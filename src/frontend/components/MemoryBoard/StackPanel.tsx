import React from "react";
import type { StackFrame } from "@/frontend/types";
import { Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { slideUpVariant } from "@/frontend/lib/motion/variants";

export const StackPanel = React.memo(({ frames }: { frames: StackFrame[] }) => {
  const framesBottomUp = [...frames].reverse();

  return (
    <section className="flex min-h-0 flex-col rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg backdrop-blur-xl">
      <header className="mb-3 flex items-center gap-2 text-sm font-semibold text-white/90">
        <Layers size={15} className="text-accentBlue" /> Call Stack
      </header>
      <div className="flex min-h-0 flex-1 flex-col-reverse gap-2 overflow-y-auto pr-1">
        {framesBottomUp.length === 0 && (
          <div className="text-xs text-white/30">No active frames.</div>
        )}
        <AnimatePresence mode="popLayout">
          {framesBottomUp.map((frame) => (
            <motion.div
              layout
              key={frame.id}
              variants={slideUpVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="rounded-lg border border-border bg-white/[0.03] p-2.5"
            >
              <div className="mb-1.5 font-mono text-xs font-semibold text-accentBlue">
                {frame.name}()
              </div>
              <div className="flex flex-wrap gap-1.5">
                {frame.variables.length === 0 && (
                  <span className="text-[11px] text-white/30">no locals yet</span>
                )}
                {frame.variables.map((v) => (
                  <div
                    key={v.name}
                    id={`var-${frame.id}-${v.name}`}
                    className="rounded-md border border-white/10 bg-black/40 px-2 py-1 font-mono text-[11px] shadow-inner"
                  >
                    <span className="text-white/50">{v.name}</span>
                    <span className="text-white/20"> : </span>
                    <span className={v.isReference ? "text-accentYellow" : "text-white/90"}>
                      {v.value}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
});
StackPanel.displayName = "StackPanel";
