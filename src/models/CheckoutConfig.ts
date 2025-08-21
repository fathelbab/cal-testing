import { ICartItem } from './CartItem';
import { IPromocodeConfig } from './Promocode';


export const DELIVERY_TYPES = {
  DELIVERY: 1,
  PICKUP: 2,
  DINEIN: 3,
};

export type DeliveryTypeId = 1 | 2 | 3;

export interface ICheckoutConfig {
  cartMenuItems?: ICartItem[];
  cartOffers?: ICartItem[];
  deliveryFeesEgp?: number;
  loyaltyBalance?: number;
  dineinExtraCharge?: number;
  coupon?: IPromocodeConfig | null ;
  deliveryType: DeliveryTypeId;
  appType?: number;
} 