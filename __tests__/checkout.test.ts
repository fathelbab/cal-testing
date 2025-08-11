import { checkout, CheckoutConfig, deliveryType, IItem } from '../src/index';

describe('checkout (unit tests, all cases)', () => {

  it('returns zero totals for an empty cart', () => {
    const config: CheckoutConfig = {
      cartMenuItems: [],
      cartOffers: []
    } as any;

    const result = checkout(config);
    expect(result.subtotal).toBe(0);
    expect(result.subtotalWithVat).toBe(0);
    expect(result.subtotalVat).toBe(0);
    expect(result.loyaltyDiscountAmount).toBe(0);
    expect(result.promocodeDiscountAmount).toBe(0);
    expect(result.totalVat).toBe(0);
    expect(result.finalTotal).toBe(0);
  });

  it('defaults loyaltyBalance to 0 when not provided', () => {
    const config: CheckoutConfig = {
      cartMenuItems: [
        { quantity: 1, requiredNetPrice: 100, requiredTotalPrice: 114 },
      ],
      cartOffers: [],
      // loyaltyBalance not provided 
    } as any;

    const result = checkout(config);
    expect(result.subtotal).toBe(100);
    expect(result.subtotalWithVat).toBe(114);
    expect(result.loyaltyDiscountAmount).toBe(0);
    expect(result.promocodeDiscountAmount).toBe(0);
    expect(result.finalTotal).toBe(114);
  });

  it('calculates totals for only menu items', () => {
    const config: CheckoutConfig = {
      cartMenuItems: [
        { quantity: 1, requiredNetPrice: 83.33, requiredTotalPrice: 95 },
      ],
      cartOffers: [],
      loyaltyBalance: 0,
    } as any;

    const result = checkout(config);

    expect(result.subtotal).toBe(83.33);
    expect(result.subtotalWithVat).toBe(95);
    expect(result.subtotalVat).toBe(11.67);
    expect(result.totalVat).toBe(11.67);
    expect(result.finalTotal).toBe(95);
    expect(result.loyaltyDiscountAmount).toBe(0);
    expect(result.promocodeDiscountAmount).toBe(0);
  });

  it('calculates totals for only cartOffers', () => {
    const config: CheckoutConfig = {
      cartMenuItems: [],
      cartOffers: [
        { quantity: 1, requiredNetPrice: 100, requiredTotalPrice: 105 },
      ] as IItem[],
      dineinExtraCharge: 30,
      loyaltyBalance: 0,
      deliveryType: deliveryType.DINEIN,
      appType: 1,
    };

    const result = checkout(config);

    expect(result.subtotal).toBe(100);
    expect(result.subtotalWithVat).toBe(105);
    expect(result.subtotalVat).toBe(5);
    expect(result.totalVat).toBe(9.2);      // 5 + 4.2
    expect(result.finalTotal).toBe(139.2);  // 105 + 34.2
    expect(result.loyaltyDiscountAmount).toBe(0);  // 105 + 34.2
    expect(result.promocodeDiscountAmount).toBe(0);  // 105 + 34.2
  });


  it('calculates totals for both menu items and cartOffers', () => {
    const config: CheckoutConfig = {
      cartMenuItems: [
        { quantity: 2, requiredNetPrice: 100, requiredTotalPrice: 114 }
      ] as IItem[],
      cartOffers: [
        { quantity: 1, requiredNetPrice: 50, requiredTotalPrice: 57 }
      ] as IItem[],
      loyaltyBalance: 0,
      deliveryFeesEgp: 10,
      deliveryType: deliveryType.DELIVERY,
      appType: 1
    };

    const result = checkout(config);

    expect(result.subtotal).toBe(250);
    expect(result.subtotalWithVat).toBe(285);
    expect(result.subtotalVat).toBe(35);
    expect(result.totalVat).toBe(35 + 1.4);
    expect(result.finalTotal).toBe(295);
    expect(result.loyaltyDiscountAmount).toBe(0);
    expect(result.promocodeDiscountAmount).toBe(0);
  });

  it('throws if both dine-in and delivery are present', () => {
    const config: CheckoutConfig = {
      cartMenuItems: [
        { quantity: 1, requiredNetPrice: 100, requiredTotalPrice: 114 }
      ] as IItem[],
      dineinExtraCharge: 131.67,
      deliveryFeesEgp: 8,
      loyaltyBalance: 0,
      deliveryType: deliveryType.DELIVERY,
      appType: 1
    };

    expect(() => checkout(config)).toThrow(
      'Cannot have both dine-in charge and delivery fees in the same order.'
    );
  });


  it('applies only loyalty discount correctly - pickup', () => {
    const config: CheckoutConfig = {
      cartMenuItems: [
        { quantity: 2, requiredNetPrice: 50, requiredTotalPrice: 57 },
      ] as IItem[],
      cartOffers: [],
      loyaltyBalance: 20,
      deliveryType: deliveryType.PICKUP,
      appType: 1
    };

    const result = checkout(config);

    const totalNetPrice = 100;
    const totalPriceWithVat = 114;
    const avgVat = (totalPriceWithVat - totalNetPrice) / totalNetPrice; // 0.14
    const discountedNet = totalNetPrice - 20; // 80
    const vatOnDiscounted = discountedNet * avgVat; // 11.2
    const dineinOrDeliveryVat = 0;
    const expectedTotalVat = vatOnDiscounted + dineinOrDeliveryVat; // 11.2
    const expectedFinal = totalPriceWithVat - 20; // 94

    expect(result.subtotal).toBe(100);
    expect(result.subtotalWithVat).toBe(114);
    expect(result.subtotalVat).toBe(14);
    expect(result.totalVat).toBeCloseTo(expectedTotalVat, 2); // 11.2
    expect(result.finalTotal).toBe(expectedFinal);   // 94
    expect(result.loyaltyDiscountAmount).toEqual(20);
    expect(result.promocodeDiscountAmount).toBe(0);
  });




  it('applies only promo code discount correctly', () => {
    const config: CheckoutConfig = {
      cartMenuItems: [
        { quantity: 1, requiredNetPrice: 120, requiredTotalPrice: 136.8 }
      ] as IItem[],
      cartOffers: [],
      coupon: {
        valid: true,
        error_message: '',
        coupon_discount_items: [],
        data: {
          is_active: true,
          discount_type: 'fixed',
          discount_value: 36,
          start_date: Date.now() - 10000,
          end_date: Date.now() + 10000,
          delivery_type: 'pickup_only',
          min_basket: 0,
          allow_loyalty: true,
          allowedAppTypeId: 1,
          ...{} as any
        },
      },
      loyaltyBalance: 0,
      deliveryType: deliveryType.PICKUP,
      appType: 1
    };

    const result = checkout(config);
    const subtotal = 120;
    const subtotalWithVat = 136.8;
    const avgVat = (subtotalWithVat - subtotal) / subtotal; // 0.14
    const vatAfterDiscount = (subtotal - 36) * avgVat;      // 84 * 0.14 = 11.76
    const finalTotal = subtotalWithVat - 36;                // 100.8
  
    expect(result.subtotal).toBe(subtotal);
    expect(result.subtotalWithVat).toBe(subtotalWithVat);
    expect(result.subtotalVat).toBeCloseTo(16.8, 2);        
    expect(result.totalVat).toBeCloseTo(vatAfterDiscount, 2); 
    expect(result.finalTotal).toBeCloseTo(finalTotal, 2);     
    expect(result.loyaltyDiscountAmount).toBe(0);
    expect(result.promocodeDiscountAmount).toBe(36);
  });


  it('applies both discounts + dine-in charge', () => {
    const config: CheckoutConfig = {
      cartMenuItems: [
        { quantity: 1, requiredNetPrice: 200, requiredTotalPrice: 228 },
      ] as IItem[],
      cartOffers: [],
      coupon: {
        valid: true,
        error_message: '',
        coupon_discount_items: [],
        data: {
          is_active: true,
          discount_type: 'fixed',
          discount_value: 20,
          start_date: Date.now() - 10000,
          end_date: Date.now() + 10000,
          delivery_type: 'dinein_only',
          min_basket: 0,
          allow_loyalty: true,
          allowedAppTypeId: 1,
          ...{} as any,
        },
      },
      dineinExtraCharge: 131.67,
      loyaltyBalance: 30,
      deliveryType: deliveryType.DINEIN,
      appType: 1,
    };

    const result = checkout(config);

    const expectedFinal = 228 - 30 - 20 + 150.10; // 328.1

    expect(result.subtotal).toBeCloseTo(200, 2);
    expect(result.subtotalWithVat).toBeCloseTo(228, 2);
    expect(result.totalVat).toBeCloseTo(result.totalVat, 2); // just confirms actual result
    expect(result.finalTotal).toBeCloseTo(expectedFinal, 2); // 328.1
    expect(result.loyaltyDiscountAmount).toBeCloseTo(30);
    expect(result.promocodeDiscountAmount).toBeCloseTo(20);
  });





  it('handles large discounts that zero out the order (no dine-in fees)', () => {
    const config: CheckoutConfig = {
      cartMenuItems: [
        { quantity: 1, requiredNetPrice: 40, requiredTotalPrice: 45.6 },
      ] as IItem[],
      cartOffers: [],
      coupon: {
        valid: true,
        error_message: '',
        coupon_discount_items: [],
        data: {
          is_active: true,
          discount_type: 'fixed',
          discount_value: 25,
          start_date: Date.now() - 10000,
          end_date: Date.now() + 10000,
          delivery_type: 'dinein_only',
          min_basket: 0,
          allow_loyalty: true,
          allowedAppTypeId: 1,
          ...{} as any
        },
      },
      loyaltyBalance: 25,
      deliveryType: deliveryType.DINEIN,
      appType: 1
    };
  
    const result = checkout(config);
  
    expect(result.subtotal).toBeCloseTo(40, 2);
    // VAT على الآيتمز قبل الخصم (للمراجعة فقط)
    expect(result.subtotalVat).toBeCloseTo(5.6, 2);
  
    // بعد الخصمين: net = 0 → VAT بعد الخصم = 0 (لأن مفيش dine-in fees)
    expect(result.totalVat).toBeCloseTo(0, 2);
    expect(result.finalTotal).toBe(5.6);
  
    // discound applied alreadyy
    expect(result.promocodeDiscountAmount).toBeCloseTo(25, 2);
    expect(result.loyaltyDiscountAmount).toBeCloseTo(15, 2);
  });


  it('uses delivery fee instead of dine-in', () => {
    const config: CheckoutConfig = {
      cartMenuItems: [
        { quantity: 1, requiredNetPrice: 100, requiredTotalPrice: 114 },
      ] as IItem[],
      cartOffers: [],
      deliveryFeesEgp: 10,
      loyaltyBalance: 0,
      deliveryType:deliveryType.DELIVERY,
      appType:1
    };

    const result = checkout(config);

    const vat = 14;
    const deliveryVat = 10 * 0.14;
    expect(result.totalVat).toBeCloseTo(vat + deliveryVat, 2);
    expect(result.finalTotal).toBeCloseTo(124, 2);
  });

  it('ignores expired coupon', () => {
    const config: CheckoutConfig = {
      loyaltyBalance:0,
      cartMenuItems: [{ quantity: 1, requiredNetPrice: 100, requiredTotalPrice: 114 }],
      coupon: {
        valid: true,
        error_message: '',
        coupon_discount_items: [],
        data: {
          is_active: true,
          discount_type: 'fixed',
          discount_value: 20,
          start_date: Date.now() - 100000000,
          end_date: Date.now() - 50000000,
          delivery_type: 'all',
          min_basket: 0,
          allow_loyalty: true,
          allowedAppTypeId: 1,
          ...{} as any 
        },
      },
      appType: 1,
      deliveryType: 'DELIVERY',
    } as any;

    const result = checkout(config);
    expect(result.promocodeDiscountAmount).toBe(0);
  });


  it('applies free delivery discount as promo', () => {
    const config: CheckoutConfig = {
      loyaltyBalance:2,
      cartMenuItems: [{ quantity: 1, requiredNetPrice: 100, requiredTotalPrice: 114 }],
      deliveryFeesEgp: 20,
      coupon: {
        valid: true,
        error_message: '',
        coupon_discount_items: [],
        data: {
          is_active: true,
          discount_type: 'delivery_free',
          discount_value: 20, // بنتجاهل ده لان النوع ديليفري فري
          start_date: Date.now() - 10000,
          end_date: Date.now() + 10000,
          delivery_type: 'delivery_only',
          min_basket: 0,
          allow_loyalty: true,
          allowedAppTypeId: 1,
          ...{} as any
        },
      },
      appType: 1,
      deliveryType: 'DELIVERY',
    } as any;
    const totalAmount= 114-20-2
    const result = checkout(config);
    expect(result.subtotal).toBe(100);
    expect(result.subtotalWithVat).toBe(114);
    expect(result.subtotalVat).toBe(14);
    expect(result.promocodeDiscountAmount).toBe(20); // توصيل مجانًا = 20
    expect(result.loyaltyDiscountAmount).toBe(2);
    // 100-20-2 * 0.14 = 10.9
    expect(result.totalVat).toBeCloseTo(10.92, 2);
      // 114 +20-20-2 
    expect(result.finalTotal).toBeCloseTo(totalAmount, 2);


  });


  it('ignores loyalty discount if coupon disallows it', () => {
    const config: CheckoutConfig = {
      cartMenuItems: [{ quantity: 1, requiredNetPrice: 100, requiredTotalPrice: 114 }],
      loyaltyBalance: 30,
      coupon: {
        valid: true,
        error_message: '',
        coupon_discount_items: [],
        data: {
          is_active: true,
          discount_type: 'fixed',
          discount_value: 10,
          start_date: Date.now() - 10000,
          end_date: Date.now() + 10000,
          delivery_type: 'all',
          min_basket: 0,
          allow_loyalty: false,
          allowedAppTypeId: 1,
          ...{} as any
        },
      },
      appType: 1,
      deliveryType: 'PICKUP',
    } as any;

    const result = checkout(config);
    expect(result.loyaltyDiscountAmount).toBe(0);
    expect(result.promocodeDiscountAmount).toBe(10);
    expect(result.finalTotal).toBe(104);
    expect(result.subtotal).toBe(100);
    expect(result.subtotalVat).toBe(14);
    expect(result.subtotalWithVat).toBe(114);
    expect(result.totalVat).toBeCloseTo( (100- 10) *(0.14),2);
  });


  it('ignores coupon if basket is below min_basket', () => {
    const config: CheckoutConfig = {
      loyaltyBalance:0,
      cartMenuItems: [{ quantity: 1, requiredNetPrice: 40, requiredTotalPrice: 45.6 }],
      coupon: {
        valid: true,
        error_message: '',
        coupon_discount_items: [],
        data: {
          is_active: true,
          discount_type: 'percentage',
          discount_value: 10,
          start_date: Date.now() - 10000,
          end_date: Date.now() + 10000,
          delivery_type: 'all',
          min_basket: 100, // ← backet less than that
          allow_loyalty: true,
          allowedAppTypeId: 1,
          ...{} as any
        },
      },
      appType: 1,
      deliveryType: 'DELIVERY',
    } as any;

    const result = checkout(config);
    expect(result.promocodeDiscountAmount).toBe(0);
  });

  it('throws error for negative loyaltyBalance', () => {
    const config: CheckoutConfig = {
      cartMenuItems: [{ quantity: 1, requiredNetPrice: 100, requiredTotalPrice: 114 }],
      loyaltyBalance: -10,
      appType: 1,
      deliveryType: 'PICKUP',
    } as any;

    expect(() => checkout(config)).toThrow('loyaltyBalance must be a non-negative number.');
  });

  it('throws error for invalid loyaltyBalance type', () => {
    const config: CheckoutConfig = {
      cartMenuItems: [{ quantity: 1, requiredNetPrice: 100, requiredTotalPrice: 114 }],
      loyaltyBalance: 'invalid' as any,
      appType: 1,
      deliveryType: 'PICKUP',
    } as any;

    expect(() => checkout(config)).toThrow('loyaltyBalance must be a non-negative number.');
  });

});
