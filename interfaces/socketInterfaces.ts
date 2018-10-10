export interface Client {
  id: string
  room: string
}

export interface User {
  id: string
  name: string
  chip: number
  ready: boolean
}

export interface Room {
  users: Array<User>
  chip: number
  pot: number
  currentBet: number
}

export interface Table {
  [key: string]: Room
  
}