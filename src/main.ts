import ExpressHttp from './adapters/ExpressHttp'
import EventHandler from './handlers/EventHandler'
import * as doc from '../docs/swagger.json'
import PostgresConnection from './adapters/PostgresConnection'
import type IConnection from './interfaces/IConnection'
import { type IHttp } from './interfaces/IHttp'
import PaymentApi from './apis/PaymentApi'
import PaymentAcceptedHandler from './handlers/PaymentAcceptedHandler'
import PaymentRejectedHandler from './handlers/PaymentRejectedHandler'
import { IOrderGateway } from './interfaces/IOrderGateway'
import OrderGateway from './gateways/OrderGateway'
import { IIntegration } from './interfaces/IIntegration'
import PaymentGateway from './gateways/PaymentGateway'
import PaymentIntegrationInMemoryGateway from './gateways/PaymentIntegrationInMemoryGateway'
import AxiosIntegration from './adapters/AxiosIntegration'

const getHanlders = (orderGateway: IOrderGateway): EventHandler => {
  return new EventHandler(
    [
      new PaymentAcceptedHandler(orderGateway),
      new PaymentRejectedHandler(orderGateway)
    ]
  )
}

const getHttp = (): IHttp => new ExpressHttp()

const getConnection = (): IConnection => {
  return new PostgresConnection({
    user: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASSWORD ?? '1234',
    database: process.env.DB_NAME ?? 'postgres',
    host: process.env.DB_HOST ?? '0.0.0.0',
    port: +(process.env.DB_PORT ?? 5432)
  })
}

const getIntegration = (): IIntegration => {
  return new AxiosIntegration(process.env.ORDER_API_HOST ?? 'http://localhost:9002/api/v1')
}

const initRoutes = (http: IHttp, connection: IConnection, integration: IIntegration): void => {
  const orderGateway = new OrderGateway(integration)
  const paymentGateway = new PaymentGateway(connection)
  const paymentIntegrationGateway = new PaymentIntegrationInMemoryGateway()
  const handler = getHanlders(orderGateway)
  const routes = [
    new PaymentApi(http, paymentGateway, paymentIntegrationGateway, handler)
  ]
  routes.forEach((route) => { route.init() })
}

const main = async (): Promise<void> => {
  const http = getHttp()
  const connection = getConnection()
  await connection.connect()
  const integration = getIntegration()
  initRoutes(http, connection, integration)
  await http.doc('/swagger', doc)
  await http.listen(+(process.env.PORT ?? 9003))
  process.on('SIGINT', () => {
    console.log('Process is finishing')
    connection.close().catch(console.log)
    process.exit()
  })
}

main().catch(console.log)
