import * as acorn from "acorn";
import type {
  ExecutionStep,
  StackFrame,
  HeapObject,
  Variable,
  ComplexityCounters,
} from "@/frontend/types";

interface WorkerRequest {
  code: string;
  requestId: string;
}

class Environment {
  constructor(public parent: Environment | null = null, public vars: Record<string, any> = {}) {}
  
  get(name: string): any {
    if (name in this.vars) return this.vars[name];
    if (this.parent) return this.parent.get(name);
    return undefined;
  }
  
  set(name: string, value: any, init: boolean = false) {
    if (init) {
      this.vars[name] = value;
      return;
    }
    if (name in this.vars) {
      this.vars[name] = value;
    } else if (this.parent) {
      this.parent.set(name, value);
    } else {
      this.vars[name] = value; // Global fallback
    }
  }
}

class Interpreter {
  steps: ExecutionStep[] = [];
  counters: ComplexityCounters = {
    comparisons: 0,
    swaps: 0,
    recursiveCalls: 0,
    arrayAccesses: 0,
  };
  
  heap: Map<string, HeapObject> = new Map();
  heapCounter = 1;
  frameCounter = 1;
  
  // Call stack
  stack: { id: string; name: string; env: Environment; parentCallId: string | null; node?: any; returnValue?: string }[] = [];
  callNamesSeen = new Set<string>();

  allocateHeap(value: any, type: string): string {
    const address = `0x${this.heapCounter.toString(16).padStart(4, "0")}`;
    this.heapCounter++;
    
    let kind: any = "generic";
    if (Array.isArray(value)) {
      kind = "primitive";
      if (value.some(Array.isArray)) kind = "matrix";
    } else if (type === "Object") {
      if ("next" in value) kind = "linkedList";
      else if ("left" in value || "right" in value) kind = "binaryTree";
      else kind = "hashMap";
    }
    
    this.heap.set(address, {
      id: address,
      type: type,
      data: JSON.stringify(value),
      isOrphaned: false,
      address,
      referencedBy: [],
      structureKind: kind,
    });
    
    return address;
  }

  updateHeap(address: string, value: any) {
    const obj = this.heap.get(address);
    if (obj) {
      obj.data = JSON.stringify(value);
      if (Array.isArray(value) && value.some(Array.isArray)) obj.structureKind = "matrix";
    }
  }

