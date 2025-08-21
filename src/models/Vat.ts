export interface IVatInput {
  itemsNetPriceAfterDiscount: number,
  itemsTotalPrice: number,
  dineinExtraCharge?: number,
  effectiveDeliveryFeesEgp?: number,
  appliedPromoCode?: number,
  appliedLoyalty?: number
}
export interface IVatOutPut {
  vatOnCharges: number,
  netPriceAfterDiscountVat: number,
  totalVat: number
} 