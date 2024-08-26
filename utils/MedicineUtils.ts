import {OrderItem} from '@/types/OrderResponse';

export class MedicineUtils {
    static calculateDiscountPercentage(price: number, discount: number) {
        return (price * discount / 100);
    }

    static getNamesFromOrderItems(orderItems: OrderItem[]) {
        return orderItems.map((item) => item.productName).join(', ');
    }
}