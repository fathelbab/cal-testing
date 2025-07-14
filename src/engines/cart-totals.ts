
export interface CartTotalsResults {
  totalNetPrice: number;
  totalPriceWithVat: number;
}
export interface Isumcart {
  netPrice: number;
  totalPrice: number;
}

export function sumCart(items:Isumcart[]): CartTotalsResults {
  return items.reduce(
    (sum, i) => ({
      totalPriceWithVat: sum.totalPriceWithVat + i.totalPrice ,
      totalNetPrice: sum.totalNetPrice + i.netPrice ,
    }),
    { totalPriceWithVat: 0, totalNetPrice: 0 }
  );
} 