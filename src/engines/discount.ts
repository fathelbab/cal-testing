export interface DiscountInput {
    totalNetPrice: number;
    loyaltyDiscount?: number;
    promoCodeDiscount?: number;
}

export interface DiscountOutput {
    loyaltyDiscountAmount: number;
    promocodeDiscountAmount: number;
}
export function applyDiscountsInOrder(totalNetPrice: number, promoCodeDiscount: number = 0, loyaltyDiscount: number = 0) {
    // Step 1: Apply promo code discount (cannot exceed totalNetPrice)
    const appliedPromo = Math.min(promoCodeDiscount, totalNetPrice);
    const afterPromo = totalNetPrice - appliedPromo;
    // Step 2: Apply loyalty discount (cannot exceed what's left)
    const appliedLoyalty = Math.min(loyaltyDiscount, afterPromo);
    const afterLoyalty = afterPromo - appliedLoyalty;
    return {
      appliedPromo,
      appliedLoyalty,
      netAfterDiscounts: afterLoyalty
    };
  }


