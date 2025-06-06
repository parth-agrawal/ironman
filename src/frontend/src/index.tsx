import { useCallback } from 'react';
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

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleSave = useCallback(() => {
    const currentRFNodes = getNodes();
    const currentRFEdges = getEdges();

    const canvasState = transformFromReactFlowObjects(currentRFNodes, currentRFEdges);

    console.log('Ready to save:', canvasState);

    fetch('http://localhost:3010/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(canvasState) // Send the correctly formatted object
    })
    .then(res => {
        if (!res.ok) console.error("Save failed with status:", res.status);
    })
    .catch(err => console.error("Save failed:", err));
  }, [getNodes, getEdges]);

  // The main div for React Flow needs a defined height.
  // Make sure its parent or itself has height: 100% or a fixed height.
  return (
    <div 
    className='flex'
    style={{ width: '50vw', height: '100vh' }}> {/* Adjusted to 50% width */}
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

      <Button onClick={handleSave}>Save</Button>
    </div>
  );
}
