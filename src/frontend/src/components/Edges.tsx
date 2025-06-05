import { useEffect } from 'react'
import { createPath } from '../lib/createPath'
import { getAnchorPoint } from '../lib/getAnchorPoint'
import { CanvasContent } from '../types'

interface EdgesProps {
  scale: number
  content: CanvasContent
  translateX: number
  translateY: number
}

// This component could be more React OR using more d3 helpers but it sorta works
export function Edges({ scale, content, translateX, translateY }: EdgesProps) {
  useEffect(() => {
    const drawEdges = () => {
      const svgContainer = document.getElementById('edge-paths')
      if (svgContainer) svgContainer.replaceChildren()

      content?.edges &&
        content.edges.forEach((edge) => {
          const fromNode = document.getElementById(edge.fromNode)
          const toNode = document.getElementById(edge.toNode)

          if (fromNode && toNode) {
            const fromPoint = getAnchorPoint(fromNode, edge.fromSide)
            const toPoint = getAnchorPoint(toNode, edge.toSide)

            // handle translate
            fromPoint.x += translateX
            fromPoint.y += translateY
            toPoint.x += translateX
            toPoint.y += translateY

            const curveTightness = 0.75
            const straightLineLength = 30 * scale
            const d = createPath(
              fromPoint,
              toPoint,
              curveTightness,
              straightLineLength,
              edge.fromSide,
              edge.toSide,
            )

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')

            path.setAttribute('d', d)
            path.setAttribute('stroke', edge.color || '#000000')
            path.setAttribute('fill', 'none')

            if (
              edge.fromSide === 'bottom' ||
              edge.fromSide === 'top' ||
              edge.toSide === 'bottom' ||
              edge.toSide === 'top'
            ) {
              if (edge.toEnd !== 'none') {
                path.setAttribute('marker-end', `url(#arrowhead-${edge.toSide})`)
              }
              if (edge.fromEnd === 'arrow') {
                path.setAttribute('marker-start', `url(#arrowhead-${edge.fromSide})`)
              }
            } else if (
              edge.fromSide === 'left' ||
              edge.fromSide === 'right' ||
              edge.toSide === 'left' ||
              edge.toSide === 'right'
            ) {
              if (edge.toEnd !== 'none') {
                path.setAttribute('marker-end', `url(#arrowhead-${edge.toSide})`)
              }
              if (edge.fromEnd === 'arrow') {
                path.setAttribute('marker-start', `url(#arrowhead-${edge.fromSide})`)
              }
            }

            svgContainer.appendChild(path)
          }
        })
    }

    drawEdges()
  }, [content.edges, scale, translateX, translateY])

  return (
    <svg id="canvas-edges">
      <defs>
        <marker
          id="arrowhead-right"
          markerWidth="8"
          markerHeight="6"
          refX="8"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
          className="arrowhead"
        >
          <polygon points="0 0, 8 3, 0 6" fill="currentColor" />
        </marker>
        <marker
          id="arrowhead-left"
          markerWidth="8"
          markerHeight="6"
          refX="0"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
          className="arrowhead"
        >
          <polygon points="8 0, 0 3, 8 6" fill="currentColor" />
        </marker>
        <marker
          id="arrowhead-bottom"
          markerWidth="6"
          markerHeight="8"
          refX="3"
          refY="8"
          orient="auto"
          markerUnits="strokeWidth"
          className="arrowhead"
        >
          <polygon points="0 0, 3 8, 6 0" fill="currentColor" />
        </marker>
        <marker
          id="arrowhead-top"
          markerWidth="6"
          markerHeight="8"
          refX="3"
          refY="0"
          orient="auto"
          markerUnits="strokeWidth"
          className="arrowhead"
        >
          <polygon points="0 8, 3 0, 6 8" fill="currentColor" />
        </marker>
      </defs>
      <g id="edge-paths" style={{ strokeWidth: 2 * scale }}></g>
    </svg>
  )
}
