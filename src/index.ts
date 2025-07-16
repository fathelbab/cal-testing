import { sumCart } from './engines/cart-totals';
import { calcDineinCharge } from './engines/dinein';
import { CheckoutConfig } from './models/CheckoutConfig';
import { calcItemPrices, collectPricedCartItems, PricedCartItem } from './engines/items';
import { applyDiscountsInOrder } from './engines/discount';
import { calculateVatDetails } from './engines/vat';
import { calculateFinalTotal } from './engines/final-total';
import { validateCheckoutConfig } from './validation/validation';
import { appTypeMap, calculatePromocodeValue } from './engines/promocode';

export interface CheckoutResult {
  subTotal: number;
  subTotalWithVat: number;
  Totalvat: number;
  promocodeDiscountAmount: number;
  loyaltyDiscountAmount: number;
  finalTotal: number;
  vatSubTotal: number;
}

export function checkout(config: CheckoutConfig): CheckoutResult {
  validateCheckoutConfig(config);
  const {
    menuItems,
    offers,
    deliveryFeesEgp = 0,
    loyaltyDiscount = 0,
    dineinPercentage = 0,
    dineinFixed = 0,
    coupon,
    deliveryType,
    appType
  } = config;

  const pricedItems = menuItems ? calcItemPrices(menuItems) : undefined;
  const pricedOffers = offers ? calcItemPrices(offers) : undefined;
  const pricedCartItems = collectPricedCartItems(
    pricedItems,
    coupon?.data?.excludes_offers ? undefined : pricedOffers
  );

  const { totalNetPrice, totalPriceWithVat } = sumCart(pricedCartItems);

  const dineinCharge = dineinFixed || dineinPercentage
    ? calcDineinCharge(totalNetPrice, { fixed: dineinFixed, percentage: dineinPercentage })
    : 0;
  const vatSubTotal = totalPriceWithVat - totalNetPrice;

  //  calc coupon amount
  const promoValue = calculatePromocodeValue(
    coupon,
    totalNetPrice,
    deliveryFeesEgp,
    deliveryType,
    appType
  );

  let effectiveLoyaltyDiscount = loyaltyDiscount;
  if (!coupon?.data.allow_loyalty) {
    effectiveLoyaltyDiscount = 0;
  }


  const { appliedPromo, appliedLoyalty } = applyDiscountsInOrder(totalNetPrice, promoValue, effectiveLoyaltyDiscount);

  const { totalVat } = calculateVatDetails(
    totalNetPrice,
    totalPriceWithVat,
    dineinCharge,
    deliveryFeesEgp,
    appliedPromo,
    appliedLoyalty
  );

  const finalTotal = calculateFinalTotal({
    totalPriceWithVat,
    dineinCharge,
    deliveryFeesEgp,
    loyaltyDiscount: effectiveLoyaltyDiscount ?? 0,
    promocodeDiscount: promoValue ?? 0
  });

  return {
    subTotal: Number(totalNetPrice.toFixed(2)),
    subTotalWithVat: Number(totalPriceWithVat.toFixed(2)),
    loyaltyDiscountAmount: Number(appliedLoyalty.toFixed(2)),
    promocodeDiscountAmount: Number(appliedPromo.toFixed(2)),
    vatSubTotal: Number(vatSubTotal.toFixed(2)),
    Totalvat: Number(totalVat.toFixed(2)),
    finalTotal: Number(finalTotal.toFixed(2)),
  };
}

// Re-export all types and functions for convenience
export * from './models/CartItem';
export * from './models/CheckoutConfig';
export * from './engines/items';
export * from './engines/cart-totals';
export * from './engines/dinein';
export * from './engines/discount';
export * from './engines/final-total';
export * from './engines/vat';
export * from './engines/promocode';
export * from './validation/validation';