import PaymentIntegrationInMemoryGateway from '../../src/gateways/PaymentIntegrationInMemoryGateway'
import { type IPaymentIntegrationGateway } from '../../src/interfaces/IPaymentIntegrationGateway'
import * as uuid from 'uuid'

jest.mock('uuid')

describe('Payment integration in memory gateway', () => {
  const integrationId = new Uint8Array(2)
  jest.spyOn(uuid, 'v4').mockReturnValueOnce(integrationId)
  it('Should return a fake payment integration when Payment in memory is called', async () => {
    const sut: IPaymentIntegrationGateway = new PaymentIntegrationInMemoryGateway()
    const result = await sut.createPayment()
    expect(result).toEqual({ integrationId, qrCode: '00020101021243650016COM' })
  })
})
