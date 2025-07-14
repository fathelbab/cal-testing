import { IItem } from "../models/CartItem";

export interface Item extends IItem { }

export interface PricedCartItem {
  netPrice: number;
  totalPrice: number;
}

export function calcItemPrices(items: IItem[]): PricedCartItem {
  return (items || []).reduce(
    (acc, e) => {
      acc.netPrice += e.required_netPrice * e.quantity;
      acc.totalPrice += e.required_totalPrice * e.quantity;
      return acc;
    },
    { netPrice: 0, totalPrice: 0 }
  );
} 

export function collectPricedCartItems(
  pricedItems?: PricedCartItem,
  pricedOffers?: PricedCartItem
): PricedCartItem[] {
  return [pricedItems, pricedOffers].filter((x): x is PricedCartItem => x !== undefined);
}
