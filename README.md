# Buffalo Burger Calculations

A TypeScript-based calculation engine for Buffalo Burger orders. This package handles detailed pricing logic including items, offers, delivery fees, dine-in charges, promo codes, loyalty discounts, and VAT.

## Features

- 🍔 **Item & Offer Pricing**: Handles combos, extras, and replacements
- 🚚 **Delivery & Dine-in**: Calculates extra charges with VAT support
- 🎫 **Promo Code Logic**: Fixed or percentage discounts, applied first
- ⭐ **Loyalty Discount**: Capped to net total after promo
- 🧾 **VAT Accuracy**: Always calculated on post-discount net total
- ✅ **Well-tested**: Comes with a comprehensive Jest test suite

---

## Discount & VAT Calculation Logic

| Step | Rule |
|------|------|
| 1    | **Promo code discount** is applied first, up to the full net cart value |
| 2    | **Loyalty discount** is applied to the remaining net value after promo code |
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
  promoCodeDiscount: 25, // applied first
  loyaltyDiscount: 25,   // applied to the remainder (only 15 will be used)
};
const result = checkout(config);
console.log(result);
// {
//   subTotal: 40,
//   subTotalWithVat: 45.6,
//   promocodeDiscountAmount: 25,
//   loyaltyDiscountAmount: 15,
//   vatSubTotal: 5.6,
//   Totalvat: 0,
//   finalTotal: 0
// }
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
  promoCodeDiscount: 5,
  loyaltyDiscount: 3,
};

const result = checkout(config);
console.log(result.finalTotal);
```

### 🔧 Advanced Configuration
```ts
const config: CheckoutConfig = {
  menuItems: [/* items */],
  offers: [/* offers */],
  dineinPercentage: 5,
  dineinFixed: 0,
  promoCodeDiscount: 30,
  loyaltyDiscount: 50,
  deliveryFeesEgp: 15,
};

const result = checkout(config);
 result interface is 
 // {
//   subTotal: 40,
//   subTotalWithVat: 45.6,
//   promocodeDiscountAmount: 25,
//   loyaltyDiscountAmount: 15,
//   vatSubTotal: 5.6,
//   Totalvat: 0,
//   finalTotal: 0
// }
```

---

## API Reference

### `checkout(config: CheckoutConfig): CheckoutResult`
Main function to compute all totals.

**Config keys:**
- `menuItems`: Array of cart items
- `offers`: Array of offer items
- `promoCodeDiscount`: Number, fixed discount applied first
- `loyaltyDiscount`: Number, applied after promo code
- `deliveryFeesEgp`: Number, delivery fee (if any)
- `dineinPercentage`: Number, optional dine-in charge as %
- `dineinFixed`: Number, optional dine-in fixed charge

**Returns:**
```ts
interface CheckoutResult {
  subTotal: number;
  subTotalWithVat: number;
  Totalvat: number;
  promocodeDiscountAmount: number;
  loyaltyDiscountAmount: number;
  finalTotal: number;
  vatSubTotal: number;
}
```

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
