/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "(app-pages-browser)/./node_modules/sql.js/dist/sql-wasm-browser.js":
/*!******************************************************!*\
  !*** ./node_modules/sql.js/dist/sql-wasm-browser.js ***!
  \******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

eval(__webpack_require__.ts("/* module decorator */ module = __webpack_require__.nmd(module);\n\n// We are modularizing this manually because the current modularize setting in Emscripten has some issues:\n// https://github.com/kripken/emscripten/issues/5820\n// In addition, When you use emcc's modularization, it still expects to export a global object called `Module`,\n// which is able to be used/called before the WASM is loaded.\n// The modularization below exports a promise that loads and resolves to the actual sql.js module.\n// That way, this module can't be used before the WASM is finished loading.\n\n// We are going to define a function that a user will call to start loading initializing our Sql.js library\n// However, that function might be called multiple times, and on subsequent calls, we don't actually want it to instantiate a new instance of the Module\n// Instead, we want to return the previously loaded module\n\n// TODO: Make this not declare a global if used in the browser\nvar initSqlJsPromise = undefined;\n\nvar initSqlJs = function (moduleConfig) {\n\n    if (initSqlJsPromise){\n      return initSqlJsPromise;\n    }\n    // If we're here, we've never called this function before\n    initSqlJsPromise = new Promise(function (resolveModule, reject) {\n\n        // We are modularizing this manually because the current modularize setting in Emscripten has some issues:\n        // https://github.com/kripken/emscripten/issues/5820\n\n        // The way to affect the loading of emcc compiled modules is to create a variable called `Module` and add\n        // properties to it, like `preRun`, `postRun`, etc\n        // We are using that to get notified when the WASM has finished loading.\n        // Only then will we return our promise\n\n        // If they passed in a moduleConfig object, use that\n        // Otherwise, initialize Module to the empty object\n        var Module = typeof moduleConfig !== 'undefined' ? moduleConfig : {};\n\n        // EMCC only allows for a single onAbort function (not an array of functions)\n        // So if the user defined their own onAbort function, we remember it and call it\n        var originalOnAbortFunction = Module['onAbort'];\n        Module['onAbort'] = function (errorThatCausedAbort) {\n            reject(new Error(errorThatCausedAbort));\n            if (originalOnAbortFunction){\n              originalOnAbortFunction(errorThatCausedAbort);\n            }\n        };\n\n        Module['postRun'] = Module['postRun'] || [];\n        Module['postRun'].push(function () {\n            // When Emscripted calls postRun, this promise resolves with the built Module\n            resolveModule(Module);\n        });\n\n        // There is a section of code in the emcc-generated code below that looks like this:\n        // (Note that this is lowercase `module`)\n        // if (typeof module !== 'undefined') {\n        //     module['exports'] = Module;\n        // }\n        // When that runs, it's going to overwrite our own modularization export efforts in shell-post.js!\n        // The only way to tell emcc not to emit it is to pass the MODULARIZE=1 or MODULARIZE_INSTANCE=1 flags,\n        // but that carries with it additional unnecessary baggage/bugs we don't want either.\n        // So, we have three options:\n        // 1) We undefine `module`\n        // 2) We remember what `module['exports']` was at the beginning of this function and we restore it later\n        // 3) We write a script to remove those lines of code as part of the Make process.\n        //\n        // Since those are the only lines of code that care about module, we will undefine it. It's the most straightforward\n        // of the options, and has the side effect of reducing emcc's efforts to modify the module if its output were to change in the future.\n        // That's a nice side effect since we're handling the modularization efforts ourselves\n        module = undefined;\n\n        // The emcc-generated code and shell-post.js code goes below,\n        // meaning that all of it runs inside of this promise. If anything throws an exception, our promise will abort\nvar k;k||=typeof Module != 'undefined' ? Module : {};var aa=!!globalThis.window,ba=!!globalThis.WorkerGlobalScope;\nk.onRuntimeInitialized=function(){function a(f,l){switch(typeof l){case \"boolean\":$b(f,l?1:0);break;case \"number\":ac(f,l);break;case \"string\":bc(f,l,-1,-1);break;case \"object\":if(null===l)eb(f);else if(null!=l.length){var n=ca(l.length);m.set(l,n);cc(f,n,l.length,-1);da(n)}else ra(f,\"Wrong API use : tried to return a value of an unknown type (\"+l+\").\",-1);break;default:eb(f)}}function b(f,l){for(var n=[],p=0;p<f;p+=1){var u=r(l+4*p,\"i32\"),v=dc(u);if(1===v||2===v)u=ec(u);else if(3===v)u=fc(u);else if(4===\nv){v=u;u=gc(v);v=hc(v);for(var K=new Uint8Array(u),I=0;I<u;I+=1)K[I]=m[v+I];u=K}else u=null;n.push(u)}return n}function c(f,l){this.Qa=f;this.db=l;this.Oa=1;this.yb=[]}function d(f,l){this.db=l;this.ob=ea(f);if(null===this.ob)throw Error(\"Unable to allocate memory for the SQL string\");this.ub=this.ob;this.gb=this.Fb=null}function e(f){this.filename=\"dbfile_\"+(4294967295*Math.random()>>>0);if(null!=f){var l=this.filename,n=\"/\",p=l;n&&(n=\"string\"==typeof n?n:fa(n),p=l?ha(n+\"/\"+l):n);l=ia(!0,!0);p=ja(p,\nl);if(f){if(\"string\"==typeof f){n=Array(f.length);for(var u=0,v=f.length;u<v;++u)n[u]=f.charCodeAt(u);f=n}ka(p,l|146);n=la(p,577);ma(n,f,0,f.length,0);na(n);ka(p,l)}}this.handleError(q(this.filename,g));this.db=r(g,\"i32\");hb(this.db);this.pb={};this.Sa={}}var g=y(4),h=k.cwrap,q=h(\"sqlite3_open\",\"number\",[\"string\",\"number\"]),w=h(\"sqlite3_close_v2\",\"number\",[\"number\"]),t=h(\"sqlite3_exec\",\"number\",[\"number\",\"string\",\"number\",\"number\",\"number\"]),x=h(\"sqlite3_changes\",\"number\",[\"number\"]),D=h(\"sqlite3_prepare_v2\",\n\"number\",[\"number\",\"string\",\"number\",\"number\",\"number\"]),ib=h(\"sqlite3_sql\",\"string\",[\"number\"]),jc=h(\"sqlite3_normalized_sql\",\"string\",[\"number\"]),jb=h(\"sqlite3_prepare_v2\",\"number\",[\"number\",\"number\",\"number\",\"number\",\"number\"]),kc=h(\"sqlite3_bind_text\",\"number\",[\"number\",\"number\",\"number\",\"number\",\"number\"]),kb=h(\"sqlite3_bind_blob\",\"number\",[\"number\",\"number\",\"number\",\"number\",\"number\"]),lc=h(\"sqlite3_bind_double\",\"number\",[\"number\",\"number\",\"number\"]),mc=h(\"sqlite3_bind_int\",\"number\",[\"number\",\n\"number\",\"number\"]),nc=h(\"sqlite3_bind_parameter_index\",\"number\",[\"number\",\"string\"]),oc=h(\"sqlite3_step\",\"number\",[\"number\"]),pc=h(\"sqlite3_errmsg\",\"string\",[\"number\"]),qc=h(\"sqlite3_column_count\",\"number\",[\"number\"]),rc=h(\"sqlite3_data_count\",\"number\",[\"number\"]),sc=h(\"sqlite3_column_double\",\"number\",[\"number\",\"number\"]),lb=h(\"sqlite3_column_text\",\"string\",[\"number\",\"number\"]),tc=h(\"sqlite3_column_blob\",\"number\",[\"number\",\"number\"]),uc=h(\"sqlite3_column_bytes\",\"number\",[\"number\",\"number\"]),vc=h(\"sqlite3_column_type\",\n\"number\",[\"number\",\"number\"]),wc=h(\"sqlite3_column_name\",\"string\",[\"number\",\"number\"]),xc=h(\"sqlite3_reset\",\"number\",[\"number\"]),yc=h(\"sqlite3_clear_bindings\",\"number\",[\"number\"]),zc=h(\"sqlite3_finalize\",\"number\",[\"number\"]),mb=h(\"sqlite3_create_function_v2\",\"number\",\"number string number number number number number number number\".split(\" \")),dc=h(\"sqlite3_value_type\",\"number\",[\"number\"]),gc=h(\"sqlite3_value_bytes\",\"number\",[\"number\"]),fc=h(\"sqlite3_value_text\",\"string\",[\"number\"]),hc=h(\"sqlite3_value_blob\",\n\"number\",[\"number\"]),ec=h(\"sqlite3_value_double\",\"number\",[\"number\"]),ac=h(\"sqlite3_result_double\",\"\",[\"number\",\"number\"]),eb=h(\"sqlite3_result_null\",\"\",[\"number\"]),bc=h(\"sqlite3_result_text\",\"\",[\"number\",\"string\",\"number\",\"number\"]),cc=h(\"sqlite3_result_blob\",\"\",[\"number\",\"number\",\"number\",\"number\"]),$b=h(\"sqlite3_result_int\",\"\",[\"number\",\"number\"]),ra=h(\"sqlite3_result_error\",\"\",[\"number\",\"string\",\"number\"]),nb=h(\"sqlite3_aggregate_context\",\"number\",[\"number\",\"number\"]),hb=h(\"RegisterExtensionFunctions\",\n\"number\",[\"number\"]),ob=h(\"sqlite3_update_hook\",\"number\",[\"number\",\"number\",\"number\"]);c.prototype.bind=function(f){if(!this.Qa)throw\"Statement closed\";this.reset();return Array.isArray(f)?this.Wb(f):null!=f&&\"object\"===typeof f?this.Xb(f):!0};c.prototype.step=function(){if(!this.Qa)throw\"Statement closed\";this.Oa=1;var f=oc(this.Qa);switch(f){case 100:return!0;case 101:return!1;default:throw this.db.handleError(f);}};c.prototype.Pb=function(f){null==f&&(f=this.Oa,this.Oa+=1);return sc(this.Qa,f)};\nc.prototype.hc=function(f){null==f&&(f=this.Oa,this.Oa+=1);f=lb(this.Qa,f);if(\"function\"!==typeof BigInt)throw Error(\"BigInt is not supported\");return BigInt(f)};c.prototype.mc=function(f){null==f&&(f=this.Oa,this.Oa+=1);return lb(this.Qa,f)};c.prototype.getBlob=function(f){null==f&&(f=this.Oa,this.Oa+=1);var l=uc(this.Qa,f);f=tc(this.Qa,f);for(var n=new Uint8Array(l),p=0;p<l;p+=1)n[p]=m[f+p];return n};c.prototype.get=function(f,l){l=l||{};null!=f&&this.bind(f)&&this.step();f=[];for(var n=rc(this.Qa),\np=0;p<n;p+=1)switch(vc(this.Qa,p)){case 1:var u=l.useBigInt?this.hc(p):this.Pb(p);f.push(u);break;case 2:f.push(this.Pb(p));break;case 3:f.push(this.mc(p));break;case 4:f.push(this.getBlob(p));break;default:f.push(null)}return f};c.prototype.Db=function(){for(var f=[],l=qc(this.Qa),n=0;n<l;n+=1)f.push(wc(this.Qa,n));return f};c.prototype.Ob=function(f,l){f=this.get(f,l);l=this.Db();for(var n={},p=0;p<l.length;p+=1)n[l[p]]=f[p];return n};c.prototype.lc=function(){return ib(this.Qa)};c.prototype.ic=\nfunction(){return jc(this.Qa)};c.prototype.Jb=function(f){null!=f&&this.bind(f);this.step();return this.reset()};c.prototype.Lb=function(f,l){null==l&&(l=this.Oa,this.Oa+=1);f=ea(f);this.yb.push(f);this.db.handleError(kc(this.Qa,l,f,-1,0))};c.prototype.Vb=function(f,l){null==l&&(l=this.Oa,this.Oa+=1);var n=ca(f.length);m.set(f,n);this.yb.push(n);this.db.handleError(kb(this.Qa,l,n,f.length,0))};c.prototype.Kb=function(f,l){null==l&&(l=this.Oa,this.Oa+=1);this.db.handleError((f===(f|0)?mc:lc)(this.Qa,\nl,f))};c.prototype.Yb=function(f){null==f&&(f=this.Oa,this.Oa+=1);kb(this.Qa,f,0,0,0)};c.prototype.Mb=function(f,l){null==l&&(l=this.Oa,this.Oa+=1);switch(typeof f){case \"string\":this.Lb(f,l);return;case \"number\":this.Kb(f,l);return;case \"bigint\":this.Lb(f.toString(),l);return;case \"boolean\":this.Kb(f+0,l);return;case \"object\":if(null===f){this.Yb(l);return}if(null!=f.length){this.Vb(f,l);return}}throw\"Wrong API use : tried to bind a value of an unknown type (\"+f+\").\";};c.prototype.Xb=function(f){var l=\nthis;Object.keys(f).forEach(function(n){var p=nc(l.Qa,n);0!==p&&l.Mb(f[n],p)});return!0};c.prototype.Wb=function(f){for(var l=0;l<f.length;l+=1)this.Mb(f[l],l+1);return!0};c.prototype.reset=function(){this.Cb();return 0===yc(this.Qa)&&0===xc(this.Qa)};c.prototype.Cb=function(){for(var f;void 0!==(f=this.yb.pop());)da(f)};c.prototype.cb=function(){this.Cb();var f=0===zc(this.Qa);delete this.db.pb[this.Qa];this.Qa=0;return f};d.prototype.next=function(){if(null===this.ob)return{done:!0};null!==this.gb&&\n(this.gb.cb(),this.gb=null);if(!this.db.db)throw this.Ab(),Error(\"Database closed\");var f=oa(),l=y(4);pa(g);pa(l);try{this.db.handleError(jb(this.db.db,this.ub,-1,g,l));this.ub=r(l,\"i32\");var n=r(g,\"i32\");if(0===n)return this.Ab(),{done:!0};this.gb=new c(n,this.db);this.db.pb[n]=this.gb;return{value:this.gb,done:!1}}catch(p){throw this.Fb=z(this.ub),this.Ab(),p;}finally{qa(f)}};d.prototype.Ab=function(){da(this.ob);this.ob=null};d.prototype.jc=function(){return null!==this.Fb?this.Fb:z(this.ub)};\n\"function\"===typeof Symbol&&\"symbol\"===typeof Symbol.iterator&&(d.prototype[Symbol.iterator]=function(){return this});e.prototype.Jb=function(f,l){if(!this.db)throw\"Database closed\";if(l){f=this.Gb(f,l);try{f.step()}finally{f.cb()}}else this.handleError(t(this.db,f,0,0,g));return this};e.prototype.exec=function(f,l,n){if(!this.db)throw\"Database closed\";var p=null,u=null,v=null;try{v=u=ea(f);var K=y(4);for(f=[];0!==r(v,\"i8\");){pa(g);pa(K);this.handleError(jb(this.db,v,-1,g,K));var I=r(g,\"i32\");v=r(K,\n\"i32\");if(0!==I){var H=null;p=new c(I,this);for(null!=l&&p.bind(l);p.step();)null===H&&(H={columns:p.Db(),values:[]},f.push(H)),H.values.push(p.get(null,n));p.cb()}}return f}catch(L){throw p&&p.cb(),L;}finally{u&&da(u)}};e.prototype.ec=function(f,l,n,p,u){\"function\"===typeof l&&(p=n,n=l,l=void 0);f=this.Gb(f,l);try{for(;f.step();)n(f.Ob(null,u))}finally{f.cb()}if(\"function\"===typeof p)return p()};e.prototype.Gb=function(f,l){pa(g);this.handleError(D(this.db,f,-1,g,0));f=r(g,\"i32\");if(0===f)throw\"Nothing to prepare\";\nvar n=new c(f,this);null!=l&&n.bind(l);return this.pb[f]=n};e.prototype.pc=function(f){return new d(f,this)};e.prototype.fc=function(){Object.values(this.pb).forEach(function(l){l.cb()});Object.values(this.Sa).forEach(A);this.Sa={};this.handleError(w(this.db));var f=sa(this.filename);this.handleError(q(this.filename,g));this.db=r(g,\"i32\");hb(this.db);return f};e.prototype.close=function(){null!==this.db&&(Object.values(this.pb).forEach(function(f){f.cb()}),Object.values(this.Sa).forEach(A),this.Sa=\n{},this.fb&&(A(this.fb),this.fb=void 0),this.handleError(w(this.db)),ta(\"/\"+this.filename),this.db=null)};e.prototype.handleError=function(f){if(0===f)return null;f=pc(this.db);throw Error(f);};e.prototype.kc=function(){return x(this.db)};e.prototype.bc=function(f,l){Object.prototype.hasOwnProperty.call(this.Sa,f)&&(A(this.Sa[f]),delete this.Sa[f]);var n=ua(function(p,u,v){u=b(u,v);try{var K=l.apply(null,u)}catch(I){ra(p,I,-1);return}a(p,K)},\"viii\");this.Sa[f]=n;this.handleError(mb(this.db,f,l.length,\n1,0,n,0,0,0));return this};e.prototype.ac=function(f,l){var n=l.init||function(){return null},p=l.finalize||function(H){return H},u=l.step;if(!u)throw\"An aggregate function must have a step function in \"+f;var v={};Object.hasOwnProperty.call(this.Sa,f)&&(A(this.Sa[f]),delete this.Sa[f]);l=f+\"__finalize\";Object.hasOwnProperty.call(this.Sa,l)&&(A(this.Sa[l]),delete this.Sa[l]);var K=ua(function(H,L,Ka){var V=nb(H,1);Object.hasOwnProperty.call(v,V)||(v[V]=n());L=b(L,Ka);L=[v[V]].concat(L);try{v[V]=u.apply(null,\nL)}catch(Bc){delete v[V],ra(H,Bc,-1)}},\"viii\"),I=ua(function(H){var L=nb(H,1);try{var Ka=p(v[L])}catch(V){delete v[L];ra(H,V,-1);return}a(H,Ka);delete v[L]},\"vi\");this.Sa[f]=K;this.Sa[l]=I;this.handleError(mb(this.db,f,u.length-1,1,0,0,K,I,0));return this};e.prototype.vc=function(f){this.fb&&(ob(this.db,0,0),A(this.fb),this.fb=void 0);if(!f)return this;this.fb=ua(function(l,n,p,u,v){switch(n){case 18:l=\"insert\";break;case 23:l=\"update\";break;case 9:l=\"delete\";break;default:throw\"unknown operationCode in updateHook callback: \"+\nn;}p=z(p);u=z(u);if(v>Number.MAX_SAFE_INTEGER)throw\"rowId too big to fit inside a Number\";f(l,p,u,Number(v))},\"viiiij\");ob(this.db,this.fb,0);return this};c.prototype.bind=c.prototype.bind;c.prototype.step=c.prototype.step;c.prototype.get=c.prototype.get;c.prototype.getColumnNames=c.prototype.Db;c.prototype.getAsObject=c.prototype.Ob;c.prototype.getSQL=c.prototype.lc;c.prototype.getNormalizedSQL=c.prototype.ic;c.prototype.run=c.prototype.Jb;c.prototype.reset=c.prototype.reset;c.prototype.freemem=\nc.prototype.Cb;c.prototype.free=c.prototype.cb;d.prototype.next=d.prototype.next;d.prototype.getRemainingSQL=d.prototype.jc;e.prototype.run=e.prototype.Jb;e.prototype.exec=e.prototype.exec;e.prototype.each=e.prototype.ec;e.prototype.prepare=e.prototype.Gb;e.prototype.iterateStatements=e.prototype.pc;e.prototype[\"export\"]=e.prototype.fc;e.prototype.close=e.prototype.close;e.prototype.handleError=e.prototype.handleError;e.prototype.getRowsModified=e.prototype.kc;e.prototype.create_function=e.prototype.bc;\ne.prototype.create_aggregate=e.prototype.ac;e.prototype.updateHook=e.prototype.vc;k.Database=e};var va=\"./this.program\",wa=globalThis.document?.currentScript?.src;ba&&(wa=self.location.href);var xa=\"\",ya,za;\nif(aa||ba){try{xa=(new URL(\".\",wa)).href}catch{}ba&&(za=a=>{var b=new XMLHttpRequest;b.open(\"GET\",a,!1);b.responseType=\"arraybuffer\";b.send(null);return new Uint8Array(b.response)});ya=async a=>{a=await fetch(a,{credentials:\"same-origin\"});if(a.ok)return a.arrayBuffer();throw Error(a.status+\" : \"+a.url);}}var Aa=console.log.bind(console),B=console.error.bind(console),Ba,Ca=!1,Da,m,C,Ea,E,F,Fa,Ga,G;\nfunction Ha(){var a=Ia.buffer;m=new Int8Array(a);Ea=new Int16Array(a);C=new Uint8Array(a);new Uint16Array(a);E=new Int32Array(a);F=new Uint32Array(a);Fa=new Float32Array(a);Ga=new Float64Array(a);G=new BigInt64Array(a);new BigUint64Array(a)}function Ja(a){k.onAbort?.(a);a=\"Aborted(\"+a+\")\";B(a);Ca=!0;throw new WebAssembly.RuntimeError(a+\". Build with -sASSERTIONS for more info.\");}var La;\nasync function Ma(a){if(!Ba)try{var b=await ya(a);return new Uint8Array(b)}catch{}if(a==La&&Ba)a=new Uint8Array(Ba);else if(za)a=za(a);else throw\"both async and sync fetching of the wasm failed\";return a}async function Na(a,b){try{var c=await Ma(a);return await WebAssembly.instantiate(c,b)}catch(d){B(`failed to asynchronously prepare wasm: ${d}`),Ja(d)}}\nasync function Oa(a){var b=La;if(!Ba)try{var c=fetch(b,{credentials:\"same-origin\"});return await WebAssembly.instantiateStreaming(c,a)}catch(d){B(`wasm streaming compile failed: ${d}`),B(\"falling back to ArrayBuffer instantiation\")}return Na(b,a)}class Pa{name=\"ExitStatus\";constructor(a){this.message=`Program terminated with exit(${a})`;this.status=a}}var Qa=a=>{for(;0<a.length;)a.shift()(k)},Ra=[],Sa=[],Ta=()=>{var a=k.preRun.shift();Sa.push(a)},J=0,Ua=null;\nfunction r(a,b=\"i8\"){b.endsWith(\"*\")&&(b=\"*\");switch(b){case \"i1\":return m[a];case \"i8\":return m[a];case \"i16\":return Ea[a>>1];case \"i32\":return E[a>>2];case \"i64\":return G[a>>3];case \"float\":return Fa[a>>2];case \"double\":return Ga[a>>3];case \"*\":return F[a>>2];default:Ja(`invalid type for getValue: ${b}`)}}var Va=!0;\nfunction pa(a){var b=\"i32\";b.endsWith(\"*\")&&(b=\"*\");switch(b){case \"i1\":m[a]=0;break;case \"i8\":m[a]=0;break;case \"i16\":Ea[a>>1]=0;break;case \"i32\":E[a>>2]=0;break;case \"i64\":G[a>>3]=BigInt(0);break;case \"float\":Fa[a>>2]=0;break;case \"double\":Ga[a>>3]=0;break;case \"*\":F[a>>2]=0;break;default:Ja(`invalid type for setValue: ${b}`)}}\nvar Wa=new TextDecoder,Xa=(a,b,c,d)=>{c=b+c;if(d)return c;for(;a[b]&&!(b>=c);)++b;return b},z=(a,b,c)=>a?Wa.decode(C.subarray(a,Xa(C,a,b,c))):\"\",Ya=(a,b)=>{for(var c=0,d=a.length-1;0<=d;d--){var e=a[d];\".\"===e?a.splice(d,1):\"..\"===e?(a.splice(d,1),c++):c&&(a.splice(d,1),c--)}if(b)for(;c;c--)a.unshift(\"..\");return a},ha=a=>{var b=\"/\"===a.charAt(0),c=\"/\"===a.slice(-1);(a=Ya(a.split(\"/\").filter(d=>!!d),!b).join(\"/\"))||b||(a=\".\");a&&c&&(a+=\"/\");return(b?\"/\":\"\")+a},Za=a=>{var b=/^(\\/?|)([\\s\\S]*?)((?:\\.{1,2}|[^\\/]+?|)(\\.[^.\\/]*|))(?:[\\/]*)$/.exec(a).slice(1);\na=b[0];b=b[1];if(!a&&!b)return\".\";b&&=b.slice(0,-1);return a+b},$a=a=>a&&a.match(/([^\\/]+|\\/)\\/*$/)[1],ab=()=>a=>crypto.getRandomValues(a),bb=a=>{(bb=ab())(a)},cb=(...a)=>{for(var b=\"\",c=!1,d=a.length-1;-1<=d&&!c;d--){c=0<=d?a[d]:\"/\";if(\"string\"!=typeof c)throw new TypeError(\"Arguments to path.resolve must be strings\");if(!c)return\"\";b=c+\"/\"+b;c=\"/\"===c.charAt(0)}b=Ya(b.split(\"/\").filter(e=>!!e),!c).join(\"/\");return(c?\"/\":\"\")+b||\".\"},db=a=>{var b=Xa(a,0);return Wa.decode(a.buffer?a.subarray(0,b):\nnew Uint8Array(a.slice(0,b)))},fb=[],gb=a=>{for(var b=0,c=0;c<a.length;++c){var d=a.charCodeAt(c);127>=d?b++:2047>=d?b+=2:55296<=d&&57343>=d?(b+=4,++c):b+=3}return b},M=(a,b,c,d)=>{if(!(0<d))return 0;var e=c;d=c+d-1;for(var g=0;g<a.length;++g){var h=a.codePointAt(g);if(127>=h){if(c>=d)break;b[c++]=h}else if(2047>=h){if(c+1>=d)break;b[c++]=192|h>>6;b[c++]=128|h&63}else if(65535>=h){if(c+2>=d)break;b[c++]=224|h>>12;b[c++]=128|h>>6&63;b[c++]=128|h&63}else{if(c+3>=d)break;b[c++]=240|h>>18;b[c++]=128|\nh>>12&63;b[c++]=128|h>>6&63;b[c++]=128|h&63;g++}}b[c]=0;return c-e},pb=[];function qb(a,b){pb[a]={input:[],output:[],kb:b};rb(a,sb)}\nvar sb={open(a){var b=pb[a.node.nb];if(!b)throw new N(43);a.Va=b;a.seekable=!1},close(a){a.Va.kb.lb(a.Va)},lb(a){a.Va.kb.lb(a.Va)},read(a,b,c,d){if(!a.Va||!a.Va.kb.Qb)throw new N(60);for(var e=0,g=0;g<d;g++){try{var h=a.Va.kb.Qb(a.Va)}catch(q){throw new N(29);}if(void 0===h&&0===e)throw new N(6);if(null===h||void 0===h)break;e++;b[c+g]=h}e&&(a.node.$a=Date.now());return e},write(a,b,c,d){if(!a.Va||!a.Va.kb.Hb)throw new N(60);try{for(var e=0;e<d;e++)a.Va.kb.Hb(a.Va,b[c+e])}catch(g){throw new N(29);\n}d&&(a.node.Ua=a.node.Ta=Date.now());return e}},tb={Qb(){a:{if(!fb.length){var a=null;globalThis.window?.prompt&&(a=window.prompt(\"Input: \"),null!==a&&(a+=\"\\n\"));if(!a){var b=null;break a}b=Array(gb(a)+1);a=M(a,b,0,b.length);b.length=a;fb=b}b=fb.shift()}return b},Hb(a,b){null===b||10===b?(Aa(db(a.output)),a.output=[]):0!=b&&a.output.push(b)},lb(a){0<a.output?.length&&(Aa(db(a.output)),a.output=[])},Dc(){return{yc:25856,Ac:5,xc:191,zc:35387,wc:[3,28,127,21,4,0,1,0,17,19,26,0,18,15,23,22,0,0,0,0,0,\n0,0,0,0,0,0,0,0,0,0,0]}},Ec(){return 0},Fc(){return[24,80]}},ub={Hb(a,b){null===b||10===b?(B(db(a.output)),a.output=[]):0!=b&&a.output.push(b)},lb(a){0<a.output?.length&&(B(db(a.output)),a.output=[])}},O={Za:null,ab(){return O.createNode(null,\"/\",16895,0)},createNode(a,b,c,d){if(24576===(c&61440)||4096===(c&61440))throw new N(63);O.Za||(O.Za={dir:{node:{Wa:O.La.Wa,Xa:O.La.Xa,mb:O.La.mb,rb:O.La.rb,Tb:O.La.Tb,xb:O.La.xb,vb:O.La.vb,Ib:O.La.Ib,wb:O.La.wb},stream:{Ya:O.Ma.Ya}},file:{node:{Wa:O.La.Wa,Xa:O.La.Xa},\nstream:{Ya:O.Ma.Ya,read:O.Ma.read,write:O.Ma.write,sb:O.Ma.sb,tb:O.Ma.tb}},link:{node:{Wa:O.La.Wa,Xa:O.La.Xa,eb:O.La.eb},stream:{}},Nb:{node:{Wa:O.La.Wa,Xa:O.La.Xa},stream:vb}});c=wb(a,b,c,d);P(c.mode)?(c.La=O.Za.dir.node,c.Ma=O.Za.dir.stream,c.Na={}):32768===(c.mode&61440)?(c.La=O.Za.file.node,c.Ma=O.Za.file.stream,c.Ra=0,c.Na=null):40960===(c.mode&61440)?(c.La=O.Za.link.node,c.Ma=O.Za.link.stream):8192===(c.mode&61440)&&(c.La=O.Za.Nb.node,c.Ma=O.Za.Nb.stream);c.$a=c.Ua=c.Ta=Date.now();a&&(a.Na[b]=\nc,a.$a=a.Ua=a.Ta=c.$a);return c},Cc(a){return a.Na?a.Na.subarray?a.Na.subarray(0,a.Ra):new Uint8Array(a.Na):new Uint8Array(0)},La:{Wa(a){var b={};b.cc=8192===(a.mode&61440)?a.id:1;b.oc=a.id;b.mode=a.mode;b.rc=1;b.uid=0;b.nc=0;b.nb=a.nb;P(a.mode)?b.size=4096:32768===(a.mode&61440)?b.size=a.Ra:40960===(a.mode&61440)?b.size=a.link.length:b.size=0;b.$a=new Date(a.$a);b.Ua=new Date(a.Ua);b.Ta=new Date(a.Ta);b.Zb=4096;b.$b=Math.ceil(b.size/b.Zb);return b},Xa(a,b){for(var c of[\"mode\",\"atime\",\"mtime\",\"ctime\"])null!=\nb[c]&&(a[c]=b[c]);void 0!==b.size&&(b=b.size,a.Ra!=b&&(0==b?(a.Na=null,a.Ra=0):(c=a.Na,a.Na=new Uint8Array(b),c&&a.Na.set(c.subarray(0,Math.min(b,a.Ra))),a.Ra=b)))},mb(){O.zb||(O.zb=new N(44),O.zb.stack=\"<generic error, no stack>\");throw O.zb;},rb(a,b,c,d){return O.createNode(a,b,c,d)},Tb(a,b,c){try{var d=Q(b,c)}catch(g){}if(d){if(P(a.mode))for(var e in d.Na)throw new N(55);xb(d)}delete a.parent.Na[a.name];b.Na[c]=a;a.name=c;b.Ta=b.Ua=a.parent.Ta=a.parent.Ua=Date.now()},xb(a,b){delete a.Na[b];a.Ta=\na.Ua=Date.now()},vb(a,b){var c=Q(a,b),d;for(d in c.Na)throw new N(55);delete a.Na[b];a.Ta=a.Ua=Date.now()},Ib(a){return[\".\",\"..\",...Object.keys(a.Na)]},wb(a,b,c){a=O.createNode(a,b,41471,0);a.link=c;return a},eb(a){if(40960!==(a.mode&61440))throw new N(28);return a.link}},Ma:{read(a,b,c,d,e){var g=a.node.Na;if(e>=a.node.Ra)return 0;a=Math.min(a.node.Ra-e,d);if(8<a&&g.subarray)b.set(g.subarray(e,e+a),c);else for(d=0;d<a;d++)b[c+d]=g[e+d];return a},write(a,b,c,d,e,g){b.buffer===m.buffer&&(g=!1);if(!d)return 0;\na=a.node;a.Ua=a.Ta=Date.now();if(b.subarray&&(!a.Na||a.Na.subarray)){if(g)return a.Na=b.subarray(c,c+d),a.Ra=d;if(0===a.Ra&&0===e)return a.Na=b.slice(c,c+d),a.Ra=d;if(e+d<=a.Ra)return a.Na.set(b.subarray(c,c+d),e),d}g=e+d;var h=a.Na?a.Na.length:0;h>=g||(g=Math.max(g,h*(1048576>h?2:1.125)>>>0),0!=h&&(g=Math.max(g,256)),h=a.Na,a.Na=new Uint8Array(g),0<a.Ra&&a.Na.set(h.subarray(0,a.Ra),0));if(a.Na.subarray&&b.subarray)a.Na.set(b.subarray(c,c+d),e);else for(g=0;g<d;g++)a.Na[e+g]=b[c+g];a.Ra=Math.max(a.Ra,\ne+d);return d},Ya(a,b,c){1===c?b+=a.position:2===c&&32768===(a.node.mode&61440)&&(b+=a.node.Ra);if(0>b)throw new N(28);return b},sb(a,b,c,d,e){if(32768!==(a.node.mode&61440))throw new N(43);a=a.node.Na;if(e&2||!a||a.buffer!==m.buffer){e=!0;d=65536*Math.ceil(b/65536);var g=yb(65536,d);g&&C.fill(0,g,g+d);d=g;if(!d)throw new N(48);if(a){if(0<c||c+b<a.length)a.subarray?a=a.subarray(c,c+b):a=Array.prototype.slice.call(a,c,c+b);m.set(a,d)}}else e=!1,d=a.byteOffset;return{tc:d,Ub:e}},tb(a,b,c,d){O.Ma.write(a,\nb,0,d,c,!1);return 0}}},ia=(a,b)=>{var c=0;a&&(c|=365);b&&(c|=146);return c},zb=null,Ab={},Bb=[],Cb=1,R=null,Db=!1,Eb=!0,N=class{name=\"ErrnoError\";constructor(a){this.Pa=a}},Fb=class{qb={};node=null;get flags(){return this.qb.flags}set flags(a){this.qb.flags=a}get position(){return this.qb.position}set position(a){this.qb.position=a}},Gb=class{La={};Ma={};ib=null;constructor(a,b,c,d){a||=this;this.parent=a;this.ab=a.ab;this.id=Cb++;this.name=b;this.mode=c;this.nb=d;this.$a=this.Ua=this.Ta=Date.now()}get read(){return 365===\n(this.mode&365)}set read(a){a?this.mode|=365:this.mode&=-366}get write(){return 146===(this.mode&146)}set write(a){a?this.mode|=146:this.mode&=-147}};\nfunction S(a,b={}){if(!a)throw new N(44);b.Bb??(b.Bb=!0);\"/\"===a.charAt(0)||(a=\"//\"+a);var c=0;a:for(;40>c;c++){a=a.split(\"/\").filter(q=>!!q);for(var d=zb,e=\"/\",g=0;g<a.length;g++){var h=g===a.length-1;if(h&&b.parent)break;if(\".\"!==a[g])if(\"..\"===a[g])if(e=Za(e),d===d.parent){a=e+\"/\"+a.slice(g+1).join(\"/\");c--;continue a}else d=d.parent;else{e=ha(e+\"/\"+a[g]);try{d=Q(d,a[g])}catch(q){if(44===q?.Pa&&h&&b.sc)return{path:e};throw q;}!d.ib||h&&!b.Bb||(d=d.ib.root);if(40960===(d.mode&61440)&&(!h||b.hb)){if(!d.La.eb)throw new N(52);\nd=d.La.eb(d);\"/\"===d.charAt(0)||(d=Za(e)+\"/\"+d);a=d+\"/\"+a.slice(g+1).join(\"/\");continue a}}}return{path:e,node:d}}throw new N(32);}function fa(a){for(var b;;){if(a===a.parent)return a=a.ab.Sb,b?\"/\"!==a[a.length-1]?`${a}/${b}`:a+b:a;b=b?`${a.name}/${b}`:a.name;a=a.parent}}function Hb(a,b){for(var c=0,d=0;d<b.length;d++)c=(c<<5)-c+b.charCodeAt(d)|0;return(a+c>>>0)%R.length}function xb(a){var b=Hb(a.parent.id,a.name);if(R[b]===a)R[b]=a.jb;else for(b=R[b];b;){if(b.jb===a){b.jb=a.jb;break}b=b.jb}}\nfunction Q(a,b){var c=P(a.mode)?(c=Ib(a,\"x\"))?c:a.La.mb?0:2:54;if(c)throw new N(c);for(c=R[Hb(a.id,b)];c;c=c.jb){var d=c.name;if(c.parent.id===a.id&&d===b)return c}return a.La.mb(a,b)}function wb(a,b,c,d){a=new Gb(a,b,c,d);b=Hb(a.parent.id,a.name);a.jb=R[b];return R[b]=a}function P(a){return 16384===(a&61440)}function Ib(a,b){return Eb?0:b.includes(\"r\")&&!(a.mode&292)||b.includes(\"w\")&&!(a.mode&146)||b.includes(\"x\")&&!(a.mode&73)?2:0}\nfunction Jb(a,b){if(!P(a.mode))return 54;try{return Q(a,b),20}catch(c){}return Ib(a,\"wx\")}function Kb(a,b,c){try{var d=Q(a,b)}catch(e){return e.Pa}if(a=Ib(a,\"wx\"))return a;if(c){if(!P(d.mode))return 54;if(d===d.parent||\"/\"===fa(d))return 10}else if(P(d.mode))return 31;return 0}function Lb(a){if(!a)throw new N(63);return a}function T(a){a=Bb[a];if(!a)throw new N(8);return a}\nfunction Mb(a,b=-1){a=Object.assign(new Fb,a);if(-1==b)a:{for(b=0;4096>=b;b++)if(!Bb[b])break a;throw new N(33);}a.bb=b;return Bb[b]=a}function Nb(a,b=-1){a=Mb(a,b);a.Ma?.Bc?.(a);return a}function Ob(a,b,c){var d=a?.Ma.Xa;a=d?a:b;d??=b.La.Xa;Lb(d);d(a,c)}var vb={open(a){a.Ma=Ab[a.node.nb].Ma;a.Ma.open?.(a)},Ya(){throw new N(70);}};function rb(a,b){Ab[a]={Ma:b}}\nfunction Pb(a,b){var c=\"/\"===b;if(c&&zb)throw new N(10);if(!c&&b){var d=S(b,{Bb:!1});b=d.path;d=d.node;if(d.ib)throw new N(10);if(!P(d.mode))throw new N(54);}b={type:a,Gc:{},Sb:b,qc:[]};a=a.ab(b);a.ab=b;b.root=a;c?zb=a:d&&(d.ib=b,d.ab&&d.ab.qc.push(b))}function Qb(a,b,c){var d=S(a,{parent:!0}).node;a=$a(a);if(!a)throw new N(28);if(\".\"===a||\"..\"===a)throw new N(20);var e=Jb(d,a);if(e)throw new N(e);if(!d.La.rb)throw new N(63);return d.La.rb(d,a,b,c)}\nfunction ja(a,b=438){return Qb(a,b&4095|32768,0)}function U(a,b=511){return Qb(a,b&1023|16384,0)}function Rb(a,b,c){\"undefined\"==typeof c&&(c=b,b=438);Qb(a,b|8192,c)}function Sb(a,b){if(!cb(a))throw new N(44);var c=S(b,{parent:!0}).node;if(!c)throw new N(44);b=$a(b);var d=Jb(c,b);if(d)throw new N(d);if(!c.La.wb)throw new N(63);c.La.wb(c,b,a)}\nfunction Tb(a){var b=S(a,{parent:!0}).node;a=$a(a);var c=Q(b,a),d=Kb(b,a,!0);if(d)throw new N(d);if(!b.La.vb)throw new N(63);if(c.ib)throw new N(10);b.La.vb(b,a);xb(c)}function ta(a){var b=S(a,{parent:!0}).node;if(!b)throw new N(44);a=$a(a);var c=Q(b,a),d=Kb(b,a,!1);if(d)throw new N(d);if(!b.La.xb)throw new N(63);if(c.ib)throw new N(10);b.La.xb(b,a);xb(c)}function Ub(a,b){a=S(a,{hb:!b}).node;return Lb(a.La.Wa)(a)}function Vb(a,b,c,d){Ob(a,b,{mode:c&4095|b.mode&-4096,Ta:Date.now(),dc:d})}\nfunction ka(a,b){a=\"string\"==typeof a?S(a,{hb:!0}).node:a;Vb(null,a,b)}function Wb(a,b,c){if(P(b.mode))throw new N(31);if(32768!==(b.mode&61440))throw new N(28);var d=Ib(b,\"w\");if(d)throw new N(d);Ob(a,b,{size:c,timestamp:Date.now()})}\nfunction la(a,b,c=438){if(\"\"===a)throw new N(44);if(\"string\"==typeof b){var d={r:0,\"r+\":2,w:577,\"w+\":578,a:1089,\"a+\":1090}[b];if(\"undefined\"==typeof d)throw Error(`Unknown file open mode: ${b}`);b=d}c=b&64?c&4095|32768:0;if(\"object\"==typeof a)d=a;else{var e=a.endsWith(\"/\");var g=S(a,{hb:!(b&131072),sc:!0});d=g.node;a=g.path}g=!1;if(b&64)if(d){if(b&128)throw new N(20);}else{if(e)throw new N(31);d=Qb(a,c|511,0);g=!0}if(!d)throw new N(44);8192===(d.mode&61440)&&(b&=-513);if(b&65536&&!P(d.mode))throw new N(54);\nif(!g&&(d?40960===(d.mode&61440)?e=32:(e=[\"r\",\"w\",\"rw\"][b&3],b&512&&(e+=\"w\"),e=P(d.mode)&&(\"r\"!==e||b&576)?31:Ib(d,e)):e=44,e))throw new N(e);b&512&&!g&&(e=d,e=\"string\"==typeof e?S(e,{hb:!0}).node:e,Wb(null,e,0));b=Mb({node:d,path:fa(d),flags:b&-131713,seekable:!0,position:0,Ma:d.Ma,uc:[],error:!1});b.Ma.open&&b.Ma.open(b);g&&ka(d,c&511);return b}function na(a){if(null===a.bb)throw new N(8);a.Eb&&(a.Eb=null);try{a.Ma.close&&a.Ma.close(a)}catch(b){throw b;}finally{Bb[a.bb]=null}a.bb=null}\nfunction Xb(a,b,c){if(null===a.bb)throw new N(8);if(!a.seekable||!a.Ma.Ya)throw new N(70);if(0!=c&&1!=c&&2!=c)throw new N(28);a.position=a.Ma.Ya(a,b,c);a.uc=[]}function Yb(a,b,c,d,e){if(0>d||0>e)throw new N(28);if(null===a.bb)throw new N(8);if(1===(a.flags&2097155))throw new N(8);if(P(a.node.mode))throw new N(31);if(!a.Ma.read)throw new N(28);var g=\"undefined\"!=typeof e;if(!g)e=a.position;else if(!a.seekable)throw new N(70);b=a.Ma.read(a,b,c,d,e);g||(a.position+=b);return b}\nfunction ma(a,b,c,d,e){if(0>d||0>e)throw new N(28);if(null===a.bb)throw new N(8);if(0===(a.flags&2097155))throw new N(8);if(P(a.node.mode))throw new N(31);if(!a.Ma.write)throw new N(28);a.seekable&&a.flags&1024&&Xb(a,0,2);var g=\"undefined\"!=typeof e;if(!g)e=a.position;else if(!a.seekable)throw new N(70);b=a.Ma.write(a,b,c,d,e,void 0);g||(a.position+=b);return b}\nfunction sa(a){var b=b||0;var c=\"binary\";\"utf8\"!==c&&\"binary\"!==c&&Ja(`Invalid encoding type \"${c}\"`);b=la(a,b);a=Ub(a).size;var d=new Uint8Array(a);Yb(b,d,0,a,0);\"utf8\"===c&&(d=db(d));na(b);return d}\nfunction W(a,b,c){a=ha(\"/dev/\"+a);var d=ia(!!b,!!c);W.Rb??(W.Rb=64);var e=W.Rb++<<8|0;rb(e,{open(g){g.seekable=!1},close(){c?.buffer?.length&&c(10)},read(g,h,q,w){for(var t=0,x=0;x<w;x++){try{var D=b()}catch(ib){throw new N(29);}if(void 0===D&&0===t)throw new N(6);if(null===D||void 0===D)break;t++;h[q+x]=D}t&&(g.node.$a=Date.now());return t},write(g,h,q,w){for(var t=0;t<w;t++)try{c(h[q+t])}catch(x){throw new N(29);}w&&(g.node.Ua=g.node.Ta=Date.now());return t}});Rb(a,d,e)}var X={};\nfunction Y(a,b,c){if(\"/\"===b.charAt(0))return b;a=-100===a?\"/\":T(a).path;if(0==b.length){if(!c)throw new N(44);return a}return a+\"/\"+b}\nfunction Zb(a,b){F[a>>2]=b.cc;F[a+4>>2]=b.mode;F[a+8>>2]=b.rc;F[a+12>>2]=b.uid;F[a+16>>2]=b.nc;F[a+20>>2]=b.nb;G[a+24>>3]=BigInt(b.size);E[a+32>>2]=4096;E[a+36>>2]=b.$b;var c=b.$a.getTime(),d=b.Ua.getTime(),e=b.Ta.getTime();G[a+40>>3]=BigInt(Math.floor(c/1E3));F[a+48>>2]=c%1E3*1E6;G[a+56>>3]=BigInt(Math.floor(d/1E3));F[a+64>>2]=d%1E3*1E6;G[a+72>>3]=BigInt(Math.floor(e/1E3));F[a+80>>2]=e%1E3*1E6;G[a+88>>3]=BigInt(b.oc);return 0}\nvar ic=void 0,Ac=()=>{var a=E[+ic>>2];ic+=4;return a},Cc=0,Dc=[0,31,60,91,121,152,182,213,244,274,305,335],Ec=[0,31,59,90,120,151,181,212,243,273,304,334],Fc={},Gc=a=>{if(!(a instanceof Pa||\"unwind\"==a))throw a;},Hc=a=>{Da=a;Va||0<Cc||(k.onExit?.(a),Ca=!0);throw new Pa(a);},Ic=a=>{if(!Ca)try{a()}catch(b){Gc(b)}finally{if(!(Va||0<Cc))try{Da=a=Da,Hc(a)}catch(b){Gc(b)}}},Jc={},Lc=()=>{if(!Kc){var a={USER:\"web_user\",LOGNAME:\"web_user\",PATH:\"/\",PWD:\"/\",HOME:\"/home/web_user\",LANG:(globalThis.navigator?.language??\n\"C\").replace(\"-\",\"_\")+\".UTF-8\",_:va||\"./this.program\"},b;for(b in Jc)void 0===Jc[b]?delete a[b]:a[b]=Jc[b];var c=[];for(b in a)c.push(`${b}=${a[b]}`);Kc=c}return Kc},Kc,Mc=(a,b,c,d)=>{var e={string:t=>{var x=0;if(null!==t&&void 0!==t&&0!==t){x=gb(t)+1;var D=y(x);M(t,C,D,x);x=D}return x},array:t=>{var x=y(t.length);m.set(t,x);return x}};a=k[\"_\"+a];var g=[],h=0;if(d)for(var q=0;q<d.length;q++){var w=e[c[q]];w?(0===h&&(h=oa()),g[q]=w(d[q])):g[q]=d[q]}c=a(...g);return c=function(t){0!==h&&qa(h);return\"string\"===\nb?z(t):\"boolean\"===b?!!t:t}(c)},ea=a=>{var b=gb(a)+1,c=ca(b);c&&M(a,C,c,b);return c},Nc,Oc=[],A=a=>{Nc.delete(Z.get(a));Z.set(a,null);Oc.push(a)},Pc=a=>{const b=a.length;return[b%128|128,b>>7,...a]},Qc={i:127,p:127,j:126,f:125,d:124,e:111},Rc=a=>Pc(Array.from(a,b=>Qc[b])),ua=(a,b)=>{if(!Nc){Nc=new WeakMap;var c=Z.length;if(Nc)for(var d=0;d<0+c;d++){var e=Z.get(d);e&&Nc.set(e,d)}}if(c=Nc.get(a)||0)return c;c=Oc.length?Oc.pop():Z.grow(1);try{Z.set(c,a)}catch(g){if(!(g instanceof TypeError))throw g;\nb=Uint8Array.of(0,97,115,109,1,0,0,0,1,...Pc([1,96,...Rc(b.slice(1)),...Rc(\"v\"===b[0]?\"\":b[0])]),2,7,1,1,101,1,102,0,0,7,5,1,1,102,0,0);b=new WebAssembly.Module(b);b=(new WebAssembly.Instance(b,{e:{f:a}})).exports.f;Z.set(c,b)}Nc.set(a,c);return c};R=Array(4096);Pb(O,\"/\");U(\"/tmp\");U(\"/home\");U(\"/home/web_user\");\n(function(){U(\"/dev\");rb(259,{read:()=>0,write:(d,e,g,h)=>h,Ya:()=>0});Rb(\"/dev/null\",259);qb(1280,tb);qb(1536,ub);Rb(\"/dev/tty\",1280);Rb(\"/dev/tty1\",1536);var a=new Uint8Array(1024),b=0,c=()=>{0===b&&(bb(a),b=a.byteLength);return a[--b]};W(\"random\",c);W(\"urandom\",c);U(\"/dev/shm\");U(\"/dev/shm/tmp\")})();\n(function(){U(\"/proc\");var a=U(\"/proc/self\");U(\"/proc/self/fd\");Pb({ab(){var b=wb(a,\"fd\",16895,73);b.Ma={Ya:O.Ma.Ya};b.La={mb(c,d){c=+d;var e=T(c);c={parent:null,ab:{Sb:\"fake\"},La:{eb:()=>e.path},id:c+1};return c.parent=c},Ib(){return Array.from(Bb.entries()).filter(([,c])=>c).map(([c])=>c.toString())}};return b}},\"/proc/self/fd\")})();k.noExitRuntime&&(Va=k.noExitRuntime);k.print&&(Aa=k.print);k.printErr&&(B=k.printErr);k.wasmBinary&&(Ba=k.wasmBinary);k.thisProgram&&(va=k.thisProgram);\nif(k.preInit)for(\"function\"==typeof k.preInit&&(k.preInit=[k.preInit]);0<k.preInit.length;)k.preInit.shift()();k.stackSave=()=>oa();k.stackRestore=a=>qa(a);k.stackAlloc=a=>y(a);k.cwrap=(a,b,c,d)=>{var e=!c||c.every(g=>\"number\"===g||\"boolean\"===g);return\"string\"!==b&&e&&!d?k[\"_\"+a]:(...g)=>Mc(a,b,c,g)};k.addFunction=ua;k.removeFunction=A;k.UTF8ToString=z;k.stringToNewUTF8=ea;k.writeArrayToMemory=(a,b)=>{m.set(a,b)};\nvar ca,da,yb,Sc,qa,y,oa,Ia,Z,Tc={a:(a,b,c,d)=>Ja(`Assertion failed: ${z(a)}, at: `+[b?z(b):\"unknown filename\",c,d?z(d):\"unknown function\"]),i:function(a,b){try{return a=z(a),ka(a,b),0}catch(c){if(\"undefined\"==typeof X||\"ErrnoError\"!==c.name)throw c;return-c.Pa}},L:function(a,b,c){try{b=z(b);b=Y(a,b);if(c&-8)return-28;var d=S(b,{hb:!0}).node;if(!d)return-44;a=\"\";c&4&&(a+=\"r\");c&2&&(a+=\"w\");c&1&&(a+=\"x\");return a&&Ib(d,a)?-2:0}catch(e){if(\"undefined\"==typeof X||\"ErrnoError\"!==e.name)throw e;return-e.Pa}},\nj:function(a,b){try{var c=T(a);Vb(c,c.node,b,!1);return 0}catch(d){if(\"undefined\"==typeof X||\"ErrnoError\"!==d.name)throw d;return-d.Pa}},h:function(a){try{var b=T(a);Ob(b,b.node,{timestamp:Date.now(),dc:!1});return 0}catch(c){if(\"undefined\"==typeof X||\"ErrnoError\"!==c.name)throw c;return-c.Pa}},b:function(a,b,c){ic=c;try{var d=T(a);switch(b){case 0:var e=Ac();if(0>e)break;for(;Bb[e];)e++;return Nb(d,e).bb;case 1:case 2:return 0;case 3:return d.flags;case 4:return e=Ac(),d.flags|=e,0;case 12:return e=\nAc(),Ea[e+0>>1]=2,0;case 13:case 14:return 0}return-28}catch(g){if(\"undefined\"==typeof X||\"ErrnoError\"!==g.name)throw g;return-g.Pa}},g:function(a,b){try{var c=T(a),d=c.node,e=c.Ma.Wa;a=e?c:d;e??=d.La.Wa;Lb(e);var g=e(a);return Zb(b,g)}catch(h){if(\"undefined\"==typeof X||\"ErrnoError\"!==h.name)throw h;return-h.Pa}},H:function(a,b){b=-9007199254740992>b||9007199254740992<b?NaN:Number(b);try{if(isNaN(b))return-61;var c=T(a);if(0>b||0===(c.flags&2097155))throw new N(28);Wb(c,c.node,b);return 0}catch(d){if(\"undefined\"==\ntypeof X||\"ErrnoError\"!==d.name)throw d;return-d.Pa}},G:function(a,b){try{if(0===b)return-28;var c=gb(\"/\")+1;if(b<c)return-68;M(\"/\",C,a,b);return c}catch(d){if(\"undefined\"==typeof X||\"ErrnoError\"!==d.name)throw d;return-d.Pa}},K:function(a,b){try{return a=z(a),Zb(b,Ub(a,!0))}catch(c){if(\"undefined\"==typeof X||\"ErrnoError\"!==c.name)throw c;return-c.Pa}},C:function(a,b,c){try{return b=z(b),b=Y(a,b),U(b,c),0}catch(d){if(\"undefined\"==typeof X||\"ErrnoError\"!==d.name)throw d;return-d.Pa}},J:function(a,\nb,c,d){try{b=z(b);var e=d&256;b=Y(a,b,d&4096);return Zb(c,e?Ub(b,!0):Ub(b))}catch(g){if(\"undefined\"==typeof X||\"ErrnoError\"!==g.name)throw g;return-g.Pa}},x:function(a,b,c,d){ic=d;try{b=z(b);b=Y(a,b);var e=d?Ac():0;return la(b,c,e).bb}catch(g){if(\"undefined\"==typeof X||\"ErrnoError\"!==g.name)throw g;return-g.Pa}},v:function(a,b,c,d){try{b=z(b);b=Y(a,b);if(0>=d)return-28;var e=S(b).node;if(!e)throw new N(44);if(!e.La.eb)throw new N(28);var g=e.La.eb(e);var h=Math.min(d,gb(g)),q=m[c+h];M(g,C,c,d+1);\nm[c+h]=q;return h}catch(w){if(\"undefined\"==typeof X||\"ErrnoError\"!==w.name)throw w;return-w.Pa}},u:function(a){try{return a=z(a),Tb(a),0}catch(b){if(\"undefined\"==typeof X||\"ErrnoError\"!==b.name)throw b;return-b.Pa}},f:function(a,b){try{return a=z(a),Zb(b,Ub(a))}catch(c){if(\"undefined\"==typeof X||\"ErrnoError\"!==c.name)throw c;return-c.Pa}},r:function(a,b,c){try{b=z(b);b=Y(a,b);if(c)if(512===c)Tb(b);else return-28;else ta(b);return 0}catch(d){if(\"undefined\"==typeof X||\"ErrnoError\"!==d.name)throw d;\nreturn-d.Pa}},q:function(a,b,c){try{b=z(b);b=Y(a,b,!0);var d=Date.now(),e,g;if(c){var h=F[c>>2]+4294967296*E[c+4>>2],q=E[c+8>>2];1073741823==q?e=d:1073741822==q?e=null:e=1E3*h+q/1E6;c+=16;h=F[c>>2]+4294967296*E[c+4>>2];q=E[c+8>>2];1073741823==q?g=d:1073741822==q?g=null:g=1E3*h+q/1E6}else g=e=d;if(null!==(g??e)){a=e;var w=S(b,{hb:!0}).node;Lb(w.La.Xa)(w,{$a:a,Ua:g})}return 0}catch(t){if(\"undefined\"==typeof X||\"ErrnoError\"!==t.name)throw t;return-t.Pa}},m:()=>Ja(\"\"),l:()=>{Va=!1;Cc=0},A:function(a,\nb){a=-9007199254740992>a||9007199254740992<a?NaN:Number(a);a=new Date(1E3*a);E[b>>2]=a.getSeconds();E[b+4>>2]=a.getMinutes();E[b+8>>2]=a.getHours();E[b+12>>2]=a.getDate();E[b+16>>2]=a.getMonth();E[b+20>>2]=a.getFullYear()-1900;E[b+24>>2]=a.getDay();var c=a.getFullYear();E[b+28>>2]=(0!==c%4||0===c%100&&0!==c%400?Ec:Dc)[a.getMonth()]+a.getDate()-1|0;E[b+36>>2]=-(60*a.getTimezoneOffset());c=(new Date(a.getFullYear(),6,1)).getTimezoneOffset();var d=(new Date(a.getFullYear(),0,1)).getTimezoneOffset();\nE[b+32>>2]=(c!=d&&a.getTimezoneOffset()==Math.min(d,c))|0},y:function(a,b,c,d,e,g,h){e=-9007199254740992>e||9007199254740992<e?NaN:Number(e);try{var q=T(d);if(0!==(b&2)&&0===(c&2)&&2!==(q.flags&2097155))throw new N(2);if(1===(q.flags&2097155))throw new N(2);if(!q.Ma.sb)throw new N(43);if(!a)throw new N(28);var w=q.Ma.sb(q,a,e,b,c);var t=w.tc;E[g>>2]=w.Ub;F[h>>2]=t;return 0}catch(x){if(\"undefined\"==typeof X||\"ErrnoError\"!==x.name)throw x;return-x.Pa}},z:function(a,b,c,d,e,g){g=-9007199254740992>g||\n9007199254740992<g?NaN:Number(g);try{var h=T(e);if(c&2){if(32768!==(h.node.mode&61440))throw new N(43);d&2||h.Ma.tb&&h.Ma.tb(h,C.slice(a,a+b),g,b,d)}}catch(q){if(\"undefined\"==typeof X||\"ErrnoError\"!==q.name)throw q;return-q.Pa}},n:(a,b)=>{Fc[a]&&(clearTimeout(Fc[a].id),delete Fc[a]);if(!b)return 0;var c=setTimeout(()=>{delete Fc[a];Ic(()=>Sc(a,performance.now()))},b);Fc[a]={id:c,Hc:b};return 0},B:(a,b,c,d)=>{var e=(new Date).getFullYear(),g=(new Date(e,0,1)).getTimezoneOffset();e=(new Date(e,6,1)).getTimezoneOffset();\nF[a>>2]=60*Math.max(g,e);E[b>>2]=Number(g!=e);b=h=>{var q=Math.abs(h);return`UTC${0<=h?\"-\":\"+\"}${String(Math.floor(q/60)).padStart(2,\"0\")}${String(q%60).padStart(2,\"0\")}`};a=b(g);b=b(e);e<g?(M(a,C,c,17),M(b,C,d,17)):(M(a,C,d,17),M(b,C,c,17))},d:()=>Date.now(),s:()=>2147483648,c:()=>performance.now(),o:a=>{var b=C.length;a>>>=0;if(2147483648<a)return!1;for(var c=1;4>=c;c*=2){var d=b*(1+.2/c);d=Math.min(d,a+100663296);a:{d=(Math.min(2147483648,65536*Math.ceil(Math.max(a,d)/65536))-Ia.buffer.byteLength+\n65535)/65536|0;try{Ia.grow(d);Ha();var e=1;break a}catch(g){}e=void 0}if(e)return!0}return!1},E:(a,b)=>{var c=0,d=0,e;for(e of Lc()){var g=b+c;F[a+d>>2]=g;c+=M(e,C,g,Infinity)+1;d+=4}return 0},F:(a,b)=>{var c=Lc();F[a>>2]=c.length;a=0;for(var d of c)a+=gb(d)+1;F[b>>2]=a;return 0},e:function(a){try{var b=T(a);na(b);return 0}catch(c){if(\"undefined\"==typeof X||\"ErrnoError\"!==c.name)throw c;return c.Pa}},p:function(a,b){try{var c=T(a);m[b]=c.Va?2:P(c.mode)?3:40960===(c.mode&61440)?7:4;Ea[b+2>>1]=0;G[b+\n8>>3]=BigInt(0);G[b+16>>3]=BigInt(0);return 0}catch(d){if(\"undefined\"==typeof X||\"ErrnoError\"!==d.name)throw d;return d.Pa}},w:function(a,b,c,d){try{a:{var e=T(a);a=b;for(var g,h=b=0;h<c;h++){var q=F[a>>2],w=F[a+4>>2];a+=8;var t=Yb(e,m,q,w,g);if(0>t){var x=-1;break a}b+=t;if(t<w)break;\"undefined\"!=typeof g&&(g+=t)}x=b}F[d>>2]=x;return 0}catch(D){if(\"undefined\"==typeof X||\"ErrnoError\"!==D.name)throw D;return D.Pa}},D:function(a,b,c,d){b=-9007199254740992>b||9007199254740992<b?NaN:Number(b);try{if(isNaN(b))return 61;\nvar e=T(a);Xb(e,b,c);G[d>>3]=BigInt(e.position);e.Eb&&0===b&&0===c&&(e.Eb=null);return 0}catch(g){if(\"undefined\"==typeof X||\"ErrnoError\"!==g.name)throw g;return g.Pa}},I:function(a){try{var b=T(a);return b.Ma?.lb?.(b)}catch(c){if(\"undefined\"==typeof X||\"ErrnoError\"!==c.name)throw c;return c.Pa}},t:function(a,b,c,d){try{a:{var e=T(a);a=b;for(var g,h=b=0;h<c;h++){var q=F[a>>2],w=F[a+4>>2];a+=8;var t=ma(e,m,q,w,g);if(0>t){var x=-1;break a}b+=t;if(t<w)break;\"undefined\"!=typeof g&&(g+=t)}x=b}F[d>>2]=x;\nreturn 0}catch(D){if(\"undefined\"==typeof X||\"ErrnoError\"!==D.name)throw D;return D.Pa}},k:Hc};\nfunction Uc(){function a(){k.calledRun=!0;if(!Ca){if(!k.noFSInit&&!Db){var b,c;Db=!0;b??=k.stdin;c??=k.stdout;d??=k.stderr;b?W(\"stdin\",b):Sb(\"/dev/tty\",\"/dev/stdin\");c?W(\"stdout\",null,c):Sb(\"/dev/tty\",\"/dev/stdout\");d?W(\"stderr\",null,d):Sb(\"/dev/tty1\",\"/dev/stderr\");la(\"/dev/stdin\",0);la(\"/dev/stdout\",1);la(\"/dev/stderr\",1)}Vc.N();Eb=!1;k.onRuntimeInitialized?.();if(k.postRun)for(\"function\"==typeof k.postRun&&(k.postRun=[k.postRun]);k.postRun.length;){var d=k.postRun.shift();Ra.push(d)}Qa(Ra)}}if(0<\nJ)Ua=Uc;else{if(k.preRun)for(\"function\"==typeof k.preRun&&(k.preRun=[k.preRun]);k.preRun.length;)Ta();Qa(Sa);0<J?Ua=Uc:k.setStatus?(k.setStatus(\"Running...\"),setTimeout(()=>{setTimeout(()=>k.setStatus(\"\"),1);a()},1)):a()}}var Vc;\n(async function(){function a(c){c=Vc=c.exports;k._sqlite3_free=c.P;k._sqlite3_value_text=c.Q;k._sqlite3_prepare_v2=c.R;k._sqlite3_step=c.S;k._sqlite3_reset=c.T;k._sqlite3_exec=c.U;k._sqlite3_finalize=c.V;k._sqlite3_column_name=c.W;k._sqlite3_column_text=c.X;k._sqlite3_column_type=c.Y;k._sqlite3_errmsg=c.Z;k._sqlite3_clear_bindings=c._;k._sqlite3_value_blob=c.$;k._sqlite3_value_bytes=c.aa;k._sqlite3_value_double=c.ba;k._sqlite3_value_int=c.ca;k._sqlite3_value_type=c.da;k._sqlite3_result_blob=c.ea;\nk._sqlite3_result_double=c.fa;k._sqlite3_result_error=c.ga;k._sqlite3_result_int=c.ha;k._sqlite3_result_int64=c.ia;k._sqlite3_result_null=c.ja;k._sqlite3_result_text=c.ka;k._sqlite3_aggregate_context=c.la;k._sqlite3_column_count=c.ma;k._sqlite3_data_count=c.na;k._sqlite3_column_blob=c.oa;k._sqlite3_column_bytes=c.pa;k._sqlite3_column_double=c.qa;k._sqlite3_bind_blob=c.ra;k._sqlite3_bind_double=c.sa;k._sqlite3_bind_int=c.ta;k._sqlite3_bind_text=c.ua;k._sqlite3_bind_parameter_index=c.va;k._sqlite3_sql=\nc.wa;k._sqlite3_normalized_sql=c.xa;k._sqlite3_changes=c.ya;k._sqlite3_close_v2=c.za;k._sqlite3_create_function_v2=c.Aa;k._sqlite3_update_hook=c.Ba;k._sqlite3_open=c.Ca;ca=k._malloc=c.Da;da=k._free=c.Ea;k._RegisterExtensionFunctions=c.Fa;yb=c.Ga;Sc=c.Ha;qa=c.Ia;y=c.Ja;oa=c.Ka;Ia=c.M;Z=c.O;Ha();J--;k.monitorRunDependencies?.(J);0==J&&Ua&&(c=Ua,Ua=null,c());return Vc}J++;k.monitorRunDependencies?.(J);var b={a:Tc};if(k.instantiateWasm)return new Promise(c=>{k.instantiateWasm(b,(d,e)=>{c(a(d,e))})});\nLa??=k.locateFile?k.locateFile(\"sql-wasm-browser.wasm\",xa):xa+\"sql-wasm-browser.wasm\";return a((await Oa(b)).instance)})();Uc();\n\n\n        // The shell-pre.js and emcc-generated code goes above\n        return Module;\n    }); // The end of the promise being returned\n\n  return initSqlJsPromise;\n} // The end of our initSqlJs function\n\n// This bit below is copied almost exactly from what you get when you use the MODULARIZE=1 flag with emcc\n// However, we don't want to use the emcc modularization. See shell-pre.js\nif (true){\n    module.exports = initSqlJs;\n    // This will allow the module to be used in ES6 or CommonJS\n    module.exports[\"default\"] = initSqlJs;\n}\nelse {}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL25vZGVfbW9kdWxlcy9zcWwuanMvZGlzdC9zcWwtd2FzbS1icm93c2VyLmpzIiwibWFwcGluZ3MiOiI7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFNLCtDQUErQztBQUNyRCxrQ0FBa0MsZ0JBQWdCLGlCQUFpQiwyQkFBMkIsTUFBTSxzQkFBc0IsTUFBTSw0QkFBNEIsTUFBTSxnQ0FBZ0Msd0JBQXdCLG1CQUFtQixXQUFXLG9CQUFvQixNQUFNLG9GQUFvRixNQUFNLGVBQWUsZ0JBQWdCLGlCQUFpQixJQUFJLE1BQU0sNkJBQTZCLHdCQUF3QixzQkFBc0I7QUFDamYsR0FBRyxJQUFJLFFBQVEsUUFBUSxnQ0FBZ0MsSUFBSSxpQkFBaUIsSUFBSSxZQUFZLFVBQVUsU0FBUyxnQkFBZ0IsVUFBVSxVQUFVLFVBQVUsV0FBVyxnQkFBZ0IsVUFBVSxjQUFjLDhFQUE4RSxnQkFBZ0IscUJBQXFCLGNBQWMsdURBQXVELFlBQVksOEJBQThCLG9EQUFvRCxZQUFZO0FBQ2xmLEdBQUcsTUFBTSx1QkFBdUIsa0JBQWtCLHVCQUF1QixJQUFJLHlCQUF5QixJQUFJLFlBQVksWUFBWSxxQkFBcUIsTUFBTSxTQUFTLHFDQUFxQyxtQkFBbUIsWUFBWSxXQUFXLFdBQVc7QUFDaFE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1RkFB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QkFBNEIsNEJBQTRCLGtDQUFrQyw2QkFBNkIsMkJBQTJCLDRCQUE0Qiw2QkFBNkIsOEJBQThCLDBCQUEwQiw0QkFBNEIseUJBQXlCLDBCQUEwQixxQ0FBcUM7QUFDMWUsS0FBSywrQkFBK0Isd0JBQXdCLHlCQUF5QixtQ0FBbUMsNEJBQTRCLHFCQUFxQixrQkFBa0IsZ0JBQWdCLG1DQUFtQyxRQUFRLFFBQVEsUUFBUSxPQUFPLFFBQVEsT0FBTyxNQUFNLEtBQUssSUFBSSw4QkFBOEIsNkJBQTZCLFVBQVUsSUFBSSw4QkFBOEIsT0FBTyxNQUFNLDRDQUE0Qyw0QkFBNEIsVUFBVSxFQUFFO0FBQ25mLHNGQUFzRixpQ0FBaUMsSUFBSTs7O0FBRzNIO0FBQ0E7QUFDQSxLQUFLLEdBQUc7O0FBRVI7QUFDQSxFQUFFOztBQUVGO0FBQ0E7QUFDQSxJQUFJLElBQXlEO0FBQzdEO0FBQ0E7QUFDQSxJQUFJLHlCQUFzQjtBQUMxQjtBQUNBLEtBQUssRUFLSiIsInNvdXJjZXMiOlsid2VicGFjazovL19OX0UvLi9ub2RlX21vZHVsZXMvc3FsLmpzL2Rpc3Qvc3FsLXdhc20tYnJvd3Nlci5qcz9mNmExIl0sInNvdXJjZXNDb250ZW50IjpbIlxuLy8gV2UgYXJlIG1vZHVsYXJpemluZyB0aGlzIG1hbnVhbGx5IGJlY2F1c2UgdGhlIGN1cnJlbnQgbW9kdWxhcml6ZSBzZXR0aW5nIGluIEVtc2NyaXB0ZW4gaGFzIHNvbWUgaXNzdWVzOlxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2tyaXBrZW4vZW1zY3JpcHRlbi9pc3N1ZXMvNTgyMFxuLy8gSW4gYWRkaXRpb24sIFdoZW4geW91IHVzZSBlbWNjJ3MgbW9kdWxhcml6YXRpb24sIGl0IHN0aWxsIGV4cGVjdHMgdG8gZXhwb3J0IGEgZ2xvYmFsIG9iamVjdCBjYWxsZWQgYE1vZHVsZWAsXG4vLyB3aGljaCBpcyBhYmxlIHRvIGJlIHVzZWQvY2FsbGVkIGJlZm9yZSB0aGUgV0FTTSBpcyBsb2FkZWQuXG4vLyBUaGUgbW9kdWxhcml6YXRpb24gYmVsb3cgZXhwb3J0cyBhIHByb21pc2UgdGhhdCBsb2FkcyBhbmQgcmVzb2x2ZXMgdG8gdGhlIGFjdHVhbCBzcWwuanMgbW9kdWxlLlxuLy8gVGhhdCB3YXksIHRoaXMgbW9kdWxlIGNhbid0IGJlIHVzZWQgYmVmb3JlIHRoZSBXQVNNIGlzIGZpbmlzaGVkIGxvYWRpbmcuXG5cbi8vIFdlIGFyZSBnb2luZyB0byBkZWZpbmUgYSBmdW5jdGlvbiB0aGF0IGEgdXNlciB3aWxsIGNhbGwgdG8gc3RhcnQgbG9hZGluZyBpbml0aWFsaXppbmcgb3VyIFNxbC5qcyBsaWJyYXJ5XG4vLyBIb3dldmVyLCB0aGF0IGZ1bmN0aW9uIG1pZ2h0IGJlIGNhbGxlZCBtdWx0aXBsZSB0aW1lcywgYW5kIG9uIHN1YnNlcXVlbnQgY2FsbHMsIHdlIGRvbid0IGFjdHVhbGx5IHdhbnQgaXQgdG8gaW5zdGFudGlhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgdGhlIE1vZHVsZVxuLy8gSW5zdGVhZCwgd2Ugd2FudCB0byByZXR1cm4gdGhlIHByZXZpb3VzbHkgbG9hZGVkIG1vZHVsZVxuXG4vLyBUT0RPOiBNYWtlIHRoaXMgbm90IGRlY2xhcmUgYSBnbG9iYWwgaWYgdXNlZCBpbiB0aGUgYnJvd3NlclxudmFyIGluaXRTcWxKc1Byb21pc2UgPSB1bmRlZmluZWQ7XG5cbnZhciBpbml0U3FsSnMgPSBmdW5jdGlvbiAobW9kdWxlQ29uZmlnKSB7XG5cbiAgICBpZiAoaW5pdFNxbEpzUHJvbWlzZSl7XG4gICAgICByZXR1cm4gaW5pdFNxbEpzUHJvbWlzZTtcbiAgICB9XG4gICAgLy8gSWYgd2UncmUgaGVyZSwgd2UndmUgbmV2ZXIgY2FsbGVkIHRoaXMgZnVuY3Rpb24gYmVmb3JlXG4gICAgaW5pdFNxbEpzUHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlTW9kdWxlLCByZWplY3QpIHtcblxuICAgICAgICAvLyBXZSBhcmUgbW9kdWxhcml6aW5nIHRoaXMgbWFudWFsbHkgYmVjYXVzZSB0aGUgY3VycmVudCBtb2R1bGFyaXplIHNldHRpbmcgaW4gRW1zY3JpcHRlbiBoYXMgc29tZSBpc3N1ZXM6XG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9rcmlwa2VuL2Vtc2NyaXB0ZW4vaXNzdWVzLzU4MjBcblxuICAgICAgICAvLyBUaGUgd2F5IHRvIGFmZmVjdCB0aGUgbG9hZGluZyBvZiBlbWNjIGNvbXBpbGVkIG1vZHVsZXMgaXMgdG8gY3JlYXRlIGEgdmFyaWFibGUgY2FsbGVkIGBNb2R1bGVgIGFuZCBhZGRcbiAgICAgICAgLy8gcHJvcGVydGllcyB0byBpdCwgbGlrZSBgcHJlUnVuYCwgYHBvc3RSdW5gLCBldGNcbiAgICAgICAgLy8gV2UgYXJlIHVzaW5nIHRoYXQgdG8gZ2V0IG5vdGlmaWVkIHdoZW4gdGhlIFdBU00gaGFzIGZpbmlzaGVkIGxvYWRpbmcuXG4gICAgICAgIC8vIE9ubHkgdGhlbiB3aWxsIHdlIHJldHVybiBvdXIgcHJvbWlzZVxuXG4gICAgICAgIC8vIElmIHRoZXkgcGFzc2VkIGluIGEgbW9kdWxlQ29uZmlnIG9iamVjdCwgdXNlIHRoYXRcbiAgICAgICAgLy8gT3RoZXJ3aXNlLCBpbml0aWFsaXplIE1vZHVsZSB0byB0aGUgZW1wdHkgb2JqZWN0XG4gICAgICAgIHZhciBNb2R1bGUgPSB0eXBlb2YgbW9kdWxlQ29uZmlnICE9PSAndW5kZWZpbmVkJyA/IG1vZHVsZUNvbmZpZyA6IHt9O1xuXG4gICAgICAgIC8vIEVNQ0Mgb25seSBhbGxvd3MgZm9yIGEgc2luZ2xlIG9uQWJvcnQgZnVuY3Rpb24gKG5vdCBhbiBhcnJheSBvZiBmdW5jdGlvbnMpXG4gICAgICAgIC8vIFNvIGlmIHRoZSB1c2VyIGRlZmluZWQgdGhlaXIgb3duIG9uQWJvcnQgZnVuY3Rpb24sIHdlIHJlbWVtYmVyIGl0IGFuZCBjYWxsIGl0XG4gICAgICAgIHZhciBvcmlnaW5hbE9uQWJvcnRGdW5jdGlvbiA9IE1vZHVsZVsnb25BYm9ydCddO1xuICAgICAgICBNb2R1bGVbJ29uQWJvcnQnXSA9IGZ1bmN0aW9uIChlcnJvclRoYXRDYXVzZWRBYm9ydCkge1xuICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihlcnJvclRoYXRDYXVzZWRBYm9ydCkpO1xuICAgICAgICAgICAgaWYgKG9yaWdpbmFsT25BYm9ydEZ1bmN0aW9uKXtcbiAgICAgICAgICAgICAgb3JpZ2luYWxPbkFib3J0RnVuY3Rpb24oZXJyb3JUaGF0Q2F1c2VkQWJvcnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIE1vZHVsZVsncG9zdFJ1biddID0gTW9kdWxlWydwb3N0UnVuJ10gfHwgW107XG4gICAgICAgIE1vZHVsZVsncG9zdFJ1biddLnB1c2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLy8gV2hlbiBFbXNjcmlwdGVkIGNhbGxzIHBvc3RSdW4sIHRoaXMgcHJvbWlzZSByZXNvbHZlcyB3aXRoIHRoZSBidWlsdCBNb2R1bGVcbiAgICAgICAgICAgIHJlc29sdmVNb2R1bGUoTW9kdWxlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gVGhlcmUgaXMgYSBzZWN0aW9uIG9mIGNvZGUgaW4gdGhlIGVtY2MtZ2VuZXJhdGVkIGNvZGUgYmVsb3cgdGhhdCBsb29rcyBsaWtlIHRoaXM6XG4gICAgICAgIC8vIChOb3RlIHRoYXQgdGhpcyBpcyBsb3dlcmNhc2UgYG1vZHVsZWApXG4gICAgICAgIC8vIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAvLyAgICAgbW9kdWxlWydleHBvcnRzJ10gPSBNb2R1bGU7XG4gICAgICAgIC8vIH1cbiAgICAgICAgLy8gV2hlbiB0aGF0IHJ1bnMsIGl0J3MgZ29pbmcgdG8gb3ZlcndyaXRlIG91ciBvd24gbW9kdWxhcml6YXRpb24gZXhwb3J0IGVmZm9ydHMgaW4gc2hlbGwtcG9zdC5qcyFcbiAgICAgICAgLy8gVGhlIG9ubHkgd2F5IHRvIHRlbGwgZW1jYyBub3QgdG8gZW1pdCBpdCBpcyB0byBwYXNzIHRoZSBNT0RVTEFSSVpFPTEgb3IgTU9EVUxBUklaRV9JTlNUQU5DRT0xIGZsYWdzLFxuICAgICAgICAvLyBidXQgdGhhdCBjYXJyaWVzIHdpdGggaXQgYWRkaXRpb25hbCB1bm5lY2Vzc2FyeSBiYWdnYWdlL2J1Z3Mgd2UgZG9uJ3Qgd2FudCBlaXRoZXIuXG4gICAgICAgIC8vIFNvLCB3ZSBoYXZlIHRocmVlIG9wdGlvbnM6XG4gICAgICAgIC8vIDEpIFdlIHVuZGVmaW5lIGBtb2R1bGVgXG4gICAgICAgIC8vIDIpIFdlIHJlbWVtYmVyIHdoYXQgYG1vZHVsZVsnZXhwb3J0cyddYCB3YXMgYXQgdGhlIGJlZ2lubmluZyBvZiB0aGlzIGZ1bmN0aW9uIGFuZCB3ZSByZXN0b3JlIGl0IGxhdGVyXG4gICAgICAgIC8vIDMpIFdlIHdyaXRlIGEgc2NyaXB0IHRvIHJlbW92ZSB0aG9zZSBsaW5lcyBvZiBjb2RlIGFzIHBhcnQgb2YgdGhlIE1ha2UgcHJvY2Vzcy5cbiAgICAgICAgLy9cbiAgICAgICAgLy8gU2luY2UgdGhvc2UgYXJlIHRoZSBvbmx5IGxpbmVzIG9mIGNvZGUgdGhhdCBjYXJlIGFib3V0IG1vZHVsZSwgd2Ugd2lsbCB1bmRlZmluZSBpdC4gSXQncyB0aGUgbW9zdCBzdHJhaWdodGZvcndhcmRcbiAgICAgICAgLy8gb2YgdGhlIG9wdGlvbnMsIGFuZCBoYXMgdGhlIHNpZGUgZWZmZWN0IG9mIHJlZHVjaW5nIGVtY2MncyBlZmZvcnRzIHRvIG1vZGlmeSB0aGUgbW9kdWxlIGlmIGl0cyBvdXRwdXQgd2VyZSB0byBjaGFuZ2UgaW4gdGhlIGZ1dHVyZS5cbiAgICAgICAgLy8gVGhhdCdzIGEgbmljZSBzaWRlIGVmZmVjdCBzaW5jZSB3ZSdyZSBoYW5kbGluZyB0aGUgbW9kdWxhcml6YXRpb24gZWZmb3J0cyBvdXJzZWx2ZXNcbiAgICAgICAgbW9kdWxlID0gdW5kZWZpbmVkO1xuXG4gICAgICAgIC8vIFRoZSBlbWNjLWdlbmVyYXRlZCBjb2RlIGFuZCBzaGVsbC1wb3N0LmpzIGNvZGUgZ29lcyBiZWxvdyxcbiAgICAgICAgLy8gbWVhbmluZyB0aGF0IGFsbCBvZiBpdCBydW5zIGluc2lkZSBvZiB0aGlzIHByb21pc2UuIElmIGFueXRoaW5nIHRocm93cyBhbiBleGNlcHRpb24sIG91ciBwcm9taXNlIHdpbGwgYWJvcnRcbnZhciBrO2t8fD10eXBlb2YgTW9kdWxlICE9ICd1bmRlZmluZWQnID8gTW9kdWxlIDoge307dmFyIGFhPSEhZ2xvYmFsVGhpcy53aW5kb3csYmE9ISFnbG9iYWxUaGlzLldvcmtlckdsb2JhbFNjb3BlO1xuay5vblJ1bnRpbWVJbml0aWFsaXplZD1mdW5jdGlvbigpe2Z1bmN0aW9uIGEoZixsKXtzd2l0Y2godHlwZW9mIGwpe2Nhc2UgXCJib29sZWFuXCI6JGIoZixsPzE6MCk7YnJlYWs7Y2FzZSBcIm51bWJlclwiOmFjKGYsbCk7YnJlYWs7Y2FzZSBcInN0cmluZ1wiOmJjKGYsbCwtMSwtMSk7YnJlYWs7Y2FzZSBcIm9iamVjdFwiOmlmKG51bGw9PT1sKWViKGYpO2Vsc2UgaWYobnVsbCE9bC5sZW5ndGgpe3ZhciBuPWNhKGwubGVuZ3RoKTttLnNldChsLG4pO2NjKGYsbixsLmxlbmd0aCwtMSk7ZGEobil9ZWxzZSByYShmLFwiV3JvbmcgQVBJIHVzZSA6IHRyaWVkIHRvIHJldHVybiBhIHZhbHVlIG9mIGFuIHVua25vd24gdHlwZSAoXCIrbCtcIikuXCIsLTEpO2JyZWFrO2RlZmF1bHQ6ZWIoZil9fWZ1bmN0aW9uIGIoZixsKXtmb3IodmFyIG49W10scD0wO3A8ZjtwKz0xKXt2YXIgdT1yKGwrNCpwLFwiaTMyXCIpLHY9ZGModSk7aWYoMT09PXZ8fDI9PT12KXU9ZWModSk7ZWxzZSBpZigzPT09dil1PWZjKHUpO2Vsc2UgaWYoND09PVxudil7dj11O3U9Z2Modik7dj1oYyh2KTtmb3IodmFyIEs9bmV3IFVpbnQ4QXJyYXkodSksST0wO0k8dTtJKz0xKUtbSV09bVt2K0ldO3U9S31lbHNlIHU9bnVsbDtuLnB1c2godSl9cmV0dXJuIG59ZnVuY3Rpb24gYyhmLGwpe3RoaXMuUWE9Zjt0aGlzLmRiPWw7dGhpcy5PYT0xO3RoaXMueWI9W119ZnVuY3Rpb24gZChmLGwpe3RoaXMuZGI9bDt0aGlzLm9iPWVhKGYpO2lmKG51bGw9PT10aGlzLm9iKXRocm93IEVycm9yKFwiVW5hYmxlIHRvIGFsbG9jYXRlIG1lbW9yeSBmb3IgdGhlIFNRTCBzdHJpbmdcIik7dGhpcy51Yj10aGlzLm9iO3RoaXMuZ2I9dGhpcy5GYj1udWxsfWZ1bmN0aW9uIGUoZil7dGhpcy5maWxlbmFtZT1cImRiZmlsZV9cIisoNDI5NDk2NzI5NSpNYXRoLnJhbmRvbSgpPj4+MCk7aWYobnVsbCE9Zil7dmFyIGw9dGhpcy5maWxlbmFtZSxuPVwiL1wiLHA9bDtuJiYobj1cInN0cmluZ1wiPT10eXBlb2Ygbj9uOmZhKG4pLHA9bD9oYShuK1wiL1wiK2wpOm4pO2w9aWEoITAsITApO3A9amEocCxcbmwpO2lmKGYpe2lmKFwic3RyaW5nXCI9PXR5cGVvZiBmKXtuPUFycmF5KGYubGVuZ3RoKTtmb3IodmFyIHU9MCx2PWYubGVuZ3RoO3U8djsrK3Upblt1XT1mLmNoYXJDb2RlQXQodSk7Zj1ufWthKHAsbHwxNDYpO249bGEocCw1NzcpO21hKG4sZiwwLGYubGVuZ3RoLDApO25hKG4pO2thKHAsbCl9fXRoaXMuaGFuZGxlRXJyb3IocSh0aGlzLmZpbGVuYW1lLGcpKTt0aGlzLmRiPXIoZyxcImkzMlwiKTtoYih0aGlzLmRiKTt0aGlzLnBiPXt9O3RoaXMuU2E9e319dmFyIGc9eSg0KSxoPWsuY3dyYXAscT1oKFwic3FsaXRlM19vcGVuXCIsXCJudW1iZXJcIixbXCJzdHJpbmdcIixcIm51bWJlclwiXSksdz1oKFwic3FsaXRlM19jbG9zZV92MlwiLFwibnVtYmVyXCIsW1wibnVtYmVyXCJdKSx0PWgoXCJzcWxpdGUzX2V4ZWNcIixcIm51bWJlclwiLFtcIm51bWJlclwiLFwic3RyaW5nXCIsXCJudW1iZXJcIixcIm51bWJlclwiLFwibnVtYmVyXCJdKSx4PWgoXCJzcWxpdGUzX2NoYW5nZXNcIixcIm51bWJlclwiLFtcIm51bWJlclwiXSksRD1oKFwic3FsaXRlM19wcmVwYXJlX3YyXCIsXG5cIm51bWJlclwiLFtcIm51bWJlclwiLFwic3RyaW5nXCIsXCJudW1iZXJcIixcIm51bWJlclwiLFwibnVtYmVyXCJdKSxpYj1oKFwic3FsaXRlM19zcWxcIixcInN0cmluZ1wiLFtcIm51bWJlclwiXSksamM9aChcInNxbGl0ZTNfbm9ybWFsaXplZF9zcWxcIixcInN0cmluZ1wiLFtcIm51bWJlclwiXSksamI9aChcInNxbGl0ZTNfcHJlcGFyZV92MlwiLFwibnVtYmVyXCIsW1wibnVtYmVyXCIsXCJudW1iZXJcIixcIm51bWJlclwiLFwibnVtYmVyXCIsXCJudW1iZXJcIl0pLGtjPWgoXCJzcWxpdGUzX2JpbmRfdGV4dFwiLFwibnVtYmVyXCIsW1wibnVtYmVyXCIsXCJudW1iZXJcIixcIm51bWJlclwiLFwibnVtYmVyXCIsXCJudW1iZXJcIl0pLGtiPWgoXCJzcWxpdGUzX2JpbmRfYmxvYlwiLFwibnVtYmVyXCIsW1wibnVtYmVyXCIsXCJudW1iZXJcIixcIm51bWJlclwiLFwibnVtYmVyXCIsXCJudW1iZXJcIl0pLGxjPWgoXCJzcWxpdGUzX2JpbmRfZG91YmxlXCIsXCJudW1iZXJcIixbXCJudW1iZXJcIixcIm51bWJlclwiLFwibnVtYmVyXCJdKSxtYz1oKFwic3FsaXRlM19iaW5kX2ludFwiLFwibnVtYmVyXCIsW1wibnVtYmVyXCIsXG5cIm51bWJlclwiLFwibnVtYmVyXCJdKSxuYz1oKFwic3FsaXRlM19iaW5kX3BhcmFtZXRlcl9pbmRleFwiLFwibnVtYmVyXCIsW1wibnVtYmVyXCIsXCJzdHJpbmdcIl0pLG9jPWgoXCJzcWxpdGUzX3N0ZXBcIixcIm51bWJlclwiLFtcIm51bWJlclwiXSkscGM9aChcInNxbGl0ZTNfZXJybXNnXCIsXCJzdHJpbmdcIixbXCJudW1iZXJcIl0pLHFjPWgoXCJzcWxpdGUzX2NvbHVtbl9jb3VudFwiLFwibnVtYmVyXCIsW1wibnVtYmVyXCJdKSxyYz1oKFwic3FsaXRlM19kYXRhX2NvdW50XCIsXCJudW1iZXJcIixbXCJudW1iZXJcIl0pLHNjPWgoXCJzcWxpdGUzX2NvbHVtbl9kb3VibGVcIixcIm51bWJlclwiLFtcIm51bWJlclwiLFwibnVtYmVyXCJdKSxsYj1oKFwic3FsaXRlM19jb2x1bW5fdGV4dFwiLFwic3RyaW5nXCIsW1wibnVtYmVyXCIsXCJudW1iZXJcIl0pLHRjPWgoXCJzcWxpdGUzX2NvbHVtbl9ibG9iXCIsXCJudW1iZXJcIixbXCJudW1iZXJcIixcIm51bWJlclwiXSksdWM9aChcInNxbGl0ZTNfY29sdW1uX2J5dGVzXCIsXCJudW1iZXJcIixbXCJudW1iZXJcIixcIm51bWJlclwiXSksdmM9aChcInNxbGl0ZTNfY29sdW1uX3R5cGVcIixcblwibnVtYmVyXCIsW1wibnVtYmVyXCIsXCJudW1iZXJcIl0pLHdjPWgoXCJzcWxpdGUzX2NvbHVtbl9uYW1lXCIsXCJzdHJpbmdcIixbXCJudW1iZXJcIixcIm51bWJlclwiXSkseGM9aChcInNxbGl0ZTNfcmVzZXRcIixcIm51bWJlclwiLFtcIm51bWJlclwiXSkseWM9aChcInNxbGl0ZTNfY2xlYXJfYmluZGluZ3NcIixcIm51bWJlclwiLFtcIm51bWJlclwiXSksemM9aChcInNxbGl0ZTNfZmluYWxpemVcIixcIm51bWJlclwiLFtcIm51bWJlclwiXSksbWI9aChcInNxbGl0ZTNfY3JlYXRlX2Z1bmN0aW9uX3YyXCIsXCJudW1iZXJcIixcIm51bWJlciBzdHJpbmcgbnVtYmVyIG51bWJlciBudW1iZXIgbnVtYmVyIG51bWJlciBudW1iZXIgbnVtYmVyXCIuc3BsaXQoXCIgXCIpKSxkYz1oKFwic3FsaXRlM192YWx1ZV90eXBlXCIsXCJudW1iZXJcIixbXCJudW1iZXJcIl0pLGdjPWgoXCJzcWxpdGUzX3ZhbHVlX2J5dGVzXCIsXCJudW1iZXJcIixbXCJudW1iZXJcIl0pLGZjPWgoXCJzcWxpdGUzX3ZhbHVlX3RleHRcIixcInN0cmluZ1wiLFtcIm51bWJlclwiXSksaGM9aChcInNxbGl0ZTNfdmFsdWVfYmxvYlwiLFxuXCJudW1iZXJcIixbXCJudW1iZXJcIl0pLGVjPWgoXCJzcWxpdGUzX3ZhbHVlX2RvdWJsZVwiLFwibnVtYmVyXCIsW1wibnVtYmVyXCJdKSxhYz1oKFwic3FsaXRlM19yZXN1bHRfZG91YmxlXCIsXCJcIixbXCJudW1iZXJcIixcIm51bWJlclwiXSksZWI9aChcInNxbGl0ZTNfcmVzdWx0X251bGxcIixcIlwiLFtcIm51bWJlclwiXSksYmM9aChcInNxbGl0ZTNfcmVzdWx0X3RleHRcIixcIlwiLFtcIm51bWJlclwiLFwic3RyaW5nXCIsXCJudW1iZXJcIixcIm51bWJlclwiXSksY2M9aChcInNxbGl0ZTNfcmVzdWx0X2Jsb2JcIixcIlwiLFtcIm51bWJlclwiLFwibnVtYmVyXCIsXCJudW1iZXJcIixcIm51bWJlclwiXSksJGI9aChcInNxbGl0ZTNfcmVzdWx0X2ludFwiLFwiXCIsW1wibnVtYmVyXCIsXCJudW1iZXJcIl0pLHJhPWgoXCJzcWxpdGUzX3Jlc3VsdF9lcnJvclwiLFwiXCIsW1wibnVtYmVyXCIsXCJzdHJpbmdcIixcIm51bWJlclwiXSksbmI9aChcInNxbGl0ZTNfYWdncmVnYXRlX2NvbnRleHRcIixcIm51bWJlclwiLFtcIm51bWJlclwiLFwibnVtYmVyXCJdKSxoYj1oKFwiUmVnaXN0ZXJFeHRlbnNpb25GdW5jdGlvbnNcIixcblwibnVtYmVyXCIsW1wibnVtYmVyXCJdKSxvYj1oKFwic3FsaXRlM191cGRhdGVfaG9va1wiLFwibnVtYmVyXCIsW1wibnVtYmVyXCIsXCJudW1iZXJcIixcIm51bWJlclwiXSk7Yy5wcm90b3R5cGUuYmluZD1mdW5jdGlvbihmKXtpZighdGhpcy5RYSl0aHJvd1wiU3RhdGVtZW50IGNsb3NlZFwiO3RoaXMucmVzZXQoKTtyZXR1cm4gQXJyYXkuaXNBcnJheShmKT90aGlzLldiKGYpOm51bGwhPWYmJlwib2JqZWN0XCI9PT10eXBlb2YgZj90aGlzLlhiKGYpOiEwfTtjLnByb3RvdHlwZS5zdGVwPWZ1bmN0aW9uKCl7aWYoIXRoaXMuUWEpdGhyb3dcIlN0YXRlbWVudCBjbG9zZWRcIjt0aGlzLk9hPTE7dmFyIGY9b2ModGhpcy5RYSk7c3dpdGNoKGYpe2Nhc2UgMTAwOnJldHVybiEwO2Nhc2UgMTAxOnJldHVybiExO2RlZmF1bHQ6dGhyb3cgdGhpcy5kYi5oYW5kbGVFcnJvcihmKTt9fTtjLnByb3RvdHlwZS5QYj1mdW5jdGlvbihmKXtudWxsPT1mJiYoZj10aGlzLk9hLHRoaXMuT2ErPTEpO3JldHVybiBzYyh0aGlzLlFhLGYpfTtcbmMucHJvdG90eXBlLmhjPWZ1bmN0aW9uKGYpe251bGw9PWYmJihmPXRoaXMuT2EsdGhpcy5PYSs9MSk7Zj1sYih0aGlzLlFhLGYpO2lmKFwiZnVuY3Rpb25cIiE9PXR5cGVvZiBCaWdJbnQpdGhyb3cgRXJyb3IoXCJCaWdJbnQgaXMgbm90IHN1cHBvcnRlZFwiKTtyZXR1cm4gQmlnSW50KGYpfTtjLnByb3RvdHlwZS5tYz1mdW5jdGlvbihmKXtudWxsPT1mJiYoZj10aGlzLk9hLHRoaXMuT2ErPTEpO3JldHVybiBsYih0aGlzLlFhLGYpfTtjLnByb3RvdHlwZS5nZXRCbG9iPWZ1bmN0aW9uKGYpe251bGw9PWYmJihmPXRoaXMuT2EsdGhpcy5PYSs9MSk7dmFyIGw9dWModGhpcy5RYSxmKTtmPXRjKHRoaXMuUWEsZik7Zm9yKHZhciBuPW5ldyBVaW50OEFycmF5KGwpLHA9MDtwPGw7cCs9MSluW3BdPW1bZitwXTtyZXR1cm4gbn07Yy5wcm90b3R5cGUuZ2V0PWZ1bmN0aW9uKGYsbCl7bD1sfHx7fTtudWxsIT1mJiZ0aGlzLmJpbmQoZikmJnRoaXMuc3RlcCgpO2Y9W107Zm9yKHZhciBuPXJjKHRoaXMuUWEpLFxucD0wO3A8bjtwKz0xKXN3aXRjaCh2Yyh0aGlzLlFhLHApKXtjYXNlIDE6dmFyIHU9bC51c2VCaWdJbnQ/dGhpcy5oYyhwKTp0aGlzLlBiKHApO2YucHVzaCh1KTticmVhaztjYXNlIDI6Zi5wdXNoKHRoaXMuUGIocCkpO2JyZWFrO2Nhc2UgMzpmLnB1c2godGhpcy5tYyhwKSk7YnJlYWs7Y2FzZSA0OmYucHVzaCh0aGlzLmdldEJsb2IocCkpO2JyZWFrO2RlZmF1bHQ6Zi5wdXNoKG51bGwpfXJldHVybiBmfTtjLnByb3RvdHlwZS5EYj1mdW5jdGlvbigpe2Zvcih2YXIgZj1bXSxsPXFjKHRoaXMuUWEpLG49MDtuPGw7bis9MSlmLnB1c2god2ModGhpcy5RYSxuKSk7cmV0dXJuIGZ9O2MucHJvdG90eXBlLk9iPWZ1bmN0aW9uKGYsbCl7Zj10aGlzLmdldChmLGwpO2w9dGhpcy5EYigpO2Zvcih2YXIgbj17fSxwPTA7cDxsLmxlbmd0aDtwKz0xKW5bbFtwXV09ZltwXTtyZXR1cm4gbn07Yy5wcm90b3R5cGUubGM9ZnVuY3Rpb24oKXtyZXR1cm4gaWIodGhpcy5RYSl9O2MucHJvdG90eXBlLmljPVxuZnVuY3Rpb24oKXtyZXR1cm4gamModGhpcy5RYSl9O2MucHJvdG90eXBlLkpiPWZ1bmN0aW9uKGYpe251bGwhPWYmJnRoaXMuYmluZChmKTt0aGlzLnN0ZXAoKTtyZXR1cm4gdGhpcy5yZXNldCgpfTtjLnByb3RvdHlwZS5MYj1mdW5jdGlvbihmLGwpe251bGw9PWwmJihsPXRoaXMuT2EsdGhpcy5PYSs9MSk7Zj1lYShmKTt0aGlzLnliLnB1c2goZik7dGhpcy5kYi5oYW5kbGVFcnJvcihrYyh0aGlzLlFhLGwsZiwtMSwwKSl9O2MucHJvdG90eXBlLlZiPWZ1bmN0aW9uKGYsbCl7bnVsbD09bCYmKGw9dGhpcy5PYSx0aGlzLk9hKz0xKTt2YXIgbj1jYShmLmxlbmd0aCk7bS5zZXQoZixuKTt0aGlzLnliLnB1c2gobik7dGhpcy5kYi5oYW5kbGVFcnJvcihrYih0aGlzLlFhLGwsbixmLmxlbmd0aCwwKSl9O2MucHJvdG90eXBlLktiPWZ1bmN0aW9uKGYsbCl7bnVsbD09bCYmKGw9dGhpcy5PYSx0aGlzLk9hKz0xKTt0aGlzLmRiLmhhbmRsZUVycm9yKChmPT09KGZ8MCk/bWM6bGMpKHRoaXMuUWEsXG5sLGYpKX07Yy5wcm90b3R5cGUuWWI9ZnVuY3Rpb24oZil7bnVsbD09ZiYmKGY9dGhpcy5PYSx0aGlzLk9hKz0xKTtrYih0aGlzLlFhLGYsMCwwLDApfTtjLnByb3RvdHlwZS5NYj1mdW5jdGlvbihmLGwpe251bGw9PWwmJihsPXRoaXMuT2EsdGhpcy5PYSs9MSk7c3dpdGNoKHR5cGVvZiBmKXtjYXNlIFwic3RyaW5nXCI6dGhpcy5MYihmLGwpO3JldHVybjtjYXNlIFwibnVtYmVyXCI6dGhpcy5LYihmLGwpO3JldHVybjtjYXNlIFwiYmlnaW50XCI6dGhpcy5MYihmLnRvU3RyaW5nKCksbCk7cmV0dXJuO2Nhc2UgXCJib29sZWFuXCI6dGhpcy5LYihmKzAsbCk7cmV0dXJuO2Nhc2UgXCJvYmplY3RcIjppZihudWxsPT09Zil7dGhpcy5ZYihsKTtyZXR1cm59aWYobnVsbCE9Zi5sZW5ndGgpe3RoaXMuVmIoZixsKTtyZXR1cm59fXRocm93XCJXcm9uZyBBUEkgdXNlIDogdHJpZWQgdG8gYmluZCBhIHZhbHVlIG9mIGFuIHVua25vd24gdHlwZSAoXCIrZitcIikuXCI7fTtjLnByb3RvdHlwZS5YYj1mdW5jdGlvbihmKXt2YXIgbD1cbnRoaXM7T2JqZWN0LmtleXMoZikuZm9yRWFjaChmdW5jdGlvbihuKXt2YXIgcD1uYyhsLlFhLG4pOzAhPT1wJiZsLk1iKGZbbl0scCl9KTtyZXR1cm4hMH07Yy5wcm90b3R5cGUuV2I9ZnVuY3Rpb24oZil7Zm9yKHZhciBsPTA7bDxmLmxlbmd0aDtsKz0xKXRoaXMuTWIoZltsXSxsKzEpO3JldHVybiEwfTtjLnByb3RvdHlwZS5yZXNldD1mdW5jdGlvbigpe3RoaXMuQ2IoKTtyZXR1cm4gMD09PXljKHRoaXMuUWEpJiYwPT09eGModGhpcy5RYSl9O2MucHJvdG90eXBlLkNiPWZ1bmN0aW9uKCl7Zm9yKHZhciBmO3ZvaWQgMCE9PShmPXRoaXMueWIucG9wKCkpOylkYShmKX07Yy5wcm90b3R5cGUuY2I9ZnVuY3Rpb24oKXt0aGlzLkNiKCk7dmFyIGY9MD09PXpjKHRoaXMuUWEpO2RlbGV0ZSB0aGlzLmRiLnBiW3RoaXMuUWFdO3RoaXMuUWE9MDtyZXR1cm4gZn07ZC5wcm90b3R5cGUubmV4dD1mdW5jdGlvbigpe2lmKG51bGw9PT10aGlzLm9iKXJldHVybntkb25lOiEwfTtudWxsIT09dGhpcy5nYiYmXG4odGhpcy5nYi5jYigpLHRoaXMuZ2I9bnVsbCk7aWYoIXRoaXMuZGIuZGIpdGhyb3cgdGhpcy5BYigpLEVycm9yKFwiRGF0YWJhc2UgY2xvc2VkXCIpO3ZhciBmPW9hKCksbD15KDQpO3BhKGcpO3BhKGwpO3RyeXt0aGlzLmRiLmhhbmRsZUVycm9yKGpiKHRoaXMuZGIuZGIsdGhpcy51YiwtMSxnLGwpKTt0aGlzLnViPXIobCxcImkzMlwiKTt2YXIgbj1yKGcsXCJpMzJcIik7aWYoMD09PW4pcmV0dXJuIHRoaXMuQWIoKSx7ZG9uZTohMH07dGhpcy5nYj1uZXcgYyhuLHRoaXMuZGIpO3RoaXMuZGIucGJbbl09dGhpcy5nYjtyZXR1cm57dmFsdWU6dGhpcy5nYixkb25lOiExfX1jYXRjaChwKXt0aHJvdyB0aGlzLkZiPXoodGhpcy51YiksdGhpcy5BYigpLHA7fWZpbmFsbHl7cWEoZil9fTtkLnByb3RvdHlwZS5BYj1mdW5jdGlvbigpe2RhKHRoaXMub2IpO3RoaXMub2I9bnVsbH07ZC5wcm90b3R5cGUuamM9ZnVuY3Rpb24oKXtyZXR1cm4gbnVsbCE9PXRoaXMuRmI/dGhpcy5GYjp6KHRoaXMudWIpfTtcblwiZnVuY3Rpb25cIj09PXR5cGVvZiBTeW1ib2wmJlwic3ltYm9sXCI9PT10eXBlb2YgU3ltYm9sLml0ZXJhdG9yJiYoZC5wcm90b3R5cGVbU3ltYm9sLml0ZXJhdG9yXT1mdW5jdGlvbigpe3JldHVybiB0aGlzfSk7ZS5wcm90b3R5cGUuSmI9ZnVuY3Rpb24oZixsKXtpZighdGhpcy5kYil0aHJvd1wiRGF0YWJhc2UgY2xvc2VkXCI7aWYobCl7Zj10aGlzLkdiKGYsbCk7dHJ5e2Yuc3RlcCgpfWZpbmFsbHl7Zi5jYigpfX1lbHNlIHRoaXMuaGFuZGxlRXJyb3IodCh0aGlzLmRiLGYsMCwwLGcpKTtyZXR1cm4gdGhpc307ZS5wcm90b3R5cGUuZXhlYz1mdW5jdGlvbihmLGwsbil7aWYoIXRoaXMuZGIpdGhyb3dcIkRhdGFiYXNlIGNsb3NlZFwiO3ZhciBwPW51bGwsdT1udWxsLHY9bnVsbDt0cnl7dj11PWVhKGYpO3ZhciBLPXkoNCk7Zm9yKGY9W107MCE9PXIodixcImk4XCIpOyl7cGEoZyk7cGEoSyk7dGhpcy5oYW5kbGVFcnJvcihqYih0aGlzLmRiLHYsLTEsZyxLKSk7dmFyIEk9cihnLFwiaTMyXCIpO3Y9cihLLFxuXCJpMzJcIik7aWYoMCE9PUkpe3ZhciBIPW51bGw7cD1uZXcgYyhJLHRoaXMpO2ZvcihudWxsIT1sJiZwLmJpbmQobCk7cC5zdGVwKCk7KW51bGw9PT1IJiYoSD17Y29sdW1uczpwLkRiKCksdmFsdWVzOltdfSxmLnB1c2goSCkpLEgudmFsdWVzLnB1c2gocC5nZXQobnVsbCxuKSk7cC5jYigpfX1yZXR1cm4gZn1jYXRjaChMKXt0aHJvdyBwJiZwLmNiKCksTDt9ZmluYWxseXt1JiZkYSh1KX19O2UucHJvdG90eXBlLmVjPWZ1bmN0aW9uKGYsbCxuLHAsdSl7XCJmdW5jdGlvblwiPT09dHlwZW9mIGwmJihwPW4sbj1sLGw9dm9pZCAwKTtmPXRoaXMuR2IoZixsKTt0cnl7Zm9yKDtmLnN0ZXAoKTspbihmLk9iKG51bGwsdSkpfWZpbmFsbHl7Zi5jYigpfWlmKFwiZnVuY3Rpb25cIj09PXR5cGVvZiBwKXJldHVybiBwKCl9O2UucHJvdG90eXBlLkdiPWZ1bmN0aW9uKGYsbCl7cGEoZyk7dGhpcy5oYW5kbGVFcnJvcihEKHRoaXMuZGIsZiwtMSxnLDApKTtmPXIoZyxcImkzMlwiKTtpZigwPT09Zil0aHJvd1wiTm90aGluZyB0byBwcmVwYXJlXCI7XG52YXIgbj1uZXcgYyhmLHRoaXMpO251bGwhPWwmJm4uYmluZChsKTtyZXR1cm4gdGhpcy5wYltmXT1ufTtlLnByb3RvdHlwZS5wYz1mdW5jdGlvbihmKXtyZXR1cm4gbmV3IGQoZix0aGlzKX07ZS5wcm90b3R5cGUuZmM9ZnVuY3Rpb24oKXtPYmplY3QudmFsdWVzKHRoaXMucGIpLmZvckVhY2goZnVuY3Rpb24obCl7bC5jYigpfSk7T2JqZWN0LnZhbHVlcyh0aGlzLlNhKS5mb3JFYWNoKEEpO3RoaXMuU2E9e307dGhpcy5oYW5kbGVFcnJvcih3KHRoaXMuZGIpKTt2YXIgZj1zYSh0aGlzLmZpbGVuYW1lKTt0aGlzLmhhbmRsZUVycm9yKHEodGhpcy5maWxlbmFtZSxnKSk7dGhpcy5kYj1yKGcsXCJpMzJcIik7aGIodGhpcy5kYik7cmV0dXJuIGZ9O2UucHJvdG90eXBlLmNsb3NlPWZ1bmN0aW9uKCl7bnVsbCE9PXRoaXMuZGImJihPYmplY3QudmFsdWVzKHRoaXMucGIpLmZvckVhY2goZnVuY3Rpb24oZil7Zi5jYigpfSksT2JqZWN0LnZhbHVlcyh0aGlzLlNhKS5mb3JFYWNoKEEpLHRoaXMuU2E9XG57fSx0aGlzLmZiJiYoQSh0aGlzLmZiKSx0aGlzLmZiPXZvaWQgMCksdGhpcy5oYW5kbGVFcnJvcih3KHRoaXMuZGIpKSx0YShcIi9cIit0aGlzLmZpbGVuYW1lKSx0aGlzLmRiPW51bGwpfTtlLnByb3RvdHlwZS5oYW5kbGVFcnJvcj1mdW5jdGlvbihmKXtpZigwPT09ZilyZXR1cm4gbnVsbDtmPXBjKHRoaXMuZGIpO3Rocm93IEVycm9yKGYpO307ZS5wcm90b3R5cGUua2M9ZnVuY3Rpb24oKXtyZXR1cm4geCh0aGlzLmRiKX07ZS5wcm90b3R5cGUuYmM9ZnVuY3Rpb24oZixsKXtPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodGhpcy5TYSxmKSYmKEEodGhpcy5TYVtmXSksZGVsZXRlIHRoaXMuU2FbZl0pO3ZhciBuPXVhKGZ1bmN0aW9uKHAsdSx2KXt1PWIodSx2KTt0cnl7dmFyIEs9bC5hcHBseShudWxsLHUpfWNhdGNoKEkpe3JhKHAsSSwtMSk7cmV0dXJufWEocCxLKX0sXCJ2aWlpXCIpO3RoaXMuU2FbZl09bjt0aGlzLmhhbmRsZUVycm9yKG1iKHRoaXMuZGIsZixsLmxlbmd0aCxcbjEsMCxuLDAsMCwwKSk7cmV0dXJuIHRoaXN9O2UucHJvdG90eXBlLmFjPWZ1bmN0aW9uKGYsbCl7dmFyIG49bC5pbml0fHxmdW5jdGlvbigpe3JldHVybiBudWxsfSxwPWwuZmluYWxpemV8fGZ1bmN0aW9uKEgpe3JldHVybiBIfSx1PWwuc3RlcDtpZighdSl0aHJvd1wiQW4gYWdncmVnYXRlIGZ1bmN0aW9uIG11c3QgaGF2ZSBhIHN0ZXAgZnVuY3Rpb24gaW4gXCIrZjt2YXIgdj17fTtPYmplY3QuaGFzT3duUHJvcGVydHkuY2FsbCh0aGlzLlNhLGYpJiYoQSh0aGlzLlNhW2ZdKSxkZWxldGUgdGhpcy5TYVtmXSk7bD1mK1wiX19maW5hbGl6ZVwiO09iamVjdC5oYXNPd25Qcm9wZXJ0eS5jYWxsKHRoaXMuU2EsbCkmJihBKHRoaXMuU2FbbF0pLGRlbGV0ZSB0aGlzLlNhW2xdKTt2YXIgSz11YShmdW5jdGlvbihILEwsS2Epe3ZhciBWPW5iKEgsMSk7T2JqZWN0Lmhhc093blByb3BlcnR5LmNhbGwodixWKXx8KHZbVl09bigpKTtMPWIoTCxLYSk7TD1bdltWXV0uY29uY2F0KEwpO3RyeXt2W1ZdPXUuYXBwbHkobnVsbCxcbkwpfWNhdGNoKEJjKXtkZWxldGUgdltWXSxyYShILEJjLC0xKX19LFwidmlpaVwiKSxJPXVhKGZ1bmN0aW9uKEgpe3ZhciBMPW5iKEgsMSk7dHJ5e3ZhciBLYT1wKHZbTF0pfWNhdGNoKFYpe2RlbGV0ZSB2W0xdO3JhKEgsViwtMSk7cmV0dXJufWEoSCxLYSk7ZGVsZXRlIHZbTF19LFwidmlcIik7dGhpcy5TYVtmXT1LO3RoaXMuU2FbbF09STt0aGlzLmhhbmRsZUVycm9yKG1iKHRoaXMuZGIsZix1Lmxlbmd0aC0xLDEsMCwwLEssSSwwKSk7cmV0dXJuIHRoaXN9O2UucHJvdG90eXBlLnZjPWZ1bmN0aW9uKGYpe3RoaXMuZmImJihvYih0aGlzLmRiLDAsMCksQSh0aGlzLmZiKSx0aGlzLmZiPXZvaWQgMCk7aWYoIWYpcmV0dXJuIHRoaXM7dGhpcy5mYj11YShmdW5jdGlvbihsLG4scCx1LHYpe3N3aXRjaChuKXtjYXNlIDE4Omw9XCJpbnNlcnRcIjticmVhaztjYXNlIDIzOmw9XCJ1cGRhdGVcIjticmVhaztjYXNlIDk6bD1cImRlbGV0ZVwiO2JyZWFrO2RlZmF1bHQ6dGhyb3dcInVua25vd24gb3BlcmF0aW9uQ29kZSBpbiB1cGRhdGVIb29rIGNhbGxiYWNrOiBcIitcbm47fXA9eihwKTt1PXoodSk7aWYodj5OdW1iZXIuTUFYX1NBRkVfSU5URUdFUil0aHJvd1wicm93SWQgdG9vIGJpZyB0byBmaXQgaW5zaWRlIGEgTnVtYmVyXCI7ZihsLHAsdSxOdW1iZXIodikpfSxcInZpaWlpalwiKTtvYih0aGlzLmRiLHRoaXMuZmIsMCk7cmV0dXJuIHRoaXN9O2MucHJvdG90eXBlLmJpbmQ9Yy5wcm90b3R5cGUuYmluZDtjLnByb3RvdHlwZS5zdGVwPWMucHJvdG90eXBlLnN0ZXA7Yy5wcm90b3R5cGUuZ2V0PWMucHJvdG90eXBlLmdldDtjLnByb3RvdHlwZS5nZXRDb2x1bW5OYW1lcz1jLnByb3RvdHlwZS5EYjtjLnByb3RvdHlwZS5nZXRBc09iamVjdD1jLnByb3RvdHlwZS5PYjtjLnByb3RvdHlwZS5nZXRTUUw9Yy5wcm90b3R5cGUubGM7Yy5wcm90b3R5cGUuZ2V0Tm9ybWFsaXplZFNRTD1jLnByb3RvdHlwZS5pYztjLnByb3RvdHlwZS5ydW49Yy5wcm90b3R5cGUuSmI7Yy5wcm90b3R5cGUucmVzZXQ9Yy5wcm90b3R5cGUucmVzZXQ7Yy5wcm90b3R5cGUuZnJlZW1lbT1cbmMucHJvdG90eXBlLkNiO2MucHJvdG90eXBlLmZyZWU9Yy5wcm90b3R5cGUuY2I7ZC5wcm90b3R5cGUubmV4dD1kLnByb3RvdHlwZS5uZXh0O2QucHJvdG90eXBlLmdldFJlbWFpbmluZ1NRTD1kLnByb3RvdHlwZS5qYztlLnByb3RvdHlwZS5ydW49ZS5wcm90b3R5cGUuSmI7ZS5wcm90b3R5cGUuZXhlYz1lLnByb3RvdHlwZS5leGVjO2UucHJvdG90eXBlLmVhY2g9ZS5wcm90b3R5cGUuZWM7ZS5wcm90b3R5cGUucHJlcGFyZT1lLnByb3RvdHlwZS5HYjtlLnByb3RvdHlwZS5pdGVyYXRlU3RhdGVtZW50cz1lLnByb3RvdHlwZS5wYztlLnByb3RvdHlwZVtcImV4cG9ydFwiXT1lLnByb3RvdHlwZS5mYztlLnByb3RvdHlwZS5jbG9zZT1lLnByb3RvdHlwZS5jbG9zZTtlLnByb3RvdHlwZS5oYW5kbGVFcnJvcj1lLnByb3RvdHlwZS5oYW5kbGVFcnJvcjtlLnByb3RvdHlwZS5nZXRSb3dzTW9kaWZpZWQ9ZS5wcm90b3R5cGUua2M7ZS5wcm90b3R5cGUuY3JlYXRlX2Z1bmN0aW9uPWUucHJvdG90eXBlLmJjO1xuZS5wcm90b3R5cGUuY3JlYXRlX2FnZ3JlZ2F0ZT1lLnByb3RvdHlwZS5hYztlLnByb3RvdHlwZS51cGRhdGVIb29rPWUucHJvdG90eXBlLnZjO2suRGF0YWJhc2U9ZX07dmFyIHZhPVwiLi90aGlzLnByb2dyYW1cIix3YT1nbG9iYWxUaGlzLmRvY3VtZW50Py5jdXJyZW50U2NyaXB0Py5zcmM7YmEmJih3YT1zZWxmLmxvY2F0aW9uLmhyZWYpO3ZhciB4YT1cIlwiLHlhLHphO1xuaWYoYWF8fGJhKXt0cnl7eGE9KG5ldyBVUkwoXCIuXCIsd2EpKS5ocmVmfWNhdGNoe31iYSYmKHphPWE9Pnt2YXIgYj1uZXcgWE1MSHR0cFJlcXVlc3Q7Yi5vcGVuKFwiR0VUXCIsYSwhMSk7Yi5yZXNwb25zZVR5cGU9XCJhcnJheWJ1ZmZlclwiO2Iuc2VuZChudWxsKTtyZXR1cm4gbmV3IFVpbnQ4QXJyYXkoYi5yZXNwb25zZSl9KTt5YT1hc3luYyBhPT57YT1hd2FpdCBmZXRjaChhLHtjcmVkZW50aWFsczpcInNhbWUtb3JpZ2luXCJ9KTtpZihhLm9rKXJldHVybiBhLmFycmF5QnVmZmVyKCk7dGhyb3cgRXJyb3IoYS5zdGF0dXMrXCIgOiBcIithLnVybCk7fX12YXIgQWE9Y29uc29sZS5sb2cuYmluZChjb25zb2xlKSxCPWNvbnNvbGUuZXJyb3IuYmluZChjb25zb2xlKSxCYSxDYT0hMSxEYSxtLEMsRWEsRSxGLEZhLEdhLEc7XG5mdW5jdGlvbiBIYSgpe3ZhciBhPUlhLmJ1ZmZlcjttPW5ldyBJbnQ4QXJyYXkoYSk7RWE9bmV3IEludDE2QXJyYXkoYSk7Qz1uZXcgVWludDhBcnJheShhKTtuZXcgVWludDE2QXJyYXkoYSk7RT1uZXcgSW50MzJBcnJheShhKTtGPW5ldyBVaW50MzJBcnJheShhKTtGYT1uZXcgRmxvYXQzMkFycmF5KGEpO0dhPW5ldyBGbG9hdDY0QXJyYXkoYSk7Rz1uZXcgQmlnSW50NjRBcnJheShhKTtuZXcgQmlnVWludDY0QXJyYXkoYSl9ZnVuY3Rpb24gSmEoYSl7ay5vbkFib3J0Py4oYSk7YT1cIkFib3J0ZWQoXCIrYStcIilcIjtCKGEpO0NhPSEwO3Rocm93IG5ldyBXZWJBc3NlbWJseS5SdW50aW1lRXJyb3IoYStcIi4gQnVpbGQgd2l0aCAtc0FTU0VSVElPTlMgZm9yIG1vcmUgaW5mby5cIik7fXZhciBMYTtcbmFzeW5jIGZ1bmN0aW9uIE1hKGEpe2lmKCFCYSl0cnl7dmFyIGI9YXdhaXQgeWEoYSk7cmV0dXJuIG5ldyBVaW50OEFycmF5KGIpfWNhdGNoe31pZihhPT1MYSYmQmEpYT1uZXcgVWludDhBcnJheShCYSk7ZWxzZSBpZih6YSlhPXphKGEpO2Vsc2UgdGhyb3dcImJvdGggYXN5bmMgYW5kIHN5bmMgZmV0Y2hpbmcgb2YgdGhlIHdhc20gZmFpbGVkXCI7cmV0dXJuIGF9YXN5bmMgZnVuY3Rpb24gTmEoYSxiKXt0cnl7dmFyIGM9YXdhaXQgTWEoYSk7cmV0dXJuIGF3YWl0IFdlYkFzc2VtYmx5Lmluc3RhbnRpYXRlKGMsYil9Y2F0Y2goZCl7QihgZmFpbGVkIHRvIGFzeW5jaHJvbm91c2x5IHByZXBhcmUgd2FzbTogJHtkfWApLEphKGQpfX1cbmFzeW5jIGZ1bmN0aW9uIE9hKGEpe3ZhciBiPUxhO2lmKCFCYSl0cnl7dmFyIGM9ZmV0Y2goYix7Y3JlZGVudGlhbHM6XCJzYW1lLW9yaWdpblwifSk7cmV0dXJuIGF3YWl0IFdlYkFzc2VtYmx5Lmluc3RhbnRpYXRlU3RyZWFtaW5nKGMsYSl9Y2F0Y2goZCl7Qihgd2FzbSBzdHJlYW1pbmcgY29tcGlsZSBmYWlsZWQ6ICR7ZH1gKSxCKFwiZmFsbGluZyBiYWNrIHRvIEFycmF5QnVmZmVyIGluc3RhbnRpYXRpb25cIil9cmV0dXJuIE5hKGIsYSl9Y2xhc3MgUGF7bmFtZT1cIkV4aXRTdGF0dXNcIjtjb25zdHJ1Y3RvcihhKXt0aGlzLm1lc3NhZ2U9YFByb2dyYW0gdGVybWluYXRlZCB3aXRoIGV4aXQoJHthfSlgO3RoaXMuc3RhdHVzPWF9fXZhciBRYT1hPT57Zm9yKDswPGEubGVuZ3RoOylhLnNoaWZ0KCkoayl9LFJhPVtdLFNhPVtdLFRhPSgpPT57dmFyIGE9ay5wcmVSdW4uc2hpZnQoKTtTYS5wdXNoKGEpfSxKPTAsVWE9bnVsbDtcbmZ1bmN0aW9uIHIoYSxiPVwiaThcIil7Yi5lbmRzV2l0aChcIipcIikmJihiPVwiKlwiKTtzd2l0Y2goYil7Y2FzZSBcImkxXCI6cmV0dXJuIG1bYV07Y2FzZSBcImk4XCI6cmV0dXJuIG1bYV07Y2FzZSBcImkxNlwiOnJldHVybiBFYVthPj4xXTtjYXNlIFwiaTMyXCI6cmV0dXJuIEVbYT4+Ml07Y2FzZSBcImk2NFwiOnJldHVybiBHW2E+PjNdO2Nhc2UgXCJmbG9hdFwiOnJldHVybiBGYVthPj4yXTtjYXNlIFwiZG91YmxlXCI6cmV0dXJuIEdhW2E+PjNdO2Nhc2UgXCIqXCI6cmV0dXJuIEZbYT4+Ml07ZGVmYXVsdDpKYShgaW52YWxpZCB0eXBlIGZvciBnZXRWYWx1ZTogJHtifWApfX12YXIgVmE9ITA7XG5mdW5jdGlvbiBwYShhKXt2YXIgYj1cImkzMlwiO2IuZW5kc1dpdGgoXCIqXCIpJiYoYj1cIipcIik7c3dpdGNoKGIpe2Nhc2UgXCJpMVwiOm1bYV09MDticmVhaztjYXNlIFwiaThcIjptW2FdPTA7YnJlYWs7Y2FzZSBcImkxNlwiOkVhW2E+PjFdPTA7YnJlYWs7Y2FzZSBcImkzMlwiOkVbYT4+Ml09MDticmVhaztjYXNlIFwiaTY0XCI6R1thPj4zXT1CaWdJbnQoMCk7YnJlYWs7Y2FzZSBcImZsb2F0XCI6RmFbYT4+Ml09MDticmVhaztjYXNlIFwiZG91YmxlXCI6R2FbYT4+M109MDticmVhaztjYXNlIFwiKlwiOkZbYT4+Ml09MDticmVhaztkZWZhdWx0OkphKGBpbnZhbGlkIHR5cGUgZm9yIHNldFZhbHVlOiAke2J9YCl9fVxudmFyIFdhPW5ldyBUZXh0RGVjb2RlcixYYT0oYSxiLGMsZCk9PntjPWIrYztpZihkKXJldHVybiBjO2Zvcig7YVtiXSYmIShiPj1jKTspKytiO3JldHVybiBifSx6PShhLGIsYyk9PmE/V2EuZGVjb2RlKEMuc3ViYXJyYXkoYSxYYShDLGEsYixjKSkpOlwiXCIsWWE9KGEsYik9Pntmb3IodmFyIGM9MCxkPWEubGVuZ3RoLTE7MDw9ZDtkLS0pe3ZhciBlPWFbZF07XCIuXCI9PT1lP2Euc3BsaWNlKGQsMSk6XCIuLlwiPT09ZT8oYS5zcGxpY2UoZCwxKSxjKyspOmMmJihhLnNwbGljZShkLDEpLGMtLSl9aWYoYilmb3IoO2M7Yy0tKWEudW5zaGlmdChcIi4uXCIpO3JldHVybiBhfSxoYT1hPT57dmFyIGI9XCIvXCI9PT1hLmNoYXJBdCgwKSxjPVwiL1wiPT09YS5zbGljZSgtMSk7KGE9WWEoYS5zcGxpdChcIi9cIikuZmlsdGVyKGQ9PiEhZCksIWIpLmpvaW4oXCIvXCIpKXx8Ynx8KGE9XCIuXCIpO2EmJmMmJihhKz1cIi9cIik7cmV0dXJuKGI/XCIvXCI6XCJcIikrYX0sWmE9YT0+e3ZhciBiPS9eKFxcLz98KShbXFxzXFxTXSo/KSgoPzpcXC57MSwyfXxbXlxcL10rP3wpKFxcLlteLlxcL10qfCkpKD86W1xcL10qKSQvLmV4ZWMoYSkuc2xpY2UoMSk7XG5hPWJbMF07Yj1iWzFdO2lmKCFhJiYhYilyZXR1cm5cIi5cIjtiJiY9Yi5zbGljZSgwLC0xKTtyZXR1cm4gYStifSwkYT1hPT5hJiZhLm1hdGNoKC8oW15cXC9dK3xcXC8pXFwvKiQvKVsxXSxhYj0oKT0+YT0+Y3J5cHRvLmdldFJhbmRvbVZhbHVlcyhhKSxiYj1hPT57KGJiPWFiKCkpKGEpfSxjYj0oLi4uYSk9Pntmb3IodmFyIGI9XCJcIixjPSExLGQ9YS5sZW5ndGgtMTstMTw9ZCYmIWM7ZC0tKXtjPTA8PWQ/YVtkXTpcIi9cIjtpZihcInN0cmluZ1wiIT10eXBlb2YgYyl0aHJvdyBuZXcgVHlwZUVycm9yKFwiQXJndW1lbnRzIHRvIHBhdGgucmVzb2x2ZSBtdXN0IGJlIHN0cmluZ3NcIik7aWYoIWMpcmV0dXJuXCJcIjtiPWMrXCIvXCIrYjtjPVwiL1wiPT09Yy5jaGFyQXQoMCl9Yj1ZYShiLnNwbGl0KFwiL1wiKS5maWx0ZXIoZT0+ISFlKSwhYykuam9pbihcIi9cIik7cmV0dXJuKGM/XCIvXCI6XCJcIikrYnx8XCIuXCJ9LGRiPWE9Pnt2YXIgYj1YYShhLDApO3JldHVybiBXYS5kZWNvZGUoYS5idWZmZXI/YS5zdWJhcnJheSgwLGIpOlxubmV3IFVpbnQ4QXJyYXkoYS5zbGljZSgwLGIpKSl9LGZiPVtdLGdiPWE9Pntmb3IodmFyIGI9MCxjPTA7YzxhLmxlbmd0aDsrK2Mpe3ZhciBkPWEuY2hhckNvZGVBdChjKTsxMjc+PWQ/YisrOjIwNDc+PWQ/Yis9Mjo1NTI5Njw9ZCYmNTczNDM+PWQ/KGIrPTQsKytjKTpiKz0zfXJldHVybiBifSxNPShhLGIsYyxkKT0+e2lmKCEoMDxkKSlyZXR1cm4gMDt2YXIgZT1jO2Q9YytkLTE7Zm9yKHZhciBnPTA7ZzxhLmxlbmd0aDsrK2cpe3ZhciBoPWEuY29kZVBvaW50QXQoZyk7aWYoMTI3Pj1oKXtpZihjPj1kKWJyZWFrO2JbYysrXT1ofWVsc2UgaWYoMjA0Nz49aCl7aWYoYysxPj1kKWJyZWFrO2JbYysrXT0xOTJ8aD4+NjtiW2MrK109MTI4fGgmNjN9ZWxzZSBpZig2NTUzNT49aCl7aWYoYysyPj1kKWJyZWFrO2JbYysrXT0yMjR8aD4+MTI7YltjKytdPTEyOHxoPj42JjYzO2JbYysrXT0xMjh8aCY2M31lbHNle2lmKGMrMz49ZClicmVhaztiW2MrK109MjQwfGg+PjE4O2JbYysrXT0xMjh8XG5oPj4xMiY2MztiW2MrK109MTI4fGg+PjYmNjM7YltjKytdPTEyOHxoJjYzO2crK319YltjXT0wO3JldHVybiBjLWV9LHBiPVtdO2Z1bmN0aW9uIHFiKGEsYil7cGJbYV09e2lucHV0OltdLG91dHB1dDpbXSxrYjpifTtyYihhLHNiKX1cbnZhciBzYj17b3BlbihhKXt2YXIgYj1wYlthLm5vZGUubmJdO2lmKCFiKXRocm93IG5ldyBOKDQzKTthLlZhPWI7YS5zZWVrYWJsZT0hMX0sY2xvc2UoYSl7YS5WYS5rYi5sYihhLlZhKX0sbGIoYSl7YS5WYS5rYi5sYihhLlZhKX0scmVhZChhLGIsYyxkKXtpZighYS5WYXx8IWEuVmEua2IuUWIpdGhyb3cgbmV3IE4oNjApO2Zvcih2YXIgZT0wLGc9MDtnPGQ7ZysrKXt0cnl7dmFyIGg9YS5WYS5rYi5RYihhLlZhKX1jYXRjaChxKXt0aHJvdyBuZXcgTigyOSk7fWlmKHZvaWQgMD09PWgmJjA9PT1lKXRocm93IG5ldyBOKDYpO2lmKG51bGw9PT1ofHx2b2lkIDA9PT1oKWJyZWFrO2UrKztiW2MrZ109aH1lJiYoYS5ub2RlLiRhPURhdGUubm93KCkpO3JldHVybiBlfSx3cml0ZShhLGIsYyxkKXtpZighYS5WYXx8IWEuVmEua2IuSGIpdGhyb3cgbmV3IE4oNjApO3RyeXtmb3IodmFyIGU9MDtlPGQ7ZSsrKWEuVmEua2IuSGIoYS5WYSxiW2MrZV0pfWNhdGNoKGcpe3Rocm93IG5ldyBOKDI5KTtcbn1kJiYoYS5ub2RlLlVhPWEubm9kZS5UYT1EYXRlLm5vdygpKTtyZXR1cm4gZX19LHRiPXtRYigpe2E6e2lmKCFmYi5sZW5ndGgpe3ZhciBhPW51bGw7Z2xvYmFsVGhpcy53aW5kb3c/LnByb21wdCYmKGE9d2luZG93LnByb21wdChcIklucHV0OiBcIiksbnVsbCE9PWEmJihhKz1cIlxcblwiKSk7aWYoIWEpe3ZhciBiPW51bGw7YnJlYWsgYX1iPUFycmF5KGdiKGEpKzEpO2E9TShhLGIsMCxiLmxlbmd0aCk7Yi5sZW5ndGg9YTtmYj1ifWI9ZmIuc2hpZnQoKX1yZXR1cm4gYn0sSGIoYSxiKXtudWxsPT09Ynx8MTA9PT1iPyhBYShkYihhLm91dHB1dCkpLGEub3V0cHV0PVtdKTowIT1iJiZhLm91dHB1dC5wdXNoKGIpfSxsYihhKXswPGEub3V0cHV0Py5sZW5ndGgmJihBYShkYihhLm91dHB1dCkpLGEub3V0cHV0PVtdKX0sRGMoKXtyZXR1cm57eWM6MjU4NTYsQWM6NSx4YzoxOTEsemM6MzUzODcsd2M6WzMsMjgsMTI3LDIxLDQsMCwxLDAsMTcsMTksMjYsMCwxOCwxNSwyMywyMiwwLDAsMCwwLDAsXG4wLDAsMCwwLDAsMCwwLDAsMCwwLDBdfX0sRWMoKXtyZXR1cm4gMH0sRmMoKXtyZXR1cm5bMjQsODBdfX0sdWI9e0hiKGEsYil7bnVsbD09PWJ8fDEwPT09Yj8oQihkYihhLm91dHB1dCkpLGEub3V0cHV0PVtdKTowIT1iJiZhLm91dHB1dC5wdXNoKGIpfSxsYihhKXswPGEub3V0cHV0Py5sZW5ndGgmJihCKGRiKGEub3V0cHV0KSksYS5vdXRwdXQ9W10pfX0sTz17WmE6bnVsbCxhYigpe3JldHVybiBPLmNyZWF0ZU5vZGUobnVsbCxcIi9cIiwxNjg5NSwwKX0sY3JlYXRlTm9kZShhLGIsYyxkKXtpZigyNDU3Nj09PShjJjYxNDQwKXx8NDA5Nj09PShjJjYxNDQwKSl0aHJvdyBuZXcgTig2Myk7Ty5aYXx8KE8uWmE9e2Rpcjp7bm9kZTp7V2E6Ty5MYS5XYSxYYTpPLkxhLlhhLG1iOk8uTGEubWIscmI6Ty5MYS5yYixUYjpPLkxhLlRiLHhiOk8uTGEueGIsdmI6Ty5MYS52YixJYjpPLkxhLkliLHdiOk8uTGEud2J9LHN0cmVhbTp7WWE6Ty5NYS5ZYX19LGZpbGU6e25vZGU6e1dhOk8uTGEuV2EsWGE6Ty5MYS5YYX0sXG5zdHJlYW06e1lhOk8uTWEuWWEscmVhZDpPLk1hLnJlYWQsd3JpdGU6Ty5NYS53cml0ZSxzYjpPLk1hLnNiLHRiOk8uTWEudGJ9fSxsaW5rOntub2RlOntXYTpPLkxhLldhLFhhOk8uTGEuWGEsZWI6Ty5MYS5lYn0sc3RyZWFtOnt9fSxOYjp7bm9kZTp7V2E6Ty5MYS5XYSxYYTpPLkxhLlhhfSxzdHJlYW06dmJ9fSk7Yz13YihhLGIsYyxkKTtQKGMubW9kZSk/KGMuTGE9Ty5aYS5kaXIubm9kZSxjLk1hPU8uWmEuZGlyLnN0cmVhbSxjLk5hPXt9KTozMjc2OD09PShjLm1vZGUmNjE0NDApPyhjLkxhPU8uWmEuZmlsZS5ub2RlLGMuTWE9Ty5aYS5maWxlLnN0cmVhbSxjLlJhPTAsYy5OYT1udWxsKTo0MDk2MD09PShjLm1vZGUmNjE0NDApPyhjLkxhPU8uWmEubGluay5ub2RlLGMuTWE9Ty5aYS5saW5rLnN0cmVhbSk6ODE5Mj09PShjLm1vZGUmNjE0NDApJiYoYy5MYT1PLlphLk5iLm5vZGUsYy5NYT1PLlphLk5iLnN0cmVhbSk7Yy4kYT1jLlVhPWMuVGE9RGF0ZS5ub3coKTthJiYoYS5OYVtiXT1cbmMsYS4kYT1hLlVhPWEuVGE9Yy4kYSk7cmV0dXJuIGN9LENjKGEpe3JldHVybiBhLk5hP2EuTmEuc3ViYXJyYXk/YS5OYS5zdWJhcnJheSgwLGEuUmEpOm5ldyBVaW50OEFycmF5KGEuTmEpOm5ldyBVaW50OEFycmF5KDApfSxMYTp7V2EoYSl7dmFyIGI9e307Yi5jYz04MTkyPT09KGEubW9kZSY2MTQ0MCk/YS5pZDoxO2Iub2M9YS5pZDtiLm1vZGU9YS5tb2RlO2IucmM9MTtiLnVpZD0wO2IubmM9MDtiLm5iPWEubmI7UChhLm1vZGUpP2Iuc2l6ZT00MDk2OjMyNzY4PT09KGEubW9kZSY2MTQ0MCk/Yi5zaXplPWEuUmE6NDA5NjA9PT0oYS5tb2RlJjYxNDQwKT9iLnNpemU9YS5saW5rLmxlbmd0aDpiLnNpemU9MDtiLiRhPW5ldyBEYXRlKGEuJGEpO2IuVWE9bmV3IERhdGUoYS5VYSk7Yi5UYT1uZXcgRGF0ZShhLlRhKTtiLlpiPTQwOTY7Yi4kYj1NYXRoLmNlaWwoYi5zaXplL2IuWmIpO3JldHVybiBifSxYYShhLGIpe2Zvcih2YXIgYyBvZltcIm1vZGVcIixcImF0aW1lXCIsXCJtdGltZVwiLFwiY3RpbWVcIl0pbnVsbCE9XG5iW2NdJiYoYVtjXT1iW2NdKTt2b2lkIDAhPT1iLnNpemUmJihiPWIuc2l6ZSxhLlJhIT1iJiYoMD09Yj8oYS5OYT1udWxsLGEuUmE9MCk6KGM9YS5OYSxhLk5hPW5ldyBVaW50OEFycmF5KGIpLGMmJmEuTmEuc2V0KGMuc3ViYXJyYXkoMCxNYXRoLm1pbihiLGEuUmEpKSksYS5SYT1iKSkpfSxtYigpe08uemJ8fChPLnpiPW5ldyBOKDQ0KSxPLnpiLnN0YWNrPVwiPGdlbmVyaWMgZXJyb3IsIG5vIHN0YWNrPlwiKTt0aHJvdyBPLnpiO30scmIoYSxiLGMsZCl7cmV0dXJuIE8uY3JlYXRlTm9kZShhLGIsYyxkKX0sVGIoYSxiLGMpe3RyeXt2YXIgZD1RKGIsYyl9Y2F0Y2goZyl7fWlmKGQpe2lmKFAoYS5tb2RlKSlmb3IodmFyIGUgaW4gZC5OYSl0aHJvdyBuZXcgTig1NSk7eGIoZCl9ZGVsZXRlIGEucGFyZW50Lk5hW2EubmFtZV07Yi5OYVtjXT1hO2EubmFtZT1jO2IuVGE9Yi5VYT1hLnBhcmVudC5UYT1hLnBhcmVudC5VYT1EYXRlLm5vdygpfSx4YihhLGIpe2RlbGV0ZSBhLk5hW2JdO2EuVGE9XG5hLlVhPURhdGUubm93KCl9LHZiKGEsYil7dmFyIGM9UShhLGIpLGQ7Zm9yKGQgaW4gYy5OYSl0aHJvdyBuZXcgTig1NSk7ZGVsZXRlIGEuTmFbYl07YS5UYT1hLlVhPURhdGUubm93KCl9LEliKGEpe3JldHVybltcIi5cIixcIi4uXCIsLi4uT2JqZWN0LmtleXMoYS5OYSldfSx3YihhLGIsYyl7YT1PLmNyZWF0ZU5vZGUoYSxiLDQxNDcxLDApO2EubGluaz1jO3JldHVybiBhfSxlYihhKXtpZig0MDk2MCE9PShhLm1vZGUmNjE0NDApKXRocm93IG5ldyBOKDI4KTtyZXR1cm4gYS5saW5rfX0sTWE6e3JlYWQoYSxiLGMsZCxlKXt2YXIgZz1hLm5vZGUuTmE7aWYoZT49YS5ub2RlLlJhKXJldHVybiAwO2E9TWF0aC5taW4oYS5ub2RlLlJhLWUsZCk7aWYoODxhJiZnLnN1YmFycmF5KWIuc2V0KGcuc3ViYXJyYXkoZSxlK2EpLGMpO2Vsc2UgZm9yKGQ9MDtkPGE7ZCsrKWJbYytkXT1nW2UrZF07cmV0dXJuIGF9LHdyaXRlKGEsYixjLGQsZSxnKXtiLmJ1ZmZlcj09PW0uYnVmZmVyJiYoZz0hMSk7aWYoIWQpcmV0dXJuIDA7XG5hPWEubm9kZTthLlVhPWEuVGE9RGF0ZS5ub3coKTtpZihiLnN1YmFycmF5JiYoIWEuTmF8fGEuTmEuc3ViYXJyYXkpKXtpZihnKXJldHVybiBhLk5hPWIuc3ViYXJyYXkoYyxjK2QpLGEuUmE9ZDtpZigwPT09YS5SYSYmMD09PWUpcmV0dXJuIGEuTmE9Yi5zbGljZShjLGMrZCksYS5SYT1kO2lmKGUrZDw9YS5SYSlyZXR1cm4gYS5OYS5zZXQoYi5zdWJhcnJheShjLGMrZCksZSksZH1nPWUrZDt2YXIgaD1hLk5hP2EuTmEubGVuZ3RoOjA7aD49Z3x8KGc9TWF0aC5tYXgoZyxoKigxMDQ4NTc2Pmg/MjoxLjEyNSk+Pj4wKSwwIT1oJiYoZz1NYXRoLm1heChnLDI1NikpLGg9YS5OYSxhLk5hPW5ldyBVaW50OEFycmF5KGcpLDA8YS5SYSYmYS5OYS5zZXQoaC5zdWJhcnJheSgwLGEuUmEpLDApKTtpZihhLk5hLnN1YmFycmF5JiZiLnN1YmFycmF5KWEuTmEuc2V0KGIuc3ViYXJyYXkoYyxjK2QpLGUpO2Vsc2UgZm9yKGc9MDtnPGQ7ZysrKWEuTmFbZStnXT1iW2MrZ107YS5SYT1NYXRoLm1heChhLlJhLFxuZStkKTtyZXR1cm4gZH0sWWEoYSxiLGMpezE9PT1jP2IrPWEucG9zaXRpb246Mj09PWMmJjMyNzY4PT09KGEubm9kZS5tb2RlJjYxNDQwKSYmKGIrPWEubm9kZS5SYSk7aWYoMD5iKXRocm93IG5ldyBOKDI4KTtyZXR1cm4gYn0sc2IoYSxiLGMsZCxlKXtpZigzMjc2OCE9PShhLm5vZGUubW9kZSY2MTQ0MCkpdGhyb3cgbmV3IE4oNDMpO2E9YS5ub2RlLk5hO2lmKGUmMnx8IWF8fGEuYnVmZmVyIT09bS5idWZmZXIpe2U9ITA7ZD02NTUzNipNYXRoLmNlaWwoYi82NTUzNik7dmFyIGc9eWIoNjU1MzYsZCk7ZyYmQy5maWxsKDAsZyxnK2QpO2Q9ZztpZighZCl0aHJvdyBuZXcgTig0OCk7aWYoYSl7aWYoMDxjfHxjK2I8YS5sZW5ndGgpYS5zdWJhcnJheT9hPWEuc3ViYXJyYXkoYyxjK2IpOmE9QXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYSxjLGMrYik7bS5zZXQoYSxkKX19ZWxzZSBlPSExLGQ9YS5ieXRlT2Zmc2V0O3JldHVybnt0YzpkLFViOmV9fSx0YihhLGIsYyxkKXtPLk1hLndyaXRlKGEsXG5iLDAsZCxjLCExKTtyZXR1cm4gMH19fSxpYT0oYSxiKT0+e3ZhciBjPTA7YSYmKGN8PTM2NSk7YiYmKGN8PTE0Nik7cmV0dXJuIGN9LHpiPW51bGwsQWI9e30sQmI9W10sQ2I9MSxSPW51bGwsRGI9ITEsRWI9ITAsTj1jbGFzc3tuYW1lPVwiRXJybm9FcnJvclwiO2NvbnN0cnVjdG9yKGEpe3RoaXMuUGE9YX19LEZiPWNsYXNze3FiPXt9O25vZGU9bnVsbDtnZXQgZmxhZ3MoKXtyZXR1cm4gdGhpcy5xYi5mbGFnc31zZXQgZmxhZ3MoYSl7dGhpcy5xYi5mbGFncz1hfWdldCBwb3NpdGlvbigpe3JldHVybiB0aGlzLnFiLnBvc2l0aW9ufXNldCBwb3NpdGlvbihhKXt0aGlzLnFiLnBvc2l0aW9uPWF9fSxHYj1jbGFzc3tMYT17fTtNYT17fTtpYj1udWxsO2NvbnN0cnVjdG9yKGEsYixjLGQpe2F8fD10aGlzO3RoaXMucGFyZW50PWE7dGhpcy5hYj1hLmFiO3RoaXMuaWQ9Q2IrKzt0aGlzLm5hbWU9Yjt0aGlzLm1vZGU9Yzt0aGlzLm5iPWQ7dGhpcy4kYT10aGlzLlVhPXRoaXMuVGE9RGF0ZS5ub3coKX1nZXQgcmVhZCgpe3JldHVybiAzNjU9PT1cbih0aGlzLm1vZGUmMzY1KX1zZXQgcmVhZChhKXthP3RoaXMubW9kZXw9MzY1OnRoaXMubW9kZSY9LTM2Nn1nZXQgd3JpdGUoKXtyZXR1cm4gMTQ2PT09KHRoaXMubW9kZSYxNDYpfXNldCB3cml0ZShhKXthP3RoaXMubW9kZXw9MTQ2OnRoaXMubW9kZSY9LTE0N319O1xuZnVuY3Rpb24gUyhhLGI9e30pe2lmKCFhKXRocm93IG5ldyBOKDQ0KTtiLkJiPz8oYi5CYj0hMCk7XCIvXCI9PT1hLmNoYXJBdCgwKXx8KGE9XCIvL1wiK2EpO3ZhciBjPTA7YTpmb3IoOzQwPmM7YysrKXthPWEuc3BsaXQoXCIvXCIpLmZpbHRlcihxPT4hIXEpO2Zvcih2YXIgZD16YixlPVwiL1wiLGc9MDtnPGEubGVuZ3RoO2crKyl7dmFyIGg9Zz09PWEubGVuZ3RoLTE7aWYoaCYmYi5wYXJlbnQpYnJlYWs7aWYoXCIuXCIhPT1hW2ddKWlmKFwiLi5cIj09PWFbZ10paWYoZT1aYShlKSxkPT09ZC5wYXJlbnQpe2E9ZStcIi9cIithLnNsaWNlKGcrMSkuam9pbihcIi9cIik7Yy0tO2NvbnRpbnVlIGF9ZWxzZSBkPWQucGFyZW50O2Vsc2V7ZT1oYShlK1wiL1wiK2FbZ10pO3RyeXtkPVEoZCxhW2ddKX1jYXRjaChxKXtpZig0ND09PXE/LlBhJiZoJiZiLnNjKXJldHVybntwYXRoOmV9O3Rocm93IHE7fSFkLmlifHxoJiYhYi5CYnx8KGQ9ZC5pYi5yb290KTtpZig0MDk2MD09PShkLm1vZGUmNjE0NDApJiYoIWh8fGIuaGIpKXtpZighZC5MYS5lYil0aHJvdyBuZXcgTig1Mik7XG5kPWQuTGEuZWIoZCk7XCIvXCI9PT1kLmNoYXJBdCgwKXx8KGQ9WmEoZSkrXCIvXCIrZCk7YT1kK1wiL1wiK2Euc2xpY2UoZysxKS5qb2luKFwiL1wiKTtjb250aW51ZSBhfX19cmV0dXJue3BhdGg6ZSxub2RlOmR9fXRocm93IG5ldyBOKDMyKTt9ZnVuY3Rpb24gZmEoYSl7Zm9yKHZhciBiOzspe2lmKGE9PT1hLnBhcmVudClyZXR1cm4gYT1hLmFiLlNiLGI/XCIvXCIhPT1hW2EubGVuZ3RoLTFdP2Ake2F9LyR7Yn1gOmErYjphO2I9Yj9gJHthLm5hbWV9LyR7Yn1gOmEubmFtZTthPWEucGFyZW50fX1mdW5jdGlvbiBIYihhLGIpe2Zvcih2YXIgYz0wLGQ9MDtkPGIubGVuZ3RoO2QrKyljPShjPDw1KS1jK2IuY2hhckNvZGVBdChkKXwwO3JldHVybihhK2M+Pj4wKSVSLmxlbmd0aH1mdW5jdGlvbiB4YihhKXt2YXIgYj1IYihhLnBhcmVudC5pZCxhLm5hbWUpO2lmKFJbYl09PT1hKVJbYl09YS5qYjtlbHNlIGZvcihiPVJbYl07Yjspe2lmKGIuamI9PT1hKXtiLmpiPWEuamI7YnJlYWt9Yj1iLmpifX1cbmZ1bmN0aW9uIFEoYSxiKXt2YXIgYz1QKGEubW9kZSk/KGM9SWIoYSxcInhcIikpP2M6YS5MYS5tYj8wOjI6NTQ7aWYoYyl0aHJvdyBuZXcgTihjKTtmb3IoYz1SW0hiKGEuaWQsYildO2M7Yz1jLmpiKXt2YXIgZD1jLm5hbWU7aWYoYy5wYXJlbnQuaWQ9PT1hLmlkJiZkPT09YilyZXR1cm4gY31yZXR1cm4gYS5MYS5tYihhLGIpfWZ1bmN0aW9uIHdiKGEsYixjLGQpe2E9bmV3IEdiKGEsYixjLGQpO2I9SGIoYS5wYXJlbnQuaWQsYS5uYW1lKTthLmpiPVJbYl07cmV0dXJuIFJbYl09YX1mdW5jdGlvbiBQKGEpe3JldHVybiAxNjM4ND09PShhJjYxNDQwKX1mdW5jdGlvbiBJYihhLGIpe3JldHVybiBFYj8wOmIuaW5jbHVkZXMoXCJyXCIpJiYhKGEubW9kZSYyOTIpfHxiLmluY2x1ZGVzKFwid1wiKSYmIShhLm1vZGUmMTQ2KXx8Yi5pbmNsdWRlcyhcInhcIikmJiEoYS5tb2RlJjczKT8yOjB9XG5mdW5jdGlvbiBKYihhLGIpe2lmKCFQKGEubW9kZSkpcmV0dXJuIDU0O3RyeXtyZXR1cm4gUShhLGIpLDIwfWNhdGNoKGMpe31yZXR1cm4gSWIoYSxcInd4XCIpfWZ1bmN0aW9uIEtiKGEsYixjKXt0cnl7dmFyIGQ9UShhLGIpfWNhdGNoKGUpe3JldHVybiBlLlBhfWlmKGE9SWIoYSxcInd4XCIpKXJldHVybiBhO2lmKGMpe2lmKCFQKGQubW9kZSkpcmV0dXJuIDU0O2lmKGQ9PT1kLnBhcmVudHx8XCIvXCI9PT1mYShkKSlyZXR1cm4gMTB9ZWxzZSBpZihQKGQubW9kZSkpcmV0dXJuIDMxO3JldHVybiAwfWZ1bmN0aW9uIExiKGEpe2lmKCFhKXRocm93IG5ldyBOKDYzKTtyZXR1cm4gYX1mdW5jdGlvbiBUKGEpe2E9QmJbYV07aWYoIWEpdGhyb3cgbmV3IE4oOCk7cmV0dXJuIGF9XG5mdW5jdGlvbiBNYihhLGI9LTEpe2E9T2JqZWN0LmFzc2lnbihuZXcgRmIsYSk7aWYoLTE9PWIpYTp7Zm9yKGI9MDs0MDk2Pj1iO2IrKylpZighQmJbYl0pYnJlYWsgYTt0aHJvdyBuZXcgTigzMyk7fWEuYmI9YjtyZXR1cm4gQmJbYl09YX1mdW5jdGlvbiBOYihhLGI9LTEpe2E9TWIoYSxiKTthLk1hPy5CYz8uKGEpO3JldHVybiBhfWZ1bmN0aW9uIE9iKGEsYixjKXt2YXIgZD1hPy5NYS5YYTthPWQ/YTpiO2Q/Pz1iLkxhLlhhO0xiKGQpO2QoYSxjKX12YXIgdmI9e29wZW4oYSl7YS5NYT1BYlthLm5vZGUubmJdLk1hO2EuTWEub3Blbj8uKGEpfSxZYSgpe3Rocm93IG5ldyBOKDcwKTt9fTtmdW5jdGlvbiByYihhLGIpe0FiW2FdPXtNYTpifX1cbmZ1bmN0aW9uIFBiKGEsYil7dmFyIGM9XCIvXCI9PT1iO2lmKGMmJnpiKXRocm93IG5ldyBOKDEwKTtpZighYyYmYil7dmFyIGQ9UyhiLHtCYjohMX0pO2I9ZC5wYXRoO2Q9ZC5ub2RlO2lmKGQuaWIpdGhyb3cgbmV3IE4oMTApO2lmKCFQKGQubW9kZSkpdGhyb3cgbmV3IE4oNTQpO31iPXt0eXBlOmEsR2M6e30sU2I6YixxYzpbXX07YT1hLmFiKGIpO2EuYWI9YjtiLnJvb3Q9YTtjP3piPWE6ZCYmKGQuaWI9YixkLmFiJiZkLmFiLnFjLnB1c2goYikpfWZ1bmN0aW9uIFFiKGEsYixjKXt2YXIgZD1TKGEse3BhcmVudDohMH0pLm5vZGU7YT0kYShhKTtpZighYSl0aHJvdyBuZXcgTigyOCk7aWYoXCIuXCI9PT1hfHxcIi4uXCI9PT1hKXRocm93IG5ldyBOKDIwKTt2YXIgZT1KYihkLGEpO2lmKGUpdGhyb3cgbmV3IE4oZSk7aWYoIWQuTGEucmIpdGhyb3cgbmV3IE4oNjMpO3JldHVybiBkLkxhLnJiKGQsYSxiLGMpfVxuZnVuY3Rpb24gamEoYSxiPTQzOCl7cmV0dXJuIFFiKGEsYiY0MDk1fDMyNzY4LDApfWZ1bmN0aW9uIFUoYSxiPTUxMSl7cmV0dXJuIFFiKGEsYiYxMDIzfDE2Mzg0LDApfWZ1bmN0aW9uIFJiKGEsYixjKXtcInVuZGVmaW5lZFwiPT10eXBlb2YgYyYmKGM9YixiPTQzOCk7UWIoYSxifDgxOTIsYyl9ZnVuY3Rpb24gU2IoYSxiKXtpZighY2IoYSkpdGhyb3cgbmV3IE4oNDQpO3ZhciBjPVMoYix7cGFyZW50OiEwfSkubm9kZTtpZighYyl0aHJvdyBuZXcgTig0NCk7Yj0kYShiKTt2YXIgZD1KYihjLGIpO2lmKGQpdGhyb3cgbmV3IE4oZCk7aWYoIWMuTGEud2IpdGhyb3cgbmV3IE4oNjMpO2MuTGEud2IoYyxiLGEpfVxuZnVuY3Rpb24gVGIoYSl7dmFyIGI9UyhhLHtwYXJlbnQ6ITB9KS5ub2RlO2E9JGEoYSk7dmFyIGM9UShiLGEpLGQ9S2IoYixhLCEwKTtpZihkKXRocm93IG5ldyBOKGQpO2lmKCFiLkxhLnZiKXRocm93IG5ldyBOKDYzKTtpZihjLmliKXRocm93IG5ldyBOKDEwKTtiLkxhLnZiKGIsYSk7eGIoYyl9ZnVuY3Rpb24gdGEoYSl7dmFyIGI9UyhhLHtwYXJlbnQ6ITB9KS5ub2RlO2lmKCFiKXRocm93IG5ldyBOKDQ0KTthPSRhKGEpO3ZhciBjPVEoYixhKSxkPUtiKGIsYSwhMSk7aWYoZCl0aHJvdyBuZXcgTihkKTtpZighYi5MYS54Yil0aHJvdyBuZXcgTig2Myk7aWYoYy5pYil0aHJvdyBuZXcgTigxMCk7Yi5MYS54YihiLGEpO3hiKGMpfWZ1bmN0aW9uIFViKGEsYil7YT1TKGEse2hiOiFifSkubm9kZTtyZXR1cm4gTGIoYS5MYS5XYSkoYSl9ZnVuY3Rpb24gVmIoYSxiLGMsZCl7T2IoYSxiLHttb2RlOmMmNDA5NXxiLm1vZGUmLTQwOTYsVGE6RGF0ZS5ub3coKSxkYzpkfSl9XG5mdW5jdGlvbiBrYShhLGIpe2E9XCJzdHJpbmdcIj09dHlwZW9mIGE/UyhhLHtoYjohMH0pLm5vZGU6YTtWYihudWxsLGEsYil9ZnVuY3Rpb24gV2IoYSxiLGMpe2lmKFAoYi5tb2RlKSl0aHJvdyBuZXcgTigzMSk7aWYoMzI3NjghPT0oYi5tb2RlJjYxNDQwKSl0aHJvdyBuZXcgTigyOCk7dmFyIGQ9SWIoYixcIndcIik7aWYoZCl0aHJvdyBuZXcgTihkKTtPYihhLGIse3NpemU6Yyx0aW1lc3RhbXA6RGF0ZS5ub3coKX0pfVxuZnVuY3Rpb24gbGEoYSxiLGM9NDM4KXtpZihcIlwiPT09YSl0aHJvdyBuZXcgTig0NCk7aWYoXCJzdHJpbmdcIj09dHlwZW9mIGIpe3ZhciBkPXtyOjAsXCJyK1wiOjIsdzo1NzcsXCJ3K1wiOjU3OCxhOjEwODksXCJhK1wiOjEwOTB9W2JdO2lmKFwidW5kZWZpbmVkXCI9PXR5cGVvZiBkKXRocm93IEVycm9yKGBVbmtub3duIGZpbGUgb3BlbiBtb2RlOiAke2J9YCk7Yj1kfWM9YiY2ND9jJjQwOTV8MzI3Njg6MDtpZihcIm9iamVjdFwiPT10eXBlb2YgYSlkPWE7ZWxzZXt2YXIgZT1hLmVuZHNXaXRoKFwiL1wiKTt2YXIgZz1TKGEse2hiOiEoYiYxMzEwNzIpLHNjOiEwfSk7ZD1nLm5vZGU7YT1nLnBhdGh9Zz0hMTtpZihiJjY0KWlmKGQpe2lmKGImMTI4KXRocm93IG5ldyBOKDIwKTt9ZWxzZXtpZihlKXRocm93IG5ldyBOKDMxKTtkPVFiKGEsY3w1MTEsMCk7Zz0hMH1pZighZCl0aHJvdyBuZXcgTig0NCk7ODE5Mj09PShkLm1vZGUmNjE0NDApJiYoYiY9LTUxMyk7aWYoYiY2NTUzNiYmIVAoZC5tb2RlKSl0aHJvdyBuZXcgTig1NCk7XG5pZighZyYmKGQ/NDA5NjA9PT0oZC5tb2RlJjYxNDQwKT9lPTMyOihlPVtcInJcIixcIndcIixcInJ3XCJdW2ImM10sYiY1MTImJihlKz1cIndcIiksZT1QKGQubW9kZSkmJihcInJcIiE9PWV8fGImNTc2KT8zMTpJYihkLGUpKTplPTQ0LGUpKXRocm93IG5ldyBOKGUpO2ImNTEyJiYhZyYmKGU9ZCxlPVwic3RyaW5nXCI9PXR5cGVvZiBlP1MoZSx7aGI6ITB9KS5ub2RlOmUsV2IobnVsbCxlLDApKTtiPU1iKHtub2RlOmQscGF0aDpmYShkKSxmbGFnczpiJi0xMzE3MTMsc2Vla2FibGU6ITAscG9zaXRpb246MCxNYTpkLk1hLHVjOltdLGVycm9yOiExfSk7Yi5NYS5vcGVuJiZiLk1hLm9wZW4oYik7ZyYma2EoZCxjJjUxMSk7cmV0dXJuIGJ9ZnVuY3Rpb24gbmEoYSl7aWYobnVsbD09PWEuYmIpdGhyb3cgbmV3IE4oOCk7YS5FYiYmKGEuRWI9bnVsbCk7dHJ5e2EuTWEuY2xvc2UmJmEuTWEuY2xvc2UoYSl9Y2F0Y2goYil7dGhyb3cgYjt9ZmluYWxseXtCYlthLmJiXT1udWxsfWEuYmI9bnVsbH1cbmZ1bmN0aW9uIFhiKGEsYixjKXtpZihudWxsPT09YS5iYil0aHJvdyBuZXcgTig4KTtpZighYS5zZWVrYWJsZXx8IWEuTWEuWWEpdGhyb3cgbmV3IE4oNzApO2lmKDAhPWMmJjEhPWMmJjIhPWMpdGhyb3cgbmV3IE4oMjgpO2EucG9zaXRpb249YS5NYS5ZYShhLGIsYyk7YS51Yz1bXX1mdW5jdGlvbiBZYihhLGIsYyxkLGUpe2lmKDA+ZHx8MD5lKXRocm93IG5ldyBOKDI4KTtpZihudWxsPT09YS5iYil0aHJvdyBuZXcgTig4KTtpZigxPT09KGEuZmxhZ3MmMjA5NzE1NSkpdGhyb3cgbmV3IE4oOCk7aWYoUChhLm5vZGUubW9kZSkpdGhyb3cgbmV3IE4oMzEpO2lmKCFhLk1hLnJlYWQpdGhyb3cgbmV3IE4oMjgpO3ZhciBnPVwidW5kZWZpbmVkXCIhPXR5cGVvZiBlO2lmKCFnKWU9YS5wb3NpdGlvbjtlbHNlIGlmKCFhLnNlZWthYmxlKXRocm93IG5ldyBOKDcwKTtiPWEuTWEucmVhZChhLGIsYyxkLGUpO2d8fChhLnBvc2l0aW9uKz1iKTtyZXR1cm4gYn1cbmZ1bmN0aW9uIG1hKGEsYixjLGQsZSl7aWYoMD5kfHwwPmUpdGhyb3cgbmV3IE4oMjgpO2lmKG51bGw9PT1hLmJiKXRocm93IG5ldyBOKDgpO2lmKDA9PT0oYS5mbGFncyYyMDk3MTU1KSl0aHJvdyBuZXcgTig4KTtpZihQKGEubm9kZS5tb2RlKSl0aHJvdyBuZXcgTigzMSk7aWYoIWEuTWEud3JpdGUpdGhyb3cgbmV3IE4oMjgpO2Euc2Vla2FibGUmJmEuZmxhZ3MmMTAyNCYmWGIoYSwwLDIpO3ZhciBnPVwidW5kZWZpbmVkXCIhPXR5cGVvZiBlO2lmKCFnKWU9YS5wb3NpdGlvbjtlbHNlIGlmKCFhLnNlZWthYmxlKXRocm93IG5ldyBOKDcwKTtiPWEuTWEud3JpdGUoYSxiLGMsZCxlLHZvaWQgMCk7Z3x8KGEucG9zaXRpb24rPWIpO3JldHVybiBifVxuZnVuY3Rpb24gc2EoYSl7dmFyIGI9Ynx8MDt2YXIgYz1cImJpbmFyeVwiO1widXRmOFwiIT09YyYmXCJiaW5hcnlcIiE9PWMmJkphKGBJbnZhbGlkIGVuY29kaW5nIHR5cGUgXCIke2N9XCJgKTtiPWxhKGEsYik7YT1VYihhKS5zaXplO3ZhciBkPW5ldyBVaW50OEFycmF5KGEpO1liKGIsZCwwLGEsMCk7XCJ1dGY4XCI9PT1jJiYoZD1kYihkKSk7bmEoYik7cmV0dXJuIGR9XG5mdW5jdGlvbiBXKGEsYixjKXthPWhhKFwiL2Rldi9cIithKTt2YXIgZD1pYSghIWIsISFjKTtXLlJiPz8oVy5SYj02NCk7dmFyIGU9Vy5SYisrPDw4fDA7cmIoZSx7b3BlbihnKXtnLnNlZWthYmxlPSExfSxjbG9zZSgpe2M/LmJ1ZmZlcj8ubGVuZ3RoJiZjKDEwKX0scmVhZChnLGgscSx3KXtmb3IodmFyIHQ9MCx4PTA7eDx3O3grKyl7dHJ5e3ZhciBEPWIoKX1jYXRjaChpYil7dGhyb3cgbmV3IE4oMjkpO31pZih2b2lkIDA9PT1EJiYwPT09dCl0aHJvdyBuZXcgTig2KTtpZihudWxsPT09RHx8dm9pZCAwPT09RClicmVhazt0Kys7aFtxK3hdPUR9dCYmKGcubm9kZS4kYT1EYXRlLm5vdygpKTtyZXR1cm4gdH0sd3JpdGUoZyxoLHEsdyl7Zm9yKHZhciB0PTA7dDx3O3QrKyl0cnl7YyhoW3ErdF0pfWNhdGNoKHgpe3Rocm93IG5ldyBOKDI5KTt9dyYmKGcubm9kZS5VYT1nLm5vZGUuVGE9RGF0ZS5ub3coKSk7cmV0dXJuIHR9fSk7UmIoYSxkLGUpfXZhciBYPXt9O1xuZnVuY3Rpb24gWShhLGIsYyl7aWYoXCIvXCI9PT1iLmNoYXJBdCgwKSlyZXR1cm4gYjthPS0xMDA9PT1hP1wiL1wiOlQoYSkucGF0aDtpZigwPT1iLmxlbmd0aCl7aWYoIWMpdGhyb3cgbmV3IE4oNDQpO3JldHVybiBhfXJldHVybiBhK1wiL1wiK2J9XG5mdW5jdGlvbiBaYihhLGIpe0ZbYT4+Ml09Yi5jYztGW2ErND4+Ml09Yi5tb2RlO0ZbYSs4Pj4yXT1iLnJjO0ZbYSsxMj4+Ml09Yi51aWQ7RlthKzE2Pj4yXT1iLm5jO0ZbYSsyMD4+Ml09Yi5uYjtHW2ErMjQ+PjNdPUJpZ0ludChiLnNpemUpO0VbYSszMj4+Ml09NDA5NjtFW2ErMzY+PjJdPWIuJGI7dmFyIGM9Yi4kYS5nZXRUaW1lKCksZD1iLlVhLmdldFRpbWUoKSxlPWIuVGEuZ2V0VGltZSgpO0dbYSs0MD4+M109QmlnSW50KE1hdGguZmxvb3IoYy8xRTMpKTtGW2ErNDg+PjJdPWMlMUUzKjFFNjtHW2ErNTY+PjNdPUJpZ0ludChNYXRoLmZsb29yKGQvMUUzKSk7RlthKzY0Pj4yXT1kJTFFMyoxRTY7R1thKzcyPj4zXT1CaWdJbnQoTWF0aC5mbG9vcihlLzFFMykpO0ZbYSs4MD4+Ml09ZSUxRTMqMUU2O0dbYSs4OD4+M109QmlnSW50KGIub2MpO3JldHVybiAwfVxudmFyIGljPXZvaWQgMCxBYz0oKT0+e3ZhciBhPUVbK2ljPj4yXTtpYys9NDtyZXR1cm4gYX0sQ2M9MCxEYz1bMCwzMSw2MCw5MSwxMjEsMTUyLDE4MiwyMTMsMjQ0LDI3NCwzMDUsMzM1XSxFYz1bMCwzMSw1OSw5MCwxMjAsMTUxLDE4MSwyMTIsMjQzLDI3MywzMDQsMzM0XSxGYz17fSxHYz1hPT57aWYoIShhIGluc3RhbmNlb2YgUGF8fFwidW53aW5kXCI9PWEpKXRocm93IGE7fSxIYz1hPT57RGE9YTtWYXx8MDxDY3x8KGsub25FeGl0Py4oYSksQ2E9ITApO3Rocm93IG5ldyBQYShhKTt9LEljPWE9PntpZighQ2EpdHJ5e2EoKX1jYXRjaChiKXtHYyhiKX1maW5hbGx5e2lmKCEoVmF8fDA8Q2MpKXRyeXtEYT1hPURhLEhjKGEpfWNhdGNoKGIpe0djKGIpfX19LEpjPXt9LExjPSgpPT57aWYoIUtjKXt2YXIgYT17VVNFUjpcIndlYl91c2VyXCIsTE9HTkFNRTpcIndlYl91c2VyXCIsUEFUSDpcIi9cIixQV0Q6XCIvXCIsSE9NRTpcIi9ob21lL3dlYl91c2VyXCIsTEFORzooZ2xvYmFsVGhpcy5uYXZpZ2F0b3I/Lmxhbmd1YWdlPz9cblwiQ1wiKS5yZXBsYWNlKFwiLVwiLFwiX1wiKStcIi5VVEYtOFwiLF86dmF8fFwiLi90aGlzLnByb2dyYW1cIn0sYjtmb3IoYiBpbiBKYyl2b2lkIDA9PT1KY1tiXT9kZWxldGUgYVtiXTphW2JdPUpjW2JdO3ZhciBjPVtdO2ZvcihiIGluIGEpYy5wdXNoKGAke2J9PSR7YVtiXX1gKTtLYz1jfXJldHVybiBLY30sS2MsTWM9KGEsYixjLGQpPT57dmFyIGU9e3N0cmluZzp0PT57dmFyIHg9MDtpZihudWxsIT09dCYmdm9pZCAwIT09dCYmMCE9PXQpe3g9Z2IodCkrMTt2YXIgRD15KHgpO00odCxDLEQseCk7eD1EfXJldHVybiB4fSxhcnJheTp0PT57dmFyIHg9eSh0Lmxlbmd0aCk7bS5zZXQodCx4KTtyZXR1cm4geH19O2E9a1tcIl9cIithXTt2YXIgZz1bXSxoPTA7aWYoZClmb3IodmFyIHE9MDtxPGQubGVuZ3RoO3ErKyl7dmFyIHc9ZVtjW3FdXTt3PygwPT09aCYmKGg9b2EoKSksZ1txXT13KGRbcV0pKTpnW3FdPWRbcV19Yz1hKC4uLmcpO3JldHVybiBjPWZ1bmN0aW9uKHQpezAhPT1oJiZxYShoKTtyZXR1cm5cInN0cmluZ1wiPT09XG5iP3oodCk6XCJib29sZWFuXCI9PT1iPyEhdDp0fShjKX0sZWE9YT0+e3ZhciBiPWdiKGEpKzEsYz1jYShiKTtjJiZNKGEsQyxjLGIpO3JldHVybiBjfSxOYyxPYz1bXSxBPWE9PntOYy5kZWxldGUoWi5nZXQoYSkpO1ouc2V0KGEsbnVsbCk7T2MucHVzaChhKX0sUGM9YT0+e2NvbnN0IGI9YS5sZW5ndGg7cmV0dXJuW2IlMTI4fDEyOCxiPj43LC4uLmFdfSxRYz17aToxMjcscDoxMjcsajoxMjYsZjoxMjUsZDoxMjQsZToxMTF9LFJjPWE9PlBjKEFycmF5LmZyb20oYSxiPT5RY1tiXSkpLHVhPShhLGIpPT57aWYoIU5jKXtOYz1uZXcgV2Vha01hcDt2YXIgYz1aLmxlbmd0aDtpZihOYylmb3IodmFyIGQ9MDtkPDArYztkKyspe3ZhciBlPVouZ2V0KGQpO2UmJk5jLnNldChlLGQpfX1pZihjPU5jLmdldChhKXx8MClyZXR1cm4gYztjPU9jLmxlbmd0aD9PYy5wb3AoKTpaLmdyb3coMSk7dHJ5e1ouc2V0KGMsYSl9Y2F0Y2goZyl7aWYoIShnIGluc3RhbmNlb2YgVHlwZUVycm9yKSl0aHJvdyBnO1xuYj1VaW50OEFycmF5Lm9mKDAsOTcsMTE1LDEwOSwxLDAsMCwwLDEsLi4uUGMoWzEsOTYsLi4uUmMoYi5zbGljZSgxKSksLi4uUmMoXCJ2XCI9PT1iWzBdP1wiXCI6YlswXSldKSwyLDcsMSwxLDEwMSwxLDEwMiwwLDAsNyw1LDEsMSwxMDIsMCwwKTtiPW5ldyBXZWJBc3NlbWJseS5Nb2R1bGUoYik7Yj0obmV3IFdlYkFzc2VtYmx5Lkluc3RhbmNlKGIse2U6e2Y6YX19KSkuZXhwb3J0cy5mO1ouc2V0KGMsYil9TmMuc2V0KGEsYyk7cmV0dXJuIGN9O1I9QXJyYXkoNDA5Nik7UGIoTyxcIi9cIik7VShcIi90bXBcIik7VShcIi9ob21lXCIpO1UoXCIvaG9tZS93ZWJfdXNlclwiKTtcbihmdW5jdGlvbigpe1UoXCIvZGV2XCIpO3JiKDI1OSx7cmVhZDooKT0+MCx3cml0ZTooZCxlLGcsaCk9PmgsWWE6KCk9PjB9KTtSYihcIi9kZXYvbnVsbFwiLDI1OSk7cWIoMTI4MCx0Yik7cWIoMTUzNix1Yik7UmIoXCIvZGV2L3R0eVwiLDEyODApO1JiKFwiL2Rldi90dHkxXCIsMTUzNik7dmFyIGE9bmV3IFVpbnQ4QXJyYXkoMTAyNCksYj0wLGM9KCk9PnswPT09YiYmKGJiKGEpLGI9YS5ieXRlTGVuZ3RoKTtyZXR1cm4gYVstLWJdfTtXKFwicmFuZG9tXCIsYyk7VyhcInVyYW5kb21cIixjKTtVKFwiL2Rldi9zaG1cIik7VShcIi9kZXYvc2htL3RtcFwiKX0pKCk7XG4oZnVuY3Rpb24oKXtVKFwiL3Byb2NcIik7dmFyIGE9VShcIi9wcm9jL3NlbGZcIik7VShcIi9wcm9jL3NlbGYvZmRcIik7UGIoe2FiKCl7dmFyIGI9d2IoYSxcImZkXCIsMTY4OTUsNzMpO2IuTWE9e1lhOk8uTWEuWWF9O2IuTGE9e21iKGMsZCl7Yz0rZDt2YXIgZT1UKGMpO2M9e3BhcmVudDpudWxsLGFiOntTYjpcImZha2VcIn0sTGE6e2ViOigpPT5lLnBhdGh9LGlkOmMrMX07cmV0dXJuIGMucGFyZW50PWN9LEliKCl7cmV0dXJuIEFycmF5LmZyb20oQmIuZW50cmllcygpKS5maWx0ZXIoKFssY10pPT5jKS5tYXAoKFtjXSk9PmMudG9TdHJpbmcoKSl9fTtyZXR1cm4gYn19LFwiL3Byb2Mvc2VsZi9mZFwiKX0pKCk7ay5ub0V4aXRSdW50aW1lJiYoVmE9ay5ub0V4aXRSdW50aW1lKTtrLnByaW50JiYoQWE9ay5wcmludCk7ay5wcmludEVyciYmKEI9ay5wcmludEVycik7ay53YXNtQmluYXJ5JiYoQmE9ay53YXNtQmluYXJ5KTtrLnRoaXNQcm9ncmFtJiYodmE9ay50aGlzUHJvZ3JhbSk7XG5pZihrLnByZUluaXQpZm9yKFwiZnVuY3Rpb25cIj09dHlwZW9mIGsucHJlSW5pdCYmKGsucHJlSW5pdD1bay5wcmVJbml0XSk7MDxrLnByZUluaXQubGVuZ3RoOylrLnByZUluaXQuc2hpZnQoKSgpO2suc3RhY2tTYXZlPSgpPT5vYSgpO2suc3RhY2tSZXN0b3JlPWE9PnFhKGEpO2suc3RhY2tBbGxvYz1hPT55KGEpO2suY3dyYXA9KGEsYixjLGQpPT57dmFyIGU9IWN8fGMuZXZlcnkoZz0+XCJudW1iZXJcIj09PWd8fFwiYm9vbGVhblwiPT09Zyk7cmV0dXJuXCJzdHJpbmdcIiE9PWImJmUmJiFkP2tbXCJfXCIrYV06KC4uLmcpPT5NYyhhLGIsYyxnKX07ay5hZGRGdW5jdGlvbj11YTtrLnJlbW92ZUZ1bmN0aW9uPUE7ay5VVEY4VG9TdHJpbmc9ejtrLnN0cmluZ1RvTmV3VVRGOD1lYTtrLndyaXRlQXJyYXlUb01lbW9yeT0oYSxiKT0+e20uc2V0KGEsYil9O1xudmFyIGNhLGRhLHliLFNjLHFhLHksb2EsSWEsWixUYz17YTooYSxiLGMsZCk9PkphKGBBc3NlcnRpb24gZmFpbGVkOiAke3ooYSl9LCBhdDogYCtbYj96KGIpOlwidW5rbm93biBmaWxlbmFtZVwiLGMsZD96KGQpOlwidW5rbm93biBmdW5jdGlvblwiXSksaTpmdW5jdGlvbihhLGIpe3RyeXtyZXR1cm4gYT16KGEpLGthKGEsYiksMH1jYXRjaChjKXtpZihcInVuZGVmaW5lZFwiPT10eXBlb2YgWHx8XCJFcnJub0Vycm9yXCIhPT1jLm5hbWUpdGhyb3cgYztyZXR1cm4tYy5QYX19LEw6ZnVuY3Rpb24oYSxiLGMpe3RyeXtiPXooYik7Yj1ZKGEsYik7aWYoYyYtOClyZXR1cm4tMjg7dmFyIGQ9UyhiLHtoYjohMH0pLm5vZGU7aWYoIWQpcmV0dXJuLTQ0O2E9XCJcIjtjJjQmJihhKz1cInJcIik7YyYyJiYoYSs9XCJ3XCIpO2MmMSYmKGErPVwieFwiKTtyZXR1cm4gYSYmSWIoZCxhKT8tMjowfWNhdGNoKGUpe2lmKFwidW5kZWZpbmVkXCI9PXR5cGVvZiBYfHxcIkVycm5vRXJyb3JcIiE9PWUubmFtZSl0aHJvdyBlO3JldHVybi1lLlBhfX0sXG5qOmZ1bmN0aW9uKGEsYil7dHJ5e3ZhciBjPVQoYSk7VmIoYyxjLm5vZGUsYiwhMSk7cmV0dXJuIDB9Y2F0Y2goZCl7aWYoXCJ1bmRlZmluZWRcIj09dHlwZW9mIFh8fFwiRXJybm9FcnJvclwiIT09ZC5uYW1lKXRocm93IGQ7cmV0dXJuLWQuUGF9fSxoOmZ1bmN0aW9uKGEpe3RyeXt2YXIgYj1UKGEpO09iKGIsYi5ub2RlLHt0aW1lc3RhbXA6RGF0ZS5ub3coKSxkYzohMX0pO3JldHVybiAwfWNhdGNoKGMpe2lmKFwidW5kZWZpbmVkXCI9PXR5cGVvZiBYfHxcIkVycm5vRXJyb3JcIiE9PWMubmFtZSl0aHJvdyBjO3JldHVybi1jLlBhfX0sYjpmdW5jdGlvbihhLGIsYyl7aWM9Yzt0cnl7dmFyIGQ9VChhKTtzd2l0Y2goYil7Y2FzZSAwOnZhciBlPUFjKCk7aWYoMD5lKWJyZWFrO2Zvcig7QmJbZV07KWUrKztyZXR1cm4gTmIoZCxlKS5iYjtjYXNlIDE6Y2FzZSAyOnJldHVybiAwO2Nhc2UgMzpyZXR1cm4gZC5mbGFncztjYXNlIDQ6cmV0dXJuIGU9QWMoKSxkLmZsYWdzfD1lLDA7Y2FzZSAxMjpyZXR1cm4gZT1cbkFjKCksRWFbZSswPj4xXT0yLDA7Y2FzZSAxMzpjYXNlIDE0OnJldHVybiAwfXJldHVybi0yOH1jYXRjaChnKXtpZihcInVuZGVmaW5lZFwiPT10eXBlb2YgWHx8XCJFcnJub0Vycm9yXCIhPT1nLm5hbWUpdGhyb3cgZztyZXR1cm4tZy5QYX19LGc6ZnVuY3Rpb24oYSxiKXt0cnl7dmFyIGM9VChhKSxkPWMubm9kZSxlPWMuTWEuV2E7YT1lP2M6ZDtlPz89ZC5MYS5XYTtMYihlKTt2YXIgZz1lKGEpO3JldHVybiBaYihiLGcpfWNhdGNoKGgpe2lmKFwidW5kZWZpbmVkXCI9PXR5cGVvZiBYfHxcIkVycm5vRXJyb3JcIiE9PWgubmFtZSl0aHJvdyBoO3JldHVybi1oLlBhfX0sSDpmdW5jdGlvbihhLGIpe2I9LTkwMDcxOTkyNTQ3NDA5OTI+Ynx8OTAwNzE5OTI1NDc0MDk5MjxiP05hTjpOdW1iZXIoYik7dHJ5e2lmKGlzTmFOKGIpKXJldHVybi02MTt2YXIgYz1UKGEpO2lmKDA+Ynx8MD09PShjLmZsYWdzJjIwOTcxNTUpKXRocm93IG5ldyBOKDI4KTtXYihjLGMubm9kZSxiKTtyZXR1cm4gMH1jYXRjaChkKXtpZihcInVuZGVmaW5lZFwiPT1cbnR5cGVvZiBYfHxcIkVycm5vRXJyb3JcIiE9PWQubmFtZSl0aHJvdyBkO3JldHVybi1kLlBhfX0sRzpmdW5jdGlvbihhLGIpe3RyeXtpZigwPT09YilyZXR1cm4tMjg7dmFyIGM9Z2IoXCIvXCIpKzE7aWYoYjxjKXJldHVybi02ODtNKFwiL1wiLEMsYSxiKTtyZXR1cm4gY31jYXRjaChkKXtpZihcInVuZGVmaW5lZFwiPT10eXBlb2YgWHx8XCJFcnJub0Vycm9yXCIhPT1kLm5hbWUpdGhyb3cgZDtyZXR1cm4tZC5QYX19LEs6ZnVuY3Rpb24oYSxiKXt0cnl7cmV0dXJuIGE9eihhKSxaYihiLFViKGEsITApKX1jYXRjaChjKXtpZihcInVuZGVmaW5lZFwiPT10eXBlb2YgWHx8XCJFcnJub0Vycm9yXCIhPT1jLm5hbWUpdGhyb3cgYztyZXR1cm4tYy5QYX19LEM6ZnVuY3Rpb24oYSxiLGMpe3RyeXtyZXR1cm4gYj16KGIpLGI9WShhLGIpLFUoYixjKSwwfWNhdGNoKGQpe2lmKFwidW5kZWZpbmVkXCI9PXR5cGVvZiBYfHxcIkVycm5vRXJyb3JcIiE9PWQubmFtZSl0aHJvdyBkO3JldHVybi1kLlBhfX0sSjpmdW5jdGlvbihhLFxuYixjLGQpe3RyeXtiPXooYik7dmFyIGU9ZCYyNTY7Yj1ZKGEsYixkJjQwOTYpO3JldHVybiBaYihjLGU/VWIoYiwhMCk6VWIoYikpfWNhdGNoKGcpe2lmKFwidW5kZWZpbmVkXCI9PXR5cGVvZiBYfHxcIkVycm5vRXJyb3JcIiE9PWcubmFtZSl0aHJvdyBnO3JldHVybi1nLlBhfX0seDpmdW5jdGlvbihhLGIsYyxkKXtpYz1kO3RyeXtiPXooYik7Yj1ZKGEsYik7dmFyIGU9ZD9BYygpOjA7cmV0dXJuIGxhKGIsYyxlKS5iYn1jYXRjaChnKXtpZihcInVuZGVmaW5lZFwiPT10eXBlb2YgWHx8XCJFcnJub0Vycm9yXCIhPT1nLm5hbWUpdGhyb3cgZztyZXR1cm4tZy5QYX19LHY6ZnVuY3Rpb24oYSxiLGMsZCl7dHJ5e2I9eihiKTtiPVkoYSxiKTtpZigwPj1kKXJldHVybi0yODt2YXIgZT1TKGIpLm5vZGU7aWYoIWUpdGhyb3cgbmV3IE4oNDQpO2lmKCFlLkxhLmViKXRocm93IG5ldyBOKDI4KTt2YXIgZz1lLkxhLmViKGUpO3ZhciBoPU1hdGgubWluKGQsZ2IoZykpLHE9bVtjK2hdO00oZyxDLGMsZCsxKTtcbm1bYytoXT1xO3JldHVybiBofWNhdGNoKHcpe2lmKFwidW5kZWZpbmVkXCI9PXR5cGVvZiBYfHxcIkVycm5vRXJyb3JcIiE9PXcubmFtZSl0aHJvdyB3O3JldHVybi13LlBhfX0sdTpmdW5jdGlvbihhKXt0cnl7cmV0dXJuIGE9eihhKSxUYihhKSwwfWNhdGNoKGIpe2lmKFwidW5kZWZpbmVkXCI9PXR5cGVvZiBYfHxcIkVycm5vRXJyb3JcIiE9PWIubmFtZSl0aHJvdyBiO3JldHVybi1iLlBhfX0sZjpmdW5jdGlvbihhLGIpe3RyeXtyZXR1cm4gYT16KGEpLFpiKGIsVWIoYSkpfWNhdGNoKGMpe2lmKFwidW5kZWZpbmVkXCI9PXR5cGVvZiBYfHxcIkVycm5vRXJyb3JcIiE9PWMubmFtZSl0aHJvdyBjO3JldHVybi1jLlBhfX0scjpmdW5jdGlvbihhLGIsYyl7dHJ5e2I9eihiKTtiPVkoYSxiKTtpZihjKWlmKDUxMj09PWMpVGIoYik7ZWxzZSByZXR1cm4tMjg7ZWxzZSB0YShiKTtyZXR1cm4gMH1jYXRjaChkKXtpZihcInVuZGVmaW5lZFwiPT10eXBlb2YgWHx8XCJFcnJub0Vycm9yXCIhPT1kLm5hbWUpdGhyb3cgZDtcbnJldHVybi1kLlBhfX0scTpmdW5jdGlvbihhLGIsYyl7dHJ5e2I9eihiKTtiPVkoYSxiLCEwKTt2YXIgZD1EYXRlLm5vdygpLGUsZztpZihjKXt2YXIgaD1GW2M+PjJdKzQyOTQ5NjcyOTYqRVtjKzQ+PjJdLHE9RVtjKzg+PjJdOzEwNzM3NDE4MjM9PXE/ZT1kOjEwNzM3NDE4MjI9PXE/ZT1udWxsOmU9MUUzKmgrcS8xRTY7Yys9MTY7aD1GW2M+PjJdKzQyOTQ5NjcyOTYqRVtjKzQ+PjJdO3E9RVtjKzg+PjJdOzEwNzM3NDE4MjM9PXE/Zz1kOjEwNzM3NDE4MjI9PXE/Zz1udWxsOmc9MUUzKmgrcS8xRTZ9ZWxzZSBnPWU9ZDtpZihudWxsIT09KGc/P2UpKXthPWU7dmFyIHc9UyhiLHtoYjohMH0pLm5vZGU7TGIody5MYS5YYSkodyx7JGE6YSxVYTpnfSl9cmV0dXJuIDB9Y2F0Y2godCl7aWYoXCJ1bmRlZmluZWRcIj09dHlwZW9mIFh8fFwiRXJybm9FcnJvclwiIT09dC5uYW1lKXRocm93IHQ7cmV0dXJuLXQuUGF9fSxtOigpPT5KYShcIlwiKSxsOigpPT57VmE9ITE7Q2M9MH0sQTpmdW5jdGlvbihhLFxuYil7YT0tOTAwNzE5OTI1NDc0MDk5Mj5hfHw5MDA3MTk5MjU0NzQwOTkyPGE/TmFOOk51bWJlcihhKTthPW5ldyBEYXRlKDFFMyphKTtFW2I+PjJdPWEuZ2V0U2Vjb25kcygpO0VbYis0Pj4yXT1hLmdldE1pbnV0ZXMoKTtFW2IrOD4+Ml09YS5nZXRIb3VycygpO0VbYisxMj4+Ml09YS5nZXREYXRlKCk7RVtiKzE2Pj4yXT1hLmdldE1vbnRoKCk7RVtiKzIwPj4yXT1hLmdldEZ1bGxZZWFyKCktMTkwMDtFW2IrMjQ+PjJdPWEuZ2V0RGF5KCk7dmFyIGM9YS5nZXRGdWxsWWVhcigpO0VbYisyOD4+Ml09KDAhPT1jJTR8fDA9PT1jJTEwMCYmMCE9PWMlNDAwP0VjOkRjKVthLmdldE1vbnRoKCldK2EuZ2V0RGF0ZSgpLTF8MDtFW2IrMzY+PjJdPS0oNjAqYS5nZXRUaW1lem9uZU9mZnNldCgpKTtjPShuZXcgRGF0ZShhLmdldEZ1bGxZZWFyKCksNiwxKSkuZ2V0VGltZXpvbmVPZmZzZXQoKTt2YXIgZD0obmV3IERhdGUoYS5nZXRGdWxsWWVhcigpLDAsMSkpLmdldFRpbWV6b25lT2Zmc2V0KCk7XG5FW2IrMzI+PjJdPShjIT1kJiZhLmdldFRpbWV6b25lT2Zmc2V0KCk9PU1hdGgubWluKGQsYykpfDB9LHk6ZnVuY3Rpb24oYSxiLGMsZCxlLGcsaCl7ZT0tOTAwNzE5OTI1NDc0MDk5Mj5lfHw5MDA3MTk5MjU0NzQwOTkyPGU/TmFOOk51bWJlcihlKTt0cnl7dmFyIHE9VChkKTtpZigwIT09KGImMikmJjA9PT0oYyYyKSYmMiE9PShxLmZsYWdzJjIwOTcxNTUpKXRocm93IG5ldyBOKDIpO2lmKDE9PT0ocS5mbGFncyYyMDk3MTU1KSl0aHJvdyBuZXcgTigyKTtpZighcS5NYS5zYil0aHJvdyBuZXcgTig0Myk7aWYoIWEpdGhyb3cgbmV3IE4oMjgpO3ZhciB3PXEuTWEuc2IocSxhLGUsYixjKTt2YXIgdD13LnRjO0VbZz4+Ml09dy5VYjtGW2g+PjJdPXQ7cmV0dXJuIDB9Y2F0Y2goeCl7aWYoXCJ1bmRlZmluZWRcIj09dHlwZW9mIFh8fFwiRXJybm9FcnJvclwiIT09eC5uYW1lKXRocm93IHg7cmV0dXJuLXguUGF9fSx6OmZ1bmN0aW9uKGEsYixjLGQsZSxnKXtnPS05MDA3MTk5MjU0NzQwOTkyPmd8fFxuOTAwNzE5OTI1NDc0MDk5MjxnP05hTjpOdW1iZXIoZyk7dHJ5e3ZhciBoPVQoZSk7aWYoYyYyKXtpZigzMjc2OCE9PShoLm5vZGUubW9kZSY2MTQ0MCkpdGhyb3cgbmV3IE4oNDMpO2QmMnx8aC5NYS50YiYmaC5NYS50YihoLEMuc2xpY2UoYSxhK2IpLGcsYixkKX19Y2F0Y2gocSl7aWYoXCJ1bmRlZmluZWRcIj09dHlwZW9mIFh8fFwiRXJybm9FcnJvclwiIT09cS5uYW1lKXRocm93IHE7cmV0dXJuLXEuUGF9fSxuOihhLGIpPT57RmNbYV0mJihjbGVhclRpbWVvdXQoRmNbYV0uaWQpLGRlbGV0ZSBGY1thXSk7aWYoIWIpcmV0dXJuIDA7dmFyIGM9c2V0VGltZW91dCgoKT0+e2RlbGV0ZSBGY1thXTtJYygoKT0+U2MoYSxwZXJmb3JtYW5jZS5ub3coKSkpfSxiKTtGY1thXT17aWQ6YyxIYzpifTtyZXR1cm4gMH0sQjooYSxiLGMsZCk9Pnt2YXIgZT0obmV3IERhdGUpLmdldEZ1bGxZZWFyKCksZz0obmV3IERhdGUoZSwwLDEpKS5nZXRUaW1lem9uZU9mZnNldCgpO2U9KG5ldyBEYXRlKGUsNiwxKSkuZ2V0VGltZXpvbmVPZmZzZXQoKTtcbkZbYT4+Ml09NjAqTWF0aC5tYXgoZyxlKTtFW2I+PjJdPU51bWJlcihnIT1lKTtiPWg9Pnt2YXIgcT1NYXRoLmFicyhoKTtyZXR1cm5gVVRDJHswPD1oP1wiLVwiOlwiK1wifSR7U3RyaW5nKE1hdGguZmxvb3IocS82MCkpLnBhZFN0YXJ0KDIsXCIwXCIpfSR7U3RyaW5nKHElNjApLnBhZFN0YXJ0KDIsXCIwXCIpfWB9O2E9YihnKTtiPWIoZSk7ZTxnPyhNKGEsQyxjLDE3KSxNKGIsQyxkLDE3KSk6KE0oYSxDLGQsMTcpLE0oYixDLGMsMTcpKX0sZDooKT0+RGF0ZS5ub3coKSxzOigpPT4yMTQ3NDgzNjQ4LGM6KCk9PnBlcmZvcm1hbmNlLm5vdygpLG86YT0+e3ZhciBiPUMubGVuZ3RoO2E+Pj49MDtpZigyMTQ3NDgzNjQ4PGEpcmV0dXJuITE7Zm9yKHZhciBjPTE7ND49YztjKj0yKXt2YXIgZD1iKigxKy4yL2MpO2Q9TWF0aC5taW4oZCxhKzEwMDY2MzI5Nik7YTp7ZD0oTWF0aC5taW4oMjE0NzQ4MzY0OCw2NTUzNipNYXRoLmNlaWwoTWF0aC5tYXgoYSxkKS82NTUzNikpLUlhLmJ1ZmZlci5ieXRlTGVuZ3RoK1xuNjU1MzUpLzY1NTM2fDA7dHJ5e0lhLmdyb3coZCk7SGEoKTt2YXIgZT0xO2JyZWFrIGF9Y2F0Y2goZyl7fWU9dm9pZCAwfWlmKGUpcmV0dXJuITB9cmV0dXJuITF9LEU6KGEsYik9Pnt2YXIgYz0wLGQ9MCxlO2ZvcihlIG9mIExjKCkpe3ZhciBnPWIrYztGW2ErZD4+Ml09ZztjKz1NKGUsQyxnLEluZmluaXR5KSsxO2QrPTR9cmV0dXJuIDB9LEY6KGEsYik9Pnt2YXIgYz1MYygpO0ZbYT4+Ml09Yy5sZW5ndGg7YT0wO2Zvcih2YXIgZCBvZiBjKWErPWdiKGQpKzE7RltiPj4yXT1hO3JldHVybiAwfSxlOmZ1bmN0aW9uKGEpe3RyeXt2YXIgYj1UKGEpO25hKGIpO3JldHVybiAwfWNhdGNoKGMpe2lmKFwidW5kZWZpbmVkXCI9PXR5cGVvZiBYfHxcIkVycm5vRXJyb3JcIiE9PWMubmFtZSl0aHJvdyBjO3JldHVybiBjLlBhfX0scDpmdW5jdGlvbihhLGIpe3RyeXt2YXIgYz1UKGEpO21bYl09Yy5WYT8yOlAoYy5tb2RlKT8zOjQwOTYwPT09KGMubW9kZSY2MTQ0MCk/Nzo0O0VhW2IrMj4+MV09MDtHW2IrXG44Pj4zXT1CaWdJbnQoMCk7R1tiKzE2Pj4zXT1CaWdJbnQoMCk7cmV0dXJuIDB9Y2F0Y2goZCl7aWYoXCJ1bmRlZmluZWRcIj09dHlwZW9mIFh8fFwiRXJybm9FcnJvclwiIT09ZC5uYW1lKXRocm93IGQ7cmV0dXJuIGQuUGF9fSx3OmZ1bmN0aW9uKGEsYixjLGQpe3RyeXthOnt2YXIgZT1UKGEpO2E9Yjtmb3IodmFyIGcsaD1iPTA7aDxjO2grKyl7dmFyIHE9RlthPj4yXSx3PUZbYSs0Pj4yXTthKz04O3ZhciB0PVliKGUsbSxxLHcsZyk7aWYoMD50KXt2YXIgeD0tMTticmVhayBhfWIrPXQ7aWYodDx3KWJyZWFrO1widW5kZWZpbmVkXCIhPXR5cGVvZiBnJiYoZys9dCl9eD1ifUZbZD4+Ml09eDtyZXR1cm4gMH1jYXRjaChEKXtpZihcInVuZGVmaW5lZFwiPT10eXBlb2YgWHx8XCJFcnJub0Vycm9yXCIhPT1ELm5hbWUpdGhyb3cgRDtyZXR1cm4gRC5QYX19LEQ6ZnVuY3Rpb24oYSxiLGMsZCl7Yj0tOTAwNzE5OTI1NDc0MDk5Mj5ifHw5MDA3MTk5MjU0NzQwOTkyPGI/TmFOOk51bWJlcihiKTt0cnl7aWYoaXNOYU4oYikpcmV0dXJuIDYxO1xudmFyIGU9VChhKTtYYihlLGIsYyk7R1tkPj4zXT1CaWdJbnQoZS5wb3NpdGlvbik7ZS5FYiYmMD09PWImJjA9PT1jJiYoZS5FYj1udWxsKTtyZXR1cm4gMH1jYXRjaChnKXtpZihcInVuZGVmaW5lZFwiPT10eXBlb2YgWHx8XCJFcnJub0Vycm9yXCIhPT1nLm5hbWUpdGhyb3cgZztyZXR1cm4gZy5QYX19LEk6ZnVuY3Rpb24oYSl7dHJ5e3ZhciBiPVQoYSk7cmV0dXJuIGIuTWE/LmxiPy4oYil9Y2F0Y2goYyl7aWYoXCJ1bmRlZmluZWRcIj09dHlwZW9mIFh8fFwiRXJybm9FcnJvclwiIT09Yy5uYW1lKXRocm93IGM7cmV0dXJuIGMuUGF9fSx0OmZ1bmN0aW9uKGEsYixjLGQpe3RyeXthOnt2YXIgZT1UKGEpO2E9Yjtmb3IodmFyIGcsaD1iPTA7aDxjO2grKyl7dmFyIHE9RlthPj4yXSx3PUZbYSs0Pj4yXTthKz04O3ZhciB0PW1hKGUsbSxxLHcsZyk7aWYoMD50KXt2YXIgeD0tMTticmVhayBhfWIrPXQ7aWYodDx3KWJyZWFrO1widW5kZWZpbmVkXCIhPXR5cGVvZiBnJiYoZys9dCl9eD1ifUZbZD4+Ml09eDtcbnJldHVybiAwfWNhdGNoKEQpe2lmKFwidW5kZWZpbmVkXCI9PXR5cGVvZiBYfHxcIkVycm5vRXJyb3JcIiE9PUQubmFtZSl0aHJvdyBEO3JldHVybiBELlBhfX0sazpIY307XG5mdW5jdGlvbiBVYygpe2Z1bmN0aW9uIGEoKXtrLmNhbGxlZFJ1bj0hMDtpZighQ2Epe2lmKCFrLm5vRlNJbml0JiYhRGIpe3ZhciBiLGM7RGI9ITA7Yj8/PWsuc3RkaW47Yz8/PWsuc3Rkb3V0O2Q/Pz1rLnN0ZGVycjtiP1coXCJzdGRpblwiLGIpOlNiKFwiL2Rldi90dHlcIixcIi9kZXYvc3RkaW5cIik7Yz9XKFwic3Rkb3V0XCIsbnVsbCxjKTpTYihcIi9kZXYvdHR5XCIsXCIvZGV2L3N0ZG91dFwiKTtkP1coXCJzdGRlcnJcIixudWxsLGQpOlNiKFwiL2Rldi90dHkxXCIsXCIvZGV2L3N0ZGVyclwiKTtsYShcIi9kZXYvc3RkaW5cIiwwKTtsYShcIi9kZXYvc3Rkb3V0XCIsMSk7bGEoXCIvZGV2L3N0ZGVyclwiLDEpfVZjLk4oKTtFYj0hMTtrLm9uUnVudGltZUluaXRpYWxpemVkPy4oKTtpZihrLnBvc3RSdW4pZm9yKFwiZnVuY3Rpb25cIj09dHlwZW9mIGsucG9zdFJ1biYmKGsucG9zdFJ1bj1bay5wb3N0UnVuXSk7ay5wb3N0UnVuLmxlbmd0aDspe3ZhciBkPWsucG9zdFJ1bi5zaGlmdCgpO1JhLnB1c2goZCl9UWEoUmEpfX1pZigwPFxuSilVYT1VYztlbHNle2lmKGsucHJlUnVuKWZvcihcImZ1bmN0aW9uXCI9PXR5cGVvZiBrLnByZVJ1biYmKGsucHJlUnVuPVtrLnByZVJ1bl0pO2sucHJlUnVuLmxlbmd0aDspVGEoKTtRYShTYSk7MDxKP1VhPVVjOmsuc2V0U3RhdHVzPyhrLnNldFN0YXR1cyhcIlJ1bm5pbmcuLi5cIiksc2V0VGltZW91dCgoKT0+e3NldFRpbWVvdXQoKCk9Pmsuc2V0U3RhdHVzKFwiXCIpLDEpO2EoKX0sMSkpOmEoKX19dmFyIFZjO1xuKGFzeW5jIGZ1bmN0aW9uKCl7ZnVuY3Rpb24gYShjKXtjPVZjPWMuZXhwb3J0cztrLl9zcWxpdGUzX2ZyZWU9Yy5QO2suX3NxbGl0ZTNfdmFsdWVfdGV4dD1jLlE7ay5fc3FsaXRlM19wcmVwYXJlX3YyPWMuUjtrLl9zcWxpdGUzX3N0ZXA9Yy5TO2suX3NxbGl0ZTNfcmVzZXQ9Yy5UO2suX3NxbGl0ZTNfZXhlYz1jLlU7ay5fc3FsaXRlM19maW5hbGl6ZT1jLlY7ay5fc3FsaXRlM19jb2x1bW5fbmFtZT1jLlc7ay5fc3FsaXRlM19jb2x1bW5fdGV4dD1jLlg7ay5fc3FsaXRlM19jb2x1bW5fdHlwZT1jLlk7ay5fc3FsaXRlM19lcnJtc2c9Yy5aO2suX3NxbGl0ZTNfY2xlYXJfYmluZGluZ3M9Yy5fO2suX3NxbGl0ZTNfdmFsdWVfYmxvYj1jLiQ7ay5fc3FsaXRlM192YWx1ZV9ieXRlcz1jLmFhO2suX3NxbGl0ZTNfdmFsdWVfZG91YmxlPWMuYmE7ay5fc3FsaXRlM192YWx1ZV9pbnQ9Yy5jYTtrLl9zcWxpdGUzX3ZhbHVlX3R5cGU9Yy5kYTtrLl9zcWxpdGUzX3Jlc3VsdF9ibG9iPWMuZWE7XG5rLl9zcWxpdGUzX3Jlc3VsdF9kb3VibGU9Yy5mYTtrLl9zcWxpdGUzX3Jlc3VsdF9lcnJvcj1jLmdhO2suX3NxbGl0ZTNfcmVzdWx0X2ludD1jLmhhO2suX3NxbGl0ZTNfcmVzdWx0X2ludDY0PWMuaWE7ay5fc3FsaXRlM19yZXN1bHRfbnVsbD1jLmphO2suX3NxbGl0ZTNfcmVzdWx0X3RleHQ9Yy5rYTtrLl9zcWxpdGUzX2FnZ3JlZ2F0ZV9jb250ZXh0PWMubGE7ay5fc3FsaXRlM19jb2x1bW5fY291bnQ9Yy5tYTtrLl9zcWxpdGUzX2RhdGFfY291bnQ9Yy5uYTtrLl9zcWxpdGUzX2NvbHVtbl9ibG9iPWMub2E7ay5fc3FsaXRlM19jb2x1bW5fYnl0ZXM9Yy5wYTtrLl9zcWxpdGUzX2NvbHVtbl9kb3VibGU9Yy5xYTtrLl9zcWxpdGUzX2JpbmRfYmxvYj1jLnJhO2suX3NxbGl0ZTNfYmluZF9kb3VibGU9Yy5zYTtrLl9zcWxpdGUzX2JpbmRfaW50PWMudGE7ay5fc3FsaXRlM19iaW5kX3RleHQ9Yy51YTtrLl9zcWxpdGUzX2JpbmRfcGFyYW1ldGVyX2luZGV4PWMudmE7ay5fc3FsaXRlM19zcWw9XG5jLndhO2suX3NxbGl0ZTNfbm9ybWFsaXplZF9zcWw9Yy54YTtrLl9zcWxpdGUzX2NoYW5nZXM9Yy55YTtrLl9zcWxpdGUzX2Nsb3NlX3YyPWMuemE7ay5fc3FsaXRlM19jcmVhdGVfZnVuY3Rpb25fdjI9Yy5BYTtrLl9zcWxpdGUzX3VwZGF0ZV9ob29rPWMuQmE7ay5fc3FsaXRlM19vcGVuPWMuQ2E7Y2E9ay5fbWFsbG9jPWMuRGE7ZGE9ay5fZnJlZT1jLkVhO2suX1JlZ2lzdGVyRXh0ZW5zaW9uRnVuY3Rpb25zPWMuRmE7eWI9Yy5HYTtTYz1jLkhhO3FhPWMuSWE7eT1jLkphO29hPWMuS2E7SWE9Yy5NO1o9Yy5PO0hhKCk7Si0tO2subW9uaXRvclJ1bkRlcGVuZGVuY2llcz8uKEopOzA9PUomJlVhJiYoYz1VYSxVYT1udWxsLGMoKSk7cmV0dXJuIFZjfUorKztrLm1vbml0b3JSdW5EZXBlbmRlbmNpZXM/LihKKTt2YXIgYj17YTpUY307aWYoay5pbnN0YW50aWF0ZVdhc20pcmV0dXJuIG5ldyBQcm9taXNlKGM9PntrLmluc3RhbnRpYXRlV2FzbShiLChkLGUpPT57YyhhKGQsZSkpfSl9KTtcbkxhPz89ay5sb2NhdGVGaWxlP2subG9jYXRlRmlsZShcInNxbC13YXNtLWJyb3dzZXIud2FzbVwiLHhhKTp4YStcInNxbC13YXNtLWJyb3dzZXIud2FzbVwiO3JldHVybiBhKChhd2FpdCBPYShiKSkuaW5zdGFuY2UpfSkoKTtVYygpO1xuXG5cbiAgICAgICAgLy8gVGhlIHNoZWxsLXByZS5qcyBhbmQgZW1jYy1nZW5lcmF0ZWQgY29kZSBnb2VzIGFib3ZlXG4gICAgICAgIHJldHVybiBNb2R1bGU7XG4gICAgfSk7IC8vIFRoZSBlbmQgb2YgdGhlIHByb21pc2UgYmVpbmcgcmV0dXJuZWRcblxuICByZXR1cm4gaW5pdFNxbEpzUHJvbWlzZTtcbn0gLy8gVGhlIGVuZCBvZiBvdXIgaW5pdFNxbEpzIGZ1bmN0aW9uXG5cbi8vIFRoaXMgYml0IGJlbG93IGlzIGNvcGllZCBhbG1vc3QgZXhhY3RseSBmcm9tIHdoYXQgeW91IGdldCB3aGVuIHlvdSB1c2UgdGhlIE1PRFVMQVJJWkU9MSBmbGFnIHdpdGggZW1jY1xuLy8gSG93ZXZlciwgd2UgZG9uJ3Qgd2FudCB0byB1c2UgdGhlIGVtY2MgbW9kdWxhcml6YXRpb24uIFNlZSBzaGVsbC1wcmUuanNcbmlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpe1xuICAgIG1vZHVsZS5leHBvcnRzID0gaW5pdFNxbEpzO1xuICAgIC8vIFRoaXMgd2lsbCBhbGxvdyB0aGUgbW9kdWxlIHRvIGJlIHVzZWQgaW4gRVM2IG9yIENvbW1vbkpTXG4gICAgbW9kdWxlLmV4cG9ydHMuZGVmYXVsdCA9IGluaXRTcWxKcztcbn1cbmVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lWydhbWQnXSkge1xuICAgIGRlZmluZShbXSwgZnVuY3Rpb24oKSB7IHJldHVybiBpbml0U3FsSnM7IH0pO1xufVxuZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKXtcbiAgICBleHBvcnRzW1wiTW9kdWxlXCJdID0gaW5pdFNxbEpzO1xufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(app-pages-browser)/./node_modules/sql.js/dist/sql-wasm-browser.js\n"));

