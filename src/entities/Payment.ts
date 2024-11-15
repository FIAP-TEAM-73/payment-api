import { assertArgumentMin } from './base/AssertionConcerns'
import type PaymentStatus from './PaymentStatus'
import { CPF } from './value-objects/Cpf'

export default class Payment {
  constructor (
    readonly id: string,
    readonly orderId: string,
    readonly value: number,
    readonly statuses: PaymentStatus[],
    readonly qrCode: string,
    readonly integrationId: string,
    readonly cpf: CPF | undefined = undefined
  ) {
    const min = 0
    assertArgumentMin(value, min, 'Value must be greater than 0')
  }

  isApproved (): boolean {
    return this.statuses.some(status => status.status === 'PAYMENT_ACCEPTED')
  }
}
