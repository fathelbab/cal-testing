import { FinalTotalInput } from '../models/FinalTotal';

export function calculateFinalTotal({
  itemsTotalPrice,
  dineinExtraChargeWithVat,
  effectiveDeliveryFeesEgp,
  loyaltyDiscount,
  promocodeDiscount,
}: FinalTotalInput): number {
  const charges = (dineinExtraChargeWithVat ?? 0) + (effectiveDeliveryFeesEgp ?? 0);
  const totalBeforeDiscount = itemsTotalPrice + charges;

  const afterPromo = Math.max(0, totalBeforeDiscount - (promocodeDiscount ?? 0));

  const afterLoyalty = Math.max(0, afterPromo - (loyaltyDiscount ?? 0));

  return afterLoyalty;
}
