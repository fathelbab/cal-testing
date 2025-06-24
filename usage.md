# Buffalo Burger Calculations - Usage Guide

## Table of Contents
1. [Quick Start](#quick-start)
2. [Package Usage](#package-usage)
3. [Code Architecture](#code-architecture)
4. [Module Interactions](#module-interactions)
5. [Developing New Features](#developing-new-features)
6. [Testing](#testing)
7. [Building and Publishing](#building-and-publishing)

## Quick Start

### Installation
```bash
npm install buffalo-burger-calculations
```

### Basic Usage
```typescript
import { checkout, CheckoutConfig } from 'buffalo-burger-calculations';

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
  deliveryType: 2, // 2 = pickup
  branchConfig: {}
};

const result = checkout(config);
console.log(result.totals.finalTotal); // 22.80
```

## Package Usage

### 1. Cart Items
Cart items represent individual menu items with their configurations:

```typescript
import { CartItem } from 'buffalo-burger-calculations';

const burgerItem: CartItem = {
  id: 1,
  quantity: 2,
  size: {
    fullData: {
      net_price: 12.00,
      total_price: 13.68
    }
  },
  extras: [
    {
      id: 101,
      net_price: 2.00,
      total_price: 2.28,
      fullData: {
        net_price: 2.00,
        total_price: 2.28
      }
    }
  ],
  replacements: [
    {
      id: 201,
      net_price: 1.50,
      total_price: 1.71,
      fullData: {
        net_price: 1.50,
        total_price: 1.71
      }
    }
  ],
  comboOption: {
    fullData: {
      net_price: 3.00,
      total_price: 3.42
    }
  }
};
```

### 2. Offers
Offers represent bundled deals with multiple components:

```typescript
import { OfferItem } from 'buffalo-burger-calculations';

const comboOffer: OfferItem = {
  id: 1,
  quantity: 1,
  sandwiches: [
    {
      menu_item_size_price: {
        net_price: 8.00,
        total_price: 9.12
      }
    }
  ],
  fries: [
    {
      menu_item_size_price: {
        net_price: 3.00,
        total_price: 3.42
      }
    }
  ],
  drink: [
    {
      menu_item_size_price: {
        net_price: 2.00,
        total_price: 2.28
      }
    }
  ],
  fullOfferData: {
    net_price: 1.00, // Base offer price
    total_price: 1.14
  }
};
```

### 3. Delivery Configuration
Configure delivery fees and timing:

```typescript
const config: CheckoutConfig = {
  // ... other config
  deliveryType: 1, // 1 = delivery, 2 = pickup, 3 = dine-in
  branchConfig: {
    branch_delivery_charge: 5.00,
    streets_delivery_time: true, // Use branch delivery time
    delivery_time: 30 // minutes
  },
  addressConfig: {
    street: {
      delivery_charge: 4.00,
      delivery_time: 25
    }
  }
};
```

### 4. Promocodes and Discounts
Apply various types of discounts:

```typescript
const config: CheckoutConfig = {
  // ... other config
  
  // Fixed amount discount
  promocodeFixed: 10.00,
  
  // OR percentage discount
  promocodePercentage: 15, // 15% off
  
  // Dine-in charges
  dineinFixed: 5.00, // Fixed charge
  // OR
  dineinPercentage: 8 // 8% of net total
};
```

### 5. Loyalty Points
Integrate loyalty point system:

```typescript
const config: CheckoutConfig = {
  // ... other config
  userPointsInfo: {
    points: 100,
    pendingPoints: 0,
    pointsValue: 50.00, // Total value of points
    pendingPointsValue: 0
  }
};
```

### 6. Complete Example
```typescript
import { checkout, CheckoutConfig } from 'buffalo-burger-calculations';

const config: CheckoutConfig = {
  menuItems: [
    {
      id: 1,
      quantity: 2,
      size: {
        fullData: {
          net_price: 12.00,
          total_price: 13.68
        }
      },
      extras: [
        {
          id: 101,
          net_price: 2.00,
          total_price: 2.28,
          fullData: {
            net_price: 2.00,
            total_price: 2.28
          }
        }
      ]
    }
  ],
  offers: [
    {
      id: 1,
      quantity: 1,
      sandwiches: [
        {
          menu_item_size_price: {
            net_price: 8.00,
            total_price: 9.12
          }
        }
      ],
      fries: [
        {
          menu_item_size_price: {
            net_price: 3.00,
            total_price: 3.42
          }
        }
      ],
      drink: [
        {
          menu_item_size_price: {
            net_price: 2.00,
            total_price: 2.28
          }
        }
      ]
    }
  ],
  deliveryType: 1,
  branchConfig: {
    branch_delivery_charge: 5.00,
    delivery_time: 30
  },
  promocodePercentage: 10,
  userPointsInfo: {
    points: 50,
    pendingPoints: 0,
    pointsValue: 25.00,
    pendingPointsValue: 0
  }
};

const result = checkout(config);
console.log(result.totals);
```

## Code Architecture

### Project Structure
```
src/
├── index.ts              # Main orchestrator
├── models/               # TypeScript interfaces
│   ├── CartItem.ts
│   ├── OfferItem.ts
│   └── CheckoutConfig.ts
├── engines/              # Calculation engines
│   ├── items.ts
│   ├── offers.ts
│   ├── cart-totals.ts
│   ├── delivery.ts
│   ├── dinein.ts
│   ├── promocode.ts
│   └── loyalty.ts
└── mappers/              # Data transformers
    └── order-api.ts
```

### Design Principles
1. **Separation of Concerns**: Each engine handles one specific calculation
2. **Pure Functions**: All engines are pure functions with no side effects
3. **Type Safety**: Full TypeScript support with comprehensive interfaces
4. **Modularity**: Easy to extend and modify individual components
5. **Testability**: Each engine can be tested independently

## Module Interactions

### Code Flow Diagram
```
CheckoutConfig → checkout() → [Engines] → CheckoutResult
     ↓              ↓           ↓           ↓
  Input Data   Orchestrator  Calculations  Output
```

### Detailed Flow

#### 1. Main Orchestrator (`src/index.ts`)
```typescript
export function checkout(config: CheckoutConfig): CheckoutResult {
  // Step 1: Price individual items
  const pricedItems = config.menuItems.map(calcItemPrices);
  
  // Step 2: Price offers
  const pricedOffers = config.offers.map(calcOfferPrices);
  
  // Step 3: Calculate cart totals
  const { totalNet, totalPrice } = sumCart([...pricedItems, ...pricedOffers]);
  
  // Step 4: Calculate delivery fees
  const { fee, feeWithVat, time } = calcDeliveryFees({...});
  
  // Step 5: Calculate VAT and dine-in charges
  const vatBase = /* VAT calculation */;
  const dineinCharge = calcDineinCharge(totalNet, {...});
  
  // Step 6: Apply promocodes
  let amount = totalPrice + feeWithVat + dineinCharge + dineinVat;
  amount = applyPromocode(amount, {...});
  
  // Step 7: Apply loyalty points
  const { pointsUsed, creditValue } = applyLoyalty(amount, {...});
  
  // Step 8: Return final result
  return { items: pricedItems, offers: pricedOffers, totals: {...} };
}
```

#### 2. Engine Dependencies
```
items.ts ← CartItem
offers.ts ← OfferItem
cart-totals.ts ← items.ts + offers.ts
delivery.ts ← CheckoutConfig
dinein.ts ← (independent)
promocode.ts ← (independent)
loyalty.ts ← CheckoutConfig
```

#### 3. Data Transformation Flow
```
Raw Cart Data → Priced Items → Cart Totals → Final Calculation
     ↓              ↓              ↓              ↓
CartItem[] → PricedCartItem[] → CartTotals → CheckoutResult
```

### Engine-Specific Flows

#### Items Engine (`src/engines/items.ts`)
```typescript
CartItem → calcItemPrices() → PricedCartItem
   ↓              ↓              ↓
Input → [Extras + Replacements + Size + Combo] → Output
```

#### Offers Engine (`src/engines/offers.ts`)
```typescript
OfferItem → calcOfferPrices() → PricedOfferItem
   ↓              ↓              ↓
Input → [Sandwiches + Fries + Drinks + Base] → Output
```

#### Cart Totals Engine (`src/engines/cart-totals.ts`)
```typescript
(PricedCartItem | PricedOfferItem)[] → sumCart() → CartTotals
   ↓              ↓              ↓
Input → [Quantity × Price calculations] → Output
```

## Developing New Features

### 1. Adding a New Engine

#### Step 1: Create the Engine File
```typescript
// src/engines/tax-calculator.ts
export interface TaxConfig {
  taxRate: number;
  taxExemptItems?: number[];
}

export interface TaxResult {
  taxAmount: number;
  taxableAmount: number;
}

export function calculateTax(
  subtotal: number, 
  config: TaxConfig
): TaxResult {
  const taxableAmount = subtotal; // Add logic for exempt items
  const taxAmount = taxableAmount * (config.taxRate / 100);
  
  return {
    taxAmount: parseFloat(taxAmount.toFixed(2)),
    taxableAmount
  };
}
```

#### Step 2: Add Types to Models
```typescript
// src/models/CheckoutConfig.ts
export interface CheckoutConfig {
  // ... existing properties
  taxConfig?: TaxConfig;
}
```

#### Step 3: Integrate into Main Orchestrator
```typescript
// src/index.ts
import { calculateTax } from './engines/tax-calculator';

export function checkout(config: CheckoutConfig): CheckoutResult {
  // ... existing code ...
  
  // Add tax calculation
  const { taxAmount, taxableAmount } = calculateTax(
    totalPrice, 
    config.taxConfig || { taxRate: 0 }
  );
  
  // Update final calculation
  let amount = totalPrice + feeWithVat + dineinCharge + dineinVat + taxAmount;
  
  // ... rest of the code ...
}
```

#### Step 4: Add Tests
```typescript
// __tests__/tax-calculator.test.ts
import { calculateTax } from '../src/engines/tax-calculator';

describe('calculateTax', () => {
  it('should calculate tax correctly', () => {
    const result = calculateTax(100, { taxRate: 10 });
    expect(result.taxAmount).toBe(10.00);
    expect(result.taxableAmount).toBe(100);
  });
});
```

### 2. Adding a New Mapper

#### Step 1: Create the Mapper File
```typescript
// src/mappers/analytics.ts
import { CheckoutResult } from '../index';

export interface AnalyticsData {
  totalItems: number;
  totalOffers: number;
  averageItemPrice: number;
  conversionRate: number;
}

export function buildAnalyticsPayload(
  checkoutResult: CheckoutResult,
  sessionData: any
): AnalyticsData {
  const { items, offers } = checkoutResult;
  
  return {
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    totalOffers: offers.reduce((sum, offer) => sum + offer.quantity, 0),
    averageItemPrice: items.length > 0 
      ? items.reduce((sum, item) => sum + item.cartPrice, 0) / items.length 
      : 0,
    conversionRate: sessionData.conversionRate || 0
  };
}
```

### 3. Extending Existing Engines

#### Example: Adding Bulk Discount to Items Engine
```typescript
// src/engines/items.ts
export interface BulkDiscountConfig {
  threshold: number;
  discountPercentage: number;
}

export function calcItemPricesWithBulkDiscount(
  item: CartItem, 
  bulkConfig?: BulkDiscountConfig
): PricedCartItem {
  const baseResult = calcItemPrices(item);
  
  if (bulkConfig && item.quantity >= bulkConfig.threshold) {
    const discount = baseResult.cartPrice * (bulkConfig.discountPercentage / 100);
    return {
      ...baseResult,
      cartPrice: baseResult.cartPrice - discount,
      netPrice: baseResult.netPrice - (discount / 1.14) // Adjust for VAT
    };
  }
  
  return baseResult;
}
```

## Testing

### Running Tests
```bash
npm test                    # Run all tests
npm test -- --watch        # Watch mode
npm test -- --coverage     # With coverage
```

### Test Structure
```typescript
// __tests__/engines/items.test.ts
import { calcItemPrices } from '../../src/engines/items';

describe('calcItemPrices', () => {
  it('should calculate basic item price', () => {
    const item = {
      id: 1,
      quantity: 1,
      size: {
        fullData: {
          net_price: 10.00,
          total_price: 11.40
        }
      }
    };
    
    const result = calcItemPrices(item);
    expect(result.netPrice).toBe(10.00);
    expect(result.cartPrice).toBe(11.40);
  });
  
  it('should calculate item with extras', () => {
    // Test with extras
  });
  
  it('should calculate item with replacements', () => {
    // Test with replacements
  });
});
```

### Integration Tests
```typescript
// __tests__/integration/checkout.test.ts
import { checkout } from '../../src/index';

describe('Checkout Integration', () => {
  it('should handle complex order with all features', () => {
    const config = {
      // Complex configuration with all features
    };
    
    const result = checkout(config);
    
    // Assert all calculations are correct
    expect(result.totals.finalTotal).toBe(expectedTotal);
  });
});
```

## Building and Publishing

### Development Workflow
```bash
# 1. Make changes to source code
# 2. Run type check
npm run type-check

# 3. Run tests
npm test

# 4. Build package
npm run build

# 5. Test the build
node -e "console.log(require('./dist/index.cjs.js'))"
```

### Publishing
```bash
# 1. Update version in package.json
npm version patch  # or minor/major

# 2. Build and test
npm run build
npm test

# 3. Publish
npm publish
```

### Version Management
- `patch`: Bug fixes (1.0.0 → 1.0.1)
- `minor`: New features (1.0.0 → 1.1.0)
- `major`: Breaking changes (1.0.0 → 2.0.0)

## Best Practices

### 1. Engine Development
- Keep engines pure and stateless
- Use TypeScript interfaces for all inputs/outputs
- Add comprehensive JSDoc comments
- Handle edge cases gracefully

### 2. Testing
- Test each engine independently
- Use realistic test data
- Test edge cases and error conditions
- Maintain high test coverage

### 3. Performance
- Avoid unnecessary calculations
- Use efficient data structures
- Consider memoization for expensive operations
- Profile performance with large datasets

### 4. Error Handling
- Validate inputs at the boundary
- Provide meaningful error messages
- Use TypeScript to catch errors at compile time
- Add runtime validation where necessary

## Troubleshooting

### Common Issues

#### 1. Type Errors
```bash
npm run type-check
```
- Check interface definitions
- Ensure all required properties are provided
- Verify import/export statements

#### 2. Build Errors
```bash
npm run build
```
- Check rollup configuration
- Verify all dependencies are installed
- Ensure TypeScript compilation passes

#### 3. Test Failures
```bash
npm test
```
- Review test data
- Check calculation logic
- Verify expected vs actual results

### Debugging Tips
1. Use console.log in engines for debugging
2. Check intermediate calculation results
3. Verify data transformations
4. Test individual engines in isolation

This comprehensive guide should help you understand, use, and extend the buffalo-burger-calculations package effectively! 