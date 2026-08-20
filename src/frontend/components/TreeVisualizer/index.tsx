import React, { useMemo } from "react";
import { ExecutionStep } from "@/frontend/types";
import { ReactFlow, Background, BackgroundVariant, Node, Edge, Position } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { TreePine } from "lucide-react";

interface TreeVisualizerProps {
  step: ExecutionStep | null;
  uiLanguage?: "en" | "hi";
  prefersReducedMotion?: boolean;
}

// Extract a tree from the heap
function extractTree(heap: Record<string, any>) {
  // Find potential root nodes: nodes that have left/right/next but are NOT referenced by any other node's left/right/next
  const nodeIds = new Set<string>();
  const childIds = new Set<string>();
  
  for (const [id, obj] of Object.entries(heap)) {
    if (obj && typeof obj === 'object') {
      const hasTreeProps = ('left' in obj || 'right' in obj || 'next' in obj || 'val' in obj || 'value' in obj || 'data' in obj);
      if (hasTreeProps) {
        nodeIds.add(id);
        if (obj.left) childIds.add(obj.left);
        if (obj.right) childIds.add(obj.right);
        if (obj.next) childIds.add(obj.next);
      }
    }
  }

  // Find a root
  let rootId = [...nodeIds].find(id => !childIds.has(id));
  
  if (!rootId && nodeIds.size > 0) {
    // Fallback if there's a cycle or something weird
    rootId = [...nodeIds][0];
  }

  if (!rootId) return null;

  return { rootId, nodeIds };
}

// Simple Custom Node for Tree
function TreeNodeComponent({ data }: { data: { label: string, isComparing: boolean, isFound: boolean } }) {
  return (
    <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 shadow-lg transition-colors duration-300 ${
      data.isFound ? "bg-cyan-500/20 border-cyan-400 text-cyan-300" :
      data.isComparing ? "bg-amber-500/20 border-amber-400 text-amber-300" :
      "bg-slate-800 border-accentBlue text-white"
    }`}>
      <span className="font-mono text-sm font-bold">{data.label}</span>
    </div>
  );
}

const nodeTypes = {
  treeNode: TreeNodeComponent
};

export function TreeVisualizer({ step, uiLanguage = "en", prefersReducedMotion = false }: TreeVisualizerProps) {
  const { nodes, edges } = useMemo(() => {
    if (!step) return { nodes: [], edges: [] };

    const treeInfo = extractTree(step.heap);
    if (!treeInfo) return { nodes: [], edges: [] };

    const { rootId } = treeInfo;
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];

    // Parse explanation to find active nodes (comparing/found)
    const text = ((step.explanation?.[uiLanguage] || step.explanation?.en || "") + " " + (step.systemLog || "")).toLowerCase();
    
    let inorderIndex = 0;
    
    // Recursive traversal to build nodes and edges
    function traverse(nodeId: string, depth: number) {
      const obj = step!.heap[nodeId as any];
      if (!obj) return;
      
      const objAny = obj as any;
      const leftId = objAny.left;
      const rightId = objAny.right;
      const nextId = objAny.next;

      // Inorder left
      if (leftId) {
        traverse(leftId, depth + 1);
      }
      
      // Process current node
      const currentX = inorderIndex * 80;
      inorderIndex++;
      
      const val = objAny.val !== undefined ? objAny.val : (objAny.value !== undefined ? objAny.value : objAny.data);
      const strVal = String(val);
      
      // Basic heuristics for active states
      const isComparing = text.includes(strVal) && (text.includes("compar") || text.includes("check"));
      const isFound = text.includes(strVal) && text.includes("found");

      newNodes.push({
        id: nodeId,
        type: "treeNode",
        position: { x: currentX, y: depth * 100 },
        data: { label: strVal, isComparing, isFound },
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
      });

      if (leftId) {
        newEdges.push({
          id: `e-${nodeId}-${leftId}`,
          source: nodeId,
          target: leftId,
          type: "smoothstep",
          animated: !prefersReducedMotion,
          style: { stroke: "rgba(255,255,255,0.2)", strokeWidth: 2 }
        });
      }
      if (rightId) {
        newEdges.push({
          id: `e-${nodeId}-${rightId}`,
          source: nodeId,
          target: rightId,
          type: "smoothstep",
          animated: !prefersReducedMotion,
          style: { stroke: "rgba(255,255,255,0.2)", strokeWidth: 2 }
        });
      }
      if (nextId) {
         newEdges.push({
          id: `e-${nodeId}-${nextId}`,
          source: nodeId,
          target: nextId,
          type: "smoothstep",
          animated: !prefersReducedMotion,
          style: { stroke: "rgba(255,255,255,0.2)", strokeWidth: 2 }
        });
      }

      // Inorder right
      if (rightId) {
        traverse(rightId, depth + 1);
      } else if (nextId) {
        // Linked list acts like a right child
        traverse(nextId, depth + 1);
      }
    }

    traverse(rootId, 0);

    return { nodes: newNodes, edges: newEdges };
  }, [step, uiLanguage, prefersReducedMotion]);

  if (nodes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white/30 p-8">
        <TreePine size={48} className="mb-4 opacity-20" />
        <p className="font-semibold text-white/50">No Tree/Graph Detected</p>
        <p className="text-xs mt-2 max-w-xs text-center leading-relaxed">
          Initialize objects with <code className="text-accentBlue">val, left, right</code> or <code className="text-accentBlue">next</code> properties to see the tree visualizer in action.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
        minZoom={0.5}
        maxZoom={2}
        className="bg-transparent"
      >
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} color="rgba(255,255,255,0.05)" />
      </ReactFlow>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 flex flex-wrap gap-3 text-[10px] bg-black/40 backdrop-blur p-2 rounded-lg border border-white/5">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full border border-accentBlue bg-slate-800" /> Default</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> Comparing</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-400" /> Found</span>
      </div>
    </div>
  );
}
