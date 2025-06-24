import { PricedCartItem } from './items';
import { PricedOfferItem } from './offers';

export interface CartTotals {
  totalNet: number;
  totalPrice: number;
}

export function sumCart(items: (PricedCartItem | PricedOfferItem)[]): CartTotals {
  return items.reduce(
    (sum, i) => ({
      totalNet: sum.totalNet + i.netPrice * i.quantity,
      totalPrice: sum.totalPrice + i.cartPrice * i.quantity,
    }),
    { totalNet: 0, totalPrice: 0 }
  );
} 