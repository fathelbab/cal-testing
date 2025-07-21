import { Item } from '../engines/items';
import { IPromocodeConfig } from '../engines/promocode';

export enum deliveryType {
  DELIVERY =  "DELIVERY",
  PICKUP= "PICKUP",
  DINEIN= "DINEIN"
}


export interface CheckoutConfig {
  menuItems?: Item[];
  offers?: Item[];
  deliveryFeesEgp?: number;
  loyaltyBalance?: number;
  dineinPercentage?: number;
  dineinExtraCharge?: number;
  dineinExtraChargeWithVat?: number;
  dineinFixed?: number;
  coupon?: IPromocodeConfig;
  deliveryType: deliveryType;
  appType: number;
} 