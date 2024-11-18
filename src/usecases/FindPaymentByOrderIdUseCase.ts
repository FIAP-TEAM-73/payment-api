import { type IPaymentGateway } from '../interfaces/IPaymentGateway'
import { notFoundError, ok, type HttpResponse } from '../presenters/HttpResponses'

export class FindPaymentByOrderIdUseCase {
  constructor (private readonly paymentGateway: IPaymentGateway) {}
  async execute (orderId: string): Promise<HttpResponse> {
    const payment = await this.paymentGateway.findPaymentByOrderId(orderId)
    if (payment === undefined) return notFoundError(`Payment with Order ID ${orderId} does not exist`)
    const { id, value, cpf, statuses, qrCode } = payment;
    return ok(
      {
        id,
        orderId,
        value,
        status: statuses[0].status,
        qrCode,
        cpf
      }
    )
  }
}
