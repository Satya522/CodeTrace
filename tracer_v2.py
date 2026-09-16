import sys
import json
import io

class CodeTracer:
    def __init__(self):
        self.trace_data = []
        self.output_buffer = io.StringIO()
        self.original_stdout = sys.stdout
        sys.stdout = self.output_buffer

    def get_obj_id(self, obj):
        return f"obj_{id(obj)}"

    def serialize_value(self, val, current_heap, var_name):
        if isinstance(val, (int, float, str, bool, type(None))):
            return {"value": str(val), "isReference": False}
        elif isinstance(val, (list, tuple, dict, set)):
            obj_id = self.get_obj_id(val)
            
            try:
                if isinstance(val, (set, tuple)):
                    data_str = json.dumps(list(val))
                else:
                    data_str = json.dumps(val)
            except Exception:
                data_str = str(val)

            current_heap[obj_id] = {
                "id": obj_id,
                "type": type(val).__name__,
                "data": data_str,
                "isOrphaned": False,
                "address": obj_id,
                "referencedBy": [var_name],
                "structureKind": "generic"
            }
            return {"value": type(val).__name__, "isReference": True, "address": obj_id, "type": type(val).__name__}
        return {"value": str(val), "isReference": False}

    def trace_calls(self, frame, event, arg):
        # We only care about user code in main.py
        if frame.f_code.co_filename != "main.py":
            return self.trace_calls

        if event in ["line", "call", "return"]:
            current_heap = {}
            
            # 1. Walk the call stack upwards to capture all active frames
            stack_frames = []
            curr = frame
            while curr is not None:
                # Stop when we leave user code
                if curr.f_code.co_filename != "main.py":
                    break
                    
                variables = []
                
                # Capture locals for this frame
                for name, val in curr.f_locals.items():
                    if name.startswith("__") or name in ['sys', 'json', 'CodeTracer']:
                        continue
                    var_info = self.serialize_value(val, current_heap, name)
                    var_dict = {
                        "name": name,
                        "type": type(val).__name__,
                        "value": var_info["value"],
                        "isReference": var_info["isReference"]
                    }
                    if "address" in var_info:
                        var_dict["address"] = var_info["address"]
                    variables.append(var_dict)
                
                # Special logic for <module> frame to capture globals properly
                if curr.f_code.co_name == "<module>":
                    for name, val in curr.f_globals.items():
                        # Don't duplicate locals, and ignore builtins
                        if name not in curr.f_locals and not name.startswith("__") and name not in ['sys', 'json', 'CodeTracer', 'main']:
                            # Also ignore function objects defined in global scope
                            if type(val).__name__ in ['function', 'module']:
                                continue
                            var_info = self.serialize_value(val, current_heap, name)
                            var_dict = {
                                "name": name,
                                "type": type(val).__name__,
                                "value": var_info["value"],
                                "isReference": var_info["isReference"]
                            }
                            if "address" in var_info:
                                var_dict["address"] = var_info["address"]
                            variables.append(var_dict)

                stack_frame = {
                    "id": f"frame_{curr.f_code.co_name}_{id(curr)}",
                    "name": curr.f_code.co_name,
                    "variables": variables
                }
                
                # Add parentCallId to link the stack recursively
                if curr.f_back and curr.f_back.f_code.co_filename == "main.py":
                    stack_frame["parentCallId"] = f"frame_{curr.f_back.f_code.co_name}_{id(curr.f_back)}"
                    
                # We prepend so the top of the stack (oldest frame) is first, or standard way?
                # Usually stack[0] is the current active frame in our UI, wait, let's keep it as an array.
                stack_frames.append(stack_frame)
                
                curr = curr.f_back

            current_stdout = self.output_buffer.getvalue()
            self.output_buffer.truncate(0)
            self.output_buffer.seek(0)

            # Optional: Add return value if event is return
            if event == "return":
                ret_info = self.serialize_value(arg, current_heap, "return")
                # Attach to the top frame (which is index 0 in stack_frames because we walked up)
                if stack_frames:
                    stack_frames[0]["returnValue"] = ret_info["value"]

            self.trace_data.append({
                "step": len(self.trace_data) + 1,
                "line": frame.f_lineno,
                "explanation": {"en": f"Executed line {frame.f_lineno}", "hi": f"लाइन {frame.f_lineno} निष्पादित की गई"},
                "stack": stack_frames,
                "heap": list(current_heap.values()),
                "consoleOutput": current_stdout if current_stdout else None,
                "counters": {"comparisons": 0, "swaps": 0, "arrayAccesses": 0, "recursiveCalls": 0},
                "mode": "real",
                "systemLog": ""
            })
            
        return self.trace_calls

    def run(self, code):
        try:
            compiled_code = compile(code, "main.py", "exec")
            sys.settrace(self.trace_calls)
            exec(compiled_code, {"__name__": "__main__"})
        except Exception as e:
            self.trace_data.append({
                "step": len(self.trace_data) + 1,
                "line": 1,
                "explanation": {"en": f"Runtime Error: {str(e)}", "hi": f"रनटाइम त्रुटि: {str(e)}"},
                "stack": [],
                "heap": [],
                "consoleOutput": f"Error: {str(e)}",
                "counters": {"comparisons": 0, "swaps": 0, "arrayAccesses": 0, "recursiveCalls": 0},
                "mode": "real",
                "error": str(e),
                "systemLog": f"Runtime Error: {str(e)}"
            })
        finally:
            sys.settrace(None)
            sys.stdout = self.original_stdout
            
        print(json.dumps(self.trace_data))

if __name__ == "__main__":
    import sys as _sys
    # We will accept the code file as argv[1] if provided
    filename = _sys.argv[1] if len(_sys.argv) > 1 else "main.py"
    with open(filename, "r") as f:
        user_code = f.read()
    
    tracer = CodeTracer()
    tracer.run(user_code)
