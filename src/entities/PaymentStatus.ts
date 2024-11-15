import { assertArgumentUnionType } from './base/AssertionConcerns'

const statuses = ['AWAITING_PAYMENT', 'PAYMENT_ACCEPTED', 'PAYMENT_REFUSED'] as const
export type PaymentStatuses = (typeof statuses)[number]

export default class PaymentStatus {
  constructor (readonly id: string, readonly status: PaymentStatuses) {
    assertArgumentUnionType(status, Object.values(statuses), `Status '${status}' does not exist`)
  }
}
