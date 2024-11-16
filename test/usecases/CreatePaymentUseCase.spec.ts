import Payment from "../../src/entities/Payment"
import PaymentStatus from "../../src/entities/PaymentStatus"
import { IPaymentGateway } from "../../src/interfaces/IPaymentGateway"
import { IPaymentIntegrationGateway } from "../../src/interfaces/IPaymentIntegrationGateway";
import { internalServerError, ok } from "../../src/presenters/HttpResponses";
import { CreatePaymentUseCase } from "../../src/usecases/CreatePaymentUseCase";

const mockPaymentStatus: PaymentStatus[] = [
    {
        id: 'payment_status_id',
        status: 'AWAITING_PAYMENT'
    }
]

const orderValue = 155;

const mockPayment = new Payment('payment_id', '1', orderValue, mockPaymentStatus, '00020101021243650016COM', 'any_integration_id')

describe('Create Payment Use Case', () => {
    const mockPaymentGateway: IPaymentGateway = {
        save: jest.fn().mockResolvedValueOnce('payment_id'),
        findPaymentByOrderId: jest.fn().mockResolvedValueOnce(Promise.resolve(mockPayment))
    }
    const mockPaymentIntegrationGateway: IPaymentIntegrationGateway = {
        createPayment: jest.fn().mockReturnValueOnce({ integrationId: 'any_integration_id', qrCode: '00020101021243650016COM' })
    }
    it('Should create a Payment when all data are correct', async () => {
        const createPaymentCommand = {
            orderId: '1',
            orderValue,
            cpf: '12559757690'
        }
        const sut = new CreatePaymentUseCase(mockPaymentGateway, mockPaymentIntegrationGateway)
        const result = await sut.execute(createPaymentCommand)
        expect(result).toEqual(ok({ paymentId: 'payment_id' }))
    })
    it('Should return InternalServerError when integration throws', async () => {
        const mockPaymentINtegrationGatewayError: IPaymentIntegrationGateway = {
            createPayment: jest.fn().mockRejectedValueOnce(new Error('Integration error'))
        }
        const createPaymentCommand = {
            orderId: '1',
            orderValue,
            cpf: '12559757690'
        }
        const sut = new CreatePaymentUseCase(mockPaymentGateway, mockPaymentINtegrationGatewayError)
        const result = await sut.execute(createPaymentCommand)
        expect(result).toEqual(internalServerError('Error while creating a payment integration', new Error('Integration error')))
    })
})