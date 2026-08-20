(()=>{"use strict";let e=null,s=`
import sys, json, io

class _Tracer:
    def __init__(self, source_lines):
        self.source_lines = source_lines
        self.steps = []
        self.heap = {}          # id(str) -> heap object dict, persists across steps
        self.orphaned_once = set()  # ids already given their one grace step
        self.step_no = 0
        self.counters = {"comparisons": 0, "swaps": 0, "recursiveCalls": 0, "arrayAccesses": 0}
        self.call_names_seen = set()
        self.stdout_buf = io.StringIO()
        self.old_stdout = sys.stdout
        sys.stdout = self.stdout_buf
        self.last_stdout_pos = 0

    def get_new_stdout(self):
        current_stdout = self.stdout_buf.getvalue()
        new_output = current_stdout[self.last_stdout_pos:]
        self.last_stdout_pos = len(current_stdout)
        return new_output

    def _classify(self, obj):
        if isinstance(obj, dict):
            return "hashMap"
        if isinstance(obj, (list, tuple)):
            if any(isinstance(x, (list, tuple)) for x in obj):
                return "matrix"
            return "generic"
        if hasattr(obj, "__dict__"):
            d = obj.__dict__
            if "next" in d:
                return "linkedList"
            if "left" in d or "right" in d:
                return "binaryTree"
        return "generic"

    def _addr(self, oid):
        return "0x" + format(int(oid) & 0xFFFFFF, "06x")

    def _touch(self, obj):
        """Register/refresh a heap entry for a reference-type object, return (address, oid)."""
        oid = str(id(obj))
        addr = self._addr(oid)
        try:
            data_repr = repr(obj)
        except Exception:
            data_repr = "<unrepresentable>"
        if len(data_repr) > 120:
            data_repr = data_repr[:117] + "..."
        entry = self.heap.get(oid)
        if entry is None:
            entry = {
                "id": oid,
                "type": type(obj).__name__,
                "data": data_repr,
                "isOrphaned": False,
                "address": addr,
                "referencedBy": [],
                "structureKind": self._classify(obj),
                "structuredData": {},
            }
            self.heap[oid] = entry
        else:
            entry["data"] = data_repr
            entry["isOrphaned"] = False
        self.orphaned_once.discard(oid)
        return addr, oid

    def _serialize(self, val):
        if isinstance(val, (int, float, bool, str, type(None))):
            return repr(val), False, None
        addr, oid = self._touch(val)
        return addr, True, oid

    def _sweep(self, reachable_ids):
        # Anything currently in the heap but not reachable this step either
        # gets a one-step "orphaned" grace period, or is swept if it already had one.
        to_drop = []
        for oid, entry in self.heap.items():
            if oid in reachable_ids:
                continue
            if oid in self.orphaned_once:
                to_drop.append(oid)
            else:
                entry["isOrphaned"] = True
                self.orphaned_once.add(oid)
        for oid in to_drop:
            del self.heap[oid]

    def trace(self, frame, event, arg):
        if frame.f_code.co_filename != "<usercode>":
            return self.trace
        if event == "call":
            name = frame.f_code.co_name
            if name in self.call_names_seen:
                self.counters["recursiveCalls"] += 1
            self.call_names_seen.add(name)
            return self.trace
        if event != "line":
            return self.trace

        frames = []
        f = frame
        while f is not None and f.f_code.co_filename == "<usercode>":
            frames.append(f)
            f = f.f_back
        frames.reverse()

        reachable_ids = set()
        stack = []
        for fr in frames:
            variables = []
            for name, val in fr.f_locals.items():
                if name.startswith("__"):
                    continue
                try:
                    display, is_ref, oid = self._serialize(val)
                except Exception:
                    display, is_ref, oid = "<error>", False, None
                if oid:
                    reachable_ids.add(oid)
                variables.append({
                    "name": name,
                    "type": type(val).__name__,
                    "value": display,
                    "isReference": is_ref,
                    "address": display if is_ref else None,
                })
            stack.append({
                "id": str(id(fr)),
                "name": fr.f_code.co_name,
                "variables": variables,
                "parentCallId": str(id(fr.f_back)) if fr.f_back else None,
            })

        self._sweep(reachable_ids)

        line_idx = frame.f_lineno - 1
        line_text = self.source_lines[line_idx] if 0 <= line_idx < len(self.source_lines) else ""
        stripped = line_text.strip()
        if any(op in stripped for op in ("<=", ">=", "==", "<", ">")) and "def " not in stripped:
            self.counters["comparisons"] += 1
        if stripped.count("[") >= 1 and "=" in stripped and "==" not in stripped:
            self.counters["arrayAccesses"] += 1
            if stripped.count("[") >= 2 or ", " in stripped.split("=")[0]:
                self.counters["swaps"] += 1

        new_out = self.get_new_stdout()
        
        self.step_no += 1
        self.steps.append({
            "step": self.step_no,
            "line": frame.f_lineno,
            "explanation": {
                "en": f"Executing line {frame.f_lineno}: {stripped or '(blank)'}",
                "hi": f"Line {frame.f_lineno} chal raha hai: {stripped or '(khaali)'}",
            },
            "stack": stack,
            "heap": [dict(v) for v in self.heap.values()],
            "systemLog": f"line-event @ {frame.f_lineno}",
            "consoleOutput": new_out if new_out else None,
            "counters": dict(self.counters),
        })
        return self.trace


def run_traced(code: str, max_steps: int = 20000):
    tracer = _Tracer(code.split("\\n"))
    compiled = compile(code, "<usercode>", "exec")
    sys.settrace(tracer.trace)
    try:
        exec(compiled, {"__name__": "__main__"})
    except Exception as e:
        sys.settrace(None)
        sys.stdout = tracer.old_stdout
        return json.dumps({"steps": tracer.steps, "error": f"{type(e).__name__}: {e}"})
    finally:
        sys.settrace(None)
        sys.stdout = tracer.old_stdout
    if len(tracer.steps) > max_steps:
        tracer.steps = tracer.steps[:max_steps]
    return json.dumps({"steps": tracer.steps, "error": None})
`;self.onmessage=async t=>{let{code:r,requestId:a}=t.data;try{let t=await (e||(e=(async()=>{let{loadPyodide:e}=await import("https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.mjs"),t=await e({indexURL:"https://cdn.jsdelivr.net/pyodide/v0.26.4/full/"});return await t.runPythonAsync(s),t})()),e),n=await t.runPythonAsync(`run_traced(${JSON.stringify(r)})`),i=JSON.parse(n);self.postMessage({requestId:a,ok:!0,steps:i.steps,error:i.error})}catch(e){self.postMessage({requestId:a,ok:!1,steps:[],error:e?.message??String(e)})}},module.exports={}})();