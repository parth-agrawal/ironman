import { useCallback, useState } from 'react';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css'; // Import React Flow styles

import { CustomCanvasNode } from './components/CanvasNode'; // Your new custom node
import './index.css'; // Your existing CSS, will need review
import { Button } from './components/ui/button';
import { transformFromReactFlowObjects } from './utils';
import Markdown from 'react-markdown';

interface CanvasProps {
  initialNodes: Node[];
  initialEdges: Edge[];
}

// Define your custom node types
const nodeTypes = {
  customNode: CustomCanvasNode,
};

export function Canvas({ initialNodes, initialEdges }: CanvasProps) {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { getNodes, getEdges } = useReactFlow();
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleSave = useCallback(async () => {
    setIsLoading(true);
    try {
      const currentRFNodes = getNodes();
      const currentRFEdges = getEdges();

      const canvasState = transformFromReactFlowObjects(currentRFNodes, currentRFEdges);

      console.log('Ready to save:', canvasState);

      const response = await fetch('http://localhost:3010/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(canvasState) // Send the correctly formatted object
      })

      if (response.ok) {
        const analysis = await response.text();
        console.log('Analysis:', analysis);
        setAnalysis(analysis);
      } else {
        console.error('Error saving:', response.status);
        setAnalysis('Error saving changes');
      }
    } catch (error) {
      console.error('Error saving:', error);
      setAnalysis('Error saving changes');
    } finally {
      setIsLoading(false);
    }
  }, [getNodes, getEdges]);

  // The main div for React Flow needs a defined height.
  // Make sure its parent or itself has height: 100% or a fixed height.
  return (
    <div 
    className='flex w-full'
    style={{ width: '100vw', height: '100vh' }}> {/* Adjusted to 50% width */}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView // Optional: Fits the view to the initial nodes
          // fitViewOptions={{ padding: 0.2 }}
        >
          <Controls />
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} /> {/* Replaces your custom grid */}
        </ReactFlow>

      <div className='flex flex-col gap-2 w-full max-w-[400px]'>

        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save'}
        </Button>
        <div>      
          <Markdown>{analysis}</Markdown>
        </div>
      </div>
    </div>
  );
}
