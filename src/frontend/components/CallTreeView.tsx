"use client";

import React from "react";
import type { ExecutionStep, StackFrame } from "@/frontend/types";
import { GitMerge, Play, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

interface CallTreeViewProps {
  step: ExecutionStep | null;
  allSteps: ExecutionStep[];
  currentIndex: number;
}

interface TreeNode {
  frame: StackFrame;
  isActive: boolean;
  children: TreeNode[];
}

export function CallTreeView({ step, allSteps, currentIndex }: CallTreeViewProps) {
  if (!step || !('stack' in step) || !step.stack || step.stack.length === 0) {
    return (
      <div className="flex h-full flex-col p-4 text-sm text-white/40 items-center justify-center">
        No active calls.
      </div>
    );
  }

  // 1. Reconstruct historical tree
  const activeFrameIds = new Set(step.stack.map(f => f.id));
  const nodeMap = new Map<string, TreeNode>();
  const roots: TreeNode[] = [];

  // Replay history up to current index to find all calls that have occurred
  for (let i = 0; i <= currentIndex; i++) {
    const historicalStep = allSteps[i];
    if (!historicalStep) continue;

    for (const frame of historicalStep.stack) {
      if (!nodeMap.has(frame.id)) {
        nodeMap.set(frame.id, {
          frame,
          isActive: false, // will be updated below
          children: []
        });
      } else {
        // Update frame data (e.g. variables) to latest seen
        const node = nodeMap.get(frame.id)!;
        node.frame = frame;
      }
    }
  }

  // 2. Build tree and set active status
  for (const [id, node] of nodeMap.entries()) {
    node.isActive = activeFrameIds.has(id);
    const parentId = node.frame.parentCallId;

    if (parentId && nodeMap.has(parentId)) {
      const parent = nodeMap.get(parentId)!;
      if (!parent.children.includes(node)) {
        parent.children.push(node);
      }
    } else {
      roots.push(node);
    }
  }

  // Recursive render component
  const RenderNode = ({ node, depth }: { node: TreeNode; depth: number }) => {
    return (
      <motion.div 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: depth * 0.05 }}
        className="flex flex-col"
      >
        <div
          className={`flex items-center gap-2 rounded-lg p-2 font-mono text-xs my-0.5 border shadow-sm transition-all duration-300 ${
            node.isActive
              ? "bg-accentBlue/20 text-accentBlue border-accentBlue/50 shadow-[0_0_10px_rgba(59,130,246,0.2)]"
              : "bg-white/[0.02] text-white/40 border-white/10 opacity-60 hover:opacity-100 hover:bg-white/5"
          }`}
          style={{ marginLeft: `${depth * 16}px` }}
        >
          {/* Depth indicator line */}
          {depth > 0 && (
            <div className="w-4 border-b border-l border-white/20 h-4 -mt-4 rounded-bl-sm absolute" style={{ marginLeft: "-16px" }}></div>
          )}
          
          {node.isActive ? <Play size={12} className="shrink-0" /> : <CheckCircle2 size={12} className="shrink-0" />}
          
          <span className="font-semibold">{node.frame.name}()</span>
          
          {node.frame.variables.length > 0 && (
            <span className="text-[10px] opacity-60 truncate max-w-[150px]">
              ({node.frame.variables.map(v => v.name).join(", ")})
            </span>
          )}

          {!node.isActive && node.frame.returnValue !== undefined && (
            <span className="ml-auto text-accentGreen text-xs font-bold shrink-0">
              → {node.frame.returnValue}
            </span>
          )}
        </div>
        
        {/* Children */}
        {node.children.length > 0 && (
          <div className="flex flex-col relative">
            <div className="absolute left-[8px] top-0 bottom-4 w-px bg-white/10" style={{ marginLeft: `${depth * 16}px` }}></div>
            {node.children.map(child => (
              <RenderNode key={child.frame.id} node={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="flex h-full flex-col p-4">
      <header className="mb-3 flex items-center gap-2 text-sm font-semibold text-white/90">
        <GitMerge size={15} className="text-accentBlue" /> Recursion / Call Tree
      </header>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto pr-2 custom-scrollbar">
        {roots.map(root => (
          <RenderNode key={root.frame.id} node={root} depth={0} />
        ))}
      </div>
    </div>
  );
}
