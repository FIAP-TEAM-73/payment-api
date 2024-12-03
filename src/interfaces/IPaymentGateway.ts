import type Payment from '../entities/Payment'

export interface IPaymentGateway {
  save: (payment: Payment) => Promise<string>
  findPaymentByOrderId: (orderId: string) => Promise<Payment | undefined>
}
