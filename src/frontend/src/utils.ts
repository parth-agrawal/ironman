import {
  CanvasContent,
  Node as AppNode,
  Edge as AppEdge,
  Direction,
} from "./types";
import { Node as RFNode, Edge as RFEdge, MarkerType } from "reactflow";

export const transformFromReactFlowObjects = (
  nodes: RFNode[],
  edges: RFEdge[]
): CanvasContent => {
  const appNodes: AppNode[] = nodes.map((node) => {
    // React Flow updates width/height on the root of the node object after resize
    const width = node.width ? Math.round(node.width) : node.data.width;
    const height = node.height ? Math.round(node.height) : node.data.height;

    return {
      id: node.id,
      type: node.data.type, // Restore original type from data
      x: Math.round(node.position.x),
      y: Math.round(node.position.y),
      width,
      height,
      color: node.data.color,
      text: node.data.text,
      file: node.data.file,
      label: node.data.label,
      // Add other fields like 'url' or 'subpath' if they exist in your data
    };
  });

  const appEdges: AppEdge[] = edges.map((edge) => ({
    id: edge.id,
    fromNode: edge.source,
    fromSide: (edge.sourceHandle as Direction) || undefined,
    fromEnd: edge.markerStart ? "arrow" : "none",
    toNode: edge.target,
    toSide: (edge.targetHandle as Direction) || undefined,
    toEnd: edge.markerEnd ? "arrow" : "none", // Default is arrow, so check for presence
    color: (edge.style?.stroke as string) || undefined,
    label: (edge.label as string) || undefined,
  }));

  return { nodes: appNodes, edges: appEdges };
};

export const transformToReactFlowObjects = (
  content: CanvasContent
): { nodes: RFNode[]; edges: RFEdge[] } => {
  const rfNodes: RFNode[] = content.nodes.map((node: AppNode) => ({
    id: node.id,
    type: "customNode", // We'll define this custom node type
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
    markerEnd:
      edge.toEnd === "arrow"
        ? { type: MarkerType.ArrowClosed, color: "lightgray" }
        : undefined,
    markerStart:
      edge.fromEnd === "arrow"
        ? { type: MarkerType.ArrowClosed, color: "lightgray" }
        : undefined,
    // For styling, you can use 'style' or 'className'
    // React Flow has default edge types like 'default', 'smoothstep', 'step', 'straight'
    // Your createPath is somewhat like 'smoothstep' but with specific straight line starts.
    // For simplicity, start with 'smoothstep'. If the curve is critical, you might need a custom edge.
    type: "smoothstep",
    style: { stroke: edge.color || "lightgray", strokeWidth: 2 },
  }));

  return { nodes: rfNodes, edges: rfEdges };
};
