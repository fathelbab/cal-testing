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
  if (typeof item.quantity !== 'number' || item.quantity <= 0) {
    throw new ValidationError(`menuItems[${index}].quantity must be a positive number.`);
  }
  if (typeof item.required_netPrice !== 'number' || item.required_netPrice < 0) {
    throw new ValidationError(`menuItems[${index}].required_netPrice must be a non-negative number.`);
  }
  if (typeof item.required_totalPrice !== 'number' || item.required_totalPrice < 0) {
    throw new ValidationError(`menuItems[${index}].required_totalPrice must be a non-negative number.`);
  }
}

function validateOfferItem(offer: IItem, index: number): void {
  if (!offer || typeof offer !== 'object') {
    throw new ValidationError(`offers[${index}] must be a valid object.`);
  }
  if (typeof offer.quantity !== 'number' || offer.quantity <= 0) {
    throw new ValidationError(`offers[${index}].quantity must be a positive number.`);
  }
  if (typeof offer.required_netPrice !== 'number' || offer.required_netPrice < 0) {
    throw new ValidationError(`offers[${index}].required_netPrice must be a non-negative number.`);
  }
  if (typeof offer.required_totalPrice !== 'number' || offer.required_totalPrice < 0) {
    throw new ValidationError(`offers[${index}].required_totalPrice must be a non-negative number.`);
  }
}

export function validateCheckoutConfig(config: CheckoutConfig): void {
  if (!config) throw new ValidationError('Checkout config is required.');

  const {
    menuItems,
    offers,
    deliveryFeesEgp,
    loyaltyDiscount,
    promoCodeDiscount,
    dineinPercentage,
    dineinFixed,
  } = config;

  if (!Array.isArray(menuItems) && !Array.isArray(offers)) {
    throw new ValidationError('At least one of menuItems or offers must be provided.');
  }

  if (menuItems) {
    if (!Array.isArray(menuItems)) throw new ValidationError('menuItems must be an array.');
    menuItems.forEach(validateMenuItem);
  }

  if (offers) {
    if (!Array.isArray(offers)) throw new ValidationError('offers must be an array.');
    offers.forEach(validateOfferItem);
  }

  if (typeof loyaltyDiscount !== 'number' || loyaltyDiscount < 0) {
    throw new ValidationError('loyaltyDiscount must be a non-negative number.');
  }

  if (typeof promoCodeDiscount !== 'number' || promoCodeDiscount < 0) {
    throw new ValidationError('promoCodeDiscount must be a non-negative number.');
  }

  if (deliveryFeesEgp !== undefined && (typeof deliveryFeesEgp !== 'number' || deliveryFeesEgp < 0)) {
    throw new ValidationError('deliveryFeesEgp must be a non-negative number.');
  }

  if (dineinFixed !== undefined && (typeof dineinFixed !== 'number' || dineinFixed < 0)) {
    throw new ValidationError('dineinFixed must be a non-negative number.');
  }

  if (dineinPercentage !== undefined && (typeof dineinPercentage !== 'number' || dineinPercentage < 0 || dineinPercentage > 100)) {
    throw new ValidationError('dineinPercentage must be between 0 and 100.');
  }
const hasDinein = (dineinFixed ?? 0) > 0 || (dineinPercentage ?? 0) > 0;
const hasDelivery = (deliveryFeesEgp ?? 0) > 0;

if (hasDinein && hasDelivery) {
  throw new ValidationError('Cannot have both dine-in charge and delivery fees in the same order.');
}

}
