import { useEffect, useRef, useState } from "react"
import {
  BaseShape,
  DraggableBaseShape,
  DrawableShapes,
  NonDraggableBaseShape,
  clear,
  drawShapes,
  isMouseInShape,
} from "./canvas"
import { match, P } from "ts-pattern"

// shapes
const initialShapes: DraggableBaseShape[] = [
  {
    id: 1,
    x: 0,
    y: 0,
    width: 30,
    height: 30,
    color: "green",
    isDragging: false,
    isDraggable: true,
  },
]

const gridLines: NonDraggableBaseShape[] = [
  {
    id: 2,
    x: 100,
    y: 75,
    width: 1,
    height: 100,
    color: "red",
    isDraggable: false,
  },
  {
    id: 3,
    x: 150,
    y: 75,
    width: 1,
    height: 100,
    color: "red",
    isDraggable: false,
  },
  {
    id: 4,
    x: 75,
    y: 100,
    width: 100,
    height: 1,
    color: "red",
    isDraggable: false,
  },
  {
    id: 5,
    x: 75,
    y: 150,
    width: 100,
    height: 1,
    color: "red",
    isDraggable: false,
  },
]

export const Canvas2 = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [shapes, setShapes] = useState<DrawableShapes[]>([
    ...initialShapes,
    ...gridLines,
  ])
  const [draggingId, setDraggingId] = useState<number | null>(null)
  // offsetRef is needed otherwise if user clicks on shape, then shape would jump
  // such that it's top left corner is mouse position because a shape's position
  // is based on it's top left corner
  // ie. offsetRef is the mouse's position inside the shape
  const offsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  // Draw all boxes
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext("2d")
    if (!context) return

    clear(context, canvas.width, canvas.height)
    drawShapes(context, shapes, canvas.width, canvas.height)
  }, [shapes])

  const getMousePositionOnCanvas = (
    event: React.MouseEvent,
  ): { x: number; y: number } => {
    const rect = canvasRef.current?.getBoundingClientRect()

    // since bounding box could be anywhere on page we subtract the bounding boxes
    // dimensions from the mouse's global position to get the mouse's position
    // inside the bounding box
    return {
      x: event.clientX - (rect?.left ?? 0),
      y: event.clientY - (rect?.top ?? 0),
    }
  }

  const handleMouseDown = (event: React.MouseEvent): void => {
    const { x, y } = getMousePositionOnCanvas(event)

    for (const shape of shapes) {
      if (shape.isDraggable && isMouseInShape(x, y, shape)) {
        setDraggingId(shape.id)
        offsetRef.current = { x: x - shape.x, y: y - shape.y }
        return
      }
    }
  }

  const handleMouseMove = (event: React.MouseEvent): void => {
    if (draggingId == null) return

    const { x, y } = getMousePositionOnCanvas(event)

    setShapes((prev) =>
      prev.map((shape) =>
        shape.id === draggingId
          ? {
              ...shape,
              x: x - offsetRef.current.x,
              y: y - offsetRef.current.y,
            }
          : shape,
      ),
    )
  }

  const handleMouseUp = (event: React.MouseEvent): void => {
    event.preventDefault()
    event.stopPropagation()
    setDraggingId(null)
  }

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={300}
      className="border border-green-600 mt-5 ml-10"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseOut={handleMouseUp}
      onMouseUp={handleMouseUp}
    />
  )
}
