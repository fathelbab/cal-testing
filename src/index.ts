import { sumCart } from './engines/cart-totals';
import { deliveryType } from './models/CheckoutConfig';
import { calcItemPrices, collectPricedCartItems } from './engines/items';
import { applyDiscountsInOrder } from './engines/discount';
import { calculateVatDetails } from './engines/vat';
import { validateCheckoutConfig } from './validation/validation';
import { calculatePromocodeValue } from './engines/promocode';
import { Item } from './models/Items';
import { IPromocodeConfig } from './models/Promocode';
import { calculateFinalTotal } from './engines/final-total';
import { calculateSubTotalVat } from './engines/subTotalVat';

export interface CheckoutResult {
  subtotal: number;
  subtotalWithVat: number;
  totalVat: number;
  promocodeDiscountAmount: number;
  loyaltyDiscountAmount: number;
  finalTotal: number;
  subtotalVat: number;
}

export interface CheckoutConfig {
  cartMenuItems?: Item[];
  cartOffers?: Item[];
  deliveryFeesEgp?: number;
  loyaltyBalance?: number;
  dineinExtraCharge?: number;
  coupon?: IPromocodeConfig;
  deliveryType: deliveryType;
  appType: number;
}

const to2 = (n: number) => Number(n.toFixed(2));

export function checkout(config: CheckoutConfig): CheckoutResult {
  validateCheckoutConfig(config);
  const {
    cartMenuItems,
    cartOffers,
    deliveryFeesEgp = 0,
    loyaltyBalance = 0,
    dineinExtraCharge = 0,
    coupon,
    deliveryType,
    appType
  } = config;

  const menuItemsTotal = cartMenuItems ? calcItemPrices(cartMenuItems) : undefined;
  const offersTotal = cartOffers ? calcItemPrices(cartOffers) : undefined;
  const allItemTotals = collectPricedCartItems(menuItemsTotal, offersTotal);

  const { itemsNetPrice, itemsTotalPrice } = sumCart(allItemTotals);

  const subtotalVat = calculateSubTotalVat(itemsTotalPrice, itemsNetPrice);

  const isDeliveryFree = !!coupon?.data && coupon.data.discount_type === 'delivery_free';
  const allowLoyalty = !(coupon?.data && !coupon.data.allow_loyalty);
  let validLoyaltyDiscount = allowLoyalty ? loyaltyBalance : 0;
  const effectiveDeliveryFeesEgp = isDeliveryFree ? 0 : deliveryFeesEgp;

  const promocodeValueEgp = isDeliveryFree
    ? 0
    : calculatePromocodeValue(
      coupon,
      itemsNetPrice,
      deliveryFeesEgp,
      deliveryType,
      appType
    );

  const { appliedPromoCode, appliedLoyalty, itemsNetPriceAfterDiscount } = applyDiscountsInOrder(itemsNetPrice, promocodeValueEgp, validLoyaltyDiscount);

  const { totalVat } = calculateVatDetails({
    itemsNetPriceAfterDiscount,
    itemsTotalPrice,
    dineinExtraCharge,
    effectiveDeliveryFeesEgp,
    appliedPromoCode,
    appliedLoyalty,
  }
  );
  const finalTotal = calculateFinalTotal({ totalVat, itemsNetPriceAfterDiscount, dineinExtraCharge, deliveryFeesEgp: effectiveDeliveryFeesEgp })
  const promoShown = isDeliveryFree ? deliveryFeesEgp : appliedPromoCode;

  return {
    subtotal: to2(itemsNetPrice),
    subtotalWithVat: to2(itemsTotalPrice),
    loyaltyDiscountAmount: to2(appliedLoyalty),
    promocodeDiscountAmount: to2(promoShown),
    subtotalVat: to2(subtotalVat),
    totalVat: to2(totalVat),
    finalTotal: to2(finalTotal),
  };
}


// Re-export all types and functions for convenience
export * from './models/CartItem';
export * from './models/CheckoutConfig';
export * from './models/CartTotals';
export * from './engines/items';
export * from './engines/cart-totals';
export * from './engines/discount';
export * from './engines/vat';
export * from './engines/promocode';
export * from './validation/validation';