/***/ }),

/***/ "(app-pages-browser)/./src/database/workers/sql.worker.ts":
/*!********************************************!*\
  !*** ./src/database/workers/sql.worker.ts ***!
  \********************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var sql_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! sql.js */ \"(app-pages-browser)/./node_modules/sql.js/dist/sql-wasm-browser.js\");\n/* harmony import */ var sql_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(sql_js__WEBPACK_IMPORTED_MODULE_0__);\n\nlet db = null;\nlet sqlPromise = null;\n// Initialize sql.js\nasync function initDb() {\n    if (sqlPromise) return sqlPromise;\n    // Requires sql-wasm.wasm to be served from public directory\n    sqlPromise = sql_js__WEBPACK_IMPORTED_MODULE_0___default()({\n        locateFile: (file)=>\"/\".concat(file)\n    });\n    const SQL = await sqlPromise;\n    db = new SQL.Database();\n    return db;\n}\nself.onmessage = async (e)=>{\n    const { code, requestId } = e.data;\n    try {\n        await initDb();\n        if (!db) throw new Error(\"Database not initialized\");\n        const steps = [];\n        // Split code into statements (naive split for demo purposes)\n        // A robust parser would use an AST, but for basic SQL this is sufficient\n        const statements = code.split(\";\").map((s)=>s.trim()).filter(Boolean);\n        for (const stmt of statements){\n            if (!stmt) continue;\n            // 1. Execute the statement\n            db.run(stmt);\n            // 2. Extract Query Plan if applicable (SELECT, UPDATE, DELETE, etc.)\n            let queryPlan = undefined;\n            const lowerStmt = stmt.toLowerCase();\n            if (lowerStmt.startsWith(\"select\") || lowerStmt.startsWith(\"update\") || lowerStmt.startsWith(\"delete\") || lowerStmt.startsWith(\"insert\")) {\n                try {\n                    const planResult = db.exec(\"EXPLAIN QUERY PLAN \".concat(stmt));\n                    if (planResult.length > 0 && planResult[0].values) {\n                        queryPlan = planResult[0].values.map((row)=>row[row.length - 1]).join(\"\\n\");\n                    }\n                } catch (e) {\n                // ignore explain plan errors for unsupported statements\n                }\n            }\n            // 3. Snapshot all tables and indexes\n            const tables = {};\n            const schema = {};\n            const indexes = {};\n            const masterResult = db.exec(\"SELECT name, sql, type, tbl_name FROM sqlite_master WHERE type IN ('table', 'index')\");\n            if (masterResult.length > 0) {\n                for (const row of masterResult[0].values){\n                    const name = row[0];\n                    const sql = row[1];\n                    const type = row[2];\n                    const tbl_name = row[3];\n                    if (type === \"table\") {\n                        schema[name] = sql;\n                        indexes[name] = []; // initialize\n                        // Fetch all rows for the table\n                        try {\n                            const dataResult = db.exec(\"SELECT * FROM \".concat(name));\n                            if (dataResult.length > 0) {\n                                const columns = dataResult[0].columns;\n                                const rows = dataResult[0].values.map((valArray)=>{\n                                    const rowObj = {};\n                                    columns.forEach((col, i)=>{\n                                        rowObj[col] = valArray[i];\n                                    });\n                                    return rowObj;\n                                });\n                                tables[name] = rows;\n                            } else {\n                                tables[name] = [];\n                            }\n                        } catch (e) {\n                            tables[name] = [];\n                        }\n                    } else if (type === \"index\" && sql) {\n                        if (!indexes[tbl_name]) indexes[tbl_name] = [];\n                        indexes[tbl_name].push(sql);\n                    }\n                }\n            }\n            steps.push({\n                statement: stmt,\n                tables,\n                schema,\n                indexes,\n                queryPlan\n            });\n        }\n        self.postMessage({\n            requestId,\n            ok: true,\n            steps,\n            error: null\n        });\n    } catch (err) {\n        var _err_message;\n        self.postMessage({\n            requestId,\n            ok: false,\n            steps: [],\n            error: (_err_message = err.message) !== null && _err_message !== void 0 ? _err_message : \"SQL Execution Error\"\n        });\n    }\n};\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL3NyYy9kYXRhYmFzZS93b3JrZXJzL3NxbC53b3JrZXIudHMiLCJtYXBwaW5ncyI6Ijs7O0FBQTZDO0FBRTdDLElBQUlDLEtBQXNCO0FBQzFCLElBQUlDLGFBQWtDO0FBVXRDLG9CQUFvQjtBQUNwQixlQUFlQztJQUNiLElBQUlELFlBQVksT0FBT0E7SUFFdkIsNERBQTREO0lBQzVEQSxhQUFhRiw2Q0FBU0EsQ0FBQztRQUNyQkksWUFBWSxDQUFDQyxPQUFTLElBQVMsT0FBTEE7SUFDNUI7SUFFQSxNQUFNQyxNQUFNLE1BQU1KO0lBQ2xCRCxLQUFLLElBQUlLLElBQUlDLFFBQVE7SUFDckIsT0FBT047QUFDVDtBQUVBTyxLQUFLQyxTQUFTLEdBQUcsT0FBT0M7SUFDdEIsTUFBTSxFQUFFQyxJQUFJLEVBQUVDLFNBQVMsRUFBRSxHQUFHRixFQUFFRyxJQUFJO0lBRWxDLElBQUk7UUFDRixNQUFNVjtRQUNOLElBQUksQ0FBQ0YsSUFBSSxNQUFNLElBQUlhLE1BQU07UUFFekIsTUFBTUMsUUFBdUIsRUFBRTtRQUUvQiw2REFBNkQ7UUFDN0QseUVBQXlFO1FBQ3pFLE1BQU1DLGFBQWFMLEtBQUtNLEtBQUssQ0FBQyxLQUFLQyxHQUFHLENBQUMsQ0FBQ0MsSUFBY0EsRUFBRUMsSUFBSSxJQUFJQyxNQUFNLENBQUNDO1FBRXZFLEtBQUssTUFBTUMsUUFBUVAsV0FBWTtZQUM3QixJQUFJLENBQUNPLE1BQU07WUFFWCwyQkFBMkI7WUFDM0J0QixHQUFHdUIsR0FBRyxDQUFDRDtZQUVQLHFFQUFxRTtZQUNyRSxJQUFJRSxZQUFZQztZQUNoQixNQUFNQyxZQUFZSixLQUFLSyxXQUFXO1lBQ2xDLElBQUlELFVBQVVFLFVBQVUsQ0FBQyxhQUFhRixVQUFVRSxVQUFVLENBQUMsYUFBYUYsVUFBVUUsVUFBVSxDQUFDLGFBQWFGLFVBQVVFLFVBQVUsQ0FBQyxXQUFXO2dCQUN4SSxJQUFJO29CQUNGLE1BQU1DLGFBQWE3QixHQUFHOEIsSUFBSSxDQUFDLHNCQUEyQixPQUFMUjtvQkFDakQsSUFBSU8sV0FBV0UsTUFBTSxHQUFHLEtBQUtGLFVBQVUsQ0FBQyxFQUFFLENBQUNHLE1BQU0sRUFBRTt3QkFDakRSLFlBQVlLLFVBQVUsQ0FBQyxFQUFFLENBQUNHLE1BQU0sQ0FBQ2YsR0FBRyxDQUFDZ0IsQ0FBQUEsTUFBT0EsR0FBRyxDQUFDQSxJQUFJRixNQUFNLEdBQUcsRUFBRSxFQUFFRyxJQUFJLENBQUM7b0JBQ3hFO2dCQUNGLEVBQUUsT0FBT3pCLEdBQUc7Z0JBQ1Ysd0RBQXdEO2dCQUMxRDtZQUNGO1lBRUEscUNBQXFDO1lBQ3JDLE1BQU0wQixTQUFnQyxDQUFDO1lBQ3ZDLE1BQU1DLFNBQWlDLENBQUM7WUFDeEMsTUFBTUMsVUFBb0MsQ0FBQztZQUUzQyxNQUFNQyxlQUFldEMsR0FBRzhCLElBQUksQ0FBQztZQUU3QixJQUFJUSxhQUFhUCxNQUFNLEdBQUcsR0FBRztnQkFDM0IsS0FBSyxNQUFNRSxPQUFPSyxZQUFZLENBQUMsRUFBRSxDQUFDTixNQUFNLENBQUU7b0JBQ3hDLE1BQU1PLE9BQU9OLEdBQUcsQ0FBQyxFQUFFO29CQUNuQixNQUFNTyxNQUFNUCxHQUFHLENBQUMsRUFBRTtvQkFDbEIsTUFBTVEsT0FBT1IsR0FBRyxDQUFDLEVBQUU7b0JBQ25CLE1BQU1TLFdBQVdULEdBQUcsQ0FBQyxFQUFFO29CQUV2QixJQUFJUSxTQUFTLFNBQVM7d0JBQ3BCTCxNQUFNLENBQUNHLEtBQUssR0FBR0M7d0JBQ2ZILE9BQU8sQ0FBQ0UsS0FBSyxHQUFHLEVBQUUsRUFBRSxhQUFhO3dCQUVqQywrQkFBK0I7d0JBQy9CLElBQUk7NEJBQ0YsTUFBTUksYUFBYTNDLEdBQUc4QixJQUFJLENBQUMsaUJBQXNCLE9BQUxTOzRCQUM1QyxJQUFJSSxXQUFXWixNQUFNLEdBQUcsR0FBRztnQ0FDekIsTUFBTWEsVUFBVUQsVUFBVSxDQUFDLEVBQUUsQ0FBQ0MsT0FBTztnQ0FDckMsTUFBTUMsT0FBT0YsVUFBVSxDQUFDLEVBQUUsQ0FBQ1gsTUFBTSxDQUFDZixHQUFHLENBQUM2QixDQUFBQTtvQ0FDcEMsTUFBTUMsU0FBYyxDQUFDO29DQUNyQkgsUUFBUUksT0FBTyxDQUFDLENBQUNDLEtBQUtDO3dDQUNwQkgsTUFBTSxDQUFDRSxJQUFJLEdBQUdILFFBQVEsQ0FBQ0ksRUFBRTtvQ0FDM0I7b0NBQ0EsT0FBT0g7Z0NBQ1Q7Z0NBQ0FaLE1BQU0sQ0FBQ0ksS0FBSyxHQUFHTTs0QkFDakIsT0FBTztnQ0FDTFYsTUFBTSxDQUFDSSxLQUFLLEdBQUcsRUFBRTs0QkFDbkI7d0JBQ0YsRUFBRSxPQUFPOUIsR0FBRzs0QkFDVjBCLE1BQU0sQ0FBQ0ksS0FBSyxHQUFHLEVBQUU7d0JBQ25CO29CQUNGLE9BQU8sSUFBSUUsU0FBUyxXQUFXRCxLQUFLO3dCQUNsQyxJQUFJLENBQUNILE9BQU8sQ0FBQ0ssU0FBUyxFQUFFTCxPQUFPLENBQUNLLFNBQVMsR0FBRyxFQUFFO3dCQUM5Q0wsT0FBTyxDQUFDSyxTQUFTLENBQUNTLElBQUksQ0FBQ1g7b0JBQ3pCO2dCQUNGO1lBQ0Y7WUFFQTFCLE1BQU1xQyxJQUFJLENBQUM7Z0JBQ1RDLFdBQVc5QjtnQkFDWGE7Z0JBQ0FDO2dCQUNBQztnQkFDQWI7WUFDRjtRQUNGO1FBRUFqQixLQUFLOEMsV0FBVyxDQUFDO1lBQ2YxQztZQUNBMkMsSUFBSTtZQUNKeEM7WUFDQXlDLE9BQU87UUFDVDtJQUNGLEVBQUUsT0FBT0MsS0FBVTtZQUtSQTtRQUpUakQsS0FBSzhDLFdBQVcsQ0FBQztZQUNmMUM7WUFDQTJDLElBQUk7WUFDSnhDLE9BQU8sRUFBRTtZQUNUeUMsT0FBT0MsQ0FBQUEsZUFBQUEsSUFBSUMsT0FBTyxjQUFYRCwwQkFBQUEsZUFBZTtRQUN4QjtJQUNGO0FBQ0YiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9fTl9FLy4vc3JjL2RhdGFiYXNlL3dvcmtlcnMvc3FsLndvcmtlci50cz9jMTQ5Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBpbml0U3FsSnMsIHsgRGF0YWJhc2UgfSBmcm9tIFwic3FsLmpzXCI7XHJcblxyXG5sZXQgZGI6IERhdGFiYXNlIHwgbnVsbCA9IG51bGw7XHJcbmxldCBzcWxQcm9taXNlOiBQcm9taXNlPGFueT4gfCBudWxsID0gbnVsbDtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgU3FsU25hcHNob3Qge1xyXG4gIHRhYmxlczogUmVjb3JkPHN0cmluZywgYW55W10+O1xyXG4gIHNjaGVtYTogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcclxuICBpbmRleGVzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmdbXT47XHJcbiAgcXVlcnlQbGFuPzogc3RyaW5nO1xyXG4gIHN0YXRlbWVudDogc3RyaW5nO1xyXG59XHJcblxyXG4vLyBJbml0aWFsaXplIHNxbC5qc1xyXG5hc3luYyBmdW5jdGlvbiBpbml0RGIoKSB7XHJcbiAgaWYgKHNxbFByb21pc2UpIHJldHVybiBzcWxQcm9taXNlO1xyXG4gIFxyXG4gIC8vIFJlcXVpcmVzIHNxbC13YXNtLndhc20gdG8gYmUgc2VydmVkIGZyb20gcHVibGljIGRpcmVjdG9yeVxyXG4gIHNxbFByb21pc2UgPSBpbml0U3FsSnMoe1xyXG4gICAgbG9jYXRlRmlsZTogKGZpbGUpID0+IGAvJHtmaWxlfWBcclxuICB9KTtcclxuICBcclxuICBjb25zdCBTUUwgPSBhd2FpdCBzcWxQcm9taXNlO1xyXG4gIGRiID0gbmV3IFNRTC5EYXRhYmFzZSgpO1xyXG4gIHJldHVybiBkYjtcclxufVxyXG5cclxuc2VsZi5vbm1lc3NhZ2UgPSBhc3luYyAoZTogTWVzc2FnZUV2ZW50KSA9PiB7XHJcbiAgY29uc3QgeyBjb2RlLCByZXF1ZXN0SWQgfSA9IGUuZGF0YTtcclxuXHJcbiAgdHJ5IHtcclxuICAgIGF3YWl0IGluaXREYigpO1xyXG4gICAgaWYgKCFkYikgdGhyb3cgbmV3IEVycm9yKFwiRGF0YWJhc2Ugbm90IGluaXRpYWxpemVkXCIpO1xyXG5cclxuICAgIGNvbnN0IHN0ZXBzOiBTcWxTbmFwc2hvdFtdID0gW107XHJcblxyXG4gICAgLy8gU3BsaXQgY29kZSBpbnRvIHN0YXRlbWVudHMgKG5haXZlIHNwbGl0IGZvciBkZW1vIHB1cnBvc2VzKVxyXG4gICAgLy8gQSByb2J1c3QgcGFyc2VyIHdvdWxkIHVzZSBhbiBBU1QsIGJ1dCBmb3IgYmFzaWMgU1FMIHRoaXMgaXMgc3VmZmljaWVudFxyXG4gICAgY29uc3Qgc3RhdGVtZW50cyA9IGNvZGUuc3BsaXQoJzsnKS5tYXAoKHM6IHN0cmluZykgPT4gcy50cmltKCkpLmZpbHRlcihCb29sZWFuKTtcclxuXHJcbiAgICBmb3IgKGNvbnN0IHN0bXQgb2Ygc3RhdGVtZW50cykge1xyXG4gICAgICBpZiAoIXN0bXQpIGNvbnRpbnVlO1xyXG5cclxuICAgICAgLy8gMS4gRXhlY3V0ZSB0aGUgc3RhdGVtZW50XHJcbiAgICAgIGRiLnJ1bihzdG10KTtcclxuXHJcbiAgICAgIC8vIDIuIEV4dHJhY3QgUXVlcnkgUGxhbiBpZiBhcHBsaWNhYmxlIChTRUxFQ1QsIFVQREFURSwgREVMRVRFLCBldGMuKVxyXG4gICAgICBsZXQgcXVlcnlQbGFuID0gdW5kZWZpbmVkO1xyXG4gICAgICBjb25zdCBsb3dlclN0bXQgPSBzdG10LnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgIGlmIChsb3dlclN0bXQuc3RhcnRzV2l0aCgnc2VsZWN0JykgfHwgbG93ZXJTdG10LnN0YXJ0c1dpdGgoJ3VwZGF0ZScpIHx8IGxvd2VyU3RtdC5zdGFydHNXaXRoKCdkZWxldGUnKSB8fCBsb3dlclN0bXQuc3RhcnRzV2l0aCgnaW5zZXJ0JykpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgY29uc3QgcGxhblJlc3VsdCA9IGRiLmV4ZWMoYEVYUExBSU4gUVVFUlkgUExBTiAke3N0bXR9YCk7XHJcbiAgICAgICAgICBpZiAocGxhblJlc3VsdC5sZW5ndGggPiAwICYmIHBsYW5SZXN1bHRbMF0udmFsdWVzKSB7XHJcbiAgICAgICAgICAgIHF1ZXJ5UGxhbiA9IHBsYW5SZXN1bHRbMF0udmFsdWVzLm1hcChyb3cgPT4gcm93W3Jvdy5sZW5ndGggLSAxXSkuam9pbihcIlxcblwiKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAvLyBpZ25vcmUgZXhwbGFpbiBwbGFuIGVycm9ycyBmb3IgdW5zdXBwb3J0ZWQgc3RhdGVtZW50c1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gMy4gU25hcHNob3QgYWxsIHRhYmxlcyBhbmQgaW5kZXhlc1xyXG4gICAgICBjb25zdCB0YWJsZXM6IFJlY29yZDxzdHJpbmcsIGFueVtdPiA9IHt9O1xyXG4gICAgICBjb25zdCBzY2hlbWE6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcclxuICAgICAgY29uc3QgaW5kZXhlczogUmVjb3JkPHN0cmluZywgc3RyaW5nW10+ID0ge307XHJcbiAgICAgIFxyXG4gICAgICBjb25zdCBtYXN0ZXJSZXN1bHQgPSBkYi5leGVjKFwiU0VMRUNUIG5hbWUsIHNxbCwgdHlwZSwgdGJsX25hbWUgRlJPTSBzcWxpdGVfbWFzdGVyIFdIRVJFIHR5cGUgSU4gKCd0YWJsZScsICdpbmRleCcpXCIpO1xyXG4gICAgICBcclxuICAgICAgaWYgKG1hc3RlclJlc3VsdC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgZm9yIChjb25zdCByb3cgb2YgbWFzdGVyUmVzdWx0WzBdLnZhbHVlcykge1xyXG4gICAgICAgICAgY29uc3QgbmFtZSA9IHJvd1swXSBhcyBzdHJpbmc7XHJcbiAgICAgICAgICBjb25zdCBzcWwgPSByb3dbMV0gYXMgc3RyaW5nO1xyXG4gICAgICAgICAgY29uc3QgdHlwZSA9IHJvd1syXSBhcyBzdHJpbmc7XHJcbiAgICAgICAgICBjb25zdCB0YmxfbmFtZSA9IHJvd1szXSBhcyBzdHJpbmc7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIGlmICh0eXBlID09PSAndGFibGUnKSB7XHJcbiAgICAgICAgICAgIHNjaGVtYVtuYW1lXSA9IHNxbDtcclxuICAgICAgICAgICAgaW5kZXhlc1tuYW1lXSA9IFtdOyAvLyBpbml0aWFsaXplXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyBGZXRjaCBhbGwgcm93cyBmb3IgdGhlIHRhYmxlXHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgY29uc3QgZGF0YVJlc3VsdCA9IGRiLmV4ZWMoYFNFTEVDVCAqIEZST00gJHtuYW1lfWApO1xyXG4gICAgICAgICAgICAgIGlmIChkYXRhUmVzdWx0Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbHVtbnMgPSBkYXRhUmVzdWx0WzBdLmNvbHVtbnM7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByb3dzID0gZGF0YVJlc3VsdFswXS52YWx1ZXMubWFwKHZhbEFycmF5ID0+IHtcclxuICAgICAgICAgICAgICAgICAgY29uc3Qgcm93T2JqOiBhbnkgPSB7fTtcclxuICAgICAgICAgICAgICAgICAgY29sdW1ucy5mb3JFYWNoKChjb2wsIGkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByb3dPYmpbY29sXSA9IHZhbEFycmF5W2ldO1xyXG4gICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgcmV0dXJuIHJvd09iajtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgdGFibGVzW25hbWVdID0gcm93cztcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGFibGVzW25hbWVdID0gW107XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgdGFibGVzW25hbWVdID0gW107XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ2luZGV4JyAmJiBzcWwpIHtcclxuICAgICAgICAgICAgaWYgKCFpbmRleGVzW3RibF9uYW1lXSkgaW5kZXhlc1t0YmxfbmFtZV0gPSBbXTtcclxuICAgICAgICAgICAgaW5kZXhlc1t0YmxfbmFtZV0ucHVzaChzcWwpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgc3RlcHMucHVzaCh7XHJcbiAgICAgICAgc3RhdGVtZW50OiBzdG10LFxyXG4gICAgICAgIHRhYmxlcyxcclxuICAgICAgICBzY2hlbWEsXHJcbiAgICAgICAgaW5kZXhlcyxcclxuICAgICAgICBxdWVyeVBsYW5cclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2VsZi5wb3N0TWVzc2FnZSh7XHJcbiAgICAgIHJlcXVlc3RJZCxcclxuICAgICAgb2s6IHRydWUsXHJcbiAgICAgIHN0ZXBzLFxyXG4gICAgICBlcnJvcjogbnVsbFxyXG4gICAgfSk7XHJcbiAgfSBjYXRjaCAoZXJyOiBhbnkpIHtcclxuICAgIHNlbGYucG9zdE1lc3NhZ2Uoe1xyXG4gICAgICByZXF1ZXN0SWQsXHJcbiAgICAgIG9rOiBmYWxzZSxcclxuICAgICAgc3RlcHM6IFtdLFxyXG4gICAgICBlcnJvcjogZXJyLm1lc3NhZ2UgPz8gXCJTUUwgRXhlY3V0aW9uIEVycm9yXCJcclxuICAgIH0pO1xyXG4gIH1cclxufTtcclxuIl0sIm5hbWVzIjpbImluaXRTcWxKcyIsImRiIiwic3FsUHJvbWlzZSIsImluaXREYiIsImxvY2F0ZUZpbGUiLCJmaWxlIiwiU1FMIiwiRGF0YWJhc2UiLCJzZWxmIiwib25tZXNzYWdlIiwiZSIsImNvZGUiLCJyZXF1ZXN0SWQiLCJkYXRhIiwiRXJyb3IiLCJzdGVwcyIsInN0YXRlbWVudHMiLCJzcGxpdCIsIm1hcCIsInMiLCJ0cmltIiwiZmlsdGVyIiwiQm9vbGVhbiIsInN0bXQiLCJydW4iLCJxdWVyeVBsYW4iLCJ1bmRlZmluZWQiLCJsb3dlclN0bXQiLCJ0b0xvd2VyQ2FzZSIsInN0YXJ0c1dpdGgiLCJwbGFuUmVzdWx0IiwiZXhlYyIsImxlbmd0aCIsInZhbHVlcyIsInJvdyIsImpvaW4iLCJ0YWJsZXMiLCJzY2hlbWEiLCJpbmRleGVzIiwibWFzdGVyUmVzdWx0IiwibmFtZSIsInNxbCIsInR5cGUiLCJ0YmxfbmFtZSIsImRhdGFSZXN1bHQiLCJjb2x1bW5zIiwicm93cyIsInZhbEFycmF5Iiwicm93T2JqIiwiZm9yRWFjaCIsImNvbCIsImkiLCJwdXNoIiwic3RhdGVtZW50IiwicG9zdE1lc3NhZ2UiLCJvayIsImVycm9yIiwiZXJyIiwibWVzc2FnZSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(app-pages-browser)/./src/database/workers/sql.worker.ts\n"));

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
/******/ 			loaded: false,
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
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
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
/******/ 		__webpack_require__.hmrF = function() { return "static/webpack/" + __webpack_require__.h() + ".933c23fce6a548d8.hot-update.json"; };
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
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	!function() {
/******/ 		__webpack_require__.nmd = function(module) {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
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
/******/ 			"_app-pages-browser_src_database_workers_sql_worker_ts": 1
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
/******/ 	var __webpack_exports__ = __webpack_require__("(app-pages-browser)/./src/database/workers/sql.worker.ts");
/******/ 	_N_E = __webpack_exports__;
/******/ 	
/******/ })()
;