'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/cart-context';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import { getFragrance } from '@/lib/mock-data';
import { formatINR } from '@/lib/utils';

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQty,
    subtotal,
    totalItems,
    qualifiesForFreeCard,
    hasComboInCart,
    amountToFreeCard,
    clearCart,
  } = useCart();

  const handleOrderOnWhatsApp = () => {
    if (items.length === 0) return;
    const url = buildWhatsAppUrl({
      items,
      subtotal,
      qualifiesForFreeCard,
    });
    window.open(url, '_blank');
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl py-20 text-center">
        <div className="mb-6 text-6xl">🛒</div>
        <h1 className="font-display text-4xl mb-4">Your cart is empty</h1>
        <p className="text-black/60 mb-8">
          Browse our fragrances and add something you love.
        </p>
        <Link
          href="/"
          className="inline-flex rounded-full bg-tawar-black px-7 py-3 text-sm text-white hover:bg-tawar-charcoal transition"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-luxury text-tawar-gold">
            Your Order
          </p>
          <h1 className="mt-2 font-display text-4xl">Shopping Cart</h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-black/40 hover:text-red-500 underline transition"
        >
          Clear cart
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {items.map((item) => {
            const p = item.product;
            const mainImage = p.images[0] ?? '/placeholder.svg';

            return (
              <div
                key={item.cartItemId}
                className="flex gap-4 rounded-2xl border border-black/10 bg-white p-4"
              >
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-tawar-cream">
                  <Image
                    src={mainImage}
                    alt={p.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display text-lg leading-tight">
                        {p.name}
                      </h3>
                      <p className="mt-0.5 text-xs text-black/50">
                        {p.sizes[0]?.label ?? 'Standard'}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.cartItemId)}
                      className="text-black/30 hover:text-red-500 text-sm transition"
                      aria-label="Remove"
                    >
                      ✕
                    </button>
                  </div>

                  {p.isCombo && item.comboSelections?.length ? (
                    <ul className="mt-2 space-y-0.5 text-xs text-black/60">
                      {item.comboSelections.map((sel) => {
                        const f = getFragrance(sel.fragrance);
                        return (
                          <li key={sel.slot}>
                            • Slot {sel.slot}: {f?.name ?? sel.fragrance}
                            {sel.design ? ` — ${sel.design}` : ''}
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}

                  {p.isCombo && item.mixMatchProducts?.length ? (
                    <ul className="mt-2 space-y-0.5 text-xs text-black/60">
                      {item.mixMatchProducts.map((mm, i) => {
                        const f = getFragrance(mm.fragrance);
                        return (
                          <li key={i}>
                            • {mm.productName} ({f?.name ?? mm.fragrance})
                            {mm.design ? ` — ${mm.design}` : ''}
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}

                  <div className="mt-auto flex items-end justify-between pt-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQty(item.cartItemId, -1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-black/15 text-sm hover:bg-black hover:text-white transition"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm font-medium">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => updateQty(item.cartItemId, 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-black/15 text-sm hover:bg-black hover:text-white transition"
                      >
                        +
                      </button>
                    </div>
                    <p className="font-medium">
                      {formatINR(item.unitPrice * item.qty)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-black/10 bg-tawar-cream p-6">
            <h2 className="font-display text-2xl mb-5">Order Summary</h2>

            <div className="space-y-3 pb-5 text-sm">
              <div className="flex justify-between">
                <span className="text-black/60">
                  Subtotal ({totalItems} items)
                </span>
                <span className="font-medium">{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/60">Shipping</span>
                <span className="font-medium text-black/70">
                  Calculated on WhatsApp
                </span>
              </div>
            </div>

            <div className="border-t border-black/10 pt-5">
              {qualifiesForFreeCard ? (
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-center text-xs text-emerald-700 font-medium">
                  🎁 You&apos;ve unlocked a <strong>FREE Fragrance Card</strong>!
                </div>
              ) : hasComboInCart ? (
                <div className="rounded-xl bg-black/5 p-3 text-center text-xs text-black/60">
                  ℹ️ Free Card offer is not applicable on Combo purchases.
                </div>
              ) : (
                <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-center text-xs text-amber-800">
                  Add{' '}
                  <strong className="text-amber-900">
                    {formatINR(amountToFreeCard)}
                  </strong>{' '}
                  more to unlock a <strong>FREE Fragrance Card</strong>
                </div>
              )}
            </div>

            <div className="mt-5 border-t border-black/10 pt-5">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-black/60">Total</span>
                <span className="font-display text-3xl">
                  {formatINR(subtotal)}
                </span>
              </div>
            </div>

            <button
              onClick={handleOrderOnWhatsApp}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-7 py-4 text-sm font-medium text-white hover:bg-[#1ebe5b] transition"
            >
              Order on WhatsApp
            </button>

            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-center">
              <p className="text-xs font-medium text-amber-900">
                💵 <strong>COD available only in Nanded city</strong>
              </p>
              <p className="mt-1 text-[11px] text-amber-800/80">
                Outside Nanded — prepaid (UPI / Bank Transfer) only.
              </p>
            </div>

            <p className="mt-3 text-center text-xs text-black/50">
              We&apos;ll confirm payment &amp; delivery details on WhatsApp.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
