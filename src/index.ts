import { sumCart } from './engines/cart-totals';
import { deliveryType } from './models/CheckoutConfig';
import { calcItemPrices, collectPricedCartItems } from './engines/items';
import { applyDiscountsInOrder } from './engines/discount';
import { calculateVatDetails } from './engines/vat';
import { calculateFinalTotal } from './engines/final-total';
import { validateCheckoutConfig } from './validation/validation';
import { calculatePromocodeValue } from './engines/promocode';
import { Item } from './models/Items';
import { IPromocodeConfig } from './models/Promocode';

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


export function checkout(config: CheckoutConfig): CheckoutResult {
  validateCheckoutConfig(config);
  let dineinExtraChargeWithVat = 0;
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
  const allItemTotals = collectPricedCartItems(
    menuItemsTotal,
    offersTotal
  );

  const { itemsNetPrice, itemsTotalPrice } = sumCart(allItemTotals);

  const subtotalVat = itemsTotalPrice - itemsNetPrice;

  const promocodeValueEgp = calculatePromocodeValue(
    coupon,
    itemsNetPrice,
    deliveryFeesEgp,
    deliveryType,
    appType
  );

  let validLoyaltyDiscount = loyaltyBalance;
  let effectiveDeliveryFeesEgp =0; 
  if (coupon && coupon?.data && !coupon?.data.allow_loyalty) {
    validLoyaltyDiscount = 0;
  }
  if (coupon && coupon?.data && coupon?.data?.discount_type === 'delivery_free') {
    effectiveDeliveryFeesEgp = 0;
  }else{
    effectiveDeliveryFeesEgp = deliveryFeesEgp
  }


  const { appliedPromoCode, appliedLoyalty } = applyDiscountsInOrder(itemsNetPrice, promocodeValueEgp, validLoyaltyDiscount);

  const { totalVat } = calculateVatDetails({
    itemsNetPrice,
    itemsTotalPrice,
    dineinExtraCharge,
    effectiveDeliveryFeesEgp,
    appliedPromoCode,
    appliedLoyalty,
  }
  );
  if (dineinExtraCharge && dineinExtraCharge > 0) {
    dineinExtraChargeWithVat = dineinExtraCharge * 1.14;
  }
  const finalTotal = calculateFinalTotal({
    itemsTotalPrice,
    dineinExtraChargeWithVat,
    effectiveDeliveryFeesEgp,
    loyaltyDiscount: appliedPromoCode ?? 0,
    promocodeDiscount: appliedLoyalty ?? 0
  });

  return {
    subtotal: Number(itemsNetPrice.toFixed(2)),
    subtotalWithVat: Number(itemsTotalPrice.toFixed(2)),
    loyaltyDiscountAmount: Number(appliedLoyalty.toFixed(2)),
    promocodeDiscountAmount: Number(appliedPromoCode.toFixed(2)),
    subtotalVat: Number(subtotalVat.toFixed(2)),
    totalVat: Number(totalVat.toFixed(2)),
    finalTotal: Number(finalTotal.toFixed(2)),
  };
}


// Re-export all types and functions for convenience
export * from './models/CartItem';
export * from './models/CheckoutConfig';
export * from './models/CartTotals';
export * from './engines/items';
export * from './engines/cart-totals';
export * from './engines/discount';
export * from './engines/final-total';
export * from './engines/vat';
export * from './engines/promocode';
export * from './validation/validation';