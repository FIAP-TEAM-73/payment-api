export interface IOrderGateway {
    updateStatus: (orderId: string, changeOrderStatus: { status: string }) => Promise<void>
}