import Payment from '../../src/entities/Payment'
import type PaymentStatus from '../../src/entities/PaymentStatus'
import EventHandler from '../../src/handlers/EventHandler'
import { type IPaymentGateway } from '../../src/interfaces/IPaymentGateway'
import { badRequest, noContent, notFoundError } from '../../src/presenters/HttpResponses'
import { ChangePaymentStatusUseCase } from '../../src/usecases/ChangePaymentStatusUseCase'

const mockPaymentStatus: PaymentStatus[] = [
  {
    id: 'any_status_id',
    status: 'AWAITING_PAYMENT'
  }
]

const orderPrice = 85.99

const mockPayment = new Payment('any_payment_id', 'any_order_id', orderPrice, mockPaymentStatus, '0001', 'any_integration_id')

describe('Save payment use case', () => {
  let mockPaymentGateway: IPaymentGateway
  beforeEach(() => {
    mockPaymentGateway = {
      save: jest.fn().mockResolvedValueOnce('payment_id'),
      findPaymentByOrderId: jest.fn().mockResolvedValueOnce(mockPayment)
    }
  })
  it('Should save a payment when the information is correct', async () => {
    const sut = new ChangePaymentStatusUseCase(mockPaymentGateway, new EventHandler([]))
    const result = await sut.execute({ issueId: 'any_payment_id', status: 'approved' })
    expect(result).toEqual(noContent())
  })
  it('Should not save when payment does not exist', async () => {
    const mockNotFound: IPaymentGateway = {
      ...mockPaymentGateway,
      findPaymentByOrderId: jest.fn().mockResolvedValueOnce(undefined)
    }
    const sut = new ChangePaymentStatusUseCase(mockNotFound, new EventHandler([]))
    const result = await sut.execute({ issueId: 'wrong_id', status: 'approved' })
    expect(result).toEqual(notFoundError('Payment with order ID wrong_id does not exist'))
  })
  it('Should throws when status is not mapped', async () => {
    const sut = new ChangePaymentStatusUseCase(mockPaymentGateway, new EventHandler([]))
    const result = sut.execute({ issueId: 'any_order_id', status: 'not_mapped' })
    await expect(result).rejects.toEqual(new Error('Status \'undefined\' does not exist'))
  })
  it('Should not save when payment was previouly approved', async () => {
    const paymentApproved: PaymentStatus = {
      id: 'another_id',
      status: 'PAYMENT_ACCEPTED'
    }
    const payment = new Payment(mockPayment.id, mockPayment.orderId, mockPayment.value, [...mockPaymentStatus, paymentApproved], mockPayment.qrCode, mockPayment.integrationId)
    const mockPaymentApproved: IPaymentGateway = {
      ...mockPaymentGateway,
      findPaymentByOrderId: jest.fn().mockResolvedValueOnce(payment)
    }
    const sut = new ChangePaymentStatusUseCase(mockPaymentApproved, new EventHandler([]))
    const result = await sut.execute({ issueId: 'any_order_id', status: 'approved' })
    expect(result).toEqual(badRequest('Payment with order ID any_order_id is already approved'))
  })
})
