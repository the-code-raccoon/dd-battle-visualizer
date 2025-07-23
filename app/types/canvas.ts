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

export type MapDimensions = {
  width: number
  height: number
  numXGridSquares: number
  numYGridSquares: number
  gridSquareSize: number
}
