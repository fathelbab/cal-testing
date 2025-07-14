export interface FinalTotalInput {
  totalPriceWithVat: number;
  dineinCharge?: number;
  deliveryFeesEgp?: number;
  loyaltyDiscount: number;
  promocodeDiscount: number;
}



export function calculateFinalTotal({
  totalPriceWithVat,
  dineinCharge,
  deliveryFeesEgp,
  loyaltyDiscount,
  promocodeDiscount,
}: FinalTotalInput): number {
  const charges = (dineinCharge ?? 0) + (deliveryFeesEgp ?? 0);
  const totalBeforeDiscount = totalPriceWithVat + charges;

  const afterPromo = Math.max(0, totalBeforeDiscount - (promocodeDiscount ?? 0));

  const afterLoyalty = Math.max(0, afterPromo - (loyaltyDiscount ?? 0));

  return afterLoyalty;
}
