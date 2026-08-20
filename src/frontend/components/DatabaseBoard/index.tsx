"use client";

import React, { useMemo, useEffect } from "react";
import { ReactFlow, Background, Controls, Node, Edge, MarkerType, useReactFlow } from "@xyflow/react";
import '@xyflow/react/dist/style.css';

import { QueryStep, NoSQLStep } from "@/frontend/types";
import { TableNode } from "./TableNode";
import { QueryNode } from "./QueryNode";
import { CollectionNode } from "./CollectionNode";
import { DocumentNode } from "./DocumentNode";
import { Database, FolderTree } from "lucide-react";

const nodeTypes = {
  tableNode: TableNode,
  queryNode: QueryNode,
  collectionNode: CollectionNode,
  documentNode: DocumentNode,
};

function FitViewOnUpdate({ nodes }: { nodes: Node[] }) {
  const { fitView } = useReactFlow();
  
  useEffect(() => {
    // Wait for nodes to render their dimensions before fitting
    const timer = setTimeout(() => {
      fitView({ duration: 500, padding: 0.2 });
    }, 50);
    return () => clearTimeout(timer);
  }, [nodes, fitView]);

  return null;
}

interface Props {
  sqlStep?: QueryStep | null;
  nosqlStep?: NoSQLStep | null;
  prevSqlStep?: QueryStep | null;
  prevNosqlStep?: NoSQLStep | null;
}

