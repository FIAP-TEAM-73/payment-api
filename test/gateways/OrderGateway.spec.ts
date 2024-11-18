import OrderGateway from "../../src/gateways/OrderGateway"
import { IIntegration } from "../../src/interfaces/IIntegration"

describe('Order Gateway', () => {
    describe('Update order status after any payment changes', () => {
        const mockIntegration: IIntegration = {
            post: jest.fn(async () => Promise.resolve()),
            put: jest.fn(async () => Promise.resolve()),
            get: jest.fn(async () => Promise.resolve())
        }
        it('Should update order status when a payment status changed', async () => {
            const sut = new OrderGateway(mockIntegration)
            const result = await sut.updateStatus('any_order_id', { status: 'RECEIVED' })
            expect(mockIntegration.put).toHaveBeenCalledWith('/order/any_order_id', { status: 'RECEIVED' }, {})
        })
    })
})