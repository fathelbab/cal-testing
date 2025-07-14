export interface DineinConfig {
  fixed?: number;
  percentage?: number;
}
export function calcDineinCharge(netTotal: number, { fixed = 0, percentage = 0 }: DineinConfig): number {
  if (percentage > 0) return parseFloat(((netTotal * percentage) / 100).toFixed(2));
  if (fixed > 0 ) return fixed;
  return 0;
} 