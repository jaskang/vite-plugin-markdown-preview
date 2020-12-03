declare interface Node {
  type: string
  data?: Data
  position?: Position
  meta?: string
  value?: string
  [key: string]: any
}

declare interface Data {
  [key: string]: any
}

declare interface Position {
  start: Point
  end: Point
  indent?: number[]
}

declare interface Point {
  line: number
  column: number
  offset?: number
}

declare interface Parent extends Node {
  children: Node[]
}
