import { IItem } from "./CartItem";

export interface Item extends IItem { }

export interface PricedCartItem {
  netPrice: number;
  totalPrice: number;
} 