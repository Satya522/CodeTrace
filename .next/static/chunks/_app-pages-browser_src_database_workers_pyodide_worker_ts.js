/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (function() { // webpackBootstrap
/******/ 	// runtime can't be in strict mode because a global variable is assign and maybe created.
/******/ 	var __webpack_modules__ = ({

/***/ "(app-pages-browser)/./src/database/workers/pyodide.worker.ts":
/*!************************************************!*\
  !*** ./src/database/workers/pyodide.worker.ts ***!
  \************************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/// <reference lib=\"webworker\" />\n// This runs off the main thread so a long/looping user script never freezes the UI.\n// Pyodide (CPython compiled to WebAssembly) is loaded on demand from jsDelivr's CDN\n// build (their official ESM entrypoint), so nothing is bundled into your app and the\n// browser caches it across visits.\nconst PYODIDE_CDN = \"https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.mjs\";\nlet pyodideReady = null;\nfunction getPyodide() {\n    if (!pyodideReady) {\n        pyodideReady = (async ()=>{\n            const { loadPyodide } = await import(/* webpackIgnore: true */ PYODIDE_CDN);\n            const pyodide = await loadPyodide({\n                indexURL: \"https://cdn.jsdelivr.net/pyodide/v0.26.4/full/\"\n            });\n            // Install the tracer module once, reused across runs.\n            await pyodide.runPythonAsync(TRACER_SOURCE);\n            return pyodide;\n        })();\n    }\n    return pyodideReady;\n}\n// --- The Python-side tracer -------------------------------------------------\n// Uses sys.settrace to fire on every executed line. For each line it snapshots\n// every active stack frame's locals, and walks reference-type values (list,\n// dict, tuple, custom objects) into a persistent \"heap\" dict keyed by id().\n//\n// Orphan/GC simulation: an object gets ONE extra step marked isOrphaned=true\n// the first time it becomes unreachable from the live stack, then is dropped\n// from the heap on the following step -- a simplified but honest stand-in for\n// CPython's real (near-instant) refcounting GC, kept around just long enough\n// to be visible and explainable in the UI.\nconst TRACER_SOURCE = '\\nimport sys, json\\n\\nclass _Tracer:\\n    def __init__(self, source_lines):\\n        self.source_lines = source_lines\\n        self.steps = []\\n        self.heap = {}          # id(str) -> heap object dict, persists across steps\\n        self.orphaned_once = set()  # ids already given their one grace step\\n        self.step_no = 0\\n        self.counters = {\"comparisons\": 0, \"swaps\": 0, \"recursiveCalls\": 0, \"arrayAccesses\": 0}\\n        self.call_names_seen = set()\\n\\n    def _classify(self, obj):\\n        if isinstance(obj, dict):\\n            return \"hashMap\"\\n        if isinstance(obj, (list, tuple)):\\n            if any(isinstance(x, (list, tuple)) for x in obj):\\n                return \"matrix\"\\n            return \"generic\"\\n        if hasattr(obj, \"__dict__\"):\\n            d = obj.__dict__\\n            if \"next\" in d:\\n                return \"linkedList\"\\n            if \"left\" in d or \"right\" in d:\\n                return \"binaryTree\"\\n        return \"generic\"\\n\\n    def _addr(self, oid):\\n        return \"0x\" + format(int(oid) & 0xFFFFFF, \"06x\")\\n\\n    def _touch(self, obj):\\n        \"\"\"Register/refresh a heap entry for a reference-type object, return (address, oid).\"\"\"\\n        oid = str(id(obj))\\n        addr = self._addr(oid)\\n        try:\\n            data_repr = repr(obj)\\n        except Exception:\\n            data_repr = \"<unrepresentable>\"\\n        if len(data_repr) > 120:\\n            data_repr = data_repr[:117] + \"...\"\\n        entry = self.heap.get(oid)\\n        if entry is None:\\n            entry = {\\n                \"id\": oid,\\n                \"type\": type(obj).__name__,\\n                \"data\": data_repr,\\n                \"isOrphaned\": False,\\n                \"address\": addr,\\n                \"referencedBy\": [],\\n                \"structureKind\": self._classify(obj),\\n                \"structuredData\": {},\\n            }\\n            self.heap[oid] = entry\\n        else:\\n            entry[\"data\"] = data_repr\\n            entry[\"isOrphaned\"] = False\\n        self.orphaned_once.discard(oid)\\n        return addr, oid\\n\\n    def _serialize(self, val):\\n        if isinstance(val, (int, float, bool, str, type(None))):\\n            return repr(val), False, None\\n        addr, oid = self._touch(val)\\n        return addr, True, oid\\n\\n    def _sweep(self, reachable_ids):\\n        # Anything currently in the heap but not reachable this step either\\n        # gets a one-step \"orphaned\" grace period, or is swept if it already had one.\\n        to_drop = []\\n        for oid, entry in self.heap.items():\\n            if oid in reachable_ids:\\n                continue\\n            if oid in self.orphaned_once:\\n                to_drop.append(oid)\\n            else:\\n                entry[\"isOrphaned\"] = True\\n                self.orphaned_once.add(oid)\\n        for oid in to_drop:\\n            del self.heap[oid]\\n\\n    def trace(self, frame, event, arg):\\n        if frame.f_code.co_filename != \"<usercode>\":\\n            return self.trace\\n        if event == \"call\":\\n            name = frame.f_code.co_name\\n            if name in self.call_names_seen:\\n                self.counters[\"recursiveCalls\"] += 1\\n            self.call_names_seen.add(name)\\n            return self.trace\\n        if event != \"line\":\\n            return self.trace\\n\\n        frames = []\\n        f = frame\\n        while f is not None and f.f_code.co_filename == \"<usercode>\":\\n            frames.append(f)\\n            f = f.f_back\\n        frames.reverse()\\n\\n        reachable_ids = set()\\n        stack = []\\n        for fr in frames:\\n            variables = []\\n            for name, val in fr.f_locals.items():\\n                if name.startswith(\"__\"):\\n                    continue\\n                try:\\n                    display, is_ref, oid = self._serialize(val)\\n                except Exception:\\n                    display, is_ref, oid = \"<error>\", False, None\\n                if oid:\\n                    reachable_ids.add(oid)\\n                variables.append({\\n                    \"name\": name,\\n                    \"type\": type(val).__name__,\\n                    \"value\": display,\\n                    \"isReference\": is_ref,\\n                    \"address\": display if is_ref else None,\\n                })\\n            stack.append({\\n                \"id\": str(id(fr)),\\n                \"name\": fr.f_code.co_name,\\n                \"variables\": variables,\\n                \"parentCallId\": str(id(fr.f_back)) if fr.f_back else None,\\n            })\\n\\n        self._sweep(reachable_ids)\\n\\n        line_idx = frame.f_lineno - 1\\n        line_text = self.source_lines[line_idx] if 0 <= line_idx < len(self.source_lines) else \"\"\\n        stripped = line_text.strip()\\n        if any(op in stripped for op in (\"<=\", \">=\", \"==\", \"<\", \">\")) and \"def \" not in stripped:\\n            self.counters[\"comparisons\"] += 1\\n        if stripped.count(\"[\") >= 1 and \"=\" in stripped and \"==\" not in stripped:\\n            self.counters[\"arrayAccesses\"] += 1\\n            if stripped.count(\"[\") >= 2 or \", \" in stripped.split(\"=\")[0]:\\n                self.counters[\"swaps\"] += 1\\n\\n        self.step_no += 1\\n        self.steps.append({\\n            \"step\": self.step_no,\\n            \"line\": frame.f_lineno,\\n            \"explanation\": {\\n                \"en\": f\"Executing line {frame.f_lineno}: {stripped or \\'(blank)\\'}\",\\n                \"hi\": f\"Line {frame.f_lineno} chal raha hai: {stripped or \\'(khaali)\\'}\",\\n            },\\n            \"stack\": stack,\\n            \"heap\": [dict(v) for v in self.heap.values()],\\n            \"systemLog\": f\"line-event @ {frame.f_lineno}\",\\n            \"counters\": dict(self.counters),\\n        })\\n        return self.trace\\n\\n\\ndef run_traced(code: str, max_steps: int = 20000):\\n    tracer = _Tracer(code.split(\"\\\\n\"))\\n    compiled = compile(code, \"<usercode>\", \"exec\")\\n    sys.settrace(tracer.trace)\\n    try:\\n        exec(compiled, {\"__name__\": \"__main__\"})\\n    except Exception as e:\\n        sys.settrace(None)\\n        return json.dumps({\"steps\": tracer.steps, \"error\": f\"{type(e).__name__}: {e}\"})\\n    finally:\\n        sys.settrace(None)\\n    if len(tracer.steps) > max_steps:\\n        tracer.steps = tracer.steps[:max_steps]\\n    return json.dumps({\"steps\": tracer.steps, \"error\": None})\\n';\nself.onmessage = async (event)=>{\n    const { code, requestId } = event.data;\n    try {\n        const pyodide = await getPyodide();\n        const resultJson = await pyodide.runPythonAsync(\"run_traced(\".concat(JSON.stringify(code), \")\"));\n        const parsed = JSON.parse(resultJson);\n        self.postMessage({\n            requestId,\n            ok: true,\n            steps: parsed.steps,\n            error: parsed.error\n        });\n    } catch (err) {\n        var _err_message;\n        self.postMessage({\n            requestId,\n            ok: false,\n            steps: [],\n            error: (_err_message = err === null || err === void 0 ? void 0 : err.message) !== null && _err_message !== void 0 ? _err_message : String(err)\n        });\n    }\n};\n // treat this file as a module\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL3NyYy9kYXRhYmFzZS93b3JrZXJzL3B5b2RpZGUud29ya2VyLnRzIiwibWFwcGluZ3MiOiI7QUFBQSxpQ0FBaUM7QUFFakMsb0ZBQW9GO0FBQ3BGLG9GQUFvRjtBQUNwRixxRkFBcUY7QUFDckYsbUNBQW1DO0FBTW5DLE1BQU1BLGNBQ0o7QUFFRixJQUFJQyxlQUFvQztBQUV4QyxTQUFTQztJQUNQLElBQUksQ0FBQ0QsY0FBYztRQUNqQkEsZUFBZSxDQUFDO1lBQ2QsTUFBTSxFQUFFRSxXQUFXLEVBQUUsR0FBRyxNQUFNLE1BQU0sQ0FBQyx1QkFBdUIsR0FBR0g7WUFDL0QsTUFBTUksVUFBVSxNQUFNRCxZQUFZO2dCQUNoQ0UsVUFBVTtZQUNaO1lBQ0Esc0RBQXNEO1lBQ3RELE1BQU1ELFFBQVFFLGNBQWMsQ0FBQ0M7WUFDN0IsT0FBT0g7UUFDVDtJQUNGO0lBQ0EsT0FBT0g7QUFDVDtBQUVBLCtFQUErRTtBQUMvRSwrRUFBK0U7QUFDL0UsNEVBQTRFO0FBQzVFLDRFQUE0RTtBQUM1RSxFQUFFO0FBQ0YsNkVBQTZFO0FBQzdFLDZFQUE2RTtBQUM3RSw4RUFBOEU7QUFDOUUsNkVBQTZFO0FBQzdFLDJDQUEyQztBQUMzQyxNQUFNTSxnQkFBaUI7QUEyS3ZCQyxLQUFLQyxTQUFTLEdBQUcsT0FBT0M7SUFDdEIsTUFBTSxFQUFFQyxJQUFJLEVBQUVDLFNBQVMsRUFBRSxHQUFHRixNQUFNRyxJQUFJO0lBQ3RDLElBQUk7UUFDRixNQUFNVCxVQUFVLE1BQU1GO1FBQ3RCLE1BQU1ZLGFBQXFCLE1BQU1WLFFBQVFFLGNBQWMsQ0FDckQsY0FBbUMsT0FBckJTLEtBQUtDLFNBQVMsQ0FBQ0wsT0FBTTtRQUVyQyxNQUFNTSxTQUFTRixLQUFLRyxLQUFLLENBQUNKO1FBQzFCTixLQUFLVyxXQUFXLENBQUM7WUFDZlA7WUFDQVEsSUFBSTtZQUNKQyxPQUFPSixPQUFPSSxLQUFLO1lBQ25CQyxPQUFPTCxPQUFPSyxLQUFLO1FBQ3JCO0lBQ0YsRUFBRSxPQUFPQyxLQUFVO1lBS1JBO1FBSlRmLEtBQUtXLFdBQVcsQ0FBQztZQUNmUDtZQUNBUSxJQUFJO1lBQ0pDLE9BQU8sRUFBRTtZQUNUQyxPQUFPQyxDQUFBQSxlQUFBQSxnQkFBQUEsMEJBQUFBLElBQUtDLE9BQU8sY0FBWkQsMEJBQUFBLGVBQWdCRSxPQUFPRjtRQUNoQztJQUNGO0FBQ0Y7QUFuT1UsQ0FBQyw4QkFBOEIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9fTl9FLy4vc3JjL2RhdGFiYXNlL3dvcmtlcnMvcHlvZGlkZS53b3JrZXIudHM/M2RlNSJdLCJzb3VyY2VzQ29udGVudCI6WyIvLy8gPHJlZmVyZW5jZSBsaWI9XCJ3ZWJ3b3JrZXJcIiAvPlxyXG5cclxuLy8gVGhpcyBydW5zIG9mZiB0aGUgbWFpbiB0aHJlYWQgc28gYSBsb25nL2xvb3BpbmcgdXNlciBzY3JpcHQgbmV2ZXIgZnJlZXplcyB0aGUgVUkuXHJcbi8vIFB5b2RpZGUgKENQeXRob24gY29tcGlsZWQgdG8gV2ViQXNzZW1ibHkpIGlzIGxvYWRlZCBvbiBkZW1hbmQgZnJvbSBqc0RlbGl2cidzIENETlxyXG4vLyBidWlsZCAodGhlaXIgb2ZmaWNpYWwgRVNNIGVudHJ5cG9pbnQpLCBzbyBub3RoaW5nIGlzIGJ1bmRsZWQgaW50byB5b3VyIGFwcCBhbmQgdGhlXHJcbi8vIGJyb3dzZXIgY2FjaGVzIGl0IGFjcm9zcyB2aXNpdHMuXHJcblxyXG5leHBvcnQge307IC8vIHRyZWF0IHRoaXMgZmlsZSBhcyBhIG1vZHVsZVxyXG5cclxuZGVjbGFyZSBjb25zdCBzZWxmOiBEZWRpY2F0ZWRXb3JrZXJHbG9iYWxTY29wZTtcclxuXHJcbmNvbnN0IFBZT0RJREVfQ0ROID1cclxuICBcImh0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9weW9kaWRlL3YwLjI2LjQvZnVsbC9weW9kaWRlLm1qc1wiO1xyXG5cclxubGV0IHB5b2RpZGVSZWFkeTogUHJvbWlzZTxhbnk+IHwgbnVsbCA9IG51bGw7XHJcblxyXG5mdW5jdGlvbiBnZXRQeW9kaWRlKCkge1xyXG4gIGlmICghcHlvZGlkZVJlYWR5KSB7XHJcbiAgICBweW9kaWRlUmVhZHkgPSAoYXN5bmMgKCkgPT4ge1xyXG4gICAgICBjb25zdCB7IGxvYWRQeW9kaWRlIH0gPSBhd2FpdCBpbXBvcnQoLyogd2VicGFja0lnbm9yZTogdHJ1ZSAqLyBQWU9ESURFX0NETik7XHJcbiAgICAgIGNvbnN0IHB5b2RpZGUgPSBhd2FpdCBsb2FkUHlvZGlkZSh7XHJcbiAgICAgICAgaW5kZXhVUkw6IFwiaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L3B5b2RpZGUvdjAuMjYuNC9mdWxsL1wiLFxyXG4gICAgICB9KTtcclxuICAgICAgLy8gSW5zdGFsbCB0aGUgdHJhY2VyIG1vZHVsZSBvbmNlLCByZXVzZWQgYWNyb3NzIHJ1bnMuXHJcbiAgICAgIGF3YWl0IHB5b2RpZGUucnVuUHl0aG9uQXN5bmMoVFJBQ0VSX1NPVVJDRSk7XHJcbiAgICAgIHJldHVybiBweW9kaWRlO1xyXG4gICAgfSkoKTtcclxuICB9XHJcbiAgcmV0dXJuIHB5b2RpZGVSZWFkeTtcclxufVxyXG5cclxuLy8gLS0tIFRoZSBQeXRob24tc2lkZSB0cmFjZXIgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4vLyBVc2VzIHN5cy5zZXR0cmFjZSB0byBmaXJlIG9uIGV2ZXJ5IGV4ZWN1dGVkIGxpbmUuIEZvciBlYWNoIGxpbmUgaXQgc25hcHNob3RzXHJcbi8vIGV2ZXJ5IGFjdGl2ZSBzdGFjayBmcmFtZSdzIGxvY2FscywgYW5kIHdhbGtzIHJlZmVyZW5jZS10eXBlIHZhbHVlcyAobGlzdCxcclxuLy8gZGljdCwgdHVwbGUsIGN1c3RvbSBvYmplY3RzKSBpbnRvIGEgcGVyc2lzdGVudCBcImhlYXBcIiBkaWN0IGtleWVkIGJ5IGlkKCkuXHJcbi8vXHJcbi8vIE9ycGhhbi9HQyBzaW11bGF0aW9uOiBhbiBvYmplY3QgZ2V0cyBPTkUgZXh0cmEgc3RlcCBtYXJrZWQgaXNPcnBoYW5lZD10cnVlXHJcbi8vIHRoZSBmaXJzdCB0aW1lIGl0IGJlY29tZXMgdW5yZWFjaGFibGUgZnJvbSB0aGUgbGl2ZSBzdGFjaywgdGhlbiBpcyBkcm9wcGVkXHJcbi8vIGZyb20gdGhlIGhlYXAgb24gdGhlIGZvbGxvd2luZyBzdGVwIC0tIGEgc2ltcGxpZmllZCBidXQgaG9uZXN0IHN0YW5kLWluIGZvclxyXG4vLyBDUHl0aG9uJ3MgcmVhbCAobmVhci1pbnN0YW50KSByZWZjb3VudGluZyBHQywga2VwdCBhcm91bmQganVzdCBsb25nIGVub3VnaFxyXG4vLyB0byBiZSB2aXNpYmxlIGFuZCBleHBsYWluYWJsZSBpbiB0aGUgVUkuXHJcbmNvbnN0IFRSQUNFUl9TT1VSQ0UgPSBgXHJcbmltcG9ydCBzeXMsIGpzb25cclxuXHJcbmNsYXNzIF9UcmFjZXI6XHJcbiAgICBkZWYgX19pbml0X18oc2VsZiwgc291cmNlX2xpbmVzKTpcclxuICAgICAgICBzZWxmLnNvdXJjZV9saW5lcyA9IHNvdXJjZV9saW5lc1xyXG4gICAgICAgIHNlbGYuc3RlcHMgPSBbXVxyXG4gICAgICAgIHNlbGYuaGVhcCA9IHt9ICAgICAgICAgICMgaWQoc3RyKSAtPiBoZWFwIG9iamVjdCBkaWN0LCBwZXJzaXN0cyBhY3Jvc3Mgc3RlcHNcclxuICAgICAgICBzZWxmLm9ycGhhbmVkX29uY2UgPSBzZXQoKSAgIyBpZHMgYWxyZWFkeSBnaXZlbiB0aGVpciBvbmUgZ3JhY2Ugc3RlcFxyXG4gICAgICAgIHNlbGYuc3RlcF9ubyA9IDBcclxuICAgICAgICBzZWxmLmNvdW50ZXJzID0ge1wiY29tcGFyaXNvbnNcIjogMCwgXCJzd2Fwc1wiOiAwLCBcInJlY3Vyc2l2ZUNhbGxzXCI6IDAsIFwiYXJyYXlBY2Nlc3Nlc1wiOiAwfVxyXG4gICAgICAgIHNlbGYuY2FsbF9uYW1lc19zZWVuID0gc2V0KClcclxuXHJcbiAgICBkZWYgX2NsYXNzaWZ5KHNlbGYsIG9iaik6XHJcbiAgICAgICAgaWYgaXNpbnN0YW5jZShvYmosIGRpY3QpOlxyXG4gICAgICAgICAgICByZXR1cm4gXCJoYXNoTWFwXCJcclxuICAgICAgICBpZiBpc2luc3RhbmNlKG9iaiwgKGxpc3QsIHR1cGxlKSk6XHJcbiAgICAgICAgICAgIGlmIGFueShpc2luc3RhbmNlKHgsIChsaXN0LCB0dXBsZSkpIGZvciB4IGluIG9iaik6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJtYXRyaXhcIlxyXG4gICAgICAgICAgICByZXR1cm4gXCJnZW5lcmljXCJcclxuICAgICAgICBpZiBoYXNhdHRyKG9iaiwgXCJfX2RpY3RfX1wiKTpcclxuICAgICAgICAgICAgZCA9IG9iai5fX2RpY3RfX1xyXG4gICAgICAgICAgICBpZiBcIm5leHRcIiBpbiBkOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwibGlua2VkTGlzdFwiXHJcbiAgICAgICAgICAgIGlmIFwibGVmdFwiIGluIGQgb3IgXCJyaWdodFwiIGluIGQ6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJiaW5hcnlUcmVlXCJcclxuICAgICAgICByZXR1cm4gXCJnZW5lcmljXCJcclxuXHJcbiAgICBkZWYgX2FkZHIoc2VsZiwgb2lkKTpcclxuICAgICAgICByZXR1cm4gXCIweFwiICsgZm9ybWF0KGludChvaWQpICYgMHhGRkZGRkYsIFwiMDZ4XCIpXHJcblxyXG4gICAgZGVmIF90b3VjaChzZWxmLCBvYmopOlxyXG4gICAgICAgIFwiXCJcIlJlZ2lzdGVyL3JlZnJlc2ggYSBoZWFwIGVudHJ5IGZvciBhIHJlZmVyZW5jZS10eXBlIG9iamVjdCwgcmV0dXJuIChhZGRyZXNzLCBvaWQpLlwiXCJcIlxyXG4gICAgICAgIG9pZCA9IHN0cihpZChvYmopKVxyXG4gICAgICAgIGFkZHIgPSBzZWxmLl9hZGRyKG9pZClcclxuICAgICAgICB0cnk6XHJcbiAgICAgICAgICAgIGRhdGFfcmVwciA9IHJlcHIob2JqKVxyXG4gICAgICAgIGV4Y2VwdCBFeGNlcHRpb246XHJcbiAgICAgICAgICAgIGRhdGFfcmVwciA9IFwiPHVucmVwcmVzZW50YWJsZT5cIlxyXG4gICAgICAgIGlmIGxlbihkYXRhX3JlcHIpID4gMTIwOlxyXG4gICAgICAgICAgICBkYXRhX3JlcHIgPSBkYXRhX3JlcHJbOjExN10gKyBcIi4uLlwiXHJcbiAgICAgICAgZW50cnkgPSBzZWxmLmhlYXAuZ2V0KG9pZClcclxuICAgICAgICBpZiBlbnRyeSBpcyBOb25lOlxyXG4gICAgICAgICAgICBlbnRyeSA9IHtcclxuICAgICAgICAgICAgICAgIFwiaWRcIjogb2lkLFxyXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IHR5cGUob2JqKS5fX25hbWVfXyxcclxuICAgICAgICAgICAgICAgIFwiZGF0YVwiOiBkYXRhX3JlcHIsXHJcbiAgICAgICAgICAgICAgICBcImlzT3JwaGFuZWRcIjogRmFsc2UsXHJcbiAgICAgICAgICAgICAgICBcImFkZHJlc3NcIjogYWRkcixcclxuICAgICAgICAgICAgICAgIFwicmVmZXJlbmNlZEJ5XCI6IFtdLFxyXG4gICAgICAgICAgICAgICAgXCJzdHJ1Y3R1cmVLaW5kXCI6IHNlbGYuX2NsYXNzaWZ5KG9iaiksXHJcbiAgICAgICAgICAgICAgICBcInN0cnVjdHVyZWREYXRhXCI6IHt9LFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNlbGYuaGVhcFtvaWRdID0gZW50cnlcclxuICAgICAgICBlbHNlOlxyXG4gICAgICAgICAgICBlbnRyeVtcImRhdGFcIl0gPSBkYXRhX3JlcHJcclxuICAgICAgICAgICAgZW50cnlbXCJpc09ycGhhbmVkXCJdID0gRmFsc2VcclxuICAgICAgICBzZWxmLm9ycGhhbmVkX29uY2UuZGlzY2FyZChvaWQpXHJcbiAgICAgICAgcmV0dXJuIGFkZHIsIG9pZFxyXG5cclxuICAgIGRlZiBfc2VyaWFsaXplKHNlbGYsIHZhbCk6XHJcbiAgICAgICAgaWYgaXNpbnN0YW5jZSh2YWwsIChpbnQsIGZsb2F0LCBib29sLCBzdHIsIHR5cGUoTm9uZSkpKTpcclxuICAgICAgICAgICAgcmV0dXJuIHJlcHIodmFsKSwgRmFsc2UsIE5vbmVcclxuICAgICAgICBhZGRyLCBvaWQgPSBzZWxmLl90b3VjaCh2YWwpXHJcbiAgICAgICAgcmV0dXJuIGFkZHIsIFRydWUsIG9pZFxyXG5cclxuICAgIGRlZiBfc3dlZXAoc2VsZiwgcmVhY2hhYmxlX2lkcyk6XHJcbiAgICAgICAgIyBBbnl0aGluZyBjdXJyZW50bHkgaW4gdGhlIGhlYXAgYnV0IG5vdCByZWFjaGFibGUgdGhpcyBzdGVwIGVpdGhlclxyXG4gICAgICAgICMgZ2V0cyBhIG9uZS1zdGVwIFwib3JwaGFuZWRcIiBncmFjZSBwZXJpb2QsIG9yIGlzIHN3ZXB0IGlmIGl0IGFscmVhZHkgaGFkIG9uZS5cclxuICAgICAgICB0b19kcm9wID0gW11cclxuICAgICAgICBmb3Igb2lkLCBlbnRyeSBpbiBzZWxmLmhlYXAuaXRlbXMoKTpcclxuICAgICAgICAgICAgaWYgb2lkIGluIHJlYWNoYWJsZV9pZHM6XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZVxyXG4gICAgICAgICAgICBpZiBvaWQgaW4gc2VsZi5vcnBoYW5lZF9vbmNlOlxyXG4gICAgICAgICAgICAgICAgdG9fZHJvcC5hcHBlbmQob2lkKVxyXG4gICAgICAgICAgICBlbHNlOlxyXG4gICAgICAgICAgICAgICAgZW50cnlbXCJpc09ycGhhbmVkXCJdID0gVHJ1ZVxyXG4gICAgICAgICAgICAgICAgc2VsZi5vcnBoYW5lZF9vbmNlLmFkZChvaWQpXHJcbiAgICAgICAgZm9yIG9pZCBpbiB0b19kcm9wOlxyXG4gICAgICAgICAgICBkZWwgc2VsZi5oZWFwW29pZF1cclxuXHJcbiAgICBkZWYgdHJhY2Uoc2VsZiwgZnJhbWUsIGV2ZW50LCBhcmcpOlxyXG4gICAgICAgIGlmIGZyYW1lLmZfY29kZS5jb19maWxlbmFtZSAhPSBcIjx1c2VyY29kZT5cIjpcclxuICAgICAgICAgICAgcmV0dXJuIHNlbGYudHJhY2VcclxuICAgICAgICBpZiBldmVudCA9PSBcImNhbGxcIjpcclxuICAgICAgICAgICAgbmFtZSA9IGZyYW1lLmZfY29kZS5jb19uYW1lXHJcbiAgICAgICAgICAgIGlmIG5hbWUgaW4gc2VsZi5jYWxsX25hbWVzX3NlZW46XHJcbiAgICAgICAgICAgICAgICBzZWxmLmNvdW50ZXJzW1wicmVjdXJzaXZlQ2FsbHNcIl0gKz0gMVxyXG4gICAgICAgICAgICBzZWxmLmNhbGxfbmFtZXNfc2Vlbi5hZGQobmFtZSlcclxuICAgICAgICAgICAgcmV0dXJuIHNlbGYudHJhY2VcclxuICAgICAgICBpZiBldmVudCAhPSBcImxpbmVcIjpcclxuICAgICAgICAgICAgcmV0dXJuIHNlbGYudHJhY2VcclxuXHJcbiAgICAgICAgZnJhbWVzID0gW11cclxuICAgICAgICBmID0gZnJhbWVcclxuICAgICAgICB3aGlsZSBmIGlzIG5vdCBOb25lIGFuZCBmLmZfY29kZS5jb19maWxlbmFtZSA9PSBcIjx1c2VyY29kZT5cIjpcclxuICAgICAgICAgICAgZnJhbWVzLmFwcGVuZChmKVxyXG4gICAgICAgICAgICBmID0gZi5mX2JhY2tcclxuICAgICAgICBmcmFtZXMucmV2ZXJzZSgpXHJcblxyXG4gICAgICAgIHJlYWNoYWJsZV9pZHMgPSBzZXQoKVxyXG4gICAgICAgIHN0YWNrID0gW11cclxuICAgICAgICBmb3IgZnIgaW4gZnJhbWVzOlxyXG4gICAgICAgICAgICB2YXJpYWJsZXMgPSBbXVxyXG4gICAgICAgICAgICBmb3IgbmFtZSwgdmFsIGluIGZyLmZfbG9jYWxzLml0ZW1zKCk6XHJcbiAgICAgICAgICAgICAgICBpZiBuYW1lLnN0YXJ0c3dpdGgoXCJfX1wiKTpcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZVxyXG4gICAgICAgICAgICAgICAgdHJ5OlxyXG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXksIGlzX3JlZiwgb2lkID0gc2VsZi5fc2VyaWFsaXplKHZhbClcclxuICAgICAgICAgICAgICAgIGV4Y2VwdCBFeGNlcHRpb246XHJcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheSwgaXNfcmVmLCBvaWQgPSBcIjxlcnJvcj5cIiwgRmFsc2UsIE5vbmVcclxuICAgICAgICAgICAgICAgIGlmIG9pZDpcclxuICAgICAgICAgICAgICAgICAgICByZWFjaGFibGVfaWRzLmFkZChvaWQpXHJcbiAgICAgICAgICAgICAgICB2YXJpYWJsZXMuYXBwZW5kKHtcclxuICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogbmFtZSxcclxuICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogdHlwZSh2YWwpLl9fbmFtZV9fLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIjogZGlzcGxheSxcclxuICAgICAgICAgICAgICAgICAgICBcImlzUmVmZXJlbmNlXCI6IGlzX3JlZixcclxuICAgICAgICAgICAgICAgICAgICBcImFkZHJlc3NcIjogZGlzcGxheSBpZiBpc19yZWYgZWxzZSBOb25lLFxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgc3RhY2suYXBwZW5kKHtcclxuICAgICAgICAgICAgICAgIFwiaWRcIjogc3RyKGlkKGZyKSksXHJcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogZnIuZl9jb2RlLmNvX25hbWUsXHJcbiAgICAgICAgICAgICAgICBcInZhcmlhYmxlc1wiOiB2YXJpYWJsZXMsXHJcbiAgICAgICAgICAgICAgICBcInBhcmVudENhbGxJZFwiOiBzdHIoaWQoZnIuZl9iYWNrKSkgaWYgZnIuZl9iYWNrIGVsc2UgTm9uZSxcclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgc2VsZi5fc3dlZXAocmVhY2hhYmxlX2lkcylcclxuXHJcbiAgICAgICAgbGluZV9pZHggPSBmcmFtZS5mX2xpbmVubyAtIDFcclxuICAgICAgICBsaW5lX3RleHQgPSBzZWxmLnNvdXJjZV9saW5lc1tsaW5lX2lkeF0gaWYgMCA8PSBsaW5lX2lkeCA8IGxlbihzZWxmLnNvdXJjZV9saW5lcykgZWxzZSBcIlwiXHJcbiAgICAgICAgc3RyaXBwZWQgPSBsaW5lX3RleHQuc3RyaXAoKVxyXG4gICAgICAgIGlmIGFueShvcCBpbiBzdHJpcHBlZCBmb3Igb3AgaW4gKFwiPD1cIiwgXCI+PVwiLCBcIj09XCIsIFwiPFwiLCBcIj5cIikpIGFuZCBcImRlZiBcIiBub3QgaW4gc3RyaXBwZWQ6XHJcbiAgICAgICAgICAgIHNlbGYuY291bnRlcnNbXCJjb21wYXJpc29uc1wiXSArPSAxXHJcbiAgICAgICAgaWYgc3RyaXBwZWQuY291bnQoXCJbXCIpID49IDEgYW5kIFwiPVwiIGluIHN0cmlwcGVkIGFuZCBcIj09XCIgbm90IGluIHN0cmlwcGVkOlxyXG4gICAgICAgICAgICBzZWxmLmNvdW50ZXJzW1wiYXJyYXlBY2Nlc3Nlc1wiXSArPSAxXHJcbiAgICAgICAgICAgIGlmIHN0cmlwcGVkLmNvdW50KFwiW1wiKSA+PSAyIG9yIFwiLCBcIiBpbiBzdHJpcHBlZC5zcGxpdChcIj1cIilbMF06XHJcbiAgICAgICAgICAgICAgICBzZWxmLmNvdW50ZXJzW1wic3dhcHNcIl0gKz0gMVxyXG5cclxuICAgICAgICBzZWxmLnN0ZXBfbm8gKz0gMVxyXG4gICAgICAgIHNlbGYuc3RlcHMuYXBwZW5kKHtcclxuICAgICAgICAgICAgXCJzdGVwXCI6IHNlbGYuc3RlcF9ubyxcclxuICAgICAgICAgICAgXCJsaW5lXCI6IGZyYW1lLmZfbGluZW5vLFxyXG4gICAgICAgICAgICBcImV4cGxhbmF0aW9uXCI6IHtcclxuICAgICAgICAgICAgICAgIFwiZW5cIjogZlwiRXhlY3V0aW5nIGxpbmUge2ZyYW1lLmZfbGluZW5vfToge3N0cmlwcGVkIG9yICcoYmxhbmspJ31cIixcclxuICAgICAgICAgICAgICAgIFwiaGlcIjogZlwiTGluZSB7ZnJhbWUuZl9saW5lbm99IGNoYWwgcmFoYSBoYWk6IHtzdHJpcHBlZCBvciAnKGtoYWFsaSknfVwiLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBcInN0YWNrXCI6IHN0YWNrLFxyXG4gICAgICAgICAgICBcImhlYXBcIjogW2RpY3QodikgZm9yIHYgaW4gc2VsZi5oZWFwLnZhbHVlcygpXSxcclxuICAgICAgICAgICAgXCJzeXN0ZW1Mb2dcIjogZlwibGluZS1ldmVudCBAIHtmcmFtZS5mX2xpbmVub31cIixcclxuICAgICAgICAgICAgXCJjb3VudGVyc1wiOiBkaWN0KHNlbGYuY291bnRlcnMpLFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgcmV0dXJuIHNlbGYudHJhY2VcclxuXHJcblxyXG5kZWYgcnVuX3RyYWNlZChjb2RlOiBzdHIsIG1heF9zdGVwczogaW50ID0gMjAwMDApOlxyXG4gICAgdHJhY2VyID0gX1RyYWNlcihjb2RlLnNwbGl0KFwiXFxcXG5cIikpXHJcbiAgICBjb21waWxlZCA9IGNvbXBpbGUoY29kZSwgXCI8dXNlcmNvZGU+XCIsIFwiZXhlY1wiKVxyXG4gICAgc3lzLnNldHRyYWNlKHRyYWNlci50cmFjZSlcclxuICAgIHRyeTpcclxuICAgICAgICBleGVjKGNvbXBpbGVkLCB7XCJfX25hbWVfX1wiOiBcIl9fbWFpbl9fXCJ9KVxyXG4gICAgZXhjZXB0IEV4Y2VwdGlvbiBhcyBlOlxyXG4gICAgICAgIHN5cy5zZXR0cmFjZShOb25lKVxyXG4gICAgICAgIHJldHVybiBqc29uLmR1bXBzKHtcInN0ZXBzXCI6IHRyYWNlci5zdGVwcywgXCJlcnJvclwiOiBmXCJ7dHlwZShlKS5fX25hbWVfX306IHtlfVwifSlcclxuICAgIGZpbmFsbHk6XHJcbiAgICAgICAgc3lzLnNldHRyYWNlKE5vbmUpXHJcbiAgICBpZiBsZW4odHJhY2VyLnN0ZXBzKSA+IG1heF9zdGVwczpcclxuICAgICAgICB0cmFjZXIuc3RlcHMgPSB0cmFjZXIuc3RlcHNbOm1heF9zdGVwc11cclxuICAgIHJldHVybiBqc29uLmR1bXBzKHtcInN0ZXBzXCI6IHRyYWNlci5zdGVwcywgXCJlcnJvclwiOiBOb25lfSlcclxuYDtcclxuXHJcbnNlbGYub25tZXNzYWdlID0gYXN5bmMgKGV2ZW50OiBNZXNzYWdlRXZlbnQpID0+IHtcclxuICBjb25zdCB7IGNvZGUsIHJlcXVlc3RJZCB9ID0gZXZlbnQuZGF0YSBhcyB7IGNvZGU6IHN0cmluZzsgcmVxdWVzdElkOiBzdHJpbmcgfTtcclxuICB0cnkge1xyXG4gICAgY29uc3QgcHlvZGlkZSA9IGF3YWl0IGdldFB5b2RpZGUoKTtcclxuICAgIGNvbnN0IHJlc3VsdEpzb246IHN0cmluZyA9IGF3YWl0IHB5b2RpZGUucnVuUHl0aG9uQXN5bmMoXHJcbiAgICAgIGBydW5fdHJhY2VkKCR7SlNPTi5zdHJpbmdpZnkoY29kZSl9KWBcclxuICAgICk7XHJcbiAgICBjb25zdCBwYXJzZWQgPSBKU09OLnBhcnNlKHJlc3VsdEpzb24pO1xyXG4gICAgc2VsZi5wb3N0TWVzc2FnZSh7XHJcbiAgICAgIHJlcXVlc3RJZCxcclxuICAgICAgb2s6IHRydWUsXHJcbiAgICAgIHN0ZXBzOiBwYXJzZWQuc3RlcHMsXHJcbiAgICAgIGVycm9yOiBwYXJzZWQuZXJyb3IsXHJcbiAgICB9KTtcclxuICB9IGNhdGNoIChlcnI6IGFueSkge1xyXG4gICAgc2VsZi5wb3N0TWVzc2FnZSh7XHJcbiAgICAgIHJlcXVlc3RJZCxcclxuICAgICAgb2s6IGZhbHNlLFxyXG4gICAgICBzdGVwczogW10sXHJcbiAgICAgIGVycm9yOiBlcnI/Lm1lc3NhZ2UgPz8gU3RyaW5nKGVyciksXHJcbiAgICB9KTtcclxuICB9XHJcbn07XHJcbiJdLCJuYW1lcyI6WyJQWU9ESURFX0NETiIsInB5b2RpZGVSZWFkeSIsImdldFB5b2RpZGUiLCJsb2FkUHlvZGlkZSIsInB5b2RpZGUiLCJpbmRleFVSTCIsInJ1blB5dGhvbkFzeW5jIiwiVFJBQ0VSX1NPVVJDRSIsInNlbGYiLCJvbm1lc3NhZ2UiLCJldmVudCIsImNvZGUiLCJyZXF1ZXN0SWQiLCJkYXRhIiwicmVzdWx0SnNvbiIsIkpTT04iLCJzdHJpbmdpZnkiLCJwYXJzZWQiLCJwYXJzZSIsInBvc3RNZXNzYWdlIiwib2siLCJzdGVwcyIsImVycm9yIiwiZXJyIiwibWVzc2FnZSIsIlN0cmluZyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(app-pages-browser)/./src/database/workers/pyodide.worker.ts\n"));

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			if (cachedModule.error !== undefined) throw cachedModule.error;
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			var execOptions = { id: moduleId, module: module, factory: __webpack_modules__[moduleId], require: __webpack_require__ };
/******/ 			__webpack_require__.i.forEach(function(handler) { handler(execOptions); });
/******/ 			module = execOptions.module;
/******/ 			execOptions.factory.call(module.exports, module, module.exports, execOptions.require);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = __webpack_module_cache__;
/******/ 	
/******/ 	// expose the module execution interceptor
/******/ 	__webpack_require__.i = [];
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/get javascript update chunk filename */
/******/ 	!function() {
/******/ 		// This function allow to reference all chunks
/******/ 		__webpack_require__.hu = function(chunkId) {
/******/ 			// return url for filenames based on template
/******/ 			return "static/webpack/" + chunkId + "." + __webpack_require__.h() + ".hot-update.js";
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/get mini-css chunk filename */
/******/ 	!function() {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.miniCssF = function(chunkId) {
/******/ 			// return url for filenames based on template
/******/ 			return undefined;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/get update manifest filename */
/******/ 	!function() {
/******/ 		__webpack_require__.hmrF = function() { return "static/webpack/" + __webpack_require__.h() + ".7d18fd0e18a8692e.hot-update.json"; };
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/getFullHash */
/******/ 	!function() {
/******/ 		__webpack_require__.h = function() { return "f903f06b3dd3fd01"; }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/trusted types policy */
/******/ 	!function() {
/******/ 		var policy;
/******/ 		__webpack_require__.tt = function() {
/******/ 			// Create Trusted Type policy if Trusted Types are available and the policy doesn't exist yet.
/******/ 			if (policy === undefined) {
/******/ 				policy = {
/******/ 					createScript: function(script) { return script; },
/******/ 					createScriptURL: function(url) { return url; }
/******/ 				};
/******/ 				if (typeof trustedTypes !== "undefined" && trustedTypes.createPolicy) {
/******/ 					policy = trustedTypes.createPolicy("nextjs#bundler", policy);
/******/ 				}
/******/ 			}
/******/ 			return policy;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/trusted types script */
/******/ 	!function() {
/******/ 		__webpack_require__.ts = function(script) { return __webpack_require__.tt().createScript(script); };
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/trusted types script url */
/******/ 	!function() {
/******/ 		__webpack_require__.tu = function(url) { return __webpack_require__.tt().createScriptURL(url); };
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hot module replacement */
/******/ 	!function() {
/******/ 		var currentModuleData = {};
/******/ 		var installedModules = __webpack_require__.c;
/******/ 		
/******/ 		// module and require creation
/******/ 		var currentChildModule;
/******/ 		var currentParents = [];
/******/ 		
/******/ 		// status
/******/ 		var registeredStatusHandlers = [];
/******/ 		var currentStatus = "idle";
/******/ 		
/******/ 		// while downloading
/******/ 		var blockingPromises = 0;
/******/ 		var blockingPromisesWaiting = [];
/******/ 		
/******/ 		// The update info
/******/ 		var currentUpdateApplyHandlers;
/******/ 		var queuedInvalidatedModules;
/******/ 		
/******/ 		__webpack_require__.hmrD = currentModuleData;
/******/ 		
/******/ 		__webpack_require__.i.push(function (options) {
/******/ 			var module = options.module;
/******/ 			var require = createRequire(options.require, options.id);
/******/ 			module.hot = createModuleHotObject(options.id, module);
/******/ 			module.parents = currentParents;
/******/ 			module.children = [];
/******/ 			currentParents = [];
/******/ 			options.require = require;
/******/ 		});
/******/ 		
/******/ 		__webpack_require__.hmrC = {};
/******/ 		__webpack_require__.hmrI = {};
/******/ 		
/******/ 		function createRequire(require, moduleId) {
/******/ 			var me = installedModules[moduleId];
/******/ 			if (!me) return require;
/******/ 			var fn = function (request) {
/******/ 				if (me.hot.active) {
/******/ 					if (installedModules[request]) {
/******/ 						var parents = installedModules[request].parents;
/******/ 						if (parents.indexOf(moduleId) === -1) {
/******/ 							parents.push(moduleId);
/******/ 						}
/******/ 					} else {
/******/ 						currentParents = [moduleId];
/******/ 						currentChildModule = request;
/******/ 					}
/******/ 					if (me.children.indexOf(request) === -1) {
/******/ 						me.children.push(request);
/******/ 					}
/******/ 				} else {
/******/ 					console.warn(
/******/ 						"[HMR] unexpected require(" +
/******/ 							request +
/******/ 							") from disposed module " +
/******/ 							moduleId
/******/ 					);
/******/ 					currentParents = [];
/******/ 				}
/******/ 				return require(request);
/******/ 			};
/******/ 			var createPropertyDescriptor = function (name) {
/******/ 				return {
/******/ 					configurable: true,
/******/ 					enumerable: true,
/******/ 					get: function () {
/******/ 						return require[name];
/******/ 					},
/******/ 					set: function (value) {
/******/ 						require[name] = value;
/******/ 					}
/******/ 				};
/******/ 			};
/******/ 			for (var name in require) {
/******/ 				if (Object.prototype.hasOwnProperty.call(require, name) && name !== "e") {
/******/ 					Object.defineProperty(fn, name, createPropertyDescriptor(name));
/******/ 				}
/******/ 			}
/******/ 			fn.e = function (chunkId, fetchPriority) {
/******/ 				return trackBlockingPromise(require.e(chunkId, fetchPriority));
/******/ 			};
/******/ 			return fn;
/******/ 		}
/******/ 		
/******/ 		function createModuleHotObject(moduleId, me) {
/******/ 			var _main = currentChildModule !== moduleId;
/******/ 			var hot = {
/******/ 				// private stuff
/******/ 				_acceptedDependencies: {},
/******/ 				_acceptedErrorHandlers: {},
/******/ 				_declinedDependencies: {},
/******/ 				_selfAccepted: false,
/******/ 				_selfDeclined: false,
/******/ 				_selfInvalidated: false,
/******/ 				_disposeHandlers: [],
/******/ 				_main: _main,
/******/ 				_requireSelf: function () {
/******/ 					currentParents = me.parents.slice();
/******/ 					currentChildModule = _main ? undefined : moduleId;
/******/ 					__webpack_require__(moduleId);
/******/ 				},
/******/ 		
/******/ 				// Module API
/******/ 				active: true,
/******/ 				accept: function (dep, callback, errorHandler) {
/******/ 					if (dep === undefined) hot._selfAccepted = true;
/******/ 					else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 					else if (typeof dep === "object" && dep !== null) {
/******/ 						for (var i = 0; i < dep.length; i++) {
/******/ 							hot._acceptedDependencies[dep[i]] = callback || function () {};
/******/ 							hot._acceptedErrorHandlers[dep[i]] = errorHandler;
/******/ 						}
/******/ 					} else {
/******/ 						hot._acceptedDependencies[dep] = callback || function () {};
/******/ 						hot._acceptedErrorHandlers[dep] = errorHandler;
/******/ 					}
/******/ 				},
/******/ 				decline: function (dep) {
/******/ 					if (dep === undefined) hot._selfDeclined = true;
/******/ 					else if (typeof dep === "object" && dep !== null)
/******/ 						for (var i = 0; i < dep.length; i++)
/******/ 							hot._declinedDependencies[dep[i]] = true;
/******/ 					else hot._declinedDependencies[dep] = true;
/******/ 				},
/******/ 				dispose: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				addDisposeHandler: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				removeDisposeHandler: function (callback) {
/******/ 					var idx = hot._disposeHandlers.indexOf(callback);
/******/ 					if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 				},
/******/ 				invalidate: function () {
/******/ 					this._selfInvalidated = true;
/******/ 					switch (currentStatus) {
/******/ 						case "idle":
/******/ 							currentUpdateApplyHandlers = [];
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							setStatus("ready");
/******/ 							break;
/******/ 						case "ready":
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							break;
/******/ 						case "prepare":
/******/ 						case "check":
/******/ 						case "dispose":
/******/ 						case "apply":
/******/ 							(queuedInvalidatedModules = queuedInvalidatedModules || []).push(
/******/ 								moduleId
/******/ 							);
/******/ 							break;
/******/ 						default:
/******/ 							// ignore requests in error states
/******/ 							break;
/******/ 					}
/******/ 				},
/******/ 		
/******/ 				// Management API
/******/ 				check: hotCheck,
/******/ 				apply: hotApply,
/******/ 				status: function (l) {
/******/ 					if (!l) return currentStatus;
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				addStatusHandler: function (l) {
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				removeStatusHandler: function (l) {
/******/ 					var idx = registeredStatusHandlers.indexOf(l);
/******/ 					if (idx >= 0) registeredStatusHandlers.splice(idx, 1);
/******/ 				},
/******/ 		
/******/ 				//inherit from previous dispose call
/******/ 				data: currentModuleData[moduleId]
/******/ 			};
/******/ 			currentChildModule = undefined;
/******/ 			return hot;
/******/ 		}
/******/ 		
/******/ 		function setStatus(newStatus) {
/******/ 			currentStatus = newStatus;
/******/ 			var results = [];
/******/ 		
/******/ 			for (var i = 0; i < registeredStatusHandlers.length; i++)
/******/ 				results[i] = registeredStatusHandlers[i].call(null, newStatus);
/******/ 		
/******/ 			return Promise.all(results);
/******/ 		}
/******/ 		
/******/ 		function unblock() {
/******/ 			if (--blockingPromises === 0) {
/******/ 				setStatus("ready").then(function () {
/******/ 					if (blockingPromises === 0) {
/******/ 						var list = blockingPromisesWaiting;
/******/ 						blockingPromisesWaiting = [];
/******/ 						for (var i = 0; i < list.length; i++) {
/******/ 							list[i]();
/******/ 						}
/******/ 					}
/******/ 				});
/******/ 			}
/******/ 		}
/******/ 		
/******/ 		function trackBlockingPromise(promise) {
/******/ 			switch (currentStatus) {
/******/ 				case "ready":
/******/ 					setStatus("prepare");
/******/ 				/* fallthrough */
/******/ 				case "prepare":
/******/ 					blockingPromises++;
/******/ 					promise.then(unblock, unblock);
/******/ 					return promise;
/******/ 				default:
/******/ 					return promise;
/******/ 			}
/******/ 		}
/******/ 		
/******/ 		function waitForBlockingPromises(fn) {
/******/ 			if (blockingPromises === 0) return fn();
/******/ 			return new Promise(function (resolve) {
/******/ 				blockingPromisesWaiting.push(function () {
/******/ 					resolve(fn());
/******/ 				});
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function hotCheck(applyOnUpdate) {
/******/ 			if (currentStatus !== "idle") {
/******/ 				throw new Error("check() is only allowed in idle status");
/******/ 			}
/******/ 			return setStatus("check")
/******/ 				.then(__webpack_require__.hmrM)
/******/ 				.then(function (update) {
/******/ 					if (!update) {
/******/ 						return setStatus(applyInvalidatedModules() ? "ready" : "idle").then(
/******/ 							function () {
/******/ 								return null;
/******/ 							}
/******/ 						);
/******/ 					}
/******/ 		
/******/ 					return setStatus("prepare").then(function () {
/******/ 						var updatedModules = [];
/******/ 						currentUpdateApplyHandlers = [];
/******/ 		
/******/ 						return Promise.all(
/******/ 							Object.keys(__webpack_require__.hmrC).reduce(function (
/******/ 								promises,
/******/ 								key
/******/ 							) {
/******/ 								__webpack_require__.hmrC[key](
/******/ 									update.c,
/******/ 									update.r,
/******/ 									update.m,
/******/ 									promises,
/******/ 									currentUpdateApplyHandlers,
/******/ 									updatedModules
/******/ 								);
/******/ 								return promises;
/******/ 							}, [])
/******/ 						).then(function () {
/******/ 							return waitForBlockingPromises(function () {
/******/ 								if (applyOnUpdate) {
/******/ 									return internalApply(applyOnUpdate);
/******/ 								} else {
/******/ 									return setStatus("ready").then(function () {
/******/ 										return updatedModules;
/******/ 									});
/******/ 								}
/******/ 							});
/******/ 						});
/******/ 					});
/******/ 				});
/******/ 		}
/******/ 		
/******/ 		function hotApply(options) {
/******/ 			if (currentStatus !== "ready") {
/******/ 				return Promise.resolve().then(function () {
/******/ 					throw new Error(
/******/ 						"apply() is only allowed in ready status (state: " +
/******/ 							currentStatus +
/******/ 							")"
/******/ 					);
/******/ 				});
/******/ 			}
/******/ 			return internalApply(options);
/******/ 		}
/******/ 		
/******/ 		function internalApply(options) {
/******/ 			options = options || {};
/******/ 		
/******/ 			applyInvalidatedModules();
/******/ 		
/******/ 			var results = currentUpdateApplyHandlers.map(function (handler) {
/******/ 				return handler(options);
/******/ 			});
/******/ 			currentUpdateApplyHandlers = undefined;
/******/ 		
/******/ 			var errors = results
/******/ 				.map(function (r) {
/******/ 					return r.error;
/******/ 				})
/******/ 				.filter(Boolean);
/******/ 		
/******/ 			if (errors.length > 0) {
/******/ 				return setStatus("abort").then(function () {
/******/ 					throw errors[0];
/******/ 				});
/******/ 			}
/******/ 		
/******/ 			// Now in "dispose" phase
/******/ 			var disposePromise = setStatus("dispose");
/******/ 		
/******/ 			results.forEach(function (result) {
/******/ 				if (result.dispose) result.dispose();
/******/ 			});
/******/ 		
/******/ 			// Now in "apply" phase
/******/ 			var applyPromise = setStatus("apply");
/******/ 		
/******/ 			var error;
/******/ 			var reportError = function (err) {
/******/ 				if (!error) error = err;
/******/ 			};
/******/ 		
/******/ 			var outdatedModules = [];
/******/ 			results.forEach(function (result) {
/******/ 				if (result.apply) {
/******/ 					var modules = result.apply(reportError);
/******/ 					if (modules) {
/******/ 						for (var i = 0; i < modules.length; i++) {
/******/ 							outdatedModules.push(modules[i]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		
/******/ 			return Promise.all([disposePromise, applyPromise]).then(function () {
/******/ 				// handle errors in accept handlers and self accepted module load
/******/ 				if (error) {
/******/ 					return setStatus("fail").then(function () {
/******/ 						throw error;
/******/ 					});
/******/ 				}
/******/ 		
/******/ 				if (queuedInvalidatedModules) {
/******/ 					return internalApply(options).then(function (list) {
/******/ 						outdatedModules.forEach(function (moduleId) {
/******/ 							if (list.indexOf(moduleId) < 0) list.push(moduleId);
/******/ 						});
/******/ 						return list;
/******/ 					});
/******/ 				}
/******/ 		
/******/ 				return setStatus("idle").then(function () {
/******/ 					return outdatedModules;
/******/ 				});
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function applyInvalidatedModules() {
/******/ 			if (queuedInvalidatedModules) {
/******/ 				if (!currentUpdateApplyHandlers) currentUpdateApplyHandlers = [];
/******/ 				Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 					queuedInvalidatedModules.forEach(function (moduleId) {
/******/ 						__webpack_require__.hmrI[key](
/******/ 							moduleId,
/******/ 							currentUpdateApplyHandlers
/******/ 						);
/******/ 					});
/******/ 				});
/******/ 				queuedInvalidatedModules = undefined;
/******/ 				return true;
/******/ 			}
/******/ 		}
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	!function() {
/******/ 		__webpack_require__.p = "/_next/";
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/react refresh */
/******/ 	!function() {
/******/ 		if (__webpack_require__.i) {
/******/ 		__webpack_require__.i.push(function(options) {
/******/ 			var originalFactory = options.factory;
/******/ 			options.factory = function(moduleObject, moduleExports, webpackRequire) {
/******/ 				var hasRefresh = typeof self !== "undefined" && !!self.$RefreshInterceptModuleExecution$;
/******/ 				var cleanup = hasRefresh ? self.$RefreshInterceptModuleExecution$(moduleObject.id) : function() {};
/******/ 				try {
/******/ 					originalFactory.call(this, moduleObject, moduleExports, webpackRequire);
/******/ 				} finally {
/******/ 					cleanup();
/******/ 				}
/******/ 			}
/******/ 		})
/******/ 		}
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	
/******/ 	// noop fns to prevent runtime errors during initialization
/******/ 	if (typeof self !== "undefined") {
/******/ 		self.$RefreshReg$ = function () {};
/******/ 		self.$RefreshSig$ = function () {
/******/ 			return function (type) {
/******/ 				return type;
/******/ 			};
/******/ 		};
/******/ 	}
/******/ 	
/******/ 	/* webpack/runtime/css loading */
/******/ 	!function() {
/******/ 		var createStylesheet = function(chunkId, fullhref, resolve, reject) {
/******/ 			var linkTag = document.createElement("link");
/******/ 		
/******/ 			linkTag.rel = "stylesheet";
/******/ 			linkTag.type = "text/css";
/******/ 			var onLinkComplete = function(event) {
/******/ 				// avoid mem leaks.
/******/ 				linkTag.onerror = linkTag.onload = null;
/******/ 				if (event.type === 'load') {
/******/ 					resolve();
/******/ 				} else {
/******/ 					var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 					var realHref = event && event.target && event.target.href || fullhref;
/******/ 					var err = new Error("Loading CSS chunk " + chunkId + " failed.\n(" + realHref + ")");
/******/ 					err.code = "CSS_CHUNK_LOAD_FAILED";
/******/ 					err.type = errorType;
/******/ 					err.request = realHref;
/******/ 					linkTag.parentNode.removeChild(linkTag)
/******/ 					reject(err);
/******/ 				}
/******/ 			}
/******/ 			linkTag.onerror = linkTag.onload = onLinkComplete;
/******/ 			linkTag.href = fullhref;
/******/ 		
/******/ 			document.head.appendChild(linkTag);
/******/ 			return linkTag;
/******/ 		};
/******/ 		var findStylesheet = function(href, fullhref) {
/******/ 			var existingLinkTags = document.getElementsByTagName("link");
/******/ 			for(var i = 0; i < existingLinkTags.length; i++) {
/******/ 				var tag = existingLinkTags[i];
/******/ 				var dataHref = tag.getAttribute("data-href") || tag.getAttribute("href");
/******/ 				if(tag.rel === "stylesheet" && (dataHref === href || dataHref === fullhref)) return tag;
/******/ 			}
/******/ 			var existingStyleTags = document.getElementsByTagName("style");
/******/ 			for(var i = 0; i < existingStyleTags.length; i++) {
/******/ 				var tag = existingStyleTags[i];
/******/ 				var dataHref = tag.getAttribute("data-href");
/******/ 				if(dataHref === href || dataHref === fullhref) return tag;
/******/ 			}
/******/ 		};
/******/ 		var loadStylesheet = function(chunkId) {
/******/ 			return new Promise(function(resolve, reject) {
/******/ 				var href = __webpack_require__.miniCssF(chunkId);
/******/ 				var fullhref = __webpack_require__.p + href;
/******/ 				if(findStylesheet(href, fullhref)) return resolve();
/******/ 				createStylesheet(chunkId, fullhref, resolve, reject);
/******/ 			});
/******/ 		}
/******/ 		// no chunk loading
/******/ 		
/******/ 		var oldTags = [];
/******/ 		var newTags = [];
/******/ 		var applyHandler = function(options) {
/******/ 			return { dispose: function() {
/******/ 				for(var i = 0; i < oldTags.length; i++) {
/******/ 					var oldTag = oldTags[i];
/******/ 					if(oldTag.parentNode) oldTag.parentNode.removeChild(oldTag);
/******/ 				}
/******/ 				oldTags.length = 0;
/******/ 			}, apply: function() {
/******/ 				for(var i = 0; i < newTags.length; i++) newTags[i].rel = "stylesheet";
/******/ 				newTags.length = 0;
/******/ 			} };
/******/ 		}
/******/ 		__webpack_require__.hmrC.miniCss = function(chunkIds, removedChunks, removedModules, promises, applyHandlers, updatedModulesList) {
/******/ 			applyHandlers.push(applyHandler);
/******/ 			chunkIds.forEach(function(chunkId) {
/******/ 				var href = __webpack_require__.miniCssF(chunkId);
/******/ 				var fullhref = __webpack_require__.p + href;
/******/ 				var oldTag = findStylesheet(href, fullhref);
/******/ 				if(!oldTag) return;
/******/ 				promises.push(new Promise(function(resolve, reject) {
/******/ 					var tag = createStylesheet(chunkId, fullhref, function() {
/******/ 						tag.as = "style";
/******/ 						tag.rel = "preload";
/******/ 						resolve();
/******/ 					}, reject);
/******/ 					oldTags.push(oldTag);
/******/ 					newTags.push(tag);
/******/ 				}));
/******/ 			});
/******/ 		}
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/importScripts chunk loading */
/******/ 	!function() {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded chunks
/******/ 		// "1" means "already loaded"
/******/ 		var installedChunks = __webpack_require__.hmrS_importScripts = __webpack_require__.hmrS_importScripts || {
/******/ 			"_app-pages-browser_src_database_workers_pyodide_worker_ts": 1
/******/ 		};
/******/ 		
/******/ 		// no chunk install function needed
/******/ 		// no chunk loading
/******/ 		
/******/ 		function loadUpdateChunk(chunkId, updatedModulesList) {
/******/ 			var success = false;
/******/ 			self["webpackHotUpdate_N_E"] = function(_, moreModules, runtime) {
/******/ 				for(var moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						currentUpdate[moduleId] = moreModules[moduleId];
/******/ 						if(updatedModulesList) updatedModulesList.push(moduleId);
/******/ 					}
/******/ 				}
/******/ 				if(runtime) currentUpdateRuntime.push(runtime);
/******/ 				success = true;
/******/ 			};
/******/ 			// start update chunk loading
/******/ 			importScripts(__webpack_require__.tu(__webpack_require__.p + __webpack_require__.hu(chunkId)));
/******/ 			if(!success) throw new Error("Loading update chunk failed for unknown reason");
/******/ 		}
/******/ 		
/******/ 		var currentUpdateChunks;
/******/ 		var currentUpdate;
/******/ 		var currentUpdateRemovedChunks;
/******/ 		var currentUpdateRuntime;
/******/ 		function applyHandler(options) {
/******/ 			if (__webpack_require__.f) delete __webpack_require__.f.importScriptsHmr;
/******/ 			currentUpdateChunks = undefined;
/******/ 			function getAffectedModuleEffects(updateModuleId) {
/******/ 				var outdatedModules = [updateModuleId];
/******/ 				var outdatedDependencies = {};
/******/ 		
/******/ 				var queue = outdatedModules.map(function (id) {
/******/ 					return {
/******/ 						chain: [id],
/******/ 						id: id
/******/ 					};
/******/ 				});
/******/ 				while (queue.length > 0) {
/******/ 					var queueItem = queue.pop();
/******/ 					var moduleId = queueItem.id;
/******/ 					var chain = queueItem.chain;
/******/ 					var module = __webpack_require__.c[moduleId];
/******/ 					if (
/******/ 						!module ||
/******/ 						(module.hot._selfAccepted && !module.hot._selfInvalidated)
/******/ 					)
/******/ 						continue;
/******/ 					if (module.hot._selfDeclined) {
/******/ 						return {
/******/ 							type: "self-declined",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					if (module.hot._main) {
/******/ 						return {
/******/ 							type: "unaccepted",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					for (var i = 0; i < module.parents.length; i++) {
/******/ 						var parentId = module.parents[i];
/******/ 						var parent = __webpack_require__.c[parentId];
/******/ 						if (!parent) continue;
/******/ 						if (parent.hot._declinedDependencies[moduleId]) {
/******/ 							return {
/******/ 								type: "declined",
/******/ 								chain: chain.concat([parentId]),
/******/ 								moduleId: moduleId,
/******/ 								parentId: parentId
/******/ 							};
/******/ 						}
/******/ 						if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 						if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 							if (!outdatedDependencies[parentId])
/******/ 								outdatedDependencies[parentId] = [];
/******/ 							addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 							continue;
/******/ 						}
/******/ 						delete outdatedDependencies[parentId];
/******/ 						outdatedModules.push(parentId);
/******/ 						queue.push({
/******/ 							chain: chain.concat([parentId]),
/******/ 							id: parentId
/******/ 						});
/******/ 					}
/******/ 				}
/******/ 		
/******/ 				return {
/******/ 					type: "accepted",
/******/ 					moduleId: updateModuleId,
/******/ 					outdatedModules: outdatedModules,
/******/ 					outdatedDependencies: outdatedDependencies
/******/ 				};
/******/ 			}
/******/ 		
/******/ 			function addAllToSet(a, b) {
/******/ 				for (var i = 0; i < b.length; i++) {
/******/ 					var item = b[i];
/******/ 					if (a.indexOf(item) === -1) a.push(item);
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			// at begin all updates modules are outdated
/******/ 			// the "outdated" status can propagate to parents if they don't accept the children
/******/ 			var outdatedDependencies = {};
/******/ 			var outdatedModules = [];
/******/ 			var appliedUpdate = {};
/******/ 		
/******/ 			var warnUnexpectedRequire = function warnUnexpectedRequire(module) {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" + module.id + ") to disposed module"
/******/ 				);
/******/ 			};
/******/ 		
/******/ 			for (var moduleId in currentUpdate) {
/******/ 				if (__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 					var newModuleFactory = currentUpdate[moduleId];
/******/ 					/** @type {TODO} */
/******/ 					var result;
/******/ 					if (newModuleFactory) {
/******/ 						result = getAffectedModuleEffects(moduleId);
/******/ 					} else {
/******/ 						result = {
/******/ 							type: "disposed",
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					/** @type {Error|false} */
/******/ 					var abortError = false;
/******/ 					var doApply = false;
/******/ 					var doDispose = false;
/******/ 					var chainInfo = "";
/******/ 					if (result.chain) {
/******/ 						chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 					}
/******/ 					switch (result.type) {
/******/ 						case "self-declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of self decline: " +
/******/ 										result.moduleId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of declined dependency: " +
/******/ 										result.moduleId +
/******/ 										" in " +
/******/ 										result.parentId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "unaccepted":
/******/ 							if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 							if (!options.ignoreUnaccepted)
/******/ 								abortError = new Error(
/******/ 									"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "accepted":
/******/ 							if (options.onAccepted) options.onAccepted(result);
/******/ 							doApply = true;
/******/ 							break;
/******/ 						case "disposed":
/******/ 							if (options.onDisposed) options.onDisposed(result);
/******/ 							doDispose = true;
/******/ 							break;
/******/ 						default:
/******/ 							throw new Error("Unexception type " + result.type);
/******/ 					}
/******/ 					if (abortError) {
/******/ 						return {
/******/ 							error: abortError
/******/ 						};
/******/ 					}
/******/ 					if (doApply) {
/******/ 						appliedUpdate[moduleId] = newModuleFactory;
/******/ 						addAllToSet(outdatedModules, result.outdatedModules);
/******/ 						for (moduleId in result.outdatedDependencies) {
/******/ 							if (__webpack_require__.o(result.outdatedDependencies, moduleId)) {
/******/ 								if (!outdatedDependencies[moduleId])
/******/ 									outdatedDependencies[moduleId] = [];
/******/ 								addAllToSet(
/******/ 									outdatedDependencies[moduleId],
/******/ 									result.outdatedDependencies[moduleId]
/******/ 								);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 					if (doDispose) {
/******/ 						addAllToSet(outdatedModules, [result.moduleId]);
/******/ 						appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 			currentUpdate = undefined;
/******/ 		
/******/ 			// Store self accepted outdated modules to require them later by the module system
/******/ 			var outdatedSelfAcceptedModules = [];
/******/ 			for (var j = 0; j < outdatedModules.length; j++) {
/******/ 				var outdatedModuleId = outdatedModules[j];
/******/ 				var module = __webpack_require__.c[outdatedModuleId];
/******/ 				if (
/******/ 					module &&
/******/ 					(module.hot._selfAccepted || module.hot._main) &&
/******/ 					// removed self-accepted modules should not be required
/******/ 					appliedUpdate[outdatedModuleId] !== warnUnexpectedRequire &&
/******/ 					// when called invalidate self-accepting is not possible
/******/ 					!module.hot._selfInvalidated
/******/ 				) {
/******/ 					outdatedSelfAcceptedModules.push({
/******/ 						module: outdatedModuleId,
/******/ 						require: module.hot._requireSelf,
/******/ 						errorHandler: module.hot._selfAccepted
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			var moduleOutdatedDependencies;
/******/ 		
/******/ 			return {
/******/ 				dispose: function () {
/******/ 					currentUpdateRemovedChunks.forEach(function (chunkId) {
/******/ 						delete installedChunks[chunkId];
/******/ 					});
/******/ 					currentUpdateRemovedChunks = undefined;
/******/ 		
/******/ 					var idx;
/******/ 					var queue = outdatedModules.slice();
/******/ 					while (queue.length > 0) {
/******/ 						var moduleId = queue.pop();
/******/ 						var module = __webpack_require__.c[moduleId];
/******/ 						if (!module) continue;
/******/ 		
/******/ 						var data = {};
/******/ 		
/******/ 						// Call dispose handlers
/******/ 						var disposeHandlers = module.hot._disposeHandlers;
/******/ 						for (j = 0; j < disposeHandlers.length; j++) {
/******/ 							disposeHandlers[j].call(null, data);
/******/ 						}
/******/ 						__webpack_require__.hmrD[moduleId] = data;
/******/ 		
/******/ 						// disable module (this disables requires from this module)
/******/ 						module.hot.active = false;
/******/ 		
/******/ 						// remove module from cache
/******/ 						delete __webpack_require__.c[moduleId];
/******/ 		
/******/ 						// when disposing there is no need to call dispose handler
/******/ 						delete outdatedDependencies[moduleId];
/******/ 		
/******/ 						// remove "parents" references from all children
/******/ 						for (j = 0; j < module.children.length; j++) {
/******/ 							var child = __webpack_require__.c[module.children[j]];
/******/ 							if (!child) continue;
/******/ 							idx = child.parents.indexOf(moduleId);
/******/ 							if (idx >= 0) {
/******/ 								child.parents.splice(idx, 1);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// remove outdated dependency from module children
/******/ 					var dependency;
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									dependency = moduleOutdatedDependencies[j];
/******/ 									idx = module.children.indexOf(dependency);
/******/ 									if (idx >= 0) module.children.splice(idx, 1);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				},
/******/ 				apply: function (reportError) {
/******/ 					// insert new code
/******/ 					for (var updateModuleId in appliedUpdate) {
/******/ 						if (__webpack_require__.o(appliedUpdate, updateModuleId)) {
/******/ 							__webpack_require__.m[updateModuleId] = appliedUpdate[updateModuleId];
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// run new runtime modules
/******/ 					for (var i = 0; i < currentUpdateRuntime.length; i++) {
/******/ 						currentUpdateRuntime[i](__webpack_require__);
/******/ 					}
/******/ 		
/******/ 					// call accept handlers
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							var module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								var callbacks = [];
/******/ 								var errorHandlers = [];
/******/ 								var dependenciesForCallbacks = [];
/******/ 								for (var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									var dependency = moduleOutdatedDependencies[j];
/******/ 									var acceptCallback =
/******/ 										module.hot._acceptedDependencies[dependency];
/******/ 									var errorHandler =
/******/ 										module.hot._acceptedErrorHandlers[dependency];
/******/ 									if (acceptCallback) {
/******/ 										if (callbacks.indexOf(acceptCallback) !== -1) continue;
/******/ 										callbacks.push(acceptCallback);
/******/ 										errorHandlers.push(errorHandler);
/******/ 										dependenciesForCallbacks.push(dependency);
/******/ 									}
/******/ 								}
/******/ 								for (var k = 0; k < callbacks.length; k++) {
/******/ 									try {
/******/ 										callbacks[k].call(null, moduleOutdatedDependencies);
/******/ 									} catch (err) {
/******/ 										if (typeof errorHandlers[k] === "function") {
/******/ 											try {
/******/ 												errorHandlers[k](err, {
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k]
/******/ 												});
/******/ 											} catch (err2) {
/******/ 												if (options.onErrored) {
/******/ 													options.onErrored({
/******/ 														type: "accept-error-handler-errored",
/******/ 														moduleId: outdatedModuleId,
/******/ 														dependencyId: dependenciesForCallbacks[k],
/******/ 														error: err2,
/******/ 														originalError: err
/******/ 													});
/******/ 												}
/******/ 												if (!options.ignoreErrored) {
/******/ 													reportError(err2);
/******/ 													reportError(err);
/******/ 												}
/******/ 											}
/******/ 										} else {
/******/ 											if (options.onErrored) {
/******/ 												options.onErrored({
/******/ 													type: "accept-errored",
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k],
/******/ 													error: err
/******/ 												});
/******/ 											}
/******/ 											if (!options.ignoreErrored) {
/******/ 												reportError(err);
/******/ 											}
/******/ 										}
/******/ 									}
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// Load self accepted modules
/******/ 					for (var o = 0; o < outdatedSelfAcceptedModules.length; o++) {
/******/ 						var item = outdatedSelfAcceptedModules[o];
/******/ 						var moduleId = item.module;
/******/ 						try {
/******/ 							item.require(moduleId);
/******/ 						} catch (err) {
/******/ 							if (typeof item.errorHandler === "function") {
/******/ 								try {
/******/ 									item.errorHandler(err, {
/******/ 										moduleId: moduleId,
/******/ 										module: __webpack_require__.c[moduleId]
/******/ 									});
/******/ 								} catch (err2) {
/******/ 									if (options.onErrored) {
/******/ 										options.onErrored({
/******/ 											type: "self-accept-error-handler-errored",
/******/ 											moduleId: moduleId,
/******/ 											error: err2,
/******/ 											originalError: err
/******/ 										});
/******/ 									}
/******/ 									if (!options.ignoreErrored) {
/******/ 										reportError(err2);
/******/ 										reportError(err);
/******/ 									}
/******/ 								}
/******/ 							} else {
/******/ 								if (options.onErrored) {
/******/ 									options.onErrored({
/******/ 										type: "self-accept-errored",
/******/ 										moduleId: moduleId,
/******/ 										error: err
/******/ 									});
/******/ 								}
/******/ 								if (!options.ignoreErrored) {
/******/ 									reportError(err);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					return outdatedModules;
/******/ 				}
/******/ 			};
/******/ 		}
/******/ 		__webpack_require__.hmrI.importScripts = function (moduleId, applyHandlers) {
/******/ 			if (!currentUpdate) {
/******/ 				currentUpdate = {};
/******/ 				currentUpdateRuntime = [];
/******/ 				currentUpdateRemovedChunks = [];
/******/ 				applyHandlers.push(applyHandler);
/******/ 			}
/******/ 			if (!__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 				currentUpdate[moduleId] = __webpack_require__.m[moduleId];
/******/ 			}
/******/ 		};
/******/ 		__webpack_require__.hmrC.importScripts = function (
/******/ 			chunkIds,
/******/ 			removedChunks,
/******/ 			removedModules,
/******/ 			promises,
/******/ 			applyHandlers,
/******/ 			updatedModulesList
/******/ 		) {
/******/ 			applyHandlers.push(applyHandler);
/******/ 			currentUpdateChunks = {};
/******/ 			currentUpdateRemovedChunks = removedChunks;
/******/ 			currentUpdate = removedModules.reduce(function (obj, key) {
/******/ 				obj[key] = false;
/******/ 				return obj;
/******/ 			}, {});
/******/ 			currentUpdateRuntime = [];
/******/ 			chunkIds.forEach(function (chunkId) {
/******/ 				if (
/******/ 					__webpack_require__.o(installedChunks, chunkId) &&
/******/ 					installedChunks[chunkId] !== undefined
/******/ 				) {
/******/ 					promises.push(loadUpdateChunk(chunkId, updatedModulesList));
/******/ 					currentUpdateChunks[chunkId] = true;
/******/ 				} else {
/******/ 					currentUpdateChunks[chunkId] = false;
/******/ 				}
/******/ 			});
/******/ 			if (__webpack_require__.f) {
/******/ 				__webpack_require__.f.importScriptsHmr = function (chunkId, promises) {
/******/ 					if (
/******/ 						currentUpdateChunks &&
/******/ 						__webpack_require__.o(currentUpdateChunks, chunkId) &&
/******/ 						!currentUpdateChunks[chunkId]
/******/ 					) {
/******/ 						promises.push(loadUpdateChunk(chunkId));
/******/ 						currentUpdateChunks[chunkId] = true;
/******/ 					}
/******/ 				};
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.hmrM = function() {
/******/ 			if (typeof fetch === "undefined") throw new Error("No browser support: need fetch API");
/******/ 			return fetch(__webpack_require__.p + __webpack_require__.hmrF()).then(function(response) {
/******/ 				if(response.status === 404) return; // no update available
/******/ 				if(!response.ok) throw new Error("Failed to fetch update manifest " + response.statusText);
/******/ 				return response.json();
/******/ 			});
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// module cache are used so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	var __webpack_exports__ = __webpack_require__("(app-pages-browser)/./src/database/workers/pyodide.worker.ts");
/******/ 	_N_E = __webpack_exports__;
/******/ 	
/******/ })()
;