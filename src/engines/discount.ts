import { IapplyDiscountResults } from "../models/Promocode";

/**
 * Applies discounts in a specific order: first the promocode discount, then the loyalty discount.
 * Ensures that neither discount exceeds the remaining total at its step.
 *
 * @param {number} totalNetPrice - The total net price before applying any discounts.
 * @param {number} [promoCodeDiscount=0] - The discount amount from a promocode (default is 0).
 * @param {number} [loyaltyDiscount=0] - The discount amount from loyalty points/balance (default is 0).
 *
 * @returns {{ appliedPromoCode: number, appliedLoyalty: number, netAfterDiscounts: number }}  
 *   An object containing:
 *   - `appliedPromoCode`: The actual applied promocode discount.
 *   - `appliedLoyalty`: The actual applied loyalty discount.
 *   - `netAfterDiscounts`: The net total after both discounts.
 *
 * @example
 * // Example 1: Both discounts fully applicable
 * const result1 = applyDiscountsInOrder(200, 50, 30);
 * console.log(result1);
 * // ➜ { appliedPromoCode: 50, appliedLoyalty: 30, netAfterDiscounts: 120 }
 *
 * @example
 * // Example 2: Promocode discount exceeds totalNetPrice
 * const result2 = applyDiscountsInOrder(100, 150, 50);
 * console.log(result2);
 * // ➜ { appliedPromoCode: 100, appliedLoyalty: 0, netAfterDiscounts: 0 }
 *
 * @example
 * // Example 3: Loyalty discount exceeds remaining after promo
 * const result3 = applyDiscountsInOrder(100, 30, 80);
 * console.log(result3);
 * // ➜ { appliedPromoCode: 30, appliedLoyalty: 70, netAfterDiscounts: 0 }
 */
export function applyDiscountsInOrder(totalNetPrice: number, promoCodeDiscount: number = 0, loyaltyDiscount: number = 0):IapplyDiscountResults {
    // Step 1: Apply promo code discount (cannot exceed totalNetPrice)
    const appliedPromoCode = Math.min(promoCodeDiscount, totalNetPrice);
    const afterPromoCode = totalNetPrice - appliedPromoCode;
    // Step 2: Apply loyalty discount (cannot exceed what's left)
    const appliedLoyalty = Math.min(loyaltyDiscount, afterPromoCode);
    const afterLoyalty = afterPromoCode - appliedLoyalty;
    return {
      appliedPromoCode,
      appliedLoyalty,
      netAfterDiscounts: afterLoyalty
    };
  }


