import { CheckoutConfig } from '../models/CheckoutConfig';
import { IItem } from '../models/CartItem';

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

function validateMenuItem(item: IItem, index: number): void {
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

function validateOfferItem(offer: IItem, index: number): void {
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

export function validateCheckoutConfig(config: CheckoutConfig): void {
  if (!config) throw new ValidationError('Checkout config is required.');

  const {
    cartMenuItems,
    cartOffers,
    deliveryFeesEgp,
    loyaltyBalance,
    dineinExtraCharge,
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

  if (deliveryFeesEgp !== undefined && (typeof deliveryFeesEgp !== 'number' || deliveryFeesEgp < 0)) {
    throw new ValidationError('deliveryFeesEgp must be a non-negative number.');
  }



  if (dineinExtraCharge !== undefined && (typeof dineinExtraCharge !== 'number' || dineinExtraCharge < 0 )) {
    throw new ValidationError('dineinExtraCharge must be a non-negative number.');
  }
const hasDinein = (dineinExtraCharge ?? 0) > 0;
const hasDelivery = (deliveryFeesEgp ?? 0) > 0;

if (hasDinein && hasDelivery) {
  throw new ValidationError('Cannot have both dine-in charge and delivery fees in the same order.');
}

}
