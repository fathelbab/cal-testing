import { UserPointsInfo } from '../models/CheckoutConfig';

export interface LoyaltyResult {
  pointsUsed: number;
  creditValue: number;
}

export function applyLoyalty(amount: number, { 
  points = 0, 
  pendingPoints = 0, 
  pointsValue = 0, 
  pendingPointsValue = 0 
}: Partial<UserPointsInfo>): LoyaltyResult {
  const availableValue = pointsValue - pendingPointsValue;
  if (amount >= availableValue) {
    return { pointsUsed: points, creditValue: availableValue };
  }
  const valuePerPoint = availableValue / points;
  const used = Math.floor(amount / valuePerPoint);
  return { pointsUsed: used, creditValue: used * valuePerPoint };
} 