import React, { useEffect, useRef, useState } from "react"
import {
  DrawableObjects,
  NonDraggableShape,
  clearCanvas,
  drawShapes,
  isMouseInShape,
  DraggableShape,
  snapCanvasObjectToGrid,
} from "./canvas"

const GRID_SIZE = 50
const CANVAS_WIDTH = 300
const CANVAS_HEIGHT = 300

const initialShapes: DraggableShape[] = [
  // {
  //   id: 104,
  //   x: 250,
  //   y: 250,
  //   width: GRID_SIZE,
  //   height: GRID_SIZE,
  //   color: "green",
  //   isDragging: false,
  //   isDraggable: true,
  // },
  //   {
  //     id: 100,
  //     x: 0,
  //     y: 0,
  //     width: GRID_SIZE * 2,
  //     height: GRID_SIZE * 2,
  //     color: "green",
  //     isDragging: false,
  //     isDraggable: true,
  //   },
  {
    id: 101,
    x: 0,
    y: 0,
    width: GRID_SIZE * 3,
    height: GRID_SIZE * 3,
    color: "blue",
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
  const canvasObjectOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

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
            y: 200,
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
        canvasObjectOffsetRef.current = { x: x - shape.x, y: y - shape.y }
        return
      }
    }
  }

  const handleMouseMove = (event: React.MouseEvent): void => {
    if (draggingId == null) return

    const shape = shapes.find((s) => s.id === draggingId)

    if (!shape) return

    const { x: mouseX, y: mouseY } = getMousePositionOnCanvas(event)

    let calculatedX = mouseX - canvasObjectOffsetRef.current.x
    let calculatedY = mouseY - canvasObjectOffsetRef.current.y

    if (
      mouseX - canvasObjectOffsetRef.current.x >=
      CANVAS_WIDTH - shape.width
    ) {
      calculatedX = CANVAS_WIDTH - shape.width
    } else if (mouseX - canvasObjectOffsetRef.current.x <= 0) {
      calculatedX = 0
    }

    if (
      mouseY - canvasObjectOffsetRef.current.y >=
      CANVAS_HEIGHT - shape.height
    ) {
      calculatedY = CANVAS_HEIGHT - shape.height
    } else if (mouseY - canvasObjectOffsetRef.current.y <= 0) {
      calculatedY = 0
    }

    setShapes((prev) =>
      prev.map((shape) =>
        shape.id === draggingId
          ? {
              ...shape,
              x: calculatedX,
              y: calculatedY,
            }
          : shape,
      ),
    )
  }

  const handleMouseOut = (event: React.MouseEvent): void => {
    if (draggingId == null) return

    event.preventDefault()
    event.stopPropagation()

    const shape = shapes.find((s) => s.id === draggingId)

    if (!shape) return

    const { x: mouseX, y: mouseY } = getMousePositionOnCanvas(event)

    let shapeX = mouseX - canvasObjectOffsetRef.current.x // shape left
    let shapeY = mouseY - canvasObjectOffsetRef.current.y // shape top

    // shapeX + shape.width = shape right
    // shapeY + shape.height = shape bottom

    if (mouseX > CANVAS_WIDTH) {
      // mouse goes out right
      shapeX = CANVAS_WIDTH - shape.width

      if (shapeY + shape.height > CANVAS_HEIGHT) {
        shapeY = CANVAS_HEIGHT - shape.height
      } else if (shapeY < 0) {
        shapeY = 0
      }
    } else if (mouseX < 0) {
      // mouse goes out left
      shapeX = 0

      if (shapeY + shape.height > CANVAS_HEIGHT) {
        shapeY = CANVAS_HEIGHT - shape.height
      } else if (shapeY < 0) {
        shapeY = 0
      }
    }

    if (mouseY > CANVAS_HEIGHT) {
      // mouse goes out bottom
      shapeY = CANVAS_HEIGHT - shape.height

      if (shapeX + shape.width > CANVAS_WIDTH) {
        shapeX = CANVAS_WIDTH - shape.width
      } else if (shapeX < 0) {
        shapeX = 0
      }
    } else if (mouseY < 0) {
      // mouse goes out top
      shapeY = 0

      if (shapeX + shape.width > CANVAS_WIDTH) {
        shapeX = CANVAS_WIDTH - shape.width
      } else if (shapeX < 0) {
        shapeX = 0
      }
    }

    const { x: closeGridX, y: closeGridY } = snapCanvasObjectToGrid(
      shapeX,
      shapeY,
      GRID_SIZE,
    )

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

  const handleMouseUp = (event: React.MouseEvent): void => {
    event.preventDefault()
    event.stopPropagation()

    const shape = shapes.find((s) => s.id === draggingId)

    if (!shape) return

    let { x: mouseX, y: mouseY } = getMousePositionOnCanvas(event)

    let shapeX = mouseX - canvasObjectOffsetRef.current.x
    let shapeY = mouseY - canvasObjectOffsetRef.current.y

    if (
      mouseX - canvasObjectOffsetRef.current.x >=
      CANVAS_WIDTH - shape.width
    ) {
      shapeX = CANVAS_WIDTH - shape.width
    } else if (mouseX - canvasObjectOffsetRef.current.x <= 0) {
      shapeX = 0
    }

    if (
      mouseY - canvasObjectOffsetRef.current.y >=
      CANVAS_HEIGHT - shape.height
    ) {
      shapeY = CANVAS_HEIGHT - shape.height
    } else if (mouseY - canvasObjectOffsetRef.current.y <= 0) {
      shapeY = 0
    }

    const { x: closeGridX, y: closeGridY } = snapCanvasObjectToGrid(
      shapeX,
      shapeY,
      GRID_SIZE,
    )

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
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      className="border border-green-600 mt-5 ml-10"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseOut={handleMouseOut}
      onMouseUp={handleMouseUp}
    />
  )
}
