'use client';

import Image from 'next/image';
import { useState } from 'react';
import ComboModal from './ComboModal';
import { formatINR } from '@/lib/utils';
import type { Product } from '@/lib/types';

type Props = {
  combo: Product & {
    comboType?: string;
    comboIncludes?: string[];
    youSave?: number;
  };
};

export default function ComboCard({ combo }: Props) {
  const [open, setOpen] = useState(false);
  const image = combo.images[0] ?? '/placeholder.svg';

  return (
    <>
      <div className="group flex flex-col overflow-hidden rounded-3xl border border-tawar-gold/30 bg-gradient-to-br from-white to-tawar-cream/50 transition hover:border-tawar-gold hover:shadow-tawar-lg">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-tawar-cream">
          <Image
            src={image}
            alt={combo.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          {combo.youSave && combo.youSave > 0 ? (
            <div className="absolute right-3 top-3 rounded-full bg-tawar-gold px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
              Save {formatINR(combo.youSave)}
            </div>
          ) : null}
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col p-5">
          <p className="text-[10px] uppercase tracking-luxury text-tawar-gold">
            Combo & Gifting
          </p>
          <h3 className="mt-1 font-display text-lg leading-tight">
            {combo.name}
          </h3>

          {combo.comboIncludes && combo.comboIncludes.length > 0 ? (
            <ul className="mt-3 space-y-1 text-xs text-black/55">
              {combo.comboIncludes.slice(0, 3).map((line, i) => (
                <li key={i}>• {line}</li>
              ))}
              {combo.comboIncludes.length > 3 ? (
                <li className="text-black/40">
                  + {combo.comboIncludes.length - 3} more items
                </li>
              ) : null}
            </ul>
          ) : null}

          <div className="mt-auto flex items-end justify-between pt-5">
            <div>
              {combo.price > 0 ? (
                <>
                  <p className="font-display text-2xl leading-none">
                    {formatINR(combo.price)}
                  </p>
                  {combo.youSave && combo.youSave > 0 ? (
                    <p className="mt-1 text-[11px] text-emerald-700">
                      Save {formatINR(combo.youSave)} vs. singles
                    </p>
                  ) : null}
                </>
              ) : (
                <>
                  <p className="font-display text-lg leading-none">
                    Build Your Own
                  </p>
                  <p className="mt-1 text-[11px] text-black/50">
                    20% off when you pick 4
                  </p>
                </>
              )}
            </div>
            <button
              onClick={() => setOpen(true)}
              className="rounded-full bg-tawar-black px-5 py-2.5 text-xs text-white transition hover:bg-tawar-charcoal"
            >
              {combo.price > 0 ? 'Configure' : 'Build Combo'}
            </button>
          </div>
        </div>
      </div>

      {open ? <ComboModal combo={combo} onClose={() => setOpen(false)} /> : null}
    </>
  );
}
