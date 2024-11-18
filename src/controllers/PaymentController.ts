import type EventHandler from '../handlers/EventHandler'
import { IPaymentGateway } from '../interfaces/IPaymentGateway'
import { IPaymentIntegrationGateway } from '../interfaces/IPaymentIntegrationGateway'
import { type HttpResponse } from '../presenters/HttpResponses'
import { type ChangePaymentStatusCommand, ChangePaymentStatusUseCase } from '../usecases/ChangePaymentStatusUseCase'
import { CreatePaymentCommand, CreatePaymentUseCase } from '../usecases/CreatePaymentUseCase'
import { FindPaymentByOrderIdUseCase } from '../usecases/FindPaymentByOrderIdUseCase'

export default class PaymentController {
  private readonly changePaymentStatusUseCase: ChangePaymentStatusUseCase
  private readonly createPaymentUseCase: CreatePaymentUseCase
  private readonly findPaymentByOrderIdUseCase: FindPaymentByOrderIdUseCase

  constructor (paymentGateway: IPaymentGateway, paymnentIntegrationGateway: IPaymentIntegrationGateway, eventHandler: EventHandler) {
    this.createPaymentUseCase = new CreatePaymentUseCase(paymentGateway, paymnentIntegrationGateway)
    this.changePaymentStatusUseCase = new ChangePaymentStatusUseCase(paymentGateway, eventHandler)
    this.findPaymentByOrderIdUseCase = new FindPaymentByOrderIdUseCase(paymentGateway)
  }

  async update (command: ChangePaymentStatusCommand): Promise<HttpResponse> {
    return await this.changePaymentStatusUseCase.execute(command)
  }

  async create (command: CreatePaymentCommand): Promise<HttpResponse> {
    return await this.createPaymentUseCase.execute(command)
  }

  async find (orderId: string): Promise<HttpResponse> {
    return await this.findPaymentByOrderIdUseCase.execute(orderId)
  }
}
