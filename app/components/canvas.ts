export type BaseShape = {
  id: number
  x: number
  y: number
  width: number
  height: number
  color: string
  isDraggable: boolean
}

export type DraggableBaseShape = BaseShape & {
  isDragging: boolean
  isDraggable: true
}

export type NonDraggableBaseShape = BaseShape & {
  isDraggable: false
}

export type DrawableShapes = DraggableBaseShape | NonDraggableBaseShape

export const drawShapes = (
  context: CanvasRenderingContext2D,
  shapes: BaseShape[],
  canvasWidth: number,
  canvasHeight: number,
): void => {
  context.clearRect(0, 0, canvasWidth, canvasHeight)
  for (const shape of shapes) {
    context.fillStyle = shape.color
    context.fillRect(shape.x, shape.y, shape.width, shape.height)
  }
}

export const clear = (
  context: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
): void => {
  context.clearRect(0, 0, canvasWidth, canvasHeight)
}

export const isMouseInShape = (
  x: number,
  y: number,
  shape: BaseShape,
): boolean => {
  const shapeLeft = shape.x
  const shapeRight = shape.x + shape.width
  const shapeTop = shape.y
  const shapeBottom = shape.y + shape.height

  return x >= shapeLeft && x <= shapeRight && y >= shapeTop && y <= shapeBottom
}
