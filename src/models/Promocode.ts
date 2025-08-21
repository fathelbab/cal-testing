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
    allowedAppTypeId: appTypeId;
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
  mobile: 1,
  web: 2,
  kiosk: 3,
  all : 10
};

export type appTypeId = 1 | 2 | 3 | 10;

export interface IApplyDiscountResults {
  appliedPromoCode:number;
  appliedLoyalty:number;
  itemsNetPriceAfterDiscount:number;
}