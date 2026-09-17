'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { FRAGRANCES, CARD_DESIGNS, getCatalogProduct } from '@/lib/mock-data';
import { useCart } from '@/lib/cart-context';
import { formatINR } from '@/lib/utils';
import type { Product, ComboSelection } from '@/lib/types';

// ═══════════════════════════════════════════════
// Combo Modal — handles all combo types
// ═══════════════════════════════════════════════

type MixMatchItem = {
  productId: string;
  productName: string;
  fragrance: string;
  design?: string;
  price: number;
};

type Props = {
  combo: Product & {
    comboType?: string;
    comboIncludes?: string[];
    youSave?: number;
    fragranceSlots?: number;
    designSlots?: number;
  };
  onClose: () => void;
};

// Available single products for Mix & Match
const MIX_MATCH_POOL: { id: string; name: string; price: number; hasDesign?: boolean }[] = [
  { id: 'h-azezya', name: 'Hanging Perfume', price: 249 },
  { id: 'v-azezya', name: 'AC Vent Perfume', price: 339 },
  { id: 'sp10-azezya', name: 'Discovery Spray 10ml', price: 129 },
  { id: 'sp30-azezya', name: 'Spray Perfume 30ml', price: 179 },
  { id: 'sp50-azezya', name: 'Spray Perfume 50ml', price: 289 },
  { id: 'sp100-azezya', name: 'Spray Perfume 100ml', price: 399 },
  { id: 'card-azezya', name: 'Fragrance Card', price: 99, hasDesign: true },
];

