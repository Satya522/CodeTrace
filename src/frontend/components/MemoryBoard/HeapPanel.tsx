import React, { useState } from "react";
import type { HeapObject } from "@/frontend/types";
import { DataStructureRenderer } from "@/frontend/components/DataStructureRenderer";
import { Database, Box } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

const ThreeHeapScene = dynamic(() => import("@/frontend/components/three/ThreeHeapScene"), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center text-white/30 text-xs">Loading 3D Canvas...</div>
});

export const HeapPanel = React.memo(({ heap }: { heap: HeapObject[] }) => {
  const [is3D, setIs3D] = useState(false);

  return (
    <section className="flex min-h-0 flex-col rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg backdrop-blur-xl relative">
      <header className="mb-3 flex items-center justify-between gap-2 text-sm font-semibold text-white/90">
        <div className="flex items-center gap-2">
          <Database size={15} className="text-accentBlue" /> Heap Memory
        </div>
        {heap.length > 0 && (
          <button 
            onClick={() => setIs3D(!is3D)}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors ${
              is3D ? "bg-accentBlue/20 text-accentBlue" : "bg-white/5 text-white/50 hover:text-white/90 hover:bg-white/10"
            }`}
          >
            <Box size={12} /> {is3D ? "2D Mode" : "3D Mode"}
          </button>
        )}
      </header>
      
      {is3D && heap.length > 0 ? (
        <div className="flex-1 min-h-0 relative">
          <ThreeHeapScene heap={heap} />
        </div>
      ) : (
        <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-2 gap-3 overflow-y-auto overflow-x-hidden pr-2 content-start custom-scrollbar">
          {heap.length === 0 && (
            <div className="col-span-2 text-xs text-white/30 pt-4 text-center">No heap objects yet.</div>
          )}
          <AnimatePresence mode="popLayout">
            {heap.map((obj) => (
              <motion.div
                key={obj.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
              >
                <DataStructureRenderer obj={obj} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
});
HeapPanel.displayName = "HeapPanel";
