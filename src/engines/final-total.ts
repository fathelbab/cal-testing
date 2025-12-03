import { IFinalTotalInput } from '../models/FinalTotal';
export function calculateFinalTotal({
  totalVat,
  itemsNetPriceAfterDiscount,
  dineinExtraCharge,
  deliveryFeesEgp
}: IFinalTotalInput): number {
  
 return totalVat + itemsNetPriceAfterDiscount + deliveryFeesEgp + dineinExtraCharge

   }