  evaluate(node: any, env: Environment): any {
    if (!node) return undefined;
    
    switch (node.type) {
      case "Program":
      case "BlockStatement": {
        let result;
        const blockEnv = node.type === "BlockStatement" ? new Environment(env) : env;
        for (const stmt of node.body) {
          result = this.evaluate(stmt, blockEnv);
          if (result && typeof result === "object" && result.__isReturn) return result;
        }
        return result;
      }
      case "VariableDeclaration": {
        for (const decl of node.declarations) {
          const val = decl.init ? this.evaluate(decl.init, env) : undefined;
          env.set(decl.id.name, val, true);
          
          let msg = `Initialized ${decl.id.name}`;
          if (decl.init && decl.init.type === "MemberExpression" && decl.init.computed) {
            const prop = this.evaluate(decl.init.property, env);
            msg = `Read array[${prop}] into ${decl.id.name}`;
          }
          this.snapshot(node.loc?.start?.line || 0, msg);
        }
        return;
      }
      case "FunctionDeclaration": {
        env.set(node.id.name, { __isFunction: true, node, env }, true);
        return;
      }
      case "ExpressionStatement": {
        const val = this.evaluate(node.expression, env);
        if (node.expression.type !== "CallExpression" && node.expression.type !== "AssignmentExpression") {
          this.snapshot(node.loc?.start?.line || 0, "Evaluated expression");
        }
        return val;
      }
      case "AssignmentExpression": {
        const right = this.evaluate(node.right, env);
        let msg = "Assignment completed";
        
        if (node.left.type === "Identifier") {
          env.set(node.left.name, right);
          msg = `Assigned value to ${node.left.name}`;
        } else if (node.left.type === "MemberExpression") {
          const obj = this.evaluate(node.left.object, env);
          const prop = node.left.computed ? this.evaluate(node.left.property, env) : node.left.property.name;
          
          if (node.left.computed) {
            msg = `Writing to array[${prop}]`;
          } else {
            msg = `Assigned property ${prop}`;
          }
          
          if (obj && obj.__address) {
            // It's a heap object
            const heapObj = this.heap.get(obj.__address);
            if (heapObj) {
              const realObj = JSON.parse(heapObj.data);
              realObj[prop] = right;
              this.updateHeap(obj.__address, realObj);
            }
          } else {
            obj[prop] = right;
          }
          this.counters.arrayAccesses++;
        }
        this.snapshot(node.loc?.start?.line || 0, msg);
        return right;
      }
      case "BinaryExpression": {
        const left = this.evaluate(node.left, env);
        const right = this.evaluate(node.right, env);
        
        let msg = "Evaluated condition";
        if (["<", ">", "==", "===", "<=", ">="].includes(node.operator)) {
          this.counters.comparisons++;
          
          let leftIdx, rightIdx;
          if (node.left.type === "MemberExpression" && node.left.computed) leftIdx = this.evaluate(node.left.property, env);
          if (node.right.type === "MemberExpression" && node.right.computed) rightIdx = this.evaluate(node.right.property, env);
          
          if (leftIdx !== undefined && rightIdx !== undefined) {
            msg = `Comparing array[${leftIdx}] and array[${rightIdx}]`;
          } else if (leftIdx !== undefined) {
            msg = `Comparing array[${leftIdx}]`;
          } else if (rightIdx !== undefined) {
            msg = `Comparing array[${rightIdx}]`;
          } else {
            msg = `Checking condition with '${node.operator}'`;
          }
          this.snapshot(node.loc?.start?.line || 0, msg);
        }
        
        switch (node.operator) {
          case "+": return left + right;
          case "-": return left - right;
          case "*": return left * right;
          case "/": return left / right;
          case "%": return left % right;
          case "<": return left < right;
          case ">": return left > right;
          case "<=": return left <= right;
          case ">=": return left >= right;
          case "===":
          case "==": return left == right;
          case "!==":
          case "!=": return left != right;
          default: return undefined;
        }
      }
      case "Identifier": {
        return env.get(node.name);
      }
      case "Literal": {
        return node.value;
      }
      case "ArrayExpression": {
        const arr = node.elements.map((el: any) => this.evaluate(el, env));
        return { __address: this.allocateHeap(arr, "Array") };
      }
      case "ObjectExpression": {
        const obj: any = {};
        for (const prop of node.properties) {
          const key = prop.key.name || prop.key.value;
          obj[key] = this.evaluate(prop.value, env);
        }
        return { __address: this.allocateHeap(obj, "Object") };
      }
      case "MemberExpression": {
        const obj = this.evaluate(node.object, env);
        const prop = node.computed ? this.evaluate(node.property, env) : node.property.name;
        if (node.computed) this.counters.arrayAccesses++;
        
        if (obj && obj.__address) {
          const heapObj = this.heap.get(obj.__address);
          if (!heapObj) return undefined;
          const realObj = JSON.parse(heapObj.data);
          return realObj[prop];
        }
        if (obj && typeof obj === "object" && obj[prop] !== undefined) {
           return obj[prop];
        }
        return undefined;
      }
      case "CallExpression": {
        const callee = this.evaluate(node.callee, env);
        const args = node.arguments.map((arg: any) => this.evaluate(arg, env));
        
        if (callee && callee.__isFunction) {
          const funcNode = callee.node;
          const funcName = funcNode.id ? funcNode.id.name : "anonymous";
          
          if (this.callNamesSeen.has(funcName)) {
            this.counters.recursiveCalls++;
          }
          this.callNamesSeen.add(funcName);
          
          const callEnv = new Environment(callee.env);
          funcNode.params.forEach((param: any, i: number) => {
            callEnv.set(param.name, args[i], true);
          });
          
          const frameId = `frame_${this.frameCounter++}`;
          const parentId = this.stack.length > 0 ? this.stack[this.stack.length - 1].id : null;
          this.stack.push({ id: frameId, name: funcName, env: callEnv, parentCallId: parentId });
          
          this.snapshot(node.loc?.start?.line || 0, `Called ${funcName}`);
          
          const res = this.evaluate(funcNode.body, callEnv);
          
          const finalReturn = (res && typeof res === "object" && res.__isReturn) ? res.value : res;
          
          // Attach return value to frame before popping
          this.stack[this.stack.length - 1].returnValue = String(finalReturn);
          this.snapshot(node.loc?.start?.line || 0, `Returned from ${funcName}`);
          
          this.stack.pop();
          this.callNamesSeen.delete(funcName);
          
          return finalReturn;
        } else if (node.callee.type === "Identifier" && node.callee.name === "console") {
          // ignore console
          return undefined;
        } else if (node.callee.type === "MemberExpression" && node.callee.property.name === "push") {
            const arr = this.evaluate(node.callee.object, env);
            if(arr && arr.__address) {
               const heapObj = this.heap.get(arr.__address);
               if (!heapObj) return undefined;
               const realObj = JSON.parse(heapObj.data);
               realObj.push(args[0]);
               this.updateHeap(arr.__address, realObj);
               this.counters.arrayAccesses++;
            }
            return;
        } else if (node.callee.type === "MemberExpression" && node.callee.property.name === "length") {
            const arr = this.evaluate(node.callee.object, env);
            if(arr && arr.__address) {
               const heapObj = this.heap.get(arr.__address);
               if (!heapObj) return undefined;
               const realObj = JSON.parse(heapObj.data);
               return realObj.length;
            }
        }
        return undefined;
      }
      case "ReturnStatement": {
        const val = node.argument ? this.evaluate(node.argument, env) : undefined;
        return { __isReturn: true, value: val };
      }
      case "IfStatement": {
        const test = this.evaluate(node.test, env);
        if (test) {
          return this.evaluate(node.consequent, env);
        } else if (node.alternate) {
          return this.evaluate(node.alternate, env);
        }
        return undefined;
      }
      case "WhileStatement": {
        let result;
        while (this.evaluate(node.test, env)) {
          result = this.evaluate(node.body, env);
          if (result && typeof result === "object" && result.__isReturn) return result;
        }
        return result;
      }
      case "ForStatement": {
        const forEnv = new Environment(env);
        if (node.init) this.evaluate(node.init, forEnv);
        let result;
        while (!node.test || this.evaluate(node.test, forEnv)) {
          result = this.evaluate(node.body, forEnv);
          if (result && typeof result === "object" && result.__isReturn) return result;
          if (node.update) this.evaluate(node.update, forEnv);
        }
        return result;
      }
      case "UpdateExpression": {
        const arg = this.evaluate(node.argument, env);
        const val = node.operator === "++" ? arg + 1 : arg - 1;
        if (node.argument.type === "Identifier") {
          env.set(node.argument.name, val);
        }
        return node.prefix ? val : arg;
      }
      default:
        // Ignore unhandled nodes silently
        return undefined;
    }
  }

