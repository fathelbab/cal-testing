# Buffalo Burger Calculations

A TypeScript cart calculation engine for buffalo burger restaurants. This package provides a comprehensive solution for calculating order totals, including items, offers, delivery fees, dine-in charges, promocodes, and loyalty points.

## Features

- 🍔 **Item Pricing**: Calculate prices for menu items with extras, replacements, and combo options
- 🎁 **Offer Management**: Handle complex offers with sandwiches, fries, and drinks
- 🚚 **Delivery Calculation**: Support for delivery fees with VAT calculations
- 🍽️ **Dine-in Charges**: Fixed or percentage-based dine-in charges
- 🎫 **Promocode Support**: Fixed amount or percentage discounts
- ⭐ **Loyalty Points**: Points-based discount system
- 📦 **TypeScript**: Full TypeScript support with comprehensive type definitions
- 🧪 **Tested**: Jest test suite included

## Installation

```bash
npm install buffalo-burger-calculations
```

## Usage

### Basic Checkout

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
  offers: [],
  deliveryType: 1, // 1 = delivery, 2 = pickup, 3 = dine-in
  branchConfig: {
    branch_delivery_charge: 5.00,
    delivery_time: 30
  },
  addressConfig: {
    street: {
      delivery_charge: 5.00,
      delivery_time: 30
    }
  }
};

const result = checkout(config);
console.log(result.totals.finalTotal); // Final total amount
```

### Advanced Features

```typescript
import { checkout, CheckoutConfig } from 'buffalo-burger-calculations';

const config: CheckoutConfig = {
  menuItems: [/* ... */],
  offers: [/* ... */],
  deliveryType: 1,
  branchConfig: {/* ... */},
  addressConfig: {/* ... */},
  
  // Promocode (10% discount)
  promocodePercentage: 10,
  
  // Dine-in charge (5% of net total)
  dineinPercentage: 5,
  
  // Loyalty points
  userPointsInfo: {
    points: 100,
    pendingPoints: 0,
    pointsValue: 50.00,
    pendingPointsValue: 0
  }
};

const result = checkout(config);
```

### Order API Integration

```typescript
import { buildOrderPayload } from 'buffalo-burger-calculations/mappers/order-api';

const orderPayload = buildOrderPayload(
  checkoutResult,
  { id: 123, name: 'John Doe' },
  {
    promocode: 'SAVE10',
    isReorder: false
  }
);

// Send to your backend API
fetch('/api/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(orderPayload)
});
```

## API Reference

### Main Functions

#### `checkout(config: CheckoutConfig): CheckoutResult`

The main function that orchestrates all calculations.

**Parameters:**
- `config`: Configuration object containing cart items, offers, and settings

**Returns:**
- `CheckoutResult`: Object containing priced items, offers, and calculated totals

### Individual Engines

#### Items Engine
- `calcItemPrices(item: CartItem): PricedCartItem`

#### Offers Engine
- `calcOfferPrices(offer: OfferItem): PricedOfferItem`

#### Cart Totals Engine
- `sumCart(items: (PricedCartItem | PricedOfferItem)[]): CartTotals`

#### Delivery Engine
- `calcDeliveryFees(config): DeliveryFees`

#### Dine-in Engine
- `calcDineinCharge(netTotal: number, config: DineinConfig): number`

#### Promocode Engine
- `applyPromocode(amount: number, config: PromocodeConfig): number`

#### Loyalty Engine
- `applyLoyalty(amount: number, userPointsInfo: UserPointsInfo): LoyaltyResult`

## Types

### Core Types

```typescript
interface CartItem {
  id: number;
  quantity: number;
  extras?: ExtraItem[];
  replacements?: ExtraItem[];
  comboOption?: ComboOption;
  size: { fullData?: { net_price: number; total_price: number } };
}

interface OfferItem {
  id: number;
  quantity: number;
  sandwiches: Array<{ menu_item_size_price?: { net_price: number; total_price: number } }>;
  fries: Array<{ menu_item_size_price?: { net_price: number; total_price: number } }>;
  drink: Array<{ menu_item_size_price?: { net_price: number; total_price: number } }>;
  fullOfferData?: { net_price: number; total_price: number };
}

interface CheckoutConfig {
  menuItems: CartItem[];
  offers: OfferItem[];
  deliveryType: 1 | 2 | 3;
  branchConfig: { /* ... */ };
  addressConfig?: { /* ... */ };
  promocodeFixed?: number;
  promocodePercentage?: number;
  dineinFixed?: number;
  dineinPercentage?: number;
  userPointsInfo?: UserPointsInfo;
}
```

## Development

### Setup

```bash
git clone <repository>
cd buffalo-burger-calculations
npm install
```

### Build

```bash
npm run build
```

### Test

```bash
npm test
```

### Type Check

```bash
npm run type-check
```

## License

MIT

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request 