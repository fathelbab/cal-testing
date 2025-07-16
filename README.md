# Buffalo Burger Calculations

A TypeScript-based calculation engine for Buffalo Burger orders. This package handles detailed pricing logic including items, offers, delivery fees, dine-in charges, promo codes, loyalty discounts, and VAT.

## Features

- 🍔 **Item & Offer Pricing**: Handles combos, extras, and replacements
- 🚚 **Delivery & Dine-in**: Calculates extra charges with VAT support
- 🎫 **Promo Code Logic**: Supports advanced coupon logic (fixed, percentage, free delivery, item-specific, app type, etc.)
- ⭐ **Loyalty Discount**: Capped to net total after promo, and can be disabled by coupon
- 🧾 **VAT Accuracy**: Always calculated on post-discount net total
- ✅ **Well-tested**: Comes with a comprehensive Jest test suite

---

## Discount & VAT Calculation Logic

| Step | Rule |
|------|------|
| 1    | **Promo code/coupon discount** is applied first, up to the full net cart value |
| 2    | **Loyalty discount** is applied to the remaining net value after promo code, unless coupon disables it |
| 3    | **Net price after all discounts will never go below zero** |
| 4    | **VAT is calculated only on the non-negative net price after discounts** |
| 5    | If discounts fully cover the cart, **VAT is zero (never negative)** |

### Example
```ts
const config: CheckoutConfig = {
  menuItems: [
    { quantity: 1, required_netPrice: 40, required_totalPrice: 45.6 },
  ],
  offers: [],
  coupon: { /* see below for coupon structure */ },
  loyaltyBalance: 25,   // applied to the remainder (only if coupon allows)
  deliveryType: 'DELIVERY',
  appType: 1, // 1=mobile, 2=web, 3=kiosk, 10=all
};
const result = checkout(config);
console.log(result);
// {
//   subTotal: 40,
//   subTotalWithVat: 45.6,
//   promocodeDiscountAmount: 25,
//   loyalityApplied: 15,
//   vatSubTotal: 5.6,
//   Totalvat: 0,
//   finalTotal: 0
// }
```

---

## 🆕 Example with Coupon and Loyalty

```ts
import { checkout, CheckoutConfig, IPromocodeConfig } from 'buffalo-burger-calculations';

const coupon: IPromocodeConfig = {
  valid: true,
  error_message: '',
  coupon_discount_items: [],
  data: {
    allowedDiscountItemsArr: [],
    id: 1,
    coupon_type: 'checkout',
    code: 'SAVE25',
    is_active: true,
    contains_offers: false,
    contains_menu_items: false,
    absolute_no_of_uses: 0,
    no_of_uses: 0,
    discount_type: 'fixed',
    delivery_type: 'all',
    discount_value: 25,
    start_date: 1680000000000,
    end_date: 1890000000000,
    min_basket: 0,
    customer_previous_orders: 0,
    allow_customers: true,
    allow_guests: true,
    allowed_discount_items: [],
    allowed_number_of_discount_items: 0,
    allowed_menu_items: [],
    allowed_offers: [],
    allowed_branches: [],
    limit_customer_previous_orders: false,
    allowedAppTypeId: 1,
    excludes_offers: false,
    allow_loyalty: true,
  }
};

const config: CheckoutConfig = {
  menuItems: [
    { quantity: 1, required_netPrice: 40, required_totalPrice: 45.6 },
  ],
  offers: [],
  coupon,
  loyaltyBalance: 25,   // applied to the remainder (only if coupon allows)
  deliveryType: 'DELIVERY',
  appType: 1, // 1=mobile, 2=web, 3=kiosk, 10=all
};

const result = checkout(config);
console.log(result);
// {
//   subTotal: 40,
//   subTotalWithVat: 45.6,
//   promocodeDiscountAmount: 25,
//   loyalityApplied: 15,
//   vatSubTotal: 5.6,
//   Totalvat: 0,
//   finalTotal: 0
// }
```

---

## Coupon Interface

```ts
export interface IPromocodeConfig {
  valid: boolean;
  error_message: string;
  coupon_discount_items: any[];
  data: {
    allowedDiscountItemsArr: any[];
    id: number;
    coupon_type: 'checkout' | string;
    code: string;
    is_active: boolean;
    contains_offers: boolean;
    contains_menu_items: boolean;
    absolute_no_of_uses: number;
    no_of_uses: number;
    discount_type: 'percentage' | 'fixed' | string;
    delivery_type: 'all' | 'delivery_only' | string;
    discount_value: number;
    start_date: number;
    end_date: number;
    min_basket: number;
    customer_previous_orders: number;
    allow_customers: boolean;
    allow_guests: boolean;
    allowed_discount_items: IAllowedDiscountItem[];
    allowed_number_of_discount_items: number;
    allowed_menu_items: any[];
    allowed_offers: any[];
    allowed_branches: any[];
    limit_customer_previous_orders: boolean;
    allowedAppTypeId: number;
    excludes_offers: boolean;
    allow_loyalty: boolean;
  };
}

export interface IAllowedDiscountItem {
  menuItemSizePriceId: number;
  net_price: number;
  total_price: number;
}
```

---

## Updated Result Fields

```ts
interface CheckoutResult {
  subTotal: number;                // Net total before VAT and discounts
  subTotalWithVat: number;         // Net total including VAT
  promocodeDiscountAmount: number; // Discount applied from promo code/coupon
  loyalityApplied: number;         // Discount applied from loyalty balance
  vatSubTotal: number;             // VAT amount before discounts
  Totalvat: number;                // Final VAT after all discounts
  finalTotal: number;              // What the customer pays
}
```

---

## Installation
```bash
npm install buffalo-burger-calculations
```

---

## How to Use

### 🔁 Basic Checkout
```ts
import { checkout, CheckoutConfig } from 'buffalo-burger-calculations';

const config: CheckoutConfig = {
  menuItems: [
     {
       cart_id: 'item1',
       quantity: 2,
       required_netPrice: 50,
       required_totalPrice: 57,
     },
  ],
  offers: [
     {
       cart_id: 'offer1',
       quantity: 1,
       required_netPrice: 30,
       required_totalPrice: 34.2,
     },
  ],
  deliveryFeesEgp: 10,
  loyaltyBalance: 3,
  deliveryType: 'DELIVERY',
  appType: 1,
};

const result = checkout(config);
console.log(result.finalTotal);
```

### 🔧 Advanced Configuration (with coupon)
```ts
import { checkout, CheckoutConfig, IPromocodeConfig } from 'buffalo-burger-calculations';

const coupon: IPromocodeConfig = {
  valid: true,
  error_message: '',
  coupon_discount_items: [],
  data: {
    allowedDiscountItemsArr: [],
    id: 1,
    coupon_type: 'checkout',
    code: 'SAVE20',
    is_active: true,
    contains_offers: false,
    contains_menu_items: false,
    absolute_no_of_uses: 0,
    no_of_uses: 0,
    discount_type: 'percentage',
    delivery_type: 'all',
    discount_value: 20,
    start_date: 1680000000000,
    end_date: 1890000000000,
    min_basket: 50,
    customer_previous_orders: 0,
    allow_customers: true,
    allow_guests: true,
    allowed_discount_items: [],
    allowed_number_of_discount_items: 0,
    allowed_menu_items: [],
    allowed_offers: [],
    allowed_branches: [],
    limit_customer_previous_orders: false,
    allowedAppTypeId: 1,
    excludes_offers: false,
    allow_loyalty: false, // disables loyalty discount
  }
};

const config: CheckoutConfig = {
  menuItems: [/* items */],
  offers: [/* offers */],
  dineinPercentage: 5,
  dineinFixed: 0,
  coupon,
  loyaltyBalance: 50, // will be ignored if coupon.data.allow_loyalty is false
  deliveryFeesEgp: 15,
  deliveryType: 'DELIVERY',
  appType: 1,
};

const result = checkout(config);
// result interface is:
// {
//   subTotal: ...,
//   subTotalWithVat: ...,
//   promocodeDiscountAmount: ...,
//   loyalityApplied: ...,
//   vatSubTotal: ...,
//   Totalvat: ...,
//   finalTotal: ...
// }
```

---

## Coupon & Promo Code Logic

- The `coupon` object supports advanced logic: minimum basket, delivery type, app type, start/end date, excludes offers, disables loyalty, and more.
- If a valid coupon is present, it overrides any manual promo discount.
- If `coupon.data.allow_loyalty` is false, loyalty discount is ignored.
- The promo code value is calculated using the `calculatePromocodeValue` function, which takes into account all coupon rules and the current order context.

---

## API Reference

### `checkout(config: CheckoutConfig): CheckoutResult`
Main function to compute all totals.

**Config keys:**
- `menuItems`: Array of cart items
- `offers`: Array of offer items
- `loyaltyBalance`: Number, applied after promo code (ignored if coupon disables loyalty)
- `deliveryFeesEgp`: Number, delivery fee (if any)
- `dineinPercentage`: Number, optional dine-in charge as %
- `dineinFixed`: Number, optional dine-in fixed charge
- `coupon`: Coupon object for advanced promo logic (see above)
- `deliveryType`: String, e.g. 'DELIVERY', 'PICKUP', 'DINEIN'
- `appType`: Number, e.g. 1=mobile, 2=web, 3=kiosk, 10=all

**Returns:**
```ts
interface CheckoutResult {
  subTotal: number;
  subTotalWithVat: number;
  Totalvat: number;
  promocodeDiscountAmount: number;
  loyalityApplied: number;
  finalTotal: number;
  vatSubTotal: number;
}
```

---

## Coupon Calculation Utility

### `calculatePromocodeValue(coupon, totalNetPrice, deliveryFeesEgp, deliveryType, appType): number`
Calculates the promo code value based on all coupon rules and the current order context. Used internally by `checkout`.

---

## Developer Guide

### 🧪 Run Tests
```bash
npm test
```

### ⚙️ Build Package
```bash
npm run build
```

### 🔍 Type Check
```bash
npm run type-check
```

---

## Contribution

1. Fork the repo
2. Create a branch
3. Write your changes with tests
4. Submit a PR ✅

---

## License
MIT © Buffalo Tech
