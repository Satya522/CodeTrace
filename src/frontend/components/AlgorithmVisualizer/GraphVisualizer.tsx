import React, { useMemo, useEffect } from "react";
import { ReactFlow, Background, BackgroundVariant, Node, Edge, MarkerType, useNodesState, useEdgesState } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { ExecutionStep } from "@/frontend/types";

interface GraphVisualizerProps {
  step: ExecutionStep | null;
  graphObj: any;
  colorblindMode?: boolean;
  prefersReducedMotion?: boolean;
}

// Custom Node for Graph
function GraphNodeComponent({ data }: { data: { label: string, isVisiting: boolean, isFound: boolean, colorblindMode?: boolean } }) {
  const bgColor = data.isFound 
    ? (data.colorblindMode ? "bg-teal-500/20 border-teal-400 text-teal-300" : "bg-cyan-500/20 border-cyan-400 text-cyan-300")
    : data.isVisiting 
    ? (data.colorblindMode ? "bg-blue-500/20 border-blue-400 text-blue-300" : "bg-amber-500/20 border-amber-400 text-amber-300")
    : "bg-slate-800 border-accentBlue text-white";

  return (
    <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 shadow-lg transition-colors duration-300 ${bgColor}`}>
      <span className="font-mono text-sm font-bold">{data.label}</span>
    </div>
  );
}

const nodeTypes = {
  graphNode: GraphNodeComponent,
};

function extractGraph(heap: any[], graphObj: any) {
  const nodes = new Set<string>();
  const edges: { source: string; target: string }[] = [];
  
  if (!graphObj || !graphObj.data) return { nodes: [], edges };

  try {
    const data = JSON.parse(graphObj.data.replace(/'/g, '"'));
    const adjListAddress = data.adjList?.__address;
    
    if (adjListAddress) {
      const adjListObj = heap.find(h => h.address === adjListAddress);
      if (adjListObj) {
        const adjList = JSON.parse(adjListObj.data.replace(/'/g, '"'));
        for (const [node, neighborsObj] of Object.entries(adjList)) {
          nodes.add(node);
          const nObj = neighborsObj as any;
          if (nObj && nObj.__address) {
            const arrObj = heap.find(h => h.address === nObj.__address);
            if (arrObj) {
              const arr = JSON.parse(arrObj.data.replace(/'/g, '"'));
              if (Array.isArray(arr)) {
                arr.forEach(neighbor => {
                  nodes.add(String(neighbor));
                  edges.push({ source: node, target: String(neighbor) });
                });
              }
            }
          }
        }
      }
    }
  } catch (e) {
    console.error("Failed to extract graph from heap", e);
  }

  return { nodes: Array.from(nodes), edges };
}

function parseExplanationForGraph(text: string) {
  const lower = text.toLowerCase();
  
  // Match "visiting node X" or "current: X"
  const visitingMatch = lower.match(/visiting\s+node\s+['"]?(\w+)['"]?/i) || lower.match(/current:\s+['"]?(\w+)['"]?/i);
  const visitingNode = visitingMatch ? visitingMatch[1] : null;

  // Match "checking edge X -> Y" or "neighbor Y of X"
  let checkingEdge = null;
  const edgeMatch = lower.match(/checking\s+edge\s+['"]?(\w+)['"]?\s*(?:->|to)\s*['"]?(\w+)['"]?/i);
  if (edgeMatch) {
    checkingEdge = { source: edgeMatch[1], target: edgeMatch[2] };
  } else {
    const neighborMatch = lower.match(/neighbor\s+['"]?(\w+)['"]?\s+of\s+['"]?(\w+)['"]?/i);
    if (neighborMatch) {
      checkingEdge = { source: neighborMatch[2], target: neighborMatch[1] };
    }
  }

  return { visitingNode, checkingEdge };
}

export function GraphVisualizer({ step, graphObj, colorblindMode = false, prefersReducedMotion = false }: GraphVisualizerProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // Compute graph structure
  const rawGraph = useMemo(() => {
    return extractGraph(step?.heap || [], graphObj);
  }, [step?.heap, graphObj]);

  // Compute active states
  const activeState = useMemo(() => {
    if (!step) return { visitingNode: null, checkingEdge: null };
    const text = (step.explanation?.en || "") + " " + (step.systemLog || "");
    return parseExplanationForGraph(text);
  }, [step]);

  // Generate React Flow nodes and edges with Circular Layout
  useEffect(() => {
    if (rawGraph.nodes.length === 0) return;

    const radius = Math.min(150 + rawGraph.nodes.length * 10, 250);
    const centerX = 300;
    const centerY = 250;
    const angleStep = (2 * Math.PI) / rawGraph.nodes.length;

    const flowNodes: Node[] = rawGraph.nodes.map((nodeId, i) => {
      const isVisiting = activeState.visitingNode?.toLowerCase() === nodeId.toLowerCase();
      // Simple hash to ensure consistent but deterministic initial positions if we wanted to
      const angle = i * angleStep - Math.PI / 2; // start from top
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      return {
        id: nodeId,
        type: 'graphNode',
        position: { x, y },
        data: { 
          label: nodeId, 
          isVisiting, 
          isFound: false, // Could expand this to show target found
          colorblindMode
        },
      };
    });

    const flowEdges: Edge[] = rawGraph.edges.map((edge, i) => {
      const isActive = activeState.checkingEdge?.source.toLowerCase() === edge.source.toLowerCase() &&
                       activeState.checkingEdge?.target.toLowerCase() === edge.target.toLowerCase();
                       
      return {
        id: `e-${edge.source}-${edge.target}-${i}`,
        source: edge.source,
        target: edge.target,
        animated: isActive && !prefersReducedMotion,
        style: { 
          stroke: isActive ? (colorblindMode ? "#60A5FA" : "#F59E0B") : "#475569", 
          strokeWidth: isActive ? 3 : 2 
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: isActive ? (colorblindMode ? "#60A5FA" : "#F59E0B") : "#475569",
        },
      };
    });

    setNodes(flowNodes);
    setEdges(flowEdges);
  }, [rawGraph, activeState, colorblindMode, prefersReducedMotion, setNodes, setEdges]);

  if (!rawGraph || rawGraph.nodes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white/30 p-8">
        <p className="font-semibold text-white/50">Invalid Graph Structure</p>
        <p className="text-xs mt-2 text-center leading-relaxed">
          The graph could not be parsed. Ensure your graph uses an <code>adjList</code>.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative" style={{ minHeight: "400px" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} color="#ffffff10" />
      </ReactFlow>
    </div>
  );
}
