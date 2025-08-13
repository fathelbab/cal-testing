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
    discount_type: "percentage" |  "delivery_free" | "fixed" | "absolute" | string;
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

export interface IapplyDiscountResults {
  appliedPromoCode:number;
  appliedLoyalty:number;
  itemsNetPriceAfterDiscount:number;
}