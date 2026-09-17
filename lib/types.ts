// ═══════════════════════════════════════════════
// TAWAR — Core Types
// ═══════════════════════════════════════════════

export type Product = {
  id: string;
  sku: string;
  name: string;
  category: string;
  sub_category: string;
  description: string;
  price: number;
  discount_price: number | null;
  images: string[];
  top_notes: string[];
  heart_notes: string[];
  base_notes: string[];
  duration: string;
  sizes: { label: string; price: number }[];
  is_active: boolean;
  in_stock: boolean;
  // Combo support
  isCombo?: boolean;
  comboIncludes?: string[];
  youSave?: number;
};

// What lives inside a CartItem when it's a combo
export type ComboSelection = {
  slot: number;              // 1..N
  fragrance: string;         // fragrance slug
  design?: string;           // for cards
  productType?: string;      // for Mix & Match only
};

export type CartItem = {
  // Unique row id — for combos with different selections, this must differ
  cartItemId: string;

  // Underlying product
  product: Product;

  // Quantity of this line item
  qty: number;

  // For combos — the sub-selections the customer made
  comboSelections?: ComboSelection[];

  // For Mix & Match — the 4 chosen products
  mixMatchProducts?: {
    productId: string;
    productName: string;
    fragrance: string;
    design?: string;
    price: number;
  }[];

  // Final price for THIS line item (after any combo discount)
  unitPrice: number;
};

export type Order = {
  id?: string;
  order_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  shipping_address: string;
  pincode: string;
  items: unknown;
  subtotal: number;
  tax?: number;
  shipping_charge?: number;
  total: number;
  status: string;
  payment_method?: string;
  payment_reference?: string;
  courier_tracking?: string;
  tracking_url?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
};
