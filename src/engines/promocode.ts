export interface PromocodeConfig {
  fixed?: number;
  percentage?: number;
}

export function applyPromocode(amount: number, { fixed = 0, percentage = 0 }: PromocodeConfig): number {
  if (fixed > 0) return amount - fixed;
  if (percentage > 0) return amount - (amount * percentage) / 100;
  return amount;
} 