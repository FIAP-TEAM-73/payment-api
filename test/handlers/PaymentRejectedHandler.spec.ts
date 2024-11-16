import PaymentRejected from '../../src/events/PaymentRejected';
import PaymentRejectedHandler from '../../src/handlers/PaymentRejectedHandler';
import { IOrderGateway } from '../../src/interfaces/IOrderGateway'

const orderId = 'any_order_id';

describe('Payment rejected handler', () => {
  const mockOrderGateway: IOrderGateway = {
    updateStatus: jest.fn(async () => await Promise.resolve()),
  }
  it('Should skip to PAYMENT_REFUSED step when order payment was rejected', async () => {
    const sut = new PaymentRejectedHandler(mockOrderGateway)
    await sut.handle(new PaymentRejected(orderId))
    expect(mockOrderGateway.updateStatus).toHaveBeenCalledWith('any_order_id', { status: 'PAYMENT_REFUSED' })
  })
  it('Should throw when OrderGateway throws', async () => {
    const mockOrderGatewayNotFound: IOrderGateway = {
      updateStatus: jest.fn(async () => await Promise.reject(new Error('Integration Error'))),
    }
    const sut = new PaymentRejectedHandler(mockOrderGatewayNotFound)
    const result = sut.handle(new PaymentRejected(orderId))
    await expect(result).rejects.toEqual(new Error('Integration Error'))
  })
})
