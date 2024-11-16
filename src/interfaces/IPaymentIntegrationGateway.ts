export interface IPaymentIntegrationResponse {
  integrationId: string
  qrCode: string
}
export interface IPaymentIntegrationGateway {
  createPayment: () => Promise<IPaymentIntegrationResponse>
}
