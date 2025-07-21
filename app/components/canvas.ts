export type BaseShape = {
  x: number
  y: number
  width: number
  height: number
  color: string
  isDragging: boolean
}

export const CANVAS_HEIGHT = 500
export const CANVAS_WIDTH = 1200

export const drawShapes = (
  context: CanvasRenderingContext2D,
  shapes: BaseShape[],
): void => {
  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  for (const shape of shapes) {
    context.fillStyle = shape.color
    context.fillRect(shape.x, shape.y, shape.width, shape.height)
  }
}

// export const mouseDown = (event: MouseEvent) => {
//   event.preventDefault()

//   const startX = event.clientX
//   const startY = event.clientY

// }
