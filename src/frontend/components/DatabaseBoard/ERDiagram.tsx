import React, { useMemo, useEffect } from "react";
import { ReactFlow, Background, Controls, Node, Edge, MarkerType, useReactFlow, useNodesState, useEdgesState } from "@xyflow/react";
import { Parser } from "@dbml/core";
import { TableNode } from "./TableNode";

const nodeTypes = {
  tableNode: TableNode,
};

function FitViewOnUpdate({ nodes }: { nodes: Node[] }) {
  const { fitView } = useReactFlow();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      fitView({ duration: 500, padding: 0.2 });
    }, 50);
    return () => clearTimeout(timer);
  }, [nodes, fitView]);

  return null;
}

interface ERDiagramProps {
  code: string;
}

export function ERDiagram({ code }: ERDiagramProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    if (!code) return;

    try {
      // Clean up common SQLite syntax that DBML might choke on if strictly MySQL
      // Since our snippets are general SQL, we parse as mysql which is quite permissive
      const database = Parser.parse(code, "mysql");
      const normalized = database.normalize();

      const newNodes: Node[] = [];
      const newEdges: Edge[] = [];

      const tables = normalized.tables || {};
      const fields = normalized.fields || {};
      const refs = normalized.refs || {};
      const endpoints = normalized.endpoints || {};

      let index = 0;
      const columns = 3;

      for (const tableId in tables) {
        const table = tables[tableId];
        const tableFields = table.fieldIds.map((fId: any) => fields[fId]);

        const mappedTable = {
          name: table.name,
          columns: tableFields.map((f: any) => f.name),
          rows: [], // No rows in static schema
          indexes: [],
        };

        const x = 50 + (index % columns) * 350;
        const y = 50 + Math.floor(index / columns) * 300;

        newNodes.push({
          id: `table-${table.name}`,
          type: "tableNode",
          position: { x, y },
          data: { table: mappedTable, isTarget: false },
        });

        index++;
      }

      for (const refId in refs) {
        const ref = refs[refId];
        const epIds = ref.endpointIds;
        if (epIds.length === 2) {
          const sourceEp = endpoints[epIds[0]];
          const targetEp = endpoints[epIds[1]];

          const sourceField = fields[sourceEp.fieldIds[0]];
          const targetField = fields[targetEp.fieldIds[0]];

          const sourceTable = tables[sourceField.tableId];
          const targetTable = tables[targetField.tableId];

          if (sourceTable && targetTable) {
            newEdges.push({
              id: `edge-fk-${sourceTable.name}-${sourceField.name}-to-${targetTable.name}-${targetField.name}`,
              source: `table-${sourceTable.name}`,
              target: `table-${targetTable.name}`,
              animated: false,
              style: { stroke: '#3498db', strokeWidth: 2, strokeDasharray: '5,5' },
              label: `${sourceField.name} → ${targetField.name}`,
              labelStyle: { fill: '#3498db', fontSize: 10, fontWeight: 600 },
              labelBgStyle: { fill: '#0a0f1a', fillOpacity: 0.8 },
              markerEnd: { type: MarkerType.ArrowClosed, color: '#3498db' },
            });
          }
        }
      }

      setNodes(newNodes);
      setEdges(newEdges);
      setError(null);
    } catch (err: any) {
      console.warn("DBML parsing failed for current code:", err);
      setError(err.message || "Failed to parse SQL schema. Make sure it contains valid CREATE TABLE statements.");
    }
  }, [code, setNodes, setEdges]);

  if (error && nodes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white/30 p-8">
        <p className="font-semibold text-white/50">Schema Parser Error</p>
        <p className="text-xs mt-2 text-center leading-relaxed">
          {error}
        </p>
      </div>
    );
  }

  if (nodes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white/30 p-8">
        <p className="font-semibold text-white/50">No Schema Found</p>
        <p className="text-xs mt-2 text-center leading-relaxed">
          Write some CREATE TABLE statements to see the ER diagram.
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
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={16} size={1} color="#ffffff10" />
        <Controls className="opacity-50 hover:opacity-100" />
        <FitViewOnUpdate nodes={nodes} />
      </ReactFlow>
    </div>
  );
}
