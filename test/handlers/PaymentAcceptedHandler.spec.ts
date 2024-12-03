import PaymentAccepted from '../../src/events/PaymentAccepted'
import PaymentAcceptedHandler from '../../src/handlers/PaymentAcceptedHandler'
import { IOrderGateway } from '../../src/interfaces/IOrderGateway'

const orderId = 'any_order_id';

describe('Payment accepted handler', () => {
  const mockOrderGateway: IOrderGateway = {
    updateStatus: jest.fn(async () => await Promise.resolve()),
  }
  it('Should skip to RECEIVED step when order payment was accepted', async () => {
    const sut = new PaymentAcceptedHandler(mockOrderGateway)
    await sut.handle(new PaymentAccepted(orderId))
    expect(mockOrderGateway.updateStatus).toHaveBeenCalledWith('any_order_id', { status: 'RECEIVED' })
  })
  it('Should throw when OrderGateway throws', async () => {
    const mockOrderGatewayNotFound: IOrderGateway = {
      updateStatus: jest.fn(async () => await Promise.reject(new Error('Integration Error'))),
    }
    const sut = new PaymentAcceptedHandler(mockOrderGatewayNotFound)
    const result = sut.handle(new PaymentAccepted(orderId))
    await expect(result).rejects.toEqual(new Error('Integration Error'))
  })
})
