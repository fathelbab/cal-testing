export interface PromocodeConfig {
  fixed?: number;
  percentage?: number;
}
export interface IPromocodeConfig {
  data: {
    allowedDiscountItemsArr: any[];
    id: number;
    coupon_type: "checkout" | string;
    code: string;
    is_active: boolean;
    contains_offers: boolean;
    contains_menu_items: boolean;
    absolute_no_of_uses: number;
    no_of_uses: number;
    discount_type: "percentage" | "fixed" | string;
    delivery_type: "all" | "delivery_only" | string;
    discount_value: number;
    start_date: number;
    end_date: number;
    min_basket: number;
    customer_previous_orders: number;
    allow_customers: boolean;
    allow_guests: boolean;
    allowed_discount_items: IAllowedDiscountItem[];
    allowed_number_of_discount_items: number;
    allowed_menu_items: any[];
    allowed_offers: any[];
    allowed_branches: any[];
    limit_customer_previous_orders: boolean;
    allowedAppTypeId: number;
    excludes_offers: boolean;
    allow_loyalty: boolean;
  };
  valid: boolean;
  error_message: string;
  coupon_discount_items: any[];
}

export interface IAllowedDiscountItem {
  menuItemSizePriceId: number;
  net_price: number;
  total_price: number;
}

export const appTypeMap = {
  1: 'mobile',
  2: 'web',
  3: 'kiosk',
  10: 'all',
} as const;



export function calculatePromocodeValue(
  coupon: IPromocodeConfig | undefined,
  totalNetPrice: number,
  deliveryFeesEgp: number,
  deliveryType: string,
  appType: number
): number {
  const now = Date.now();
  if (
    !coupon?.valid ||
    !coupon.data?.is_active ||
    coupon.data.start_date > now ||
    now > coupon.data.end_date
  ) return 0;

  const couponData = coupon.data;

  const meetsMinBasket = totalNetPrice >= (couponData.min_basket || 0);

  const matchesDeliveryType =
    couponData.delivery_type === 'all' ||
    (couponData.delivery_type === 'delivery_only' && deliveryType === 'DELIVERY') ||
    (couponData.delivery_type === 'pickup_only' && deliveryType === 'PICKUP') ||
    (couponData.delivery_type === 'dinein_only' && deliveryType === 'DINEIN');

  let matchesAppType = true;
  if (appType && couponData.allowedAppTypeId) {
    const allowedAppTypeKey = couponData.allowedAppTypeId as unknown as keyof typeof appTypeMap;
    matchesAppType = appTypeMap[allowedAppTypeKey] === appTypeMap[appType as keyof typeof appTypeMap];
  }

  if (!meetsMinBasket || !matchesDeliveryType || !matchesAppType) return 0;

  switch (couponData.discount_type) {
    case 'percentage':
      return (totalNetPrice * couponData.discount_value) / 100;
    case 'fixed':
    case 'Absolute':
      return couponData.discount_value;
    case 'free_delivery':
      return deliveryFeesEgp;
    default:
      return 0;
  }
}
