import { Client, Tables, Player, Room } from '../interfaces/socketInterfaces'

export class Table {
  allClients: Array<Client>
  tables: Tables
  rooms: string[]
  asd: string

  constructor() {
    this.allClients = []
    this.tables = {}
    this.rooms = Object.keys(this.tables)
  }

  addClient(client: Client): void {
    this.allClients.push(client)
  }

  allIn(data): void {
    const user = this.getUser(data)
    if (user && this.tables[data.roomName]) {
      this.tables[data.roomName].pot += user.chip
      user.chip = 0
    }
  }

  bet(data): void {
    const user = this.getUser(data)
    if (user) {
      user.chip -= data.bet
      this.tables[data.roomName].pot += data.bet
      this.tables[data.roomName].currentBet = data.bet
    }
  }

  call(data): void {
    const user = this.getUser(data)
    if (user && this.tables[data.roomName].currentBet !== 0) {
      user.chip -= this.tables[data.roomName].currentBet
      this.tables[data.roomName].pot += this.tables[data.roomName].currentBet
    }
  }

  getCurrentBet(data: { roomName: string }): number {
    if (this.tables[data.roomName]) return this.tables[data.roomName].currentBet
  }

  getUser(data): Player {
    if (this.tables[data.roomName]) {
      const user = this.tables[data.roomName].users.find(
        u => u.name === data.userName
      )
      return user
    }
  }

  getScores(data): Player[] {
    if (this.tables[data.roomName]) {
      const scores = this.tables[data.roomName].users.sort(
        (a, b) => b.chip - a.chip
      )
      return scores
    }
  }

  getRooms(): void {
    this.rooms = Object.keys(this.tables)
  }

  isUsernameTaken(data): boolean {
    const user = this.getUser(data)
    if (user) return true

    return false
  }

  joinRoom(roomName: string, player: Player): void {
    this.getRooms()
    if (this.rooms.indexOf(roomName) === -1) {
      this.tables[roomName] = {
        users: [player],
        chip: player.chip,
        pot: 0,
        currentBet: 0
      }
    } else {
      player.chip = this.tables[roomName].chip
      this.tables[roomName].users.push(player)
    }
  }

  removeUser(id): void {
    const disconnectedClient = this.allClients.find(client => client.id === id)
    if (disconnectedClient && this.tables[disconnectedClient.room]) {
      console.log('works')
      const userInTable = this.tables[disconnectedClient.room].users.find(
        user => user.id === disconnectedClient.id
      )
      const _i = this.tables[disconnectedClient.room].users.indexOf(userInTable)

      this.tables[disconnectedClient.room].users.splice(_i, 1)
    }
    const i = this.allClients.indexOf(disconnectedClient)
    if (i) this.allClients.splice(i, 1)
  }

  sendRoom(roomName): Room {
    return this.tables[roomName]
  }

  take(data): void {
    const user = this.getUser(data)
    if (user && this.tables[data.roomName].pot !== 0) {
      user.chip += this.tables[data.roomName].pot
      this.tables[data.roomName].pot = 0
      this.tables[data.roomName].currentBet = 0
    }
  }
}

export class User {
  id: string
  name: string
  chip: number
  ready: boolean

  constructor(id: string, name: string, chip: number, ready: boolean) {
    this.id = id
    this.name = name
    this.chip = chip
    this.ready = ready
  }
}
