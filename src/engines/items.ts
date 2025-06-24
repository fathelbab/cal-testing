import { CartItem } from '../models/CartItem';

export interface PricedCartItem extends CartItem {
  netPrice: number;
  cartPrice: number;
}

export function calcItemPrices(item: CartItem): PricedCartItem {
  const extras = (item.extras || []).reduce(
    (acc, e) => {
      acc.net += e.fullData.net_price;
      acc.total += e.fullData.total_price;
      return acc;
    },
    { net: 0, total: 0 }
  );

  const replacements = (item.replacements || []).reduce(
    (acc, r) => {
      acc.net += r.fullData.net_price;
      acc.total += r.fullData.total_price;
      return acc;
    },
    { net: 0, total: 0 }
  );

  const sizeData = item.size?.fullData || { net_price: 0, total_price: 0 };
  const comboData = item.comboOption?.fullData || { net_price: 0, total_price: 0 };

  const netPrice = extras.net + replacements.net + sizeData.net_price + comboData.net_price;
  const cartPrice = extras.total + replacements.total + sizeData.total_price + comboData.total_price;

  return { ...item, netPrice, cartPrice };
} 