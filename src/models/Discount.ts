export interface DiscountInput {
  totalNetPrice: number;
  loyaltyDiscount?: number;
  promoCodeDiscount?: number;
}

export interface DiscountOutput {
  loyaltyDiscountAmount: number;
  promocodeDiscountAmount: number;
} 