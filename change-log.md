# Buffalo Burger Calculations — Changelog


### Added
- Support for **effective delivery fee** handling in `delivery_free` coupon type.
- More robust discount capping flow via `applyDiscountsInOrder`.

### Changed
- Updated API naming conventions (`cartMenuItems`, `cartOffers`, `subtotal`, etc.).
- Forward only **applied** discounts (capped) to VAT and final total calculations.

### Fixed
- VAT mismatches when discounts exceeded subtotal.
- Final total now uses **applied** promo/loyalty amounts, not raw values 'sent values i mean'.

---

## [1.0.6]   version — API & Behavior Refresh

### Breaking Changes
#### Renamed Result Fields
| Old | New |
| --- | --- |
| `subTotal` | `subtotal` |
| `subTotalWithVat` | `subtotalWithVat` |
| `vatSubTotal` | `subtotalVat` |
| `Totalvat` | `totalVat` |
| `loyalityApplied` | `loyaltyDiscountAmount` |

#### Renamed Config Keys
| Old | New |
| --- | --- |
| `menuItems` | `cartMenuItems` |
| `offers` | `cartOffers` |
| `dineinExtraChargeWithVat` | ❌ removed (calculated internally) |

#### Item Fields
| Old | New |
| --- | --- |
| `required_netPrice` | `requiredNetPrice` |
| `required_totalPrice` | `requiredTotalPrice` |

---

### Added
- **Delivery-free VAT control** via effective delivery fee parameter.
- Updated documentation & test examples.

### Changed
- `checkout()` now calls `calculateFinalTotal` with capped discounts only.

### Fixed
- Negative VAT scenarios prevented by calculating VAT on non-negative net values.

