import { type IPaymentGateway } from '../interfaces/IPaymentGateway'
import { notFoundError, ok, type HttpResponse } from '../presenters/HttpResponses'

export class FindPaymentByOrderIdUseCase {
  constructor (private readonly paymentGateway: IPaymentGateway) {}
  async execute (id: string): Promise<HttpResponse> {
    const payment = await this.paymentGateway.findPaymentByOrderId(id)
    if (payment === undefined) return notFoundError(`Payment with ID ${id} does not exist`)
    return ok(
      {
        id: payment.id,
        orderId: payment.orderId,
        value: payment.value,
        status: payment.statuses[0].status
      }
    )
  }
}
