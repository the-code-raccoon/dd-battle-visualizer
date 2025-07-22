import { useEffect, useRef, useState } from "react"
import {
  DrawableObjects,
  NonDraggableShape,
  clearCanvas,
  drawShapes,
  isMouseInShape,
  DraggableShape,
} from "./canvas"

const GRID_SIZE = 50

const initialShapes: DraggableShape[] = [
  {
    id: 100,
    x: 0,
    y: 0,
    width: GRID_SIZE * 2,
    height: GRID_SIZE * 2,
    color: "green",
    isDragging: false,
    isDraggable: true,
  },
]

const gridLines: NonDraggableShape[] = []

for (let i = 0; i < 20; i += 2) {
  gridLines.push(
    {
      id: i,
      x: 0,
      y: i * (GRID_SIZE / 2),
      width: 1000,
      height: 1,
      color: "red",
      isDraggable: false,
    },
    {
      id: i + 1,
      x: i * (GRID_SIZE / 2),
      y: 0,
      width: 1,
      height: 1000,
      color: "red",
      isDraggable: false,
    },
  )
}

export const Canvas2 = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [shapes, setShapes] = useState<DrawableObjects[]>([
    ...initialShapes,
    ...gridLines,
  ])
  const [draggingId, setDraggingId] = useState<number | null>(null)
  // offsetRef is needed otherwise if user clicks on shape, then shape would jump
  // such that it's top left corner is mouse position because a shape's position
  // is based on it's top left corner
  // ie. offsetRef is the mouse's position inside the shape
  const offsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  // load all images
  useEffect(() => {
    const imageUrls = ["./test-avatar-circle.png"]
    for (const url of imageUrls) {
      const image = new Image()
      image.src = url
      image.onload = () => {
        setShapes((prev) => [
          ...prev,
          {
            id: 200,
            x: 0,
            y: 50,
            width: GRID_SIZE,
            height: GRID_SIZE,
            color: "",
            image,
            isDragging: false,
            isDraggable: true,
          },
        ])
      }
    }
  }, [])

  // Draw all boxes
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext("2d")
    if (!context) return

    clearCanvas(context, canvas.width, canvas.height)
    drawShapes(context, shapes)
    // drawImages(context, [], canvas.width, canvas.height)
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

    const { x, y } = getMousePositionOnCanvas(event)

    // finds the closest grid square to snap to
    const closeGridX = x - (x % GRID_SIZE)
    const closeGridY = y - (y % GRID_SIZE)

    setShapes((prev) =>
      prev.map((shape) =>
        shape.id === draggingId
          ? {
              ...shape,
              x: closeGridX,
              y: closeGridY,
            }
          : shape,
      ),
    )

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
