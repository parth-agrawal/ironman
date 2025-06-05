import { Canvas } from '../index'
import { CanvasContent, Node as AppNode, Edge as AppEdge } from '../types'
import { useEffect, useState } from 'react';
import { Node as RFNode, Edge as RFEdge, MarkerType } from 'reactflow';

// Helper function to transform your data to React Flow format
const transformToReactFlowObjects = (content: CanvasContent): { nodes: RFNode[], edges: RFEdge[] } => {
  const rfNodes: RFNode[] = content.nodes.map((node: AppNode) => ({
    id: node.id,
    type: 'customNode', // We'll define this custom node type
    position: { x: node.x, y: node.y },
    data: {
      label: node.label,
      file: node.file,
      text: node.text,
      color: node.color,
      type: node.type, // Original type
      width: node.width,
      height: node.height,
    },
    // React Flow will use these dimensions for the node
    style: { width: node.width, height: node.height },
  }));

  const rfEdges: RFEdge[] = content.edges.map((edge: AppEdge) => ({
    id: edge.id,
    source: edge.fromNode,
    target: edge.toNode,
    sourceHandle: edge.fromSide, // Assumes your handles are named 'top', 'right', etc.
    targetHandle: edge.toSide,
    label: edge.label,
    markerEnd: edge.toEnd === 'arrow' ? { type: MarkerType.ArrowClosed, color: 'lightgray' } : undefined,
    markerStart: edge.fromEnd === 'arrow' ? { type: MarkerType.ArrowClosed, color: 'lightgray' } : undefined,
    // For styling, you can use 'style' or 'className'
    // React Flow has default edge types like 'default', 'smoothstep', 'step', 'straight'
    // Your createPath is somewhat like 'smoothstep' but with specific straight line starts.
    // For simplicity, start with 'smoothstep'. If the curve is critical, you might need a custom edge.
    type: 'smoothstep',
    style: { stroke: edge.color || 'lightgray', strokeWidth: 2 },
  }));

  return { nodes: rfNodes, edges: rfEdges };
};

export default function App() {
  const [rfNodes, setRfNodes] = useState<RFNode[]>([]);
  const [rfEdges, setRfEdges] = useState<RFEdge[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('http://localhost:3010/api/canvas-content');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json() as CanvasContent;
        const { nodes, edges } = transformToReactFlowObjects(data);
        setRfNodes(nodes);
        setRfEdges(edges);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (rfNodes.length === 0 && rfEdges.length === 0 && !loading) {
    return <div>No content available.</div>;
  }

  // Pass nodes and edges to your main Canvas component
  return <Canvas initialNodes={rfNodes} initialEdges={rfEdges} />;
}
