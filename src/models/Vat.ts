export interface VatInput {
  itemsNetPriceAfterDiscount: number,
  itemsTotalPrice: number,
  dineinExtraCharge?: number,
  effectiveDeliveryFeesEgp?: number,
  appliedPromoCode?: number,
  appliedLoyalty?: number
}
export interface VatOutPut {
  vatOnCharges: number,
  netPriceAfterDiscountVat: number,
  totalVat: number
} 