import {OrderItem} from '@/types/OrderResponse';

export class MedicineUtils {
    static calculateDiscountPercentage(price: number, discount: number) {
        return (100 * discount / price);
    }

    static getNamesFromOrderItems(orderItems: OrderItem[]) {
        return orderItems.map((item) => item.productName).join(', ');
    }
}