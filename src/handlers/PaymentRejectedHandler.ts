import type DomainEvent from '../events/DomainEvent'
import PaymentRejected from '../events/PaymentRejected'
import IHandler from '../interfaces/IHandler'
import { IOrderGateway } from '../interfaces/IOrderGateway'

export default class PaymentRejectedHandler implements IHandler {
  name: string = 'paymentRejected'

  constructor(private readonly orderGateway: IOrderGateway) { }

  async handle<T>(event: DomainEvent<T>): Promise<void> {
    if (event instanceof PaymentRejected) {
      try {
        await this.orderGateway.updateStatus(event.value, { status: 'PAYMENT_REFUSED' })
      } catch (err) {
        console.error(`Error while updating Order status`, err instanceof Error ? err.message : JSON.stringify(err))
        throw err
      }
    }
  }
}
