import { useEffect, useRef } from "react"
import { BaseShape } from "./canvas"

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context: CanvasRenderingContext2D | null = canvas.getContext("2d")
    if (!context) return

    const shapes: BaseShape[] = []
    shapes.push({ x: 10, y: 10, width: 150, height: 100, color: "green" })

    const drawShapes = (): void => {
      context.clearRect(0, 0, 2000, 1500)
      for (const shape of shapes) {
        context.fillStyle = shape.color
        context.fillRect(shape.x, shape.y, shape.width, shape.height)
      }
    }

    drawShapes()

    let isDragging = false
    let startX = 0
    let startY = 0

    const isMouseInShape = (
      x: number,
      y: number,
      shape: BaseShape,
    ): boolean => {
      const shapeLeft = shape.x
      const shapeRight = shape.x + shape.width
      const shapeTop = shape.y
      const shapeBottom = shape.y + shape.height

      console.log(shapeLeft, x, shapeRight, shapeTop, y, shapeBottom)

      return x > shapeLeft && x < shapeRight && y > shapeTop && y < shapeBottom
    }

    const mouseDown = (event: MouseEvent): void => {
      event.preventDefault()

      const startX = event.clientX
      const startY = event.clientY

      let i = 0
      let currentShapeIndex
      for (const shape of shapes) {
        if (isMouseInShape(startX, startY, shape)) {
          currentShapeIndex = i
          isDragging = true
        }
        i++
      }
    }

    const mouseUp = (event: MouseEvent): void => {
      if (!isDragging) return
      event.preventDefault()

      isDragging = false
    }

    const mouseMove = (event: MouseEvent): void => {
      if (!isDragging || !startX || !startY) return

      event.preventDefault()

      const mouseX = event.clientX
      const mouseY = event.clientY

      const dx = mouseX - startX
      const dy = mouseY - startY

      const shape = shapes[0]
      shape.x += dx
      shape.y += dy

      drawShapes()

      startX = mouseX
      startY = mouseY
    }

    canvas.onmousedown = mouseDown
    canvas.onmouseup = mouseUp
    canvas.onmouseout = mouseUp
    canvas.onmousemove = mouseMove
  }, [])

  return (
    <canvas ref={canvasRef} className="w-100 h-100 border border-green-600" />
  )
}
