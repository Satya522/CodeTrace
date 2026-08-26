"use client";

import { useEffect, useState } from "react";
import { MemoryBoard } from "@/frontend/components/MemoryBoard";
import { DatabaseBoard } from "@/frontend/components/DatabaseBoard";
import { PointerArrows } from "@/frontend/components/PointerArrows";
import { useVisualizerEngine } from "@/frontend/hooks/useVisualizerEngine";
import { runPythonTrace } from "@/frontend/engines/pythonEngine";
import { runJsTrace } from "@/frontend/engines/jsEngine";
import { runTraceEngine } from "@/backend/services/traceEngine";
import { executeSql } from "@/database/engines/sqlEngine";
import { executeNoSql } from "@/database/engines/nosqlEngine";
import type { CodeExample } from "@/frontend/lib";
import type { ExecutionStep, QueryStep, NoSQLStep } from "@/frontend/types";
import { Loader2 } from "lucide-react";

export function EmbedVisualizer({ example }: { example: CodeExample }) {
  const engine = useVisualizerEngine();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const lang = example.language;
        let trace;
        if (lang === "sql") {
          trace = await executeSql(example.code);
        } else if (lang === "nosql") {
          trace = executeNoSql(example.code);
        } else if (lang === "javascript") {
          trace = await runJsTrace(example.code);
        } else if (lang === "python") {
          trace = await runPythonTrace(example.code);
        } else {
          trace = await runTraceEngine(example.code, lang);
        }
        
        if (trace.error) setErrorMsg(trace.error);
        engine.setSteps(trace.steps as any);
        engine.play();
      } catch (err: any) {
        setErrorMsg(err?.message ?? "Failed to run code.");
      } finally {
        setIsLoading(false);
      }
    }
    
    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [example]);

  if (isLoading) {
    return <div className="flex h-full items-center justify-center text-accentBlue"><Loader2 className="animate-spin" /></div>;
  }

  if (errorMsg) {
    return <div className="p-4 text-accentRed text-xs">{errorMsg}</div>;
  }

  const isDB = example.language === "sql" || example.language === "nosql";

  return (
    <div className="relative flex h-full flex-col gap-2 p-2">
      <div className="flex-1 min-h-0 relative">
        {isDB ? (
          <DatabaseBoard 
            sqlStep={engine.currentStep && 'affectedTables' in engine.currentStep ? (engine.currentStep as QueryStep) : null}
            nosqlStep={engine.currentStep && 'collections' in engine.currentStep ? (engine.currentStep as NoSQLStep) : null}
            prevSqlStep={engine.currentIndex > 0 && 'affectedTables' in engine.steps[engine.currentIndex - 1] ? (engine.steps[engine.currentIndex - 1] as QueryStep) : null}
            prevNosqlStep={engine.currentIndex > 0 && 'collections' in engine.steps[engine.currentIndex - 1] ? (engine.steps[engine.currentIndex - 1] as NoSQLStep) : null}
          />
        ) : (
          <MemoryBoard step={engine.currentStep as ExecutionStep} />
        )}
      </div>
      {!isDB && <PointerArrows step={engine.currentStep as ExecutionStep} />}
    </div>
  );
}
