export type OrderResponse = {
    id: string;
    user:{
        id: string;
        userName: string;
        phone: string;
        address: string;
    }
    orderItems: { productId: number; productName: string, unitPrice: number; quantity: number; }[];
    status: string;
    totalAmount: number;
    deliveryCharge: number;
    couponApplied: string;
    deliveryDate: string;
    paymentChannel: string;
    transactionId: string;
    orderDate: string;
}