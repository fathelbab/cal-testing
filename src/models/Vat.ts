export interface VatInput {
  itemsNetPrice: number,
  itemsTotalPrice: number,
  dineinExtraCharge?: number,
  effectiveDeliveryFeesEgp?: number,
  appliedPromoCode?: number,
  appliedLoyalty?: number
}
export interface VatOutPut {
  avgVat: number,
  vatOnCharges: number,
  netPriceAfterDiscountVat: number,
  totalVat: number
} 