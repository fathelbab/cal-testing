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
  


export function applyPromocode(amount: number, { fixed = 0, percentage = 0 }: PromocodeConfig): number {
  if (fixed > 0) return amount - fixed;
  if (percentage > 0) return amount - (amount * percentage) / 100;
  return amount;
} 