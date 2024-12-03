import Payment from '../entities/Payment'
import PaymentStatus, { type PaymentStatuses } from '../entities/PaymentStatus'
import type DomainEvent from '../events/DomainEvent'
import PaymentAccepted from '../events/PaymentAccepted'
import PaymentRejected from '../events/PaymentRejected'
import type EventHandler from '../handlers/EventHandler'
import { type IPaymentGateway } from '../interfaces/IPaymentGateway'
import { badRequest, type HttpResponse, noContent, notFoundError } from '../presenters/HttpResponses'
import { v4 as uuidv4 } from 'uuid'

export interface ChangePaymentStatusCommand {
  issueId: string
  status: 'approved' | 'rejected' | string
}

const statusMapper: Record<'approved' | 'rejected' | string, PaymentStatuses> = {
  approved: 'PAYMENT_ACCEPTED',
  rejected: 'PAYMENT_REFUSED'
}

export class ChangePaymentStatusUseCase {
  constructor (private readonly paymentGateway: IPaymentGateway, private readonly eventHandler: EventHandler) { }

  async execute ({ issueId, status }: ChangePaymentStatusCommand): Promise<HttpResponse> {
    const payment = await this.paymentGateway.findPaymentByOrderId(issueId)
    if (payment === undefined) return notFoundError(`Payment with order ID ${issueId} does not exist`)
    if (payment.isApproved()) return badRequest(`Payment with order ID ${issueId} is already approved`)
    const mappedstatus = statusMapper[status]
    const paymentStatus = new PaymentStatus(uuidv4(), mappedstatus)
    const newPayment = new Payment(payment.id, payment.orderId, payment.value, [...payment.statuses, paymentStatus], payment.qrCode, payment.integrationId)
    await this.paymentGateway.save(newPayment)
    await this.eventHandler.publish(this.getEventByPaymentStatus(mappedstatus, payment.orderId))
    return noContent()
  }

  private getEventByPaymentStatus (statuses: PaymentStatuses, orderId: string): DomainEvent<string> {
    if (statuses === 'PAYMENT_ACCEPTED') return new PaymentAccepted(orderId)
    return new PaymentRejected(orderId)
  }
}
