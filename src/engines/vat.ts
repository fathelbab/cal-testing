export interface VatInput {
  totalNetPriceAfterDiscount: number;
  avgVat: number;
  vatableFees?: number; // e.g. deliveryFeesEgp OR dineinCharge, can be 0 or undefined
}


export function calculateTotalVat({
  totalNetPriceAfterDiscount,
  avgVat,
  vatableFees = 0,
}: VatInput): number {
  if (avgVat <= 0) {
    avgVat = 1
  }
  if (vatableFees <= 0) {
    vatableFees = 1
  }
  return (totalNetPriceAfterDiscount * 1.14) + (vatableFees * 0.14);
}


export function calculateVatDetails(
  totalNetPrice: number,
  totalPriceWithVat: number,
  dineinCharge?: number,
  deliveryFeesEgp?: number,
  promoCodeDiscount?: number,
  loyaltyDiscount?: number
) {

  // Prevent division by zero - if totalNetPrice is 0, avgVat should be 0
  const avgVat = totalNetPrice > 0 ? (totalPriceWithVat - totalNetPrice) / totalNetPrice : 0;
  // Prevent negative net price after discounts
  const totalNetPriceAfterDiscount = Math.max(totalNetPrice - (promoCodeDiscount ?? 0) - (loyaltyDiscount ?? 0), 0);

  const vatableFees = dineinCharge || deliveryFeesEgp || 0;
  const vatOnCharges = vatableFees * 0.14;
  const netPriceAfterDiscountVat = totalNetPriceAfterDiscount * avgVat;

  return {
    avgVat,
    vatOnCharges,
    netPriceAfterDiscountVat,
    totalVat: netPriceAfterDiscountVat + vatOnCharges
  };
}
