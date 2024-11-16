import { Client } from 'pg'
import type IConnection from '../interfaces/IConnection'

interface PGConfig {
  user: string
  password: string
  host: string
  port: number
  database: string
}

export default class PostgresConnection implements IConnection {
  private readonly client: Client
  private connected: boolean = false

  constructor (config: PGConfig) {
    this.client = new Client(config)
  }

  async connect (): Promise<void> {
    await this.client.connect()
      .then(() => {
        console.log('Database Connected')
        this.connected = true
      })
      .catch(err => { console.error('connection error', err.stack) })
  }

  async query (stmt: string, params: any[]): Promise<any> {
    return await this.client.query(stmt, params)
  }

  async isAlive (): Promise<boolean> {
    return this.connected
  }

  async close (): Promise<void> {
    await this.client.end()
      .then(() => {
        console.log('client has disconnected')
        this.connected = false
      })
      .catch(err => { console.error('error during disconnection', err.stack) })
  }
}