  snapshot(line: number, msg: string) {
    if (line === 0) return;
    
    if (this.steps.length >= 50000) {
      throw new Error("Execution limit exceeded (50,000 steps). Possible infinite loop.");
    }
    
    // Garbage collection check (Orphan detection)
    const reachableAddrs = new Set<string>();
    for (const frame of this.stack) {
      for (const val of Object.values(frame.env.vars)) {
        if (val && typeof val === "object" && val.__address) {
          reachableAddrs.add(val.__address);
        }
      }
    }
    
    let added = true;
    while (added) {
      added = false;
      for (const [addr, obj] of Array.from(this.heap.entries())) {
        if (reachableAddrs.has(addr)) {
          let parsed;
          try { parsed = JSON.parse(obj.data); } catch { parsed = obj.data; }
          
          const findRefs = (val: any) => {
            if (val && typeof val === "object" && val.__address) {
              if (!reachableAddrs.has(val.__address)) {
                reachableAddrs.add(val.__address);
                added = true;
              }
            } else if (Array.isArray(val)) {
              for (const item of val) findRefs(item);
            } else if (val && typeof val === "object") {
              for (const k in val) findRefs(val[k]);
            }
          };
          
          findRefs(parsed);
        }
      }
    }
    
    // Simplistic sweep
    for (const [addr, obj] of Array.from(this.heap.entries())) {
      if (!reachableAddrs.has(addr)) {
        if (obj.isOrphaned) {
          this.heap.delete(addr);
        } else {
          obj.isOrphaned = true;
        }
      } else {
        obj.isOrphaned = false;
      }
    }

    this.steps.push({
      step: this.steps.length + 1,
      line,
      explanation: {
        en: msg,
        hi: "निष्पादन कदम"
      },
      stack: this.stack.map(fr => {
        const frameVariables: Variable[] = [];
        for (const [key, val] of Object.entries(fr.env.vars)) {
          if (val && typeof val === "object" && val.__isFunction) continue; // skip rendering functions as variables
          if (val && typeof val === "object" && (val as any).__address) {
            frameVariables.push({
              name: key,
              type: "object",
              value: (val as any).__address,
              isReference: true,
              address: (val as any).__address,
            });
          } else {
            frameVariables.push({
              name: key,
              type: typeof val,
              value: String(val),
              isReference: false,
            });
          }
        }
        return {
          id: fr.id,
          name: fr.name,
          variables: frameVariables,
          parentCallId: fr.parentCallId || undefined,
          returnValue: fr.returnValue,
        };
      }),
      heap: Array.from(this.heap.values()).map(h => ({...h})), // Deep clone heap for snapshot
      systemLog: "",
      counters: { ...this.counters },
    });
  }

  run(code: string) {
    const ast = acorn.parse(code, { locations: true, ecmaVersion: 2020 });
    const globalEnv = new Environment();
    const globalId = `frame_${this.frameCounter++}`;
    this.stack.push({ id: globalId, name: "Global", env: globalEnv, parentCallId: null });
    this.evaluate(ast, globalEnv);
    return this.steps;
  }
}

self.addEventListener("message", (e: MessageEvent<WorkerRequest>) => {
  const { code, requestId } = e.data;

  try {
    const interpreter = new Interpreter();
    const steps = interpreter.run(code);
    
    self.postMessage({
      requestId,
      ok: true,
      steps,
      error: null,
    });
  } catch (err: any) {
    self.postMessage({
      requestId,
      ok: false,
      steps: [],
      error: err.message ?? "JS Execution Error",
    });
  }
});
