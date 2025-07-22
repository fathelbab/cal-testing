import { sumCart } from './engines/cart-totals';
import { deliveryType } from './models/CheckoutConfig';
import { calcItemPrices, collectPricedCartItems, Item } from './engines/items';
import { applyDiscountsInOrder } from './engines/discount';
import { calculateVatDetails } from './engines/vat';
import { calculateFinalTotal } from './engines/final-total';
import { validateCheckoutConfig } from './validation/validation';
import { calculatePromocodeValue, IPromocodeConfig } from './engines/promocode';

export interface CheckoutResult {
  subTotal: number;
  subTotalWithVat: number;
  Totalvat: number;
  promocodeDiscountAmount: number;
  loyalityApplied: number;
  finalTotal: number;
  vatSubTotal: number;
}

export interface CheckoutConfig {
  menuItems?: Item[];
  offers?: Item[];
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
    menuItems,
    offers,
    deliveryFeesEgp = 0,
    loyaltyBalance = 0,
    dineinExtraCharge = 0,
    coupon,
    deliveryType,
    appType
  } = config;

  const pricedItems = menuItems ? calcItemPrices(menuItems) : undefined;
  const pricedOffers = offers ? calcItemPrices(offers) : undefined;
  const pricedCartItems = collectPricedCartItems(
    pricedItems,
    pricedOffers
  );

  const { totalNetPrice, totalPriceWithVat } = sumCart(pricedCartItems);


  const vatSubTotal = totalPriceWithVat - totalNetPrice;

  //  calc coupon amount
  const promoValue = calculatePromocodeValue(
    coupon,
    totalNetPrice,
    deliveryFeesEgp,
    deliveryType,
    appType
  );

  let effectiveLoyaltyDiscount = loyaltyBalance;
  if (!coupon?.data.allow_loyalty) {
    effectiveLoyaltyDiscount = 0;
  }


  const { appliedPromo, appliedLoyalty } = applyDiscountsInOrder(totalNetPrice, promoValue, effectiveLoyaltyDiscount);

  const { totalVat } = calculateVatDetails(
    totalNetPrice,
    totalPriceWithVat,
    dineinExtraCharge,
    deliveryFeesEgp,
    appliedPromo,
    appliedLoyalty
  );
  if (dineinExtraCharge && dineinExtraCharge > 0) {
    dineinExtraChargeWithVat = dineinExtraCharge * 1.14;
  }
  const finalTotal = calculateFinalTotal({
    totalPriceWithVat,
    dineinExtraChargeWithVat,
    deliveryFeesEgp,
    loyaltyDiscount: effectiveLoyaltyDiscount ?? 0,
    promocodeDiscount: promoValue ?? 0
  });

  return {
    subTotal: Number(totalNetPrice.toFixed(2)),
    subTotalWithVat: Number(totalPriceWithVat.toFixed(2)),
    loyalityApplied: Number(appliedLoyalty.toFixed(2)),
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
export * from './engines/discount';
export * from './engines/final-total';
export * from './engines/vat';
export * from './engines/promocode';
export * from './validation/validation';