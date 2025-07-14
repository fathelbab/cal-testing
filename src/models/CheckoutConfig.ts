import { Item } from '../engines/items';
import { IPromocodeConfig } from '../engines/promocode';



export interface CheckoutConfig {
  menuItems?: Item[];
  offers?: Item[];
  deliveryFeesEgp?:number;
  loyaltyDiscount?:number;
  promoCodeDiscount?:number;
  dineinPercentage?:number;
  dineinFixed?:number;
  coupon?:IPromocodeConfig
} 