import type { CartItem } from './types';
import { getFragrance } from './mock-data';

// ═══════════════════════════════════════════════
// WhatsApp Order Message Builder
// Reads from env: NEXT_PUBLIC_WHATSAPP_NUMBER
// ═══════════════════════════════════════════════

const FOUNDER_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '918999407970';

function formatFragranceName(slug: string): string {
  const f = getFragrance(slug);
  return f ? f.name : slug;
}

function formatINR(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

/**
 * Build the itemized WhatsApp message body for an order.
 */
export function buildOrderMessage(params: {
  items: CartItem[];
  subtotal: number;
  qualifiesForFreeCard: boolean;
}): string {
  const { items, subtotal, qualifiesForFreeCard } = params;

  const lines: string[] = [];
  lines.push('*NEW ORDER — TAWAR CAR PERFUMES*');
  lines.push('');
  lines.push('*Order Items:*');
  lines.push('');

  items.forEach((item, idx) => {
    lines.push(`${idx + 1}. ${item.product.name}`);

    // Regular single product (has fragrance baked into name)
    if (!item.product.isCombo) {
      lines.push(`   • Size: ${item.product.sizes[0]?.label ?? 'Standard'}`);
    }

    // Combo line items
    if (item.product.isCombo) {
      // Combo selections (per-slot fragrance / design)
      if (item.comboSelections?.length) {
        item.comboSelections.forEach((sel) => {
          const fName = formatFragranceName(sel.fragrance);
          if (sel.design) {
            lines.push(`   • Slot ${sel.slot}: ${fName} — Design: ${sel.design}`);
          } else {
            lines.push(`   • Slot ${sel.slot}: ${fName}`);
          }
        });
      }

      // Mix & Match — list the 4 chosen products
      if (item.mixMatchProducts?.length) {
        item.mixMatchProducts.forEach((mm, mmIdx) => {
          const fName = formatFragranceName(mm.fragrance);
          const design = mm.design ? ` — Design: ${mm.design}` : '';
          lines.push(`   • Pick ${mmIdx + 1}: ${mm.productName} (${fName})${design}`);
        });
      }

      // Combo contents listing (for clarity)
      if (item.product.comboIncludes?.length) {
        lines.push(`   • Includes: ${item.product.comboIncludes.join(', ')}`);
      }
    }

    const unit = formatINR(item.unitPrice);
    const total = formatINR(item.unitPrice * item.qty);
    lines.push(`   • Qty: ${item.qty} | Price: ${unit} each = ${total}`);
    lines.push('');
  });

  // Free card offer
  if (qualifiesForFreeCard) {
    lines.push('🎁 *OFFER APPLIED:* FREE Fragrance Card included');
    lines.push('   (Design: Customer choice — please confirm in chat)');
    lines.push('');
  } else {
    // Explain why no free card if combo present but subtotal ≥ 500
    const hasCombo = items.some((i) => i.product.isCombo);
    if (hasCombo && subtotal >= 500) {
      lines.push('ℹ️ Note: Free Card offer not applicable on Combo purchases.');
      lines.push('');
    }
  }

  lines.push(`*Total Amount:* ${formatINR(subtotal)}`);
  lines.push('');
  lines.push('📍 COD: Available only in Nanded city. Outside Nanded — prepaid (UPI/Bank Transfer) only.');
  lines.push('');
  lines.push('Hi! Please confirm my order and share payment + delivery details.');

  return lines.join('\n');
}

/**
 * Build a full wa.me URL for the founder's WhatsApp.
 */
export function buildWhatsAppUrl(params: {
  items: CartItem[];
  subtotal: number;
  qualifiesForFreeCard: boolean;
}): string {
  const message = buildOrderMessage(params);
  return `https://wa.me/${FOUNDER_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Single-product quick order (for a "Order on WhatsApp" button on a product card).
 * Useful for one-click WhatsApp directly from a product page.
 */
export function buildSingleProductWhatsAppUrl(params: {
  productName: string;
  size?: string;
  fragrance?: string;
  design?: string;
  price: number;
  qty?: number;
}): string {
  const { productName, size, fragrance, design, price, qty = 1 } = params;
  const lines: string[] = [];
  lines.push('*NEW ORDER — TAWAR CAR PERFUMES*');
  lines.push('');
  lines.push(`*Product:* ${productName}`);
  if (fragrance) lines.push(`*Fragrance:* ${fragrance}`);
  if (size) lines.push(`*Size:* ${size}`);
  if (design) lines.push(`*Design:* ${design}`);
  lines.push(`*Qty:* ${qty}`);
  lines.push(`*Price:* ${formatINR(price * qty)}`);
  lines.push('');
  lines.push('📍 COD: Available only in Nanded city. Outside Nanded — prepaid only.');
  lines.push('');
  lines.push('Hi! Please confirm my order and share payment + delivery details.');
  const message = lines.join('\n');
  return `https://wa.me/${FOUNDER_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const WHATSAPP_FOUNDER_NUMBER = FOUNDER_NUMBER;
