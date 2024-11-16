import Payment from '../entities/Payment'
import PaymentStatus from '../entities/PaymentStatus'
import { type PaymentStatuses } from '../entities/PaymentStatus'
import { CPF } from '../entities/value-objects/Cpf'
import type IConnection from '../interfaces/IConnection'
import { type IPaymentGateway } from '../interfaces/IPaymentGateway'

interface PaymentRow {
  id: string
  order_id: string
  value: number
  integration_id: string
  qr_code: string
  payment_status_id: string
  status: PaymentStatuses
  cpf: string
}

export default class PaymentGateway implements IPaymentGateway {
  constructor (private readonly connection: IConnection) {}
  async save (payment: Payment): Promise<string> {
    const query = 'INSERT INTO "payment"(id, order_id, "value", integration_id, qr_code, cpf) VALUES($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO UPDATE SET integration_id=$4, qr_code=$5 RETURNING *'
    const { id, orderId, value, statuses, integrationId, qrCode, cpf } = payment
    const values = [id, orderId, value, integrationId, qrCode, cpf]
    const result = await this.connection.query(query, values)
    const paymentId: string = result.rows[0].id
    await this.savePaymentStatus(paymentId, statuses)
    return paymentId
  }

  private async savePaymentStatus (paymentId: string, statuses: PaymentStatus[]): Promise<void> {
    const query = 'INSERT INTO "payment_status"(id, payment_id, "status") VALUES($1, $2, $3) ON CONFLICT DO NOTHING;'
    await Promise.all(statuses.map(async ({ id, status }) => {
      const values = [id, paymentId, status]
      await this.connection.query(query, values)
    }))
  }

  async findPaymentByOrderId (orderId: string): Promise<Payment | undefined> {
    const query = `
    SELECT p.*, ps.id as payment_status_id, ps.status, ps.created_at FROM "payment" p
    JOIN payment_status ps ON ps.payment_id = p.id
    WHERE p.order_id = $1
    ORDER BY ps.created_at DESC
    `
    const result = await this.connection.query(query, [orderId])
    if (result.rows.length === 0) return undefined
    return result.rows.reduce((acc: Payment | undefined, row: PaymentRow) => {
      const { id, order_id: orderId, integration_id: integrationId, payment_status_id: paymentStatusId, qr_code: qrCode, status, value, cpf } = row
      const paymentStatus = new PaymentStatus(paymentStatusId, status)
      if (acc === undefined) {
        return new Payment(id, orderId, value, [paymentStatus], qrCode, integrationId, this.createTypeSafeCpf(cpf))
      }
      return new Payment(acc.id, acc.orderId, acc.value, [...acc.statuses, paymentStatus], acc.qrCode, acc.integrationId, acc.cpf)
    }, undefined)
  }

  private createTypeSafeCpf (cpf: string | null): CPF | undefined {
    if (cpf === null) return undefined
    return new CPF(cpf)
  }

}
