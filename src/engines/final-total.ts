import { FinalTotalInput } from '../models/FinalTotal';
export function calculateFinalTotal({
  totalVat,
  itemsNetPriceAfterDiscount,
  dineinExtraCharge,
  deliveryFeesEgp
}: FinalTotalInput): number {
  
 return totalVat + itemsNetPriceAfterDiscount + deliveryFeesEgp + dineinExtraCharge

   }
