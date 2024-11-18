import { IIntegration } from "../interfaces/IIntegration";
import { IOrderGateway } from "../interfaces/IOrderGateway";

export default class OrderGateway implements IOrderGateway {
    constructor (private readonly orderIntegration: IIntegration) {}
    
    async updateStatus (orderId: string, changeOrderStatus: { status: string; }): Promise<void> {
        await this.orderIntegration.put(`/order/${orderId}`, changeOrderStatus, {})
    }
    
}