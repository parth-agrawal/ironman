import Markdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import { colors } from '../types'
import { NodeProps, Handle, Position } from 'reactflow'

// Your original Node interface from types.ts
interface OriginalNodeData {
  label?: string
  file?: string
  width: number
  height: number
  color?: string
  text?: string
  type: string // Original type: 'group', 'text', etc.
}

export function CustomCanvasNode({ data, id }: NodeProps<OriginalNodeData>) {
  // 'data' prop now contains what you passed in the transformation step
  const node = data

  // Define handles for edges. Their 'id' should match sourceHandle/targetHandle in edges.
  // You might need to adjust styling/positioning of these handles.
  const handleStyle = { width: 8, height: 8, background: '#555' }

  return (
    <>
      <Handle type="target" position={Position.Top} id="top" style={handleStyle} />
      <Handle type="source" position={Position.Top} id="top" style={handleStyle} />
      <Handle type="target" position={Position.Right} id="right" style={handleStyle} />
      <Handle type="source" position={Position.Right} id="right" style={handleStyle} />
      <Handle type="target" position={Position.Bottom} id="bottom" style={handleStyle} />
      <Handle type="source" position={Position.Bottom} id="bottom" style={handleStyle} />
      <Handle type="target" position={Position.Left} id="left" style={handleStyle} />
      <Handle type="source" position={Position.Left} id="left" style={handleStyle} />

      <div
        id={id} // Use the id from NodeProps for React Flow internals
        className="node" // Keep your existing class for styling if desired
        style={{
          // React Flow handles positioning. Width and height come from node.style in transformation or set here.
          // width: `${node.width}px`, // Handled by 'style' prop on RFNode
          // height: `${node.height}px`,// Handled by 'style' prop on RFNode
          border: `2px solid ${colors[node.color as keyof typeof colors] || '#EBEDE9'}`, // Keep scale factor small or remove
          backgroundColor: `${
            node.color ? colors[node.color as keyof typeof colors] + '20' : node.type !== 'group' ? '#ffffff90' : '#ffffff60'
          }`,
          fontSize: `14px`, // Scale is handled by RF zoom
          lineHeight: `18px`, // Scale is handled by RF zoom
          // Remove transform, left, top - React Flow manages this.
          // Ensure the outer div of the custom node component itself respects width/height from node.style
        }}
      >
        {node.type === 'group' && (
          <p
            className="node-label"
            style={{
              // position: 'absolute', // Review absolute positioning, might conflict
              top: Math.min(-40, 40), // Remove scale
              fontSize: `16px`, // Remove scale
            }}
          >
            {node.label}
          </p>
        )}
        <div className="node-content">
          {node.type !== 'group' && <div className="px-4">{node.label}</div>}
          <Markdown
            rehypePlugins={[rehypeHighlight, rehypeRaw]}
            remarkPlugins={[remarkGfm, remarkFrontmatter]}
            className="markdown"
          >
            {node.file ? node.file : ''}
          </Markdown>
        </div>
      </div>
    </>
  )
}
