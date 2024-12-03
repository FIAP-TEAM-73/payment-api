import { type IHttp } from '../interfaces/IHttp'
import type EventHandler from '../handlers/EventHandler'
import PaymentController from '../controllers/PaymentController'
import { type ChangePaymentStatusCommand } from '../usecases/ChangePaymentStatusUseCase'
import { IPaymentGateway } from '../interfaces/IPaymentGateway'
import { IPaymentIntegrationGateway } from '../interfaces/IPaymentIntegrationGateway'
import { CreatePaymentCommand } from '../usecases/CreatePaymentUseCase'
import { IApi } from '../interfaces/IApi'

export default class PaymentApi implements IApi {
  private readonly paymentController: PaymentController
  constructor (
    private readonly http: IHttp,
    paymentGateway: IPaymentGateway,
    paymnentIntegrationGateway: IPaymentIntegrationGateway,
    eventHandler: EventHandler
  ) {
    this.paymentController = new PaymentController(paymentGateway, paymnentIntegrationGateway, eventHandler)
  }

  init (): void {
    void this.http.route('post', 'payment/hook', async (_: any, body: ChangePaymentStatusCommand) => {
        console.info(`[POST] - Receiving a request on "/api/v1/payment/hook" body: ${JSON.stringify(body)}`)
      return await this.paymentController.update(body)
    })
    void this.http.route('post', 'payment', async (_: any, body: CreatePaymentCommand) => {
        console.info(`[POST] - Receiving a request on "/api/v1/payment" body: ${JSON.stringify(body)}`)
      return await this.paymentController.create(body)
    })
    void this.http.route('get', 'payment/order/:id', async (req: { params: { id: string } }) => {
        console.info(`[GET] - Receiving a request on "/api/v1/payment/order/:id" params: ${JSON.stringify(req)}`)
      return await this.paymentController.find(req.params.id)
    })
  }
}
