import { type IPaymentIntegrationGateway, type IPaymentIntegrationResponse } from '../interfaces/IPaymentIntegrationGateway'
import { v4 as uuidv4 } from 'uuid'

export default class PaymentIntegrationInMemoryGateway implements IPaymentIntegrationGateway {
  async createPayment (): Promise<IPaymentIntegrationResponse> {
    return await Promise.resolve({
      integrationId: uuidv4(),
      qrCode: '00020101021243650016COM'
    })
  }
}
