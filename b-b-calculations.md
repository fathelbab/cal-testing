# B-B Calculations

A comprehensive cart calculation engine for Buffalo Burger restaurants. This package provides robust calculation logic for handling menu items, offers, discounts, VAT, delivery fees, and loyalty programs.

## Features

- 🛒 **Cart Management**: Handle menu items and offers with quantity support
- 💰 **Discount System**: Support for promocodes and loyalty discounts
- 🏷️ **VAT Calculation**: Automatic VAT calculation with configurable rates
- 🚚 **Delivery Options**: Support for delivery fees and dine-in charges
- ✅ **Validation**: Comprehensive input validation and error handling
- 📱 **Multi-Platform**: Support for different app types (mobile, web, kiosk)
- 🔧 **TypeScript**: Full TypeScript support with type definitions

## Installation

```bash
npm install b-b-calculations
```

## Quick Start

```javascript
import { checkout } from 'b-b-calculations';
 
const config = {
  cartMenuItems: [
    {
      quantity: 2,
      requiredNetPrice: 50,
      requiredTotalPrice: 57
    }
  ],
  loyaltyBalance: 20,
  deliveryType: 'PICKUP',
  appType: 1
};

const result = checkout(config);
console.log(result);
// Output:
// {
//   subtotal: 100,
//   subtotalWithVat: 114,
//   totalVat: 14,
//   promocodeDiscountAmount: 0,
//   loyaltyDiscountAmount: 20,
//   finalTotal: 94,
//   subtotalVat: 14
// }
```

## API Reference

### Main Function

#### `checkout(config: ICheckoutConfig): CheckoutResult`

The main function that processes a checkout configuration and returns calculation results.

**Parameters:**
- `config` (ICheckoutConfig): The checkout configuration object

**Returns:**
- `CheckoutResult`: Object containing all calculation results

### Types

#### ICheckoutConfig

```typescript
interface ICheckoutConfig {
  cartMenuItems?: Item[];          // Array of menu items
  cartOffers?: Item[];             // Array of offer items
  deliveryFeesEgp?: number;        // Delivery fees (optional)
  loyaltyBalance?: number;         // Loyalty points balance (defaults to 0)
  dineinExtraCharge?: number;      // Dine-in service charge (net) (optional)
  coupon?: IPromocodeConfig;       // Promocode configuration (optional)
  deliveryType: deliveryType;      // DELIVERY, PICKUP, or DINEIN
  appType: number;                 // 1=mobile, 2=web, 3=kiosk, 10=all
}
```

#### CheckoutResult

```typescript
interface CheckoutResult {
  subtotal: number;                // Net subtotal (without VAT)
  subtotalWithVat: number;         // Subtotal with VAT (before discounts)
  totalVat: number;                // Total VAT amount after discounts/charges
  promocodeDiscountAmount: number; // Applied promocode discount
  loyaltyDiscountAmount: number;   // Applied loyalty discount
  finalTotal: number;              // Final total after all discounts & charges
  subtotalVat: number;             // VAT on subtotal (before discounts)
}
```

#### Item

```typescript
interface Item {
  menu_item_size_price_id?: number;    // Menu item ID (optional)
  quantity: number;                    // Item quantity
  requiredNetPrice: number;           // Net price (without VAT)
  requiredTotalPrice: number;         // Total price (with VAT)
}
```

#### deliveryType

```typescript
enum deliveryType {
  DELIVERY = "DELIVERY",
  PICKUP = "PICKUP", 
  DINEIN = "DINEIN"
}
```

## Usage Examples

### Basic Cart Calculation

```javascript
import { checkout, deliveryType } from 'b-b-calculations';

const config = {
  cartMenuItems: [
    {
      quantity: 1,
      requiredNetPrice: 100,
      requiredTotalPrice: 114
    },
    {
      quantity: 2,
      requiredNetPrice: 25,
      requiredTotalPrice: 28.5
    }
  ],
  deliveryType: deliveryType.PICKUP,
  appType: 1
};

const result = checkout(config);
// result.subtotal = 150
// result.subtotalWithVat = 171
// result.finalTotal = 171
```

### With Delivery Fees

```javascript
const config = {
  cartMenuItems: [
    {
      quantity: 1,
      requiredNetPrice: 100,
      requiredTotalPrice: 114
    }
  ],
  deliveryFeesEgp: 10,
  deliveryType: deliveryType.DELIVERY,
  appType: 1
};

const result = checkout(config);
// result.finalTotal = 124 (114 + 10)
```

### With Loyalty Discount

```javascript
const config = {
  cartMenuItems: [
    {
      quantity: 1,
      requiredNetPrice: 100,
      requiredTotalPrice: 114
    }
  ],
  loyaltyBalance: 30,
  deliveryType: deliveryType.PICKUP,
  appType: 1
};

const result = checkout(config);
// result.loyaltyDiscountAmount = 30
// result.finalTotal = 84 (114 - 30)
```

### With Promocode

```javascript
const config = {
  cartMenuItems: [
    {
      quantity: 1,
      requiredNetPrice: 100,
      requiredTotalPrice: 114
    }
  ],
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
      delivery_type: 'all',
      min_basket: 0,
      allow_loyalty: true,
      allowedAppTypeId: 1,
      // ... other required fields
    }
  },
  deliveryType: deliveryType.PICKUP,
  appType: 1
};

const result = checkout(config);
// result.promocodeDiscountAmount = 20
// result.finalTotal = 94 (114 - 20)
```

### With Dine-in Charge

```javascript
const config = {
  cartMenuItems: [
    {
      quantity: 1,
      requiredNetPrice: 100,
      requiredTotalPrice: 114
    }
  ],
  dineinExtraCharge: 50,
  deliveryType: deliveryType.DINEIN,
  appType: 1
};

const result = checkout(config);
// result.finalTotal = 164 (114 + 50)
```

## Discount Logic

### Promocode Priority
1. Promocodes are applied first
2. Loyalty discounts are applied second
3. Discounts cannot exceed the available amount

### Promocode Types
- `fixed`: Fixed amount discount
- `percentage`: Percentage-based discount
- `delivery_free`: Free delivery (covers delivery fees)
- `absolute`: Fixed amount discount

### Loyalty Rules
- Loyalty discounts are only applied if the promocode allows it (`allow_loyalty: true`)
- If no promocode is provided, loyalty is always applied
- Loyalty balance defaults to 0 if not provided

## VAT Calculation

- VAT is calculated based on the difference between net and total prices
- Delivery fees and dine-in charges have separate VAT rates
- VAT is recalculated after applying discounts

## Validation Rules

### Required Fields
- At least one of `cartMenuItems` or `cartOffers` must be provided
- `deliveryType` and `appType` are required

### Validation Checks
- Item quantities must be positive numbers
- Prices must be non-negative numbers
- Cannot have both delivery fees and dine-in charges
- Loyalty balance must be non-negative (if provided)

### Error Handling

```javascript
import { checkout, ValidationError } from 'b-b-calculations';

try {
  const result = checkout(invalidConfig);
} catch (error) {
  if (error instanceof ValidationError) {
    console.log('Validation error:', error.message);
  }
}
```

## Common Error Messages

- `"Checkout config is required."` - Config object is missing
- `"At least one of menuItems or offers must be provided."` - No items in cart
- `"loyaltyBalance must be a non-negative number."` - Invalid loyalty balance
- `"Cannot have both dine-in charge and delivery fees in the same order."` - Conflicting delivery options

## App Types

| Value | Type |
|-------|------|
| 1 | Mobile |
| 2 | Web |
| 3 | Kiosk |
| 10 | All platforms |
