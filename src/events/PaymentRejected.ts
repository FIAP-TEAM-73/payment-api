import type DomainEvent from './DomainEvent'

export default class PaymentRejected implements DomainEvent<string> {
  name: string = 'paymentRejected'
  constructor (readonly value: string) {}
}
