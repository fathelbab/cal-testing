import { ICheckoutConfig } from '../models/CheckoutConfig';
import { ICartItem } from '../models/CartItem';

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

function validateMenuItem(item: ICartItem, index: number): void {
  if (!item || typeof item !== 'object') {
    throw new ValidationError(`menuItems[${index}] must be a valid object.`);
  }
  if (typeof item.quantity !== 'number' || item.quantity < 1) {
    throw new ValidationError(`menuItems[${index}].quantity must be a positive number.`);
  }
  if (typeof item.requiredNetPrice !== 'number' || item.requiredNetPrice < 1) {
    throw new ValidationError(`menuItems[${index}].requiredNetPrice must be a non-negative number.`);
  }
  if (typeof item.requiredNetPrice !== 'number' || item.requiredNetPrice < 1) {
    throw new ValidationError(`menuItems[${index}].requiredNetPrice must be a non-negative number.`);
  }
}

function validateOfferItem(offer: ICartItem, index: number): void {
  if (!offer || typeof offer !== 'object') {
    throw new ValidationError(`offers[${index}] must be a valid object.`);
  }
  if (typeof offer.quantity !== 'number' || offer.quantity < 1) {
    throw new ValidationError(`offers[${index}].quantity must be a positive number.`);
  }
  if (typeof offer.requiredNetPrice !== 'number' || offer.requiredNetPrice < 1) {
    throw new ValidationError(`offers[${index}].requiredNetPrice must be a non-negative number.`);
  }
  if (typeof offer.requiredNetPrice !== 'number' || offer.requiredNetPrice < 1) {
    throw new ValidationError(`offers[${index}].requiredNetPrice must be a non-negative number.`);
  }
}

export function validateICheckoutConfig(config: ICheckoutConfig): void {
  if (!config) throw new ValidationError('Checkout config is required.');

  const {
    cartMenuItems,
    cartOffers,
    deliveryFeesEgp,
    loyaltyBalance,
    dineinExtraCharge,
    deliveryType,
    appType,
    coupon
  } = config;

  if (!Array.isArray(cartMenuItems) && !Array.isArray(cartOffers)) {
    throw new ValidationError('At least one of cartMenuItems or cartOffers must be provided.');
  }

  if (cartMenuItems) {
    if (!Array.isArray(cartMenuItems)) throw new ValidationError('cartMenuItems must be an array.');
    cartMenuItems.forEach(validateMenuItem);
  }

  if (cartOffers) {
    if (!Array.isArray(cartOffers)) throw new ValidationError('cartOffers must be an array.');
    cartOffers.forEach(validateOfferItem);
  }

  // Default loyaltyBalance to 0 if not provided or invalid
  if (loyaltyBalance !== undefined && (typeof loyaltyBalance !== 'number' || loyaltyBalance < 0)) {
    throw new ValidationError('loyaltyBalance must be a non-negative number.');
  }



  if (![1, 2, 3].includes(deliveryType)) {
    throw new ValidationError('deliveryType must be a valid ID (1 = DELIVERY, 2 = PICKUP, 3 = DINEIN).');
  }



  if (deliveryFeesEgp !== undefined && (typeof deliveryFeesEgp !== 'number' || deliveryFeesEgp < 0)) {
    throw new ValidationError('deliveryFeesEgp must be a non-negative number.');
  }



  if (dineinExtraCharge !== undefined && (typeof dineinExtraCharge !== 'number' || dineinExtraCharge < 0)) {
    throw new ValidationError('dineinExtraCharge must be a non-negative number.');
  }
  const hasDinein = (dineinExtraCharge ?? 0) > 0;
  const hasDelivery = (deliveryFeesEgp ?? 0) > 0;

  if (hasDinein && hasDelivery) {
    throw new ValidationError('Cannot have both dine-in charge and delivery fees in the same order.');
  }
  if (appType !== undefined && ![1, 2, 3, 10].includes(appType)) {
    throw new ValidationError('appType must be one of: 1 (mobile), 2 (web), 3 (kiosk), 10 (all).');
  }

  if (coupon !== null) {
    if (typeof coupon !== 'object' || typeof coupon.valid !== 'boolean' || typeof coupon.data !== 'object' || coupon.data === null) {
      throw new ValidationError('coupon must be a valid IPromocodeConfig object.');
    }
  }
}
