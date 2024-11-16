import Payment from "../entities/Payment";
import PaymentStatus from "../entities/PaymentStatus";
import { CPF } from "../entities/value-objects/Cpf";
import { IPaymentGateway } from "../interfaces/IPaymentGateway";
import { IPaymentIntegrationGateway } from "../interfaces/IPaymentIntegrationGateway";
import { HttpResponse, ok } from "../presenters/HttpResponses";
import { v4 as uuidv4 } from 'uuid'

export interface CreatePaymentCommand {
    orderId: string
    orderValue: number
    cpf: string | undefined
}

export class CreatePaymentUseCase {
    constructor(private readonly paymentGateway: IPaymentGateway, private readonly paymentIntegrationGateway: IPaymentIntegrationGateway) { }

    async execute(command: CreatePaymentCommand): Promise<HttpResponse> {
        const cpf = command.cpf ? new CPF(command.cpf) : undefined
        const result = await this.paymentIntegrationGateway.createPayment();
        const payment = new Payment(uuidv4(), command.orderId, command.orderValue, [new PaymentStatus(uuidv4(), 'AWAITING_PAYMENT')], result.qrCode, result.integrationId, cpf)
        const paymentId = await this.paymentGateway.save(payment);
        return ok({ paymentId })
    }
}