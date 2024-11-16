import Payment from '../../src/entities/Payment'
import type PaymentStatus from '../../src/entities/PaymentStatus'
import { type IPaymentGateway } from '../../src/interfaces/IPaymentGateway'
import { notFoundError, ok } from '../../src/presenters/HttpResponses'
import { FindPaymentByOrderIdUseCase } from '../../src/usecases/FindPaymentByOrderIdUseCase'

const mockPaymentStatus: PaymentStatus[] = [
  {
    id: 'any_status_id',
    status: 'AWAITING_PAYMENT'
  }
]

const orderPrice = 85.99

const mockPayment = new Payment('any_payment_id', 'any_order_id', orderPrice, mockPaymentStatus, '0001', 'any_integration_id')

describe('Find payment by order id use case', () => {
  const mockPaymentGateway: IPaymentGateway = {
    save: jest.fn().mockResolvedValueOnce('payment_id'),
    findPaymentByOrderId: jest.fn().mockResolvedValueOnce(mockPayment)
  }
  it('Should return a payment when it exists', async () => {
    const sut = new FindPaymentByOrderIdUseCase(mockPaymentGateway)
    const result = await sut.execute('any_order_id')
    expect(result).toEqual(ok(
      {
        id: 'any_payment_id',
        orderId: 'any_order_id',
        value: orderPrice,
        status: 'AWAITING_PAYMENT'
      }
    ))
  })
  it('Should return not found when it does not exist', async () => {
    const mockPaymentGateway: IPaymentGateway = {
      save: jest.fn().mockResolvedValueOnce('payment_id'),
      findPaymentByOrderId: jest.fn().mockResolvedValueOnce(undefined)
    }
    const sut = new FindPaymentByOrderIdUseCase(mockPaymentGateway)
    const result = await sut.execute('wrong_order_id')
    expect(result).toEqual(notFoundError('Payment with ID wrong_order_id does not exist'))
  })
})
