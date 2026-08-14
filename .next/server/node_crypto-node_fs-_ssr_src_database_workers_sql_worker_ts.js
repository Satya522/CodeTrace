/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "node:crypto":
/*!******************************!*\
  !*** external "node:crypto" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("node:crypto");

/***/ }),

/***/ "node:fs":
/*!**************************!*\
  !*** external "node:fs" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("node:fs");

/***/ }),

/***/ "(ssr)/./src/database/workers/sql.worker.ts":
/*!********************************************!*\
  !*** ./src/database/workers/sql.worker.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var sql_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! sql.js */ \"(ssr)/./node_modules/sql.js/dist/sql-wasm.js\");\n/* harmony import */ var sql_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(sql_js__WEBPACK_IMPORTED_MODULE_0__);\n\nlet db = null;\nlet sqlPromise = null;\n// Initialize sql.js\nasync function initDb() {\n    if (sqlPromise) return sqlPromise;\n    // Requires sql-wasm.wasm to be served from public directory\n    sqlPromise = sql_js__WEBPACK_IMPORTED_MODULE_0___default()({\n        locateFile: (file)=>`/${file}`\n    });\n    const SQL = await sqlPromise;\n    db = new SQL.Database();\n    return db;\n}\nself.onmessage = async (e)=>{\n    const { code, requestId } = e.data;\n    try {\n        await initDb();\n        if (!db) throw new Error(\"Database not initialized\");\n        const steps = [];\n        // Split code into statements (naive split for demo purposes)\n        // A robust parser would use an AST, but for basic SQL this is sufficient\n        const statements = code.split(\";\").map((s)=>s.trim()).filter(Boolean);\n        for (const stmt of statements){\n            if (!stmt) continue;\n            // 1. Execute the statement\n            db.run(stmt);\n            // 2. Extract Query Plan if applicable (SELECT, UPDATE, DELETE, etc.)\n            let queryPlan = undefined;\n            const lowerStmt = stmt.toLowerCase();\n            if (lowerStmt.startsWith(\"select\") || lowerStmt.startsWith(\"update\") || lowerStmt.startsWith(\"delete\") || lowerStmt.startsWith(\"insert\")) {\n                try {\n                    const planResult = db.exec(`EXPLAIN QUERY PLAN ${stmt}`);\n                    if (planResult.length > 0 && planResult[0].values) {\n                        queryPlan = planResult[0].values.map((row)=>row[row.length - 1]).join(\"\\n\");\n                    }\n                } catch (e) {\n                // ignore explain plan errors for unsupported statements\n                }\n            }\n            // 3. Snapshot all tables and indexes\n            const tables = {};\n            const schema = {};\n            const indexes = {};\n            const masterResult = db.exec(\"SELECT name, sql, type, tbl_name FROM sqlite_master WHERE type IN ('table', 'index')\");\n            if (masterResult.length > 0) {\n                for (const row of masterResult[0].values){\n                    const name = row[0];\n                    const sql = row[1];\n                    const type = row[2];\n                    const tbl_name = row[3];\n                    if (type === \"table\") {\n                        schema[name] = sql;\n                        indexes[name] = []; // initialize\n                        // Fetch all rows for the table\n                        try {\n                            const dataResult = db.exec(`SELECT * FROM ${name}`);\n                            if (dataResult.length > 0) {\n                                const columns = dataResult[0].columns;\n                                const rows = dataResult[0].values.map((valArray)=>{\n                                    const rowObj = {};\n                                    columns.forEach((col, i)=>{\n                                        rowObj[col] = valArray[i];\n                                    });\n                                    return rowObj;\n                                });\n                                tables[name] = rows;\n                            } else {\n                                tables[name] = [];\n                            }\n                        } catch (e) {\n                            tables[name] = [];\n                        }\n                    } else if (type === \"index\" && sql) {\n                        if (!indexes[tbl_name]) indexes[tbl_name] = [];\n                        indexes[tbl_name].push(sql);\n                    }\n                }\n            }\n            steps.push({\n                statement: stmt,\n                tables,\n                schema,\n                indexes,\n                queryPlan\n            });\n        }\n        self.postMessage({\n            requestId,\n            ok: true,\n            steps,\n            error: null\n        });\n    } catch (err) {\n        self.postMessage({\n            requestId,\n            ok: false,\n            steps: [],\n            error: err.message ?? \"SQL Execution Error\"\n        });\n    }\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LENBQUMsRUFBRSxDQUFDWCxNQUFNLENBQUNmLEdBQUcsQ0FBQzZCLENBQUFBO29DQUNwQyxNQUFNQyxTQUFjLENBQUM7b0NBQ3JCSCxRQUFRSSxPQUFPLENBQUMsQ0FBQ0MsS0FBS0M7d0NBQ3BCSCxNQUFNLENBQUNFLElBQUksR0FBR0gsUUFBUSxDQUFDSSxFQUFFO29DQUMzQjtvQ0FDQSxPQUFPSDtnQ0FDVDtnQ0FDQVosTUFBTSxDQUFDSSxLQUFLLEdBQUdNOzRCQUNqQixPQUFPO2dDQUNMVixNQUFNLENBQUNJLEtBQUssR0FBRyxFQUFFOzRCQUNuQjt3QkFDRixFQUFFLE9BQU85QixHQUFHOzRCQUNWMEIsTUFBTSxDQUFDSSxLQUFLLEdBQUcsRUFBRTt3QkFDbkI7b0JBQ0YsT0FBTyxJQUFJRSxTQUFTLFdBQVdELEtBQUs7d0JBQ2xDLElBQUksQ0FBQ0gsT0FBTyxDQUFDSyxTQUFTLEVBQUVMLE9BQU8sQ0FBQ0ssU0FBUyxHQUFHLEVBQUU7d0JBQzlDTCxPQUFPLENBQUNLLFNBQVMsQ0FBQ1MsSUFBSSxDQUFDWDtvQkFDekI7Z0JBQ0Y7WUFDRjtZQUVBMUIsTUFBTXFDLElBQUksQ0FBQztnQkFDVEMsV0FBVzlCO2dCQUNYYTtnQkFDQUM7Z0JBQ0FDO2dCQUNBYjtZQUNGO1FBQ0Y7UUFFQWpCLEtBQUs4QyxXQUFXLENBQUM7WUFDZjFDO1lBQ0EyQyxJQUFJO1lBQ0p4QztZQUNBeUMsT0FBTztRQUNUO0lBQ0YsRUFBRSxPQUFPQyxLQUFVO1FBQ2pCakQsS0FBSzhDLFdBQVcsQ0FBQztZQUNmMUM7WUFDQTJDLElBQUk7WUFDSnhDLE9BQU8sRUFBRTtZQUNUeUMsT0FBT0MsSUFBSUMsT0FBTyxJQUFJO1FBQ3hCO0lBQ0Y7QUFDRiIsInNvdXJjZXMiOlsid2VicGFjazovL2NvZGV0cmFjZS8uL3NyYy9kYXRhYmFzZS93b3JrZXJzL3NxbC53b3JrZXIudHM/YzE0OSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgaW5pdFNxbEpzLCB7IERhdGFiYXNlIH0gZnJvbSBcInNxbC5qc1wiO1xyXG5cclxubGV0IGRiOiBEYXRhYmFzZSB8IG51bGwgPSBudWxsO1xyXG5sZXQgc3FsUHJvbWlzZTogUHJvbWlzZTxhbnk+IHwgbnVsbCA9IG51bGw7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFNxbFNuYXBzaG90IHtcclxuICB0YWJsZXM6IFJlY29yZDxzdHJpbmcsIGFueVtdPjtcclxuICBzY2hlbWE6IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XHJcbiAgaW5kZXhlczogUmVjb3JkPHN0cmluZywgc3RyaW5nW10+O1xyXG4gIHF1ZXJ5UGxhbj86IHN0cmluZztcclxuICBzdGF0ZW1lbnQ6IHN0cmluZztcclxufVxyXG5cclxuLy8gSW5pdGlhbGl6ZSBzcWwuanNcclxuYXN5bmMgZnVuY3Rpb24gaW5pdERiKCkge1xyXG4gIGlmIChzcWxQcm9taXNlKSByZXR1cm4gc3FsUHJvbWlzZTtcclxuICBcclxuICAvLyBSZXF1aXJlcyBzcWwtd2FzbS53YXNtIHRvIGJlIHNlcnZlZCBmcm9tIHB1YmxpYyBkaXJlY3RvcnlcclxuICBzcWxQcm9taXNlID0gaW5pdFNxbEpzKHtcclxuICAgIGxvY2F0ZUZpbGU6IChmaWxlKSA9PiBgLyR7ZmlsZX1gXHJcbiAgfSk7XHJcbiAgXHJcbiAgY29uc3QgU1FMID0gYXdhaXQgc3FsUHJvbWlzZTtcclxuICBkYiA9IG5ldyBTUUwuRGF0YWJhc2UoKTtcclxuICByZXR1cm4gZGI7XHJcbn1cclxuXHJcbnNlbGYub25tZXNzYWdlID0gYXN5bmMgKGU6IE1lc3NhZ2VFdmVudCkgPT4ge1xyXG4gIGNvbnN0IHsgY29kZSwgcmVxdWVzdElkIH0gPSBlLmRhdGE7XHJcblxyXG4gIHRyeSB7XHJcbiAgICBhd2FpdCBpbml0RGIoKTtcclxuICAgIGlmICghZGIpIHRocm93IG5ldyBFcnJvcihcIkRhdGFiYXNlIG5vdCBpbml0aWFsaXplZFwiKTtcclxuXHJcbiAgICBjb25zdCBzdGVwczogU3FsU25hcHNob3RbXSA9IFtdO1xyXG5cclxuICAgIC8vIFNwbGl0IGNvZGUgaW50byBzdGF0ZW1lbnRzIChuYWl2ZSBzcGxpdCBmb3IgZGVtbyBwdXJwb3NlcylcclxuICAgIC8vIEEgcm9idXN0IHBhcnNlciB3b3VsZCB1c2UgYW4gQVNULCBidXQgZm9yIGJhc2ljIFNRTCB0aGlzIGlzIHN1ZmZpY2llbnRcclxuICAgIGNvbnN0IHN0YXRlbWVudHMgPSBjb2RlLnNwbGl0KCc7JykubWFwKChzOiBzdHJpbmcpID0+IHMudHJpbSgpKS5maWx0ZXIoQm9vbGVhbik7XHJcblxyXG4gICAgZm9yIChjb25zdCBzdG10IG9mIHN0YXRlbWVudHMpIHtcclxuICAgICAgaWYgKCFzdG10KSBjb250aW51ZTtcclxuXHJcbiAgICAgIC8vIDEuIEV4ZWN1dGUgdGhlIHN0YXRlbWVudFxyXG4gICAgICBkYi5ydW4oc3RtdCk7XHJcblxyXG4gICAgICAvLyAyLiBFeHRyYWN0IFF1ZXJ5IFBsYW4gaWYgYXBwbGljYWJsZSAoU0VMRUNULCBVUERBVEUsIERFTEVURSwgZXRjLilcclxuICAgICAgbGV0IHF1ZXJ5UGxhbiA9IHVuZGVmaW5lZDtcclxuICAgICAgY29uc3QgbG93ZXJTdG10ID0gc3RtdC50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICBpZiAobG93ZXJTdG10LnN0YXJ0c1dpdGgoJ3NlbGVjdCcpIHx8IGxvd2VyU3RtdC5zdGFydHNXaXRoKCd1cGRhdGUnKSB8fCBsb3dlclN0bXQuc3RhcnRzV2l0aCgnZGVsZXRlJykgfHwgbG93ZXJTdG10LnN0YXJ0c1dpdGgoJ2luc2VydCcpKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgIGNvbnN0IHBsYW5SZXN1bHQgPSBkYi5leGVjKGBFWFBMQUlOIFFVRVJZIFBMQU4gJHtzdG10fWApO1xyXG4gICAgICAgICAgaWYgKHBsYW5SZXN1bHQubGVuZ3RoID4gMCAmJiBwbGFuUmVzdWx0WzBdLnZhbHVlcykge1xyXG4gICAgICAgICAgICBxdWVyeVBsYW4gPSBwbGFuUmVzdWx0WzBdLnZhbHVlcy5tYXAocm93ID0+IHJvd1tyb3cubGVuZ3RoIC0gMV0pLmpvaW4oXCJcXG5cIik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgLy8gaWdub3JlIGV4cGxhaW4gcGxhbiBlcnJvcnMgZm9yIHVuc3VwcG9ydGVkIHN0YXRlbWVudHNcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIDMuIFNuYXBzaG90IGFsbCB0YWJsZXMgYW5kIGluZGV4ZXNcclxuICAgICAgY29uc3QgdGFibGVzOiBSZWNvcmQ8c3RyaW5nLCBhbnlbXT4gPSB7fTtcclxuICAgICAgY29uc3Qgc2NoZW1hOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XHJcbiAgICAgIGNvbnN0IGluZGV4ZXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZ1tdPiA9IHt9O1xyXG4gICAgICBcclxuICAgICAgY29uc3QgbWFzdGVyUmVzdWx0ID0gZGIuZXhlYyhcIlNFTEVDVCBuYW1lLCBzcWwsIHR5cGUsIHRibF9uYW1lIEZST00gc3FsaXRlX21hc3RlciBXSEVSRSB0eXBlIElOICgndGFibGUnLCAnaW5kZXgnKVwiKTtcclxuICAgICAgXHJcbiAgICAgIGlmIChtYXN0ZXJSZXN1bHQubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGZvciAoY29uc3Qgcm93IG9mIG1hc3RlclJlc3VsdFswXS52YWx1ZXMpIHtcclxuICAgICAgICAgIGNvbnN0IG5hbWUgPSByb3dbMF0gYXMgc3RyaW5nO1xyXG4gICAgICAgICAgY29uc3Qgc3FsID0gcm93WzFdIGFzIHN0cmluZztcclxuICAgICAgICAgIGNvbnN0IHR5cGUgPSByb3dbMl0gYXMgc3RyaW5nO1xyXG4gICAgICAgICAgY29uc3QgdGJsX25hbWUgPSByb3dbM10gYXMgc3RyaW5nO1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgICBpZiAodHlwZSA9PT0gJ3RhYmxlJykge1xyXG4gICAgICAgICAgICBzY2hlbWFbbmFtZV0gPSBzcWw7XHJcbiAgICAgICAgICAgIGluZGV4ZXNbbmFtZV0gPSBbXTsgLy8gaW5pdGlhbGl6ZVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gRmV0Y2ggYWxsIHJvd3MgZm9yIHRoZSB0YWJsZVxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgIGNvbnN0IGRhdGFSZXN1bHQgPSBkYi5leGVjKGBTRUxFQ1QgKiBGUk9NICR7bmFtZX1gKTtcclxuICAgICAgICAgICAgICBpZiAoZGF0YVJlc3VsdC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb2x1bW5zID0gZGF0YVJlc3VsdFswXS5jb2x1bW5zO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgcm93cyA9IGRhdGFSZXN1bHRbMF0udmFsdWVzLm1hcCh2YWxBcnJheSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIGNvbnN0IHJvd09iajogYW55ID0ge307XHJcbiAgICAgICAgICAgICAgICAgIGNvbHVtbnMuZm9yRWFjaCgoY29sLCBpKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcm93T2JqW2NvbF0gPSB2YWxBcnJheVtpXTtcclxuICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgIHJldHVybiByb3dPYmo7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHRhYmxlc1tuYW1lXSA9IHJvd3M7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRhYmxlc1tuYW1lXSA9IFtdO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgIHRhYmxlc1tuYW1lXSA9IFtdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdpbmRleCcgJiYgc3FsKSB7XHJcbiAgICAgICAgICAgIGlmICghaW5kZXhlc1t0YmxfbmFtZV0pIGluZGV4ZXNbdGJsX25hbWVdID0gW107XHJcbiAgICAgICAgICAgIGluZGV4ZXNbdGJsX25hbWVdLnB1c2goc3FsKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHN0ZXBzLnB1c2goe1xyXG4gICAgICAgIHN0YXRlbWVudDogc3RtdCxcclxuICAgICAgICB0YWJsZXMsXHJcbiAgICAgICAgc2NoZW1hLFxyXG4gICAgICAgIGluZGV4ZXMsXHJcbiAgICAgICAgcXVlcnlQbGFuXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHNlbGYucG9zdE1lc3NhZ2Uoe1xyXG4gICAgICByZXF1ZXN0SWQsXHJcbiAgICAgIG9rOiB0cnVlLFxyXG4gICAgICBzdGVwcyxcclxuICAgICAgZXJyb3I6IG51bGxcclxuICAgIH0pO1xyXG4gIH0gY2F0Y2ggKGVycjogYW55KSB7XHJcbiAgICBzZWxmLnBvc3RNZXNzYWdlKHtcclxuICAgICAgcmVxdWVzdElkLFxyXG4gICAgICBvazogZmFsc2UsXHJcbiAgICAgIHN0ZXBzOiBbXSxcclxuICAgICAgZXJyb3I6IGVyci5tZXNzYWdlID8/IFwiU1FMIEV4ZWN1dGlvbiBFcnJvclwiXHJcbiAgICB9KTtcclxuICB9XHJcbn07XHJcbiJdLCJuYW1lcyI6WyJpbml0U3FsSnMiLCJkYiIsInNxbFByb21pc2UiLCJpbml0RGIiLCJsb2NhdGVGaWxlIiwiZmlsZSIsIlNRTCIsIkRhdGFiYXNlIiwic2VsZiIsIm9ubWVzc2FnZSIsImUiLCJjb2RlIiwicmVxdWVzdElkIiwiZGF0YSIsIkVycm9yIiwic3RlcHMiLCJzdGF0ZW1lbnRzIiwic3BsaXQiLCJtYXAiLCJzIiwidHJpbSIsImZpbHRlciIsIkJvb2xlYW4iLCJzdG10IiwicnVuIiwicXVlcnlQbGFuIiwidW5kZWZpbmVkIiwibG93ZXJTdG10IiwidG9Mb3dlckNhc2UiLCJzdGFydHNXaXRoIiwicGxhblJlc3VsdCIsImV4ZWMiLCJsZW5ndGgiLCJ2YWx1ZXMiLCJyb3ciLCJqb2luIiwidGFibGVzIiwic2NoZW1hIiwiaW5kZXhlcyIsIm1hc3RlclJlc3VsdCIsIm5hbWUiLCJzcWwiLCJ0eXBlIiwidGJsX25hbWUiLCJkYXRhUmVzdWx0IiwiY29sdW1ucyIsInJvd3MiLCJ2YWxBcnJheSIsInJvd09iaiIsImZvckVhY2giLCJjb2wiLCJpIiwicHVzaCIsInN0YXRlbWVudCIsInBvc3RNZXNzYWdlIiwib2siLCJlcnJvciIsImVyciIsIm1lc3NhZ2UiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./src/database/workers/sql.worker.ts\n");

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
/******/ 			__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
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
/******/ 	// the startup function
/******/ 	__webpack_require__.x = () => {
/******/ 		// Load entry module and return exports
/******/ 		// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 		var __webpack_exports__ = __webpack_require__.O(undefined, ["vendor-chunks/sql.js"], () => (__webpack_require__("(ssr)/./src/database/workers/sql.worker.ts")))
/******/ 		__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 		return __webpack_exports__;
/******/ 	};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks and sibling chunks for the entrypoint
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/require chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded chunks
/******/ 		// "1" means "loaded", otherwise not loaded yet
/******/ 		var installedChunks = {
/******/ 			"node_crypto-node_fs-_ssr_src_database_workers_sql_worker_ts": 1
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.O.require = (chunkId) => (installedChunks[chunkId]);
/******/ 		
/******/ 		var installChunk = (chunk) => {
/******/ 			var moreModules = chunk.modules, chunkIds = chunk.ids, runtime = chunk.runtime;
/******/ 			for(var moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) runtime(__webpack_require__);
/******/ 			for(var i = 0; i < chunkIds.length; i++)
/******/ 				installedChunks[chunkIds[i]] = 1;
/******/ 			__webpack_require__.O();
/******/ 		};
/******/ 		
/******/ 		// require() chunk loading for javascript
/******/ 		__webpack_require__.f.require = (chunkId, promises) => {
/******/ 			// "1" is the signal for "already loaded"
/******/ 			if(!installedChunks[chunkId]) {
/******/ 				if(true) { // all chunks have JS
/******/ 					installChunk(require("./" + __webpack_require__.u(chunkId)));
/******/ 				} else installedChunks[chunkId] = 1;
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		// no external install chunk
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/startup chunk dependencies */
/******/ 	(() => {
/******/ 		var next = __webpack_require__.x;
/******/ 		__webpack_require__.x = () => {
/******/ 			__webpack_require__.e("vendor-chunks/sql.js");
/******/ 			return next();
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// run startup
/******/ 	var __webpack_exports__ = __webpack_require__.x();
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;