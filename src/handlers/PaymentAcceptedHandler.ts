import type DomainEvent from '../events/DomainEvent'
import PaymentAccepted from '../events/PaymentAccepted'
import IHandler from '../interfaces/IHandler'
import { IOrderGateway } from '../interfaces/IOrderGateway'

export default class PaymentAcceptedHandler implements IHandler {
  name: string = 'paymentAccepted'

  constructor(private readonly orderGateway: IOrderGateway) { }

  async handle<T>(event: DomainEvent<T>): Promise<void> {
    if (event instanceof PaymentAccepted) {
      try {
        await this.orderGateway.updateStatus(event.value, { status: 'RECEIVED' })
      } catch (err) {
        console.error(`Error while updating Order status`, err instanceof Error ? err.message : JSON.stringify(err))
        throw err
      }
    }
  }
}
