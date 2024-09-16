import {OrderItem} from '@/types/OrderResponse';

export class MedicineUtils {
    static calculateDiscountPercentage(price: number, discount: number) {
        return parseFloat((100 * discount / price).toFixed(2));
    }

    static getNamesFromOrderItems(orderItems: OrderItem[]) {
        return orderItems.map((item) => item.productName).join(', ');
    }
}