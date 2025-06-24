import { CartItem } from './CartItem';
import { OfferItem } from './OfferItem';

export interface UserPointsInfo {
  points: number;
  pendingPoints: number;
  pointsValue: number;
  pendingPointsValue: number;
}

export interface CheckoutConfig {
  menuItems: CartItem[];
  offers: OfferItem[];
  deliveryType: 1 | 2 | 3;
  branchConfig: {
    branch_delivery_charge?: number;
    streets_delivery_time?: boolean;
    delivery_time?: number;
  };
  addressConfig?: {
    street: {
      delivery_charge: number;
      delivery_time: number;
    };
  };
  promocodeFixed?: number;
  promocodePercentage?: number;
  deliveryPromocode?: boolean;
  dineinFixed?: number;
  dineinPercentage?: number;
  userPointsInfo?: UserPointsInfo;
} 