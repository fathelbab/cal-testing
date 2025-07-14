import { checkout, CheckoutConfig, IItem } from '../src/index';

describe('checkout (unit tests, all cases)', () => {

  it('returns zero totals for an empty cart', () => {
    const config: CheckoutConfig = {
      menuItems: [],
      offers: [],
      loyaltyDiscount: 0,
      promoCodeDiscount: 0,
    } as any;

    const result = checkout(config);
    expect(result.subTotal).toBe(0);
    expect(result.subTotalWithVat).toBe(0);
    expect(result.vatSubTotal).toBe(0);
    expect(result.loyaltyDiscountAmount).toBe(0);
    expect(result.promocodeDiscountAmount).toBe(0);
    expect(result.Totalvat).toBe(0);
    expect(result.finalTotal).toBe(0);
  });

  it('calculates totals for only menu items', () => {
    const config: CheckoutConfig = {
      menuItems: [
        { quantity: 1, required_netPrice: 83.33, required_totalPrice: 95 },
      ],
      offers: [],
      loyaltyDiscount: 0,
      promoCodeDiscount: 0,
    } as any;

    const result = checkout(config);

    expect(result.subTotal).toBeCloseTo(83.33, 2);
    expect(result.subTotalWithVat).toBeCloseTo(95, 2);
    expect(result.vatSubTotal).toBeCloseTo(11.67, 2);
    expect(result.Totalvat).toBeCloseTo(11.67, 2);
    expect(result.finalTotal).toBeCloseTo(95, 2);
    expect(result.loyaltyDiscountAmount).toBe(0);
    expect(result.promocodeDiscountAmount).toBe(0);
  });

  it('calculates totals for only offers', () => {
    const config: CheckoutConfig = {
      menuItems: [],
      offers: [
        { quantity: 1, required_netPrice: 100, required_totalPrice: 105 },
      ] as IItem[],
      dineinFixed: 50,
      dineinPercentage: 0,
      loyaltyDiscount: 0,
      promoCodeDiscount: 0,
    };

    const result = checkout(config);

    expect(result.subTotal).toBeCloseTo(100, 2);
    expect(result.subTotalWithVat).toBeCloseTo(105, 2);
    expect(result.vatSubTotal).toBeCloseTo(5, 2);
    expect(result.Totalvat).toEqual(12); // includes dine-in VAT (50 * 0.14)
    expect(result.finalTotal).toBeCloseTo(155, 2); // 934.04 + 50 dine-in
  });

  it('calculates totals for both menu items and offers', () => {
    const config: CheckoutConfig = {
      menuItems: [
        { quantity: 2, required_netPrice: 100, required_totalPrice: 114 }
      ] as IItem[],
      offers: [
        { quantity: 1, required_netPrice: 50, required_totalPrice: 57 }
      ] as IItem[],
      loyaltyDiscount: 0,
      promoCodeDiscount: 0,
    };

    const result = checkout(config);

    expect(result.subTotal).toBeCloseTo(250, 2);
    expect(result.subTotalWithVat).toBeCloseTo(285, 2);
    expect(result.vatSubTotal).toBeCloseTo(35, 2);
    expect(result.Totalvat).toBeCloseTo(35, 2);
    expect(result.finalTotal).toBeCloseTo(285, 2);
  });

  it('throws if both dine-in and delivery are present', () => {
    const config: CheckoutConfig = {
      menuItems: [
        { quantity: 1, required_netPrice: 100, required_totalPrice: 114 }
      ] as IItem[],
      dineinFixed: 5,
      deliveryFeesEgp: 8,
      loyaltyDiscount: 0,
      promoCodeDiscount: 0,
    };

    expect(() => checkout(config)).toThrow(
      'Cannot have both dine-in charge and delivery fees in the same order.'
    );
  });


  it('applies only loyalty discount correctly - pickup', () => {
    const config: CheckoutConfig = {
      menuItems: [
        { quantity: 2, required_netPrice: 50, required_totalPrice: 57 },
      ] as IItem[],
      offers: [],
      loyaltyDiscount: 20,
      promoCodeDiscount: 0,
    };
  
    const result = checkout(config);
  
    const totalNetPrice = 100;
    const totalPriceWithVat = 114;
    const avgVat = (114 - 100) / 100; // = 0.14
    const discountedNet = 100 - 20; // = 80
    const vatOnDiscounted = discountedNet * avgVat; // 80 * 0.14 = 11.2
    const dineinOrDeliveryVat = 0; // pickup
    const expectedTotalVat = vatOnDiscounted + dineinOrDeliveryVat;
    const expectedFinal = totalPriceWithVat - 20 ;

    expect(result.subTotal).toBeCloseTo(100, 2);
    expect(result.subTotalWithVat).toBeCloseTo(114, 2);
    expect(result.vatSubTotal).toBeCloseTo(14, 2);
    expect(result.Totalvat).toBeCloseTo(expectedTotalVat, 2); // = 11.2
    expect(result.finalTotal).toBeCloseTo(expectedFinal, 2); // should match 94
    expect(result.loyaltyDiscountAmount).toEqual(20);
    expect(result.promocodeDiscountAmount).toBe(0);
  });
  
  
  
  
  it('applies only promo code discount correctly', () => {
    const config: CheckoutConfig = {
      menuItems: [
        { quantity: 1, required_netPrice: 120, required_totalPrice: 136.8 }
      ] as IItem[],
      offers: [],
      loyaltyDiscount: 0,
      promoCodeDiscount: 36,
    };
  
    const result = checkout(config);
  
    const expectedNet = 120;
    const expectedVat = 16.8;
    const expectedVatOnDiscounted = (120 - 36) * (16.8 / 120);
    const expectedTotal = (136.8 - 36);
  
    expect(result.subTotal).toEqual(120);
    expect(result.Totalvat).toBeCloseTo(expectedVatOnDiscounted);
    expect(result.finalTotal).toBeCloseTo(expectedTotal);
    expect(result.loyaltyDiscountAmount).toBe(0);
    expect(result.promocodeDiscountAmount).toEqual(36);
  });
  
  
  it('applies both discounts + dine-in charge', () => {
    const config: CheckoutConfig = {
      menuItems: [
        { quantity: 1, required_netPrice: 200, required_totalPrice: 228 },
      ] as IItem[],
      offers: [],
      dineinFixed: 40,
      loyaltyDiscount: 30,
      promoCodeDiscount: 20,
    };
  
    const result = checkout(config);
  
    const expectedNet = 200;
    const expectedVat = 28;
    const discountedNet = expectedNet - 30 - 20;
    const avgVatRate = 28 / 200;
    const vatOnDiscounted = discountedNet * avgVatRate;
    const dineInVat = 40 * 0.14;
    const expectedTotalVat = vatOnDiscounted + dineInVat;
    const expectedTotal = (expectedVat +expectedNet) + 40  - (50);
  
    expect(result.subTotal).toEqual(200);
    expect(result.Totalvat).toBeCloseTo(expectedTotalVat);
    expect(result.finalTotal).toEqual(expectedTotal);
    expect(result.loyaltyDiscountAmount).toBeCloseTo(30);
    expect(result.promocodeDiscountAmount).toBeCloseTo(20);
  });
  
  
  it('handles large discounts that make final total zero or negative', () => {
    const config: CheckoutConfig = {
      menuItems: [
        { quantity: 1, required_netPrice: 40, required_totalPrice: 45.6 },
      ] as IItem[],
      offers: [],
      loyaltyDiscount: 25,
      promoCodeDiscount: 25,
    };
  
    const result = checkout(config);
    // capped at net price
    expect(result.subTotal).toBeCloseTo(40, 2);
    expect(result.finalTotal).toBeGreaterThanOrEqual(0);
    expect(result.loyaltyDiscountAmount).toBeGreaterThanOrEqual(15);
    expect(result.promocodeDiscountAmount).toBeGreaterThanOrEqual(25);
  });
  
  
  it('uses delivery fee instead of dine-in', () => {
    const config: CheckoutConfig = {
      menuItems: [
        { quantity: 1, required_netPrice: 100, required_totalPrice: 114 },
      ] as IItem[],
      offers: [],
      deliveryFeesEgp: 10,
      loyaltyDiscount: 0,
      promoCodeDiscount: 0,
    };
  
    const result = checkout(config);
  
    const vat = 14;
    const deliveryVat = 10 * 0.14;
    expect(result.Totalvat).toBeCloseTo(vat + deliveryVat, 2);
    expect(result.finalTotal).toBeCloseTo(124, 2);
  });
  

});
