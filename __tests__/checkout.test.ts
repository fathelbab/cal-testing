import { checkout, CheckoutConfig } from '../src/index';

// Jest types are available globally when using ts-jest
describe('checkout', () => {
  it('should calculate basic cart totals', () => {
    const config: CheckoutConfig = {
      menuItems: [
        {
          id: 1,
          quantity: 2,
          size: {
            fullData: {
              net_price: 10.00,
              total_price: 11.40
            }
          }
        }
      ],
      offers: [],
      deliveryType: 2, // pickup
      branchConfig: {}
    };

    const result = checkout(config);
    
    expect(result.totals.subTotalNet).toBe(20.00);
    expect(result.totals.subTotalPrice).toBe(22.80);
    expect(result.totals.finalTotal).toBe(22.80);
  });

  it('should calculate delivery fees', () => {
    const config: CheckoutConfig = {
      menuItems: [
        {
          id: 1,
          quantity: 1,
          size: {
            fullData: {
              net_price: 10.00,
              total_price: 11.40
            }
          }
        }
      ],
      offers: [],
      deliveryType: 1, // delivery
      branchConfig: {
        branch_delivery_charge: 5.00,
        delivery_time: 30
      }
    };

    const result = checkout(config);
    
    expect(result.totals.deliveryFee).toBe(5.00);
    expect(result.totals.deliveryFeeWithVat).toBe(5.70);
    expect(result.totals.deliveryTime).toBe(30);
  });

  it('should apply promocode discount', () => {
    const config: CheckoutConfig = {
      menuItems: [
        {
          id: 1,
          quantity: 1,
          size: {
            fullData: {
              net_price: 100.00,
              total_price: 114.00
            }
          }
        }
      ],
      offers: [],
      deliveryType: 2,
      branchConfig: {},
      promocodePercentage: 10
    };

    const result = checkout(config);
    
    expect(result.totals.afterPromocode).toBe(102.60); // 114 - 10%
    expect(result.totals.finalTotal).toBe(102.60);
  });

  it('should apply loyalty points', () => {
    const config: CheckoutConfig = {
      menuItems: [
        {
          id: 1,
          quantity: 1,
          size: {
            fullData: {
              net_price: 100.00,
              total_price: 114.00
            }
          }
        }
      ],
      offers: [],
      deliveryType: 2,
      branchConfig: {},
      userPointsInfo: {
        points: 100,
        pendingPoints: 0,
        pointsValue: 50.00,
        pendingPointsValue: 0
      }
    };

    const result = checkout(config);
    
    expect(result.totals.loyaltyCredit).toBe(50.00);
    expect(result.totals.pointsUsed).toBe(100);
    expect(result.totals.finalTotal).toBe(64.00); // 114 - 50
  });
}); 