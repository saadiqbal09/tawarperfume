'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { Product } from '@/lib/types';
import { formatINR } from '@/lib/utils';
import { useCart } from '@/lib/cart-context';
import QuantitySelector from './QuantitySelector';
import FragranceNotes from './FragranceNotes';
import { buildSingleProductWhatsAppUrl } from '@/lib/whatsapp';

export default function ProductDetail({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const price = product.discount_price ?? product.price;
  const waUrl = buildSingleProductWhatsAppUrl({
    productName: product.name,
    size: product.sizes[0]?.label ?? 'Standard',
    price,
    qty,
  });

  function add() {
    for (let i = 0; i < qty; i++) addItem(product);
  }

  return (
    <div>
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-tawar-cream">
            <Image
              src={product.images[activeImage] ?? '/placeholder.svg'}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          {product.images.length > 1 ? (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition ${
                    activeImage === i
                      ? 'border-tawar-gold'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} ${i + 1}`}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="py-4">
          <p className="text-xs uppercase tracking-luxury text-tawar-gold">
            {product.category.replace('-', ' ')}
          </p>
          <h1 className="mt-3 font-display text-4xl leading-tight md:text-5xl">
            {product.name}
          </h1>
          <p className="mt-5 text-2xl">{formatINR(price)}</p>
          {product.duration ? (
            <p className="mt-2 text-sm text-black/50">
              Lasts {product.duration}
            </p>
          ) : null}
          <p className="mt-5 leading-7 text-black/60">{product.description}</p>

          <div className="mt-6">
            <p className="mb-3 text-xs uppercase tracking-luxury">Size</p>
            <p className="text-sm text-black/70">
              {product.sizes[0]?.label ?? 'Standard'}
            </p>
          </div>

          <div className="mt-6">
            <p className="mb-3 text-xs uppercase tracking-luxury">Quantity</p>
            <QuantitySelector value={qty} onChange={setQty} />
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={add}
              className="rounded-full bg-tawar-black px-7 py-3 text-sm text-white transition hover:bg-tawar-charcoal"
            >
              Add to Cart
            </button>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-7 py-3 text-sm text-white transition hover:bg-[#1ebe5b]"
            >
              Order on WhatsApp
            </a>
          </div>
        </div>
      </div>

      <section className="mt-14">
        <h2 className="mb-6 font-display text-3xl">Fragrance Notes</h2>
        <FragranceNotes product={product} />
      </section>
    </div>
  );
}
