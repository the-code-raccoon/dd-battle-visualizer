import React, { useEffect, useRef, useState } from "react"
import {
  clearCanvas,
  drawShapes,
  isMouseInShape,
  snapCanvasObjectToGrid,
  generateGridLines,
  generateTestShapes,
} from "./canvas"

import { MapDimensions, DrawableObjects } from "~/types/canvas"

export const Canvas = ({ mapDimensions }: { mapDimensions: MapDimensions }) => {
  const {
    width: mapWidth,
    height: mapHeight,
    numXGridSquares,
    numYGridSquares,
    gridSquareSize,
  } = mapDimensions

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [shapes, setShapes] = useState<DrawableObjects[]>(
    generateTestShapes(gridSquareSize),
  )
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
            width: gridSquareSize,
            height: gridSquareSize,
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

    const gridLines = generateGridLines(
      gridSquareSize,
      numXGridSquares,
      numYGridSquares,
    )

    clearCanvas(context, canvas.width, canvas.height)
    drawShapes(context, [...shapes, ...gridLines])
  }, [shapes, mapDimensions])

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

    if (mouseX - canvasObjectOffsetRef.current.x >= mapWidth - shape.width) {
      calculatedX = mapWidth - shape.width
    } else if (mouseX - canvasObjectOffsetRef.current.x <= 0) {
      calculatedX = 0
    }

    if (mouseY - canvasObjectOffsetRef.current.y >= mapHeight - shape.height) {
      calculatedY = mapHeight - shape.height
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

    if (mouseX > mapWidth) {
      // mouse goes out right
      shapeX = mapWidth - shape.width

      if (shapeY + shape.height > mapHeight) {
        shapeY = mapHeight - shape.height
      } else if (shapeY < 0) {
        shapeY = 0
      }
    } else if (mouseX < 0) {
      // mouse goes out left
      shapeX = 0

      if (shapeY + shape.height > mapHeight) {
        shapeY = mapHeight - shape.height
      } else if (shapeY < 0) {
        shapeY = 0
      }
    }

    if (mouseY > mapHeight) {
      // mouse goes out bottom
      shapeY = mapHeight - shape.height

      if (shapeX + shape.width > mapWidth) {
        shapeX = mapWidth - shape.width
      } else if (shapeX < 0) {
        shapeX = 0
      }
    } else if (mouseY < 0) {
      // mouse goes out top
      shapeY = 0

      if (shapeX + shape.width > mapWidth) {
        shapeX = mapWidth - shape.width
      } else if (shapeX < 0) {
        shapeX = 0
      }
    }

    const { x: closeGridX, y: closeGridY } = snapCanvasObjectToGrid(
      shapeX,
      shapeY,
      gridSquareSize,
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

    if (mouseX - canvasObjectOffsetRef.current.x >= mapWidth - shape.width) {
      shapeX = mapWidth - shape.width
    } else if (mouseX - canvasObjectOffsetRef.current.x <= 0) {
      shapeX = 0
    }

    if (mouseY - canvasObjectOffsetRef.current.y >= mapHeight - shape.height) {
      shapeY = mapHeight - shape.height
    } else if (mouseY - canvasObjectOffsetRef.current.y <= 0) {
      shapeY = 0
    }

    const { x: closeGridX, y: closeGridY } = snapCanvasObjectToGrid(
      shapeX,
      shapeY,
      gridSquareSize,
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
    <div>
      <canvas
        ref={canvasRef}
        width={mapWidth}
        height={mapHeight}
        className="border border-green-600 mt-5 ml-10"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseOut={handleMouseOut}
        onMouseUp={handleMouseUp}
      />
    </div>
  )
}
