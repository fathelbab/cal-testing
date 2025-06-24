import { OfferItem } from '../models/OfferItem';

export interface PricedOfferItem extends OfferItem {
  netPrice: number;
  cartPrice: number;
}

export function calcOfferPrices(offer: OfferItem): PricedOfferItem {
  const sum = (arr: Array<{ menu_item_size_price?: { net_price: number; total_price: number } }>, key: 'net_price' | 'total_price') => 
    arr.reduce((a, b) => a + (b.menu_item_size_price?.[key] || 0), 0);
  
  const sandwichesNet = sum(offer.sandwiches, 'net_price');
  const friesNet = sum(offer.fries, 'net_price');
  const drinkNet = sum(offer.drink, 'net_price');

  const sandwichesTotal = sum(offer.sandwiches, 'total_price');
  const friesTotal = sum(offer.fries, 'total_price');
  const drinkTotal = sum(offer.drink, 'total_price');

  const base = offer.fullOfferData || { net_price: 0, total_price: 0 };

  const netPrice = sandwichesNet + friesNet + drinkNet + base.net_price;
  const cartPrice = sandwichesTotal + friesTotal + drinkTotal + base.total_price;

  return { ...offer, netPrice, cartPrice };
} 