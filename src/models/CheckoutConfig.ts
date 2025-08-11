import { Item } from './Items';
import { IPromocodeConfig } from './Promocode';

export enum deliveryType {
  DELIVERY =  "DELIVERY",
  PICKUP= "PICKUP",
  DINEIN= "DINEIN"
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