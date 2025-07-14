// import { CheckoutResult } from '../index';

// export interface CartMetadata {
//   promocode?: string;
//   isReorder?: boolean;
//   schedule?: any;
// }

// export interface User {
//   id: number;
//   [key: string]: any;
// }

// export interface OrderPayload {
//   total_net_price: string;
//   total_net_price_with_vat: string;
//   total_price_before_discount: string;
//   total_price_after_discount: string;
//   delivery_charge: number;
//   delivery_charge_with_vat: number;
//   dinein_extra_charge: number;
//   dinein_extra_charge_with_vat: string;
//   items: Array<{
//     menu_item: number;
//     count: number;
//     price: number;
//   }>;
//   offers: Array<{
//     offer: number;
//     count: number;
//     price: number;
//   }>;
//   coupon_code?: string;
//   is_reorder: boolean;
//   schedule_data?: any;
// }

// /**
//  * Transform checkout result into your backend order payload.
//  */
// export function buildOrderPayload(
//   checkoutResult: CheckoutResult, 
//   user: User, 
//   cartMetadata: CartMetadata = {}
// ): OrderPayload {
//   const { items, offers, totals } = checkoutResult;
  
//   return {
//     total_net_price: totals.subTotalNet.toFixed(2),
//     total_net_price_with_vat: (totals.subTotalNet * 1.14).toFixed(2),
//     total_price_before_discount: (
//       totals.subTotalPrice + 
//       totals.deliveryFeeWithVat + 
//       totals.dineinCharge + 
//       (totals.vat - ((totals.deliveryFeeWithVat - totals.deliveryFee) + ((totals.dineinCharge * 1.14) - totals.dineinCharge)))
//     ).toFixed(2),
//     total_price_after_discount: totals.finalTotal.toFixed(2),
//     delivery_charge: totals.deliveryFee,
//     delivery_charge_with_vat: totals.deliveryFeeWithVat,
//     dinein_extra_charge: totals.dineinCharge,
//     dinein_extra_charge_with_vat: (totals.dineinCharge * 1.14).toFixed(2),
//     items: items.map(i => ({ 
//       menu_item: i.id, 
//       count: i.quantity, 
//       price: i.cartPrice 
//     })),
//     offers: offers.map(o => ({ 
//       offer: o.id, 
//       count: o.quantity, 
//       price: o.cartPrice 
//     })),
//     ...(cartMetadata.promocode ? { coupon_code: cartMetadata.promocode } : {}),
//     is_reorder: !!cartMetadata.isReorder,
//     ...(cartMetadata.schedule ? { schedule_data: cartMetadata.schedule } : {})
//   };
// } 