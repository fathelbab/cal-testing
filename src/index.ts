import { calcItemPrices, PricedCartItem } from './engines/items';
import { calcOfferPrices, PricedOfferItem } from './engines/offers';
import { sumCart } from './engines/cart-totals';
import { calcDeliveryFees } from './engines/delivery';
import { calcDineinCharge } from './engines/dinein';
import { applyPromocode } from './engines/promocode';
import { applyLoyalty } from './engines/loyalty';
import { CheckoutConfig } from './models/CheckoutConfig';

export interface CheckoutResult {
  items: PricedCartItem[];
  offers: PricedOfferItem[];
  totals: {
    subTotalNet: number;
    subTotalPrice: number;
    deliveryFee: number;
    deliveryFeeWithVat: number;
    deliveryTime: number;
    vat: number;
    dineinCharge: number;
    afterPromocode: number;
    loyaltyCredit: number;
    finalTotal: number;
    pointsUsed: number;
  };
}

export function checkout(config: CheckoutConfig): CheckoutResult {
  const pricedItems = config.menuItems.map(calcItemPrices);
  const pricedOffers = config.offers.map(calcOfferPrices);

  const { totalNet, totalPrice } = sumCart([...pricedItems, ...pricedOffers]);

  const { fee, feeWithVat, time } = calcDeliveryFees({
    branchConfig: config.branchConfig,
    addressConfig: config.addressConfig,
    deliveryType: config.deliveryType,
  });

  const vatBase = parseFloat(((totalPrice - totalNet + (feeWithVat - fee)) || 0).toFixed(2));
  const dineinCharge = calcDineinCharge(totalNet, {
    fixed: config.dineinFixed,
    percentage: config.dineinPercentage,
  });
  const dineinVat = parseFloat((((totalNet + dineinCharge) * 0.14) - (totalNet * 0.14)).toFixed(2));

  let amount = totalPrice + feeWithVat + dineinCharge + dineinVat;
  amount = applyPromocode(amount, {
    fixed: config.promocodeFixed,
    percentage: config.promocodePercentage,
  });

  const { pointsUsed, creditValue } = applyLoyalty(amount, config.userPointsInfo || {});
  const finalTotal = parseFloat((amount - creditValue).toFixed(2));

  return {
    items: pricedItems,
    offers: pricedOffers,
    totals: {
      subTotalNet: totalNet,
      subTotalPrice: totalPrice,
      deliveryFee: fee,
      deliveryFeeWithVat: feeWithVat,
      deliveryTime: time,
      vat: vatBase + dineinVat,
      dineinCharge,
      afterPromocode: amount,
      loyaltyCredit: creditValue,
      finalTotal,
      pointsUsed,
    }
  };
}

// Re-export all types and functions for convenience
export * from './models/CartItem';
export * from './models/OfferItem';
export * from './models/CheckoutConfig';
export * from './engines/items';
export * from './engines/offers';
export * from './engines/cart-totals';
export * from './engines/delivery';
export * from './engines/dinein';
export * from './engines/promocode';
export * from './engines/loyalty'; 