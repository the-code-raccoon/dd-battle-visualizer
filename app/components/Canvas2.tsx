import { useEffect, useRef } from "react"
import { BaseShape } from "./canvas"

export const Canvas2 = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context: CanvasRenderingContext2D | null = canvas.getContext("2d")
    if (!context) return

    // canvas references
    const boundingBox = canvas.getBoundingClientRect()
    const offsetX = boundingBox.left
    const offsetY = boundingBox.top
    const canvasWidth = canvas.width
    const canvasHeight = canvas.height

    // drag and drop control varaibles
    let startX = 0
    let startY = 0
    let canDrag = false

    // shapes
    const shapes: BaseShape[] = []
    shapes.push({
      x: 10,
      y: 10,
      width: 30,
      height: 30,
      color: "green",
      isDragging: false,
    })

    const clear = (): void => {
      context.clearRect(0, 0, canvasWidth, canvasHeight)
    }

    const drawShapes = (): void => {
      clear()
      for (const shape of shapes) {
        context.fillStyle = shape.color
        context.fillRect(shape.x, shape.y, shape.width, shape.height)
      }
    }

    const isMouseInShape = (
      x: number,
      y: number,
      shape: BaseShape,
    ): boolean => {
      const shapeLeft = shape.x
      const shapeRight = shape.x + shape.width
      const shapeTop = shape.y
      const shapeBottom = shape.y + shape.height

      return x > shapeLeft && x < shapeRight && y > shapeTop && y < shapeBottom
    }

    const mouseDown = (event: MouseEvent): void => {
      event.preventDefault()
      event.stopPropagation()

      const mouseX = event.clientX
      const mouseY = event.clientY

      canDrag = false

      for (const shape of shapes) {
        if (isMouseInShape(startX, startY, shape)) {
          canDrag = true
          shape.isDragging = true
        }
      }

      startX = mouseX
      startY = mouseY
    }

    const mouseUp = (event: MouseEvent): void => {
      event.preventDefault()
      event.stopPropagation()

      canDrag = false
      for (const shape of shapes) {
        shape.isDragging = false
      }
    }

    const mouseMove = (event: MouseEvent): void => {
      if (!canDrag) return

      event.preventDefault()
      event.stopPropagation()

      // get the current mouse position
      const mouseX = event.clientX - offsetX
      const mouseY = event.clientY - offsetY

      // calculate the distance the mouse has moved since the last mousemove
      const dx = mouseX - startX
      const dy = mouseY - startY

      for (const shape of shapes) {
        if (shape.isDragging) {
          shape.x += dx
          shape.y += dy
        }
      }

      drawShapes()

      startX = mouseX
      startY = mouseY
    }

    drawShapes()

    // mouse event functions
    canvas.onmousedown = mouseDown
    canvas.onmouseup = mouseUp
    canvas.onmouseout = mouseUp
    canvas.onmousemove = mouseMove
  }, [])

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={300}
      className="border border-green-600"
    />
  )
}