export default function ComboModal({ combo, onClose }: Props) {
  const { addCombo } = useCart();
  const comboType = combo.comboType ?? 'master';
  const fragranceSlots = combo.fragranceSlots ?? 1;
  const designSlots = combo.designSlots ?? 0;

  // State for fragrance selections (one per slot)
  const [fragranceSelections, setFragranceSelections] = useState<string[]>(
    Array(fragranceSlots).fill(FRAGRANCES[0].slug)
  );

  // State for design selections (one per slot)
  const [designSelections, setDesignSelections] = useState<string[]>(
    Array(designSlots).fill(CARD_DESIGNS[0])
  );

  // Mix & Match state
  const [mixPicks, setMixPicks] = useState<MixMatchItem[]>(
    Array(4).fill(null).map(() => ({
      productId: '',
      productName: '',
      fragrance: FRAGRANCES[0].slug,
      design: undefined,
      price: 0,
    }))
  );

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // ─────────── Mix & Match pricing ───────────
  const mixSubtotal = useMemo(
    () => mixPicks.reduce((sum, p) => sum + (p.price || 0), 0),
    [mixPicks]
  );
  const mixDiscount = useMemo(() => Math.round(mixSubtotal * 0.2), [mixSubtotal]);
  const mixFinal = mixSubtotal - mixDiscount;
  const mixComplete = mixPicks.every((p) => p.productId && p.fragrance);

  // ─────────── Handle Add to Cart ───────────
  const handleAdd = () => {
    if (comboType === 'mixmatch') {
      if (!mixComplete) return;
      addCombo({
        product: combo,
        mixMatchProducts: mixPicks.map((m) => ({ ...m })),
        unitPrice: mixFinal,
      });
    } else {
      // Build combo selections: one per fragrance slot
      const selections: ComboSelection[] = [];
      for (let i = 0; i < fragranceSlots; i++) {
        selections.push({
          slot: i + 1,
          fragrance: fragranceSelections[i],
          design:
            designSlots > 0 && designSelections[i]
              ? designSelections[i]
              : undefined,
        });
      }
      addCombo({
        product: combo,
        comboSelections: selections,
        unitPrice: combo.price,
      });
    }
    onClose();
  };

  // ─────────── Helper: update arrays ───────────
  const setFragranceAt = (idx: number, val: string) => {
    setFragranceSelections((prev) => {
      const next = [...prev];
      next[idx] = val;
      return next;
    });
  };

  const setDesignAt = (idx: number, val: string) => {
    setDesignSelections((prev) => {
      const next = [...prev];
      next[idx] = val;
      return next;
    });
  };

  const updateMixPick = (
    idx: number,
    patch: Partial<MixMatchItem>
  ) => {
    setMixPicks((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], ...patch };
      return next;
    });
  };

  const onMixProductChange = (idx: number, productId: string) => {
    const found = MIX_MATCH_POOL.find((p) => p.id === productId);
    updateMixPick(idx, {
      productId,
      productName: found?.name ?? '',
      price: found?.price ?? 0,
      design: found?.hasDesign ? CARD_DESIGNS[0] : undefined,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-2xl text-black/30 hover:text-black transition"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Header */}
        <div className="mb-6 flex items-start gap-4">
          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-tawar-cream">
            <Image
              src={combo.images[0] ?? '/placeholder.svg'}
              alt={combo.name}
              fill
              sizes="80px"
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <p className="text-xs uppercase tracking-luxury text-tawar-gold">
              Configure Combo
            </p>
            <h2 className="mt-1 font-display text-2xl leading-tight">
              {combo.name}
            </h2>
            <p className="mt-1 text-lg font-medium">
              {comboType === 'mixmatch' ? (
                <>Build your own — 20% off</>
              ) : (
                <>
                  {formatINR(combo.price)}{' '}
                  {combo.youSave ? (
                    <span className="ml-2 text-xs font-normal text-emerald-600">
                      Save {formatINR(combo.youSave)}
                    </span>
                  ) : null}
                </>
              )}
            </p>
          </div>
        </div>

        {/* Includes list */}
        {combo.comboIncludes && combo.comboIncludes.length > 0 ? (
          <div className="mb-6 rounded-2xl bg-tawar-cream p-4">
            <p className="text-xs font-medium uppercase tracking-luxury text-black/50">
              Includes
            </p>
            <ul className="mt-2 space-y-1 text-sm text-black/70">
              {combo.comboIncludes.map((line, i) => (
                <li key={i}>• {line}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {/* ─────────── MIX & MATCH ─────────── */}
        {comboType === 'mixmatch' ? (
          <div className="space-y-4">
            {mixPicks.map((pick, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-black/10 p-4"
              >
                <p className="mb-3 text-xs font-medium uppercase tracking-luxury text-black/50">
                  Pick {idx + 1}
                </p>
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="md:col-span-1">
                    <label className="mb-1 block text-xs text-black/60">
                      Product
                    </label>
                    <select
                      value={pick.productId}
                      onChange={(e) => onMixProductChange(idx, e.target.value)}
                      className="w-full rounded-lg border border-black/15 bg-white p-2 text-sm focus:border-tawar-gold outline-none"
                    >
                      <option value="">Select…</option>
                      {MIX_MATCH_POOL.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} — {formatINR(p.price)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-1">
                    <label className="mb-1 block text-xs text-black/60">
                      Fragrance
                    </label>
                    <select
                      value={pick.fragrance}
                      onChange={(e) =>
                        updateMixPick(idx, { fragrance: e.target.value })
                      }
                      className="w-full rounded-lg border border-black/15 bg-white p-2 text-sm focus:border-tawar-gold outline-none"
                    >
                      {FRAGRANCES.map((f) => (
                        <option key={f.slug} value={f.slug}>
                          {f.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {pick.design !== undefined ? (
                    <div className="md:col-span-1">
                      <label className="mb-1 block text-xs text-black/60">
                        Design
                      </label>
                      <select
                        value={pick.design}
                        onChange={(e) =>
                          updateMixPick(idx, { design: e.target.value })
                        }
                        className="w-full rounded-lg border border-black/15 bg-white p-2 text-sm focus:border-tawar-gold outline-none"
                      >
                        {CARD_DESIGNS.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}

            {/* Mix & Match pricing */}
            <div className="rounded-2xl bg-tawar-cream p-4 text-sm">
              <div className="flex justify-between">
                <span className="text-black/60">Subtotal</span>
                <span>{formatINR(mixSubtotal)}</span>
              </div>
              <div className="mt-1 flex justify-between text-emerald-700">
                <span>Combo discount (20%)</span>
                <span>−{formatINR(mixDiscount)}</span>
              </div>
              <div className="mt-3 flex justify-between border-t border-black/10 pt-3 font-display text-xl">
                <span>You pay</span>
                <span>{formatINR(mixFinal)}</span>
              </div>
            </div>
          </div>
        ) : (
          /* ─────────── STANDARD COMBOS ─────────── */
          <div className="space-y-4">
            {/* Master & HangVent — single fragrance + single design */}
            {(comboType === 'master' || comboType === 'hangvent') && (
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-black/60">
                    Select Fragrance{' '}
                    <span className="text-black/40">(applies to all)</span>
                  </label>
                  <select
                    value={fragranceSelections[0]}
                    onChange={(e) => setFragranceAt(0, e.target.value)}
                    className="w-full rounded-lg border border-black/15 bg-white p-3 text-sm focus:border-tawar-gold outline-none"
                  >
                    {FRAGRANCES.map((f) => (
                      <option key={f.slug} value={f.slug}>
                        {f.name} — {f.tagline}
                      </option>
                    ))}
                  </select>
                </div>
                {designSlots > 0 ? (
                  <div>
                    <label className="mb-1 block text-xs font-medium text-black/60">
                      Select Card Design
                    </label>
                    <select
                      value={designSelections[0]}
                      onChange={(e) => setDesignAt(0, e.target.value)}
                      className="w-full rounded-lg border border-black/15 bg-white p-3 text-sm focus:border-tawar-gold outline-none"
                    >
                      {CARD_DESIGNS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : null}
              </div>
            )}

            {/* Multi-fragrance combos — 4+ slots, one dropdown each */}
            {(comboType === 'multi-fragrance-4' ||
              comboType === 'multi-fragrance-design-4' ||
              comboType === 'carfresh') && (
              <div className="space-y-3">
                {Array.from({ length: fragranceSlots }).map((_, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-black/10 p-3"
                  >
                    <p className="mb-2 text-xs font-medium uppercase tracking-luxury text-black/50">
                      Item {idx + 1}
                    </p>
                    <div className="grid gap-3 md:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-[11px] text-black/60">
                          Fragrance
                        </label>
                        <select
                          value={fragranceSelections[idx]}
                          onChange={(e) => setFragranceAt(idx, e.target.value)}
                          className="w-full rounded-lg border border-black/15 bg-white p-2 text-sm focus:border-tawar-gold outline-none"
                        >
                          {FRAGRANCES.map((f) => (
                            <option key={f.slug} value={f.slug}>
                              {f.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      {designSlots > 0 && designSelections[idx] !== undefined ? (
                        <div>
                          <label className="mb-1 block text-[11px] text-black/60">
                            Design
                          </label>
                          <select
                            value={designSelections[idx]}
                            onChange={(e) => setDesignAt(idx, e.target.value)}
                            className="w-full rounded-lg border border-black/15 bg-white p-2 text-sm focus:border-tawar-gold outline-none"
                          >
                            {CARD_DESIGNS.map((d) => (
                              <option key={d} value={d}>
                                {d}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─────────── ADD TO CART ─────────── */}
        <div className="mt-8 flex items-center justify-between gap-4 border-t border-black/10 pt-6">
          <div>
            <p className="text-xs text-black/50">Total</p>
            <p className="font-display text-2xl">
              {comboType === 'mixmatch'
                ? formatINR(mixFinal)
                : formatINR(combo.price)}
            </p>
          </div>
          <button
            onClick={handleAdd}
            disabled={comboType === 'mixmatch' && !mixComplete}
            className="rounded-full bg-tawar-black px-8 py-3 text-sm text-white transition hover:bg-tawar-charcoal disabled:cursor-not-allowed disabled:opacity-40"
          >
            {comboType === 'mixmatch' ? 'Add Combo to Cart' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
