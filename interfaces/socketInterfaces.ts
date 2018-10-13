export interface Client {
  id: string
  name: string
  room: string
}

export interface Player {
  id: string
  name: string
  chip?: number
  ready: boolean
}

export interface Room {
  users: Array<Player>
  chip: number
  pot: number
  currentBet: number
}

export interface Tables {
  [key: string]: Room
}

export interface clientData {
  roomName: string
  userName: string
  chip: number
  bet?: number
  take?: number
}