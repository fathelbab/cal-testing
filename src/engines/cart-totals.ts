import { ICartTotalsResults, ISumcart } from '../models/CartTotals';
/**
 * Calculates the sum of net prices and total prices for a list of cart items.
 *
 * @param {Isumcart[]} items - Array of items, each containing:
 *   - `netPrice`: Net price for the item
 *   - `totalPrice`: Total price for the item including VAT
 *
 * @returns {ICartTotalsResults} Object containing:
 *   - `itemsNetPrice`: Sum of all net prices
 *   - `itemsTotalPrice`: Sum of all total prices
 *
 * @example
 * const cartItems = [
 *   { netPrice: 100, totalPrice: 114 },
 *   { netPrice: 50, totalPrice: 57 }
 * ];
 *
 * const totals = sumCart(cartItems);
 * console.log(totals);
 * // output { itemsTotalPrice: 171, itemsNetPrice: 150 }
 */
export function sumCart(items:ISumcart[]): ICartTotalsResults {
  return items.reduce(
    (sum, i) => ({
      itemsTotalPrice: sum.itemsTotalPrice + i.totalPrice ,
      itemsNetPrice: sum.itemsNetPrice + i.netPrice ,
    }),
    { itemsTotalPrice: 0, itemsNetPrice: 0 }
  );
} 