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
  ReactFlowProvider, // Important for useReactFlow hook if needed elsewhere
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css'; // Import React Flow styles

import { CustomCanvasNode } from './components/CanvasNode'; // Your new custom node
import './index.css'; // Your existing CSS, will need review

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

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // The main div for React Flow needs a defined height.
  // Make sure its parent or itself has height: 100% or a fixed height.
  return (
    <div style={{ width: '100vw', height: '100vh' }}> {/* Adjust as needed */}
      <ReactFlowProvider>
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
      </ReactFlowProvider>
    </div>
  );
}