export function DatabaseBoard({ sqlStep, nosqlStep, prevSqlStep, prevNosqlStep }: Props) {
  
  // Memoize graph building for SQL
  const { sqlNodes, sqlEdges } = useMemo(() => {
    if (!sqlStep) return { sqlNodes: [], sqlEdges: [] };

    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];

    // Add Query Node at the top
    newNodes.push({
      id: "query",
      type: "queryNode",
      position: { x: 250, y: 50 },
      data: { step: sqlStep },
    });

    // Add Table Nodes
    sqlStep.affectedTables.forEach((table, index) => {
      const prevTable = prevSqlStep?.affectedTables.find(t => t.name === table.name);
      
      const columns = 2;
      const x = 50 + (index % columns) * 350;
      const y = 300 + Math.floor(index / columns) * 300;

      newNodes.push({
        id: `table-${table.name}`,
        type: "tableNode",
        position: { x, y },
        data: { table, prevTable, isTarget: true },
      });

      // Edge from Query to Table
      newEdges.push({
        id: `edge-query-${table.name}`,
        source: "query",
        target: `table-${table.name}`,
        animated: true,
        style: { stroke: '#f1c40f', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#f1c40f' },
      });

      // Edges for Foreign Keys
      if (table.foreignKeys) {
        table.foreignKeys.forEach(fk => {
          newEdges.push({
            id: `edge-fk-${table.name}-${fk.column}-to-${fk.referencesTable}-${fk.referencesColumn}`,
            source: `table-${table.name}`,
            target: `table-${fk.referencesTable}`,
            animated: false,
            style: { stroke: '#3498db', strokeWidth: 2, strokeDasharray: '5,5' },
            label: `${fk.column} → ${fk.referencesColumn}`,
            labelStyle: { fill: '#3498db', fontSize: 10, fontWeight: 600 },
            labelBgStyle: { fill: '#0a0f1a', fillOpacity: 0.8 },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#3498db' },
          });
        });
      }
    });

    return { sqlNodes: newNodes, sqlEdges: newEdges };
  }, [sqlStep, prevSqlStep]);

  // Memoize graph building for NoSQL
  const { nosqlNodes, nosqlEdges } = useMemo(() => {
    if (!nosqlStep) return { nosqlNodes: [], nosqlEdges: [] };

    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];

    // Add Query Node at the top
    newNodes.push({
      id: "query",
      type: "queryNode",
      position: { x: 400, y: 50 },
      data: { step: nosqlStep },
    });

    nosqlStep.collections.forEach((collection, cIdx) => {
      const prevCollection = prevNosqlStep?.collections.find(c => c.name === collection.name);
      const prevDocs = prevCollection ? prevCollection.documents : [];
      
      const colX = 100 + (cIdx * 500);
      const colY = 250;

      // Add Collection Node
      newNodes.push({
        id: `col-${collection.name}`,
        type: "collectionNode",
        position: { x: colX, y: colY },
        data: { name: collection.name, isTarget: true, docCount: collection.documents.length },
      });

      // Edge from Query to Collection
      newEdges.push({
        id: `edge-query-col-${collection.name}`,
        source: "query",
        target: `col-${collection.name}`,
        animated: true,
        style: { stroke: 'rgba(255,255,255,0.4)', strokeWidth: 1.5 },
        markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(255,255,255,0.6)' },
      });

      // Add Document Nodes
      let docIndex = 0;
      
      // Handle existing and updated/inserted documents
      collection.documents.forEach((doc) => {
        let status: "none" | "inserted" | "updated" | "deleted" = "none";
        const prevDoc = prevDocs.find(d => d._id === doc._id);
        if (!prevDoc) status = "inserted";
        else if (JSON.stringify(prevDoc) !== JSON.stringify(doc)) status = "updated";

        const docX = colX - 100 + ((docIndex % 2) * 250);
        const docY = colY + 150 + (Math.floor(docIndex / 2) * 150);
        docIndex++;

        newNodes.push({
          id: `doc-${collection.name}-${doc._id}`,
          type: "documentNode",
          position: { x: docX, y: docY },
          data: { doc, status },
        });

        // Edge from Collection to Document
        let edgeColor = 'rgba(255, 255, 255, 0.4)';
        let markerColor = 'rgba(255, 255, 255, 0.6)';
        let edgeWidth = 1.5;
        
        if (status === "inserted") {
          edgeColor = 'rgba(46, 204, 113, 0.8)';
          markerColor = 'rgba(46, 204, 113, 1)';
          edgeWidth = 2;
        } else if (status === "updated") {
          edgeColor = 'rgba(241, 196, 15, 0.8)';
          markerColor = 'rgba(241, 196, 15, 1)';
          edgeWidth = 2;
        }

        newEdges.push({
          id: `edge-col-${collection.name}-doc-${doc._id}`,
          source: `col-${collection.name}`,
          target: `doc-${collection.name}-${doc._id}`,
          animated: status === "inserted" || status === "updated",
          style: { stroke: edgeColor, strokeWidth: edgeWidth },
          markerEnd: { type: MarkerType.ArrowClosed, color: markerColor },
        });
      });

      // Handle deleted documents (render them with strikethrough for one step)
      prevDocs.filter(pd => !collection.documents.some(cd => cd._id === pd._id)).forEach((deletedDoc) => {
        const docX = colX - 100 + ((docIndex % 2) * 250);
        const docY = colY + 150 + (Math.floor(docIndex / 2) * 150);
        docIndex++;

        newNodes.push({
          id: `doc-${collection.name}-${deletedDoc._id}-deleted`,
          type: "documentNode",
          position: { x: docX, y: docY },
          data: { doc: deletedDoc, status: "deleted" },
        });

        // Edge from Collection to Deleted Document
        newEdges.push({
          id: `edge-col-${collection.name}-doc-${deletedDoc._id}-deleted`,
          source: `col-${collection.name}`,
          target: `doc-${collection.name}-${deletedDoc._id}-deleted`,
          animated: false,
          style: { stroke: 'rgba(231,76,60,0.5)', strokeWidth: 1.5, strokeDasharray: '4,4' },
          markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(231,76,60,0.8)' },
        });
      });
    });

    return { nosqlNodes: newNodes, nosqlEdges: newEdges };
  }, [nosqlStep, prevNosqlStep]);

  if (!sqlStep && !nosqlStep) {
    return (
      <div className="flex h-full flex-col p-3 text-sm text-white/40 items-center justify-center">
        No database active.
      </div>
    );
  }

  const nodes = sqlStep ? sqlNodes : nosqlNodes;
  const edges = sqlStep ? sqlEdges : nosqlEdges;
  const icon = sqlStep ? <Database size={16} className="text-accentBlue" /> : <FolderTree size={16} className="text-accentGreen" />;
  const title = sqlStep ? "SQL Execution Map" : "NoSQL Document Flow";

  return (
    <div className="w-full h-full bg-[#050505] relative rounded-b-xl overflow-hidden">
      {/* Ambient glowing blobs in background */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accentBlue/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accentGreen/10 rounded-full blur-[120px] pointer-events-none" />

      <header className="absolute top-4 left-4 z-10 flex items-center gap-2 text-[11px] font-mono tracking-widest uppercase font-bold text-white/70 bg-[#09090b] px-4 py-2 rounded-lg border border-white/10 shadow-2xl">
        {icon} {title}
      </header>
      
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.2}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <FitViewOnUpdate nodes={nodes} />
        {/* Sleeker subtle dot background */}
        <Background color="#ffffff" gap={32} size={1} />
        <Controls 
          position="bottom-right" 
          className="flex flex-col gap-1 !bg-transparent !border-0 shadow-none !m-4 [&>button]:!bg-[#09090b] [&>button]:!border [&>button]:!border-white/10 [&>button]:!rounded-md [&>button]:!fill-white/50 hover:[&>button]:!bg-white/5 hover:[&>button]:!text-white [&>button]:transition-colors [&>button]:!shadow-xl" 
        />
      </ReactFlow>
    </div>
  );
}
