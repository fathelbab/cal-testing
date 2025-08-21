import { ICartItem } from '../models/CartItem';
import { IPricedCartItem } from '../models/PricedCartItem';
/**
 * Calculates the total net price and total price for a list of cart items.
 *
 * @param {ICartItem[]} items - Array of cart items, each with `requiredNetPrice`, `requiredTotalPrice`, and `quantity`.
 * @returns {IPricedCartItem} Object containing:
 *  - `netPrice`: Sum of (requiredNetPrice × quantity) for all items
 *  - `totalPrice`: Sum of (requiredTotalPrice × quantity) for all items
 *
 * @example
 * calcItemPrices([
 *   { requiredNetPrice: 10, requiredTotalPrice: 12, quantity: 2 },
 *   { requiredNetPrice: 5, requiredTotalPrice: 6, quantity: 1 }
 * ]);
 * // output: { netPrice: 25, totalPrice: 30 }
 */
export function calcItemPrices(items: ICartItem[]): IPricedCartItem {
  return (items || []).reduce(
    (acc, e) => {
      acc.netPrice += e.requiredNetPrice * e.quantity;
      acc.totalPrice += e.requiredTotalPrice * e.quantity;
      return acc;
    },
    { netPrice: 0, totalPrice: 0 }
  );
} 

/**
 * Combines priced items and priced offers into a single array, ignoring undefined values.
 *
 * @param {PricedCartItem} [pricedItems] - Calculated prices for regular cart items.
 * @param {PricedCartItem} [pricedOffers] - Calculated prices for offers.
 * @returns {PricedCartItem[]} Array containing all defined priced items/offers.
 *
 * @example
 * collectPricedCartItems(
 *   { netPrice: 20, totalPrice: 25 },
 *   undefined
 * );
 * // output: [{ netPrice: 20, totalPrice: 25 }]
 */
export function collectPricedCartItems(
  pricedItems?: IPricedCartItem,
  pricedOffers?: IPricedCartItem
): IPricedCartItem[] {
  return [pricedItems, pricedOffers].filter((x): x is IPricedCartItem => x !== undefined);
}
