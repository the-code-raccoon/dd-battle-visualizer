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

export const snapCanvasObjectToGrid = (
  shapeX: number,
  shapeY: number,
  gridSize: number,
): { x: number; y: number } => ({
  x: Math.round(shapeX / gridSize) * gridSize,
  y: Math.round(shapeY / gridSize) * gridSize,
})

export type MapDimensions = {
  width: number
  height: number
  numXGridSquares: number
  numYGridSquares: number
  gridSquareSize: number
}

export const generateGridLines = (
  gridSize: number,
  numXGridSquares: number,
  numYGridSquares: number,
): NonDraggableShape[] => {
  const gridLines: NonDraggableShape[] = []

  // generate horizontalgrid lines
  for (let i = 0; i < numXGridSquares + 1; i++) {
    gridLines.push({
      id: i,
      x: 0,
      y: i * gridSize,
      width: 1000,
      height: 1,
      color: "red",
      isDraggable: false,
    })
  }

  // generate vertical grid lines
  for (let i = 0; i < numYGridSquares + 1; i++) {
    gridLines.push({
      id: i,
      x: i * gridSize,
      y: 0,
      height: 1000,
      width: 1,
      color: "red",
      isDraggable: false,
    })
  }

  return gridLines
}

export const generateTestShapes = (gridSize: number): DraggableShape[] => {
  return [
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
      width: gridSize * 3,
      height: gridSize * 3,
      color: "blue",
      isDragging: false,
      isDraggable: true,
    },
  ]
}
