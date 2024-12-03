import type DomainEvent from './DomainEvent'

export default class PaymentAccepted implements DomainEvent<string> {
  name: string = 'paymentAccepted'
  constructor (readonly value: string) {}
}
