export interface OfferItem {
  id: number;
  quantity: number;
  sandwiches: Array<{
    menu_item_size_price?: {
      net_price: number;
      total_price: number;
    };
  }>;
  fries: Array<{
    menu_item_size_price?: {
      net_price: number;
      total_price: number;
    };
  }>;
  drink: Array<{
    menu_item_size_price?: {
      net_price: number;
      total_price: number;
    };
  }>;
  fullOfferData?: {
    net_price: number;
    total_price: number;
  };
} 