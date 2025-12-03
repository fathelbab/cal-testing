import { DELIVERY_TYPES } from '../models/CheckoutConfig';
import { IPromocodeConfig } from '../models/Promocode';

/**
 * Calculates the discount value from a given promocode (coupon) based on its configuration
 * and the current checkout context.
 *
 * @param {IPromocodeConfig | undefined} coupon - The promocode configuration object (or undefined if none is applied).
 * @param {number} itemsNetPrice - The total net price of items in the cart (before VAT and fees).
 * @param {number} deliveryFeesEgp - Delivery fees in EGP.
 * @param {string} deliveryType - The type of delivery ("DELIVERY", "PICKUP", "DINEIN", etc.).
 * @param {number} appType - Numeric code representing the app type (mapped in `appTypeMap`).
 *
 * @returns {number} The calculated discount amount in EGP. Returns 0 if the promocode is not valid or does not match conditions.
 *
 * @example
 * const coupon = {
 *   valid: true,
 *   data: {
 *     is_active: true,
 *     start_date: Date.now() - 1000,
 *     end_date: Date.now() + 100000,
 *     min_basket: 100,
 *     delivery_type: 'all',
 *     discount_type: 'percentage',
 *     discount_value: 10
 *   }
 * };
 *
 * const discount = calculatePromocodeValue(coupon, 200, 20, 'DELIVERY', 1);
 * console.log(discount);
 * // output 20 (10% of 200)
 */
export function calculatePromocodeValue(
  coupon: IPromocodeConfig | null,
  itemsNetPrice: number,
  deliveryFeesEgp: number,
  deliveryType: number,
  appType: number
): number {
  const now = Date.now();
  if (
    !coupon?.valid ||
    !coupon.data?.is_active ||
    coupon.data.start_date > now ||
    now > coupon.data.end_date
  ) return 0;

  const couponData = coupon.data;

  const meetsMinBasket = itemsNetPrice >= (couponData.min_basket || 0);

  const matchesDeliveryType =
  couponData.delivery_type === 'all' ||
  (couponData.delivery_type === 'delivery_only' && deliveryType === DELIVERY_TYPES.DELIVERY) ||
  (couponData.delivery_type === 'pickup_only' && deliveryType === DELIVERY_TYPES.PICKUP) ||
  (couponData.delivery_type === 'dinein_only' && deliveryType === DELIVERY_TYPES.DINEIN);


  let matchesAppType = true;
  if (appType && couponData.allowedAppTypeId) {
    matchesAppType = appType === couponData.allowedAppTypeId;
  }

  if (!meetsMinBasket || !matchesDeliveryType || !matchesAppType) return 0;

  switch (couponData.discount_type) {
    case 'percentage':
      return (itemsNetPrice * couponData.discount_value) / 100;
    case 'fixed':
    case 'absolute':
      return couponData.discount_value;
    case 'delivery_free':
      return deliveryFeesEgp;
    default:
      return 0;
  }
}
