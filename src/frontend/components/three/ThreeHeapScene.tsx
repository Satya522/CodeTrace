import React, { useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Html, Line } from "@react-three/drei";
import * as THREE from "three";
import type { HeapObject } from "@/frontend/types";

interface NodeData {
  id: string;
  position: THREE.Vector3;
  label: string;
}

interface EdgeData {
  id: string;
  start: THREE.Vector3;
  end: THREE.Vector3;
}

function GraphScene({ heap }: { heap: HeapObject[] }) {
  // Simple force-directed layout approximation or grid layout for the heap objects
  const { nodes, edges } = useMemo(() => {
    const nodes: NodeData[] = [];
    const edges: EdgeData[] = [];
    
    // Layout in a grid for simplicity
    const cols = Math.ceil(Math.sqrt(heap.length));
    const spacing = 3;
    
    const nodeMap = new Map<string, THREE.Vector3>();

    heap.forEach((obj, i) => {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const x = (col - cols / 2) * spacing;
      const y = (row - cols / 2) * -spacing;
      const z = (Math.random() - 0.5) * spacing;
      const pos = new THREE.Vector3(x, y, z);
      nodeMap.set(obj.id, pos);
      nodes.push({ id: obj.id, position: pos, label: obj.structureKind });
    });

    // We can infer pointers from heap if they contain string references to other heap IDs, but 
    // for this quick visualization we will just draw them as floating interconnected spheres
    
    return { nodes, edges };
  }, [heap]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} />
      
      {nodes.map((node) => (
        <Sphere args={[0.5, 32, 32]} position={node.position} key={node.id}>
          <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.2} wireframe />
          <Html distanceFactor={10} position={[0, -0.8, 0]} center>
            <div className="bg-black/60 text-white/90 px-2 py-1 rounded text-xs border border-white/20 backdrop-blur whitespace-nowrap font-mono">
              {node.label}
              <br/>
              <span className="text-white/40 text-[10px]">{node.id}</span>
            </div>
          </Html>
        </Sphere>
      ))}
      <OrbitControls autoRotate autoRotateSpeed={1} />
    </>
  );
}

export default function ThreeHeapScene({ heap }: { heap: HeapObject[] }) {
  return (
    <div className="w-full h-full rounded-xl overflow-hidden bg-gradient-to-b from-black/80 to-[#050505] border border-white/10 shadow-inner">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <GraphScene heap={heap} />
      </Canvas>
    </div>
  );
}
