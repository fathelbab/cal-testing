export interface ExtraItem {
  id: number;
  net_price: number;
  total_price: number;
  fullData: Record<string, any>;
}

export interface ComboOption {
  fullData: Record<string, any>;
}

export interface CartItem {
  id: number;
  quantity: number;
  extras?: ExtraItem[];
  replacements?: ExtraItem[];
  comboOption?: ComboOption;
  size: {
    fullData?: {
      net_price: number;
      total_price: number;
    };
  };
} 