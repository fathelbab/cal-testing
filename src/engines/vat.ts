import { IVatInput, IVatOutPut } from "../models/Vat";

/**
 * Calculates detailed VAT breakdown including:
 * - Average VAT percentage.
 * - VAT on additional charges.
 * - VAT on the net price after discounts.
 * - Total VAT amount.
 *
 * @param {number} itemsNetPrice - Total net price of items before VAT.
 * @param {number} itemsTotalPrice - Total price of items including VAT.
 * @param {number} dineinExtraCharge - Extra charge for dine-in service.
 * @param {number} effectiveDeliveryFeesEgp - Delivery fees in EGP.
 * @param {number} appliedPromoCode - Applied promocode discount amount.
 * @param {number} appliedLoyalty - Applied loyalty discount amount.
 *
 * @returns {{
*   avgVat: number,
*   vatOnCharges: number,
*   netPriceAfterDiscountVat: number,
*   totalVat: number
* }} An object containing VAT breakdown.
*
* @example
* const vatDetails = calculateVatDetails(100, 114, 10, 0, 5, 0);
* console.log(vatDetails);
* // ➜ {
* //   avgVat: 0.14,
* //   vatOnCharges: 1.4,
* //   netPriceAfterDiscountVat: 13.3,
* //   totalVat: 14.7
* // }
*/
export function calculateVatDetails(
  data: IVatInput
): IVatOutPut {

  const vatableFees = (data.dineinExtraCharge ?? 0) + (data.effectiveDeliveryFeesEgp ?? 0);
  const vatOnCharges = vatableFees * 0.14;
    const VatOnItems =
  data.itemsNetPriceAfterDiscount > 0 ? data.itemsNetPriceAfterDiscount * 0.14 : 0;


  return {
    vatOnCharges,
    netPriceAfterDiscountVat:VatOnItems,
    totalVat: VatOnItems + vatOnCharges
  };
}
