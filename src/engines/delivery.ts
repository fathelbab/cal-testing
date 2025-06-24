import { CheckoutConfig } from '../models/CheckoutConfig';

export interface DeliveryFees {
  fee: number;
  feeWithVat: number;
  time: number;
}

export function calcDeliveryFees({ 
  branchConfig, 
  addressConfig, 
  deliveryType 
}: Pick<CheckoutConfig, 'branchConfig' | 'addressConfig' | 'deliveryType'>): DeliveryFees {
  if (deliveryType !== 1) return { fee: 0, feeWithVat: 0, time: 0 };

  const base = branchConfig.branch_delivery_charge || addressConfig?.street.delivery_charge || 0;
  
  // If streets_delivery_time is true, use branch delivery time, otherwise use address delivery time
  const time = branchConfig.streets_delivery_time === true ? 
    (branchConfig.delivery_time || 0) : 
    (addressConfig?.street.delivery_time || branchConfig.delivery_time || 0);
    
  const feeWithVat = parseFloat((base * 1.14).toFixed(2));

  return { fee: parseFloat(base.toString()), feeWithVat, time };
} 