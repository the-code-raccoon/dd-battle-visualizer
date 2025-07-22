import { match, P } from "ts-pattern"

export type CanvasObject = {
  id: number
  x: number
  y: number
  width: number
  height: number
  isDraggable: boolean
}

export type Shape = CanvasObject & {
  color: string
}

export type Image = CanvasObject & {
  image: HTMLImageElement
}

export type DraggableObject = {
  isDragging: boolean
  isDraggable: true
}

export type NonDraggableObject = {
  isDraggable: false
}

export type DraggableShape = DraggableObject & Shape

export type NonDraggableShape = NonDraggableObject & Shape

export type DraggableImage = DraggableObject & Image

export type DrawableObjects =
  | DraggableShape
  | NonDraggableShape
  | DraggableImage

export const drawShapes = (
  context: CanvasRenderingContext2D,
  shapes: DrawableObjects[],
): void => {
  for (const shape of shapes) {
    match(shape)
      .with({ image: {} }, (image) => {
        context.drawImage(
          image.image,
          image.x,
          image.y,
          image.width,
          image.height,
        )
      })
      .with({ color: P.string }, (shape) => {
        context.fillStyle = shape.color
        context.fillRect(shape.x, shape.y, shape.width, shape.height)
      })
      .exhaustive()
  }
}

export const clearCanvas = (
  context: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
): void => {
  context.clearRect(0, 0, canvasWidth, canvasHeight)
}

export const isMouseInShape = (
  x: number,
  y: number,
  shape: CanvasObject,
): boolean => {
  const shapeLeft = shape.x
  const shapeRight = shape.x + shape.width
  const shapeTop = shape.y
  const shapeBottom = shape.y + shape.height

  return x >= shapeLeft && x <= shapeRight && y >= shapeTop && y <= shapeBottom
}
