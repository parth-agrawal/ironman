import { Canvas } from '../index'
import { CanvasContent } from '../types'
import { useEffect, useState } from 'react';
import { Node as RFNode, Edge as RFEdge } from 'reactflow';
import { transformToReactFlowObjects } from '../utils';


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

  return (
    <>
      <Canvas initialNodes={rfNodes} initialEdges={rfEdges} />
    </>
  );
}
