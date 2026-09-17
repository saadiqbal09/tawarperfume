'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { formatINR, slugify } from '@/lib/utils';
import { useCart } from '@/lib/cart-context';

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  const price = product.discount_price ?? product.price;
  const href = `/products/${product.category}/${slugify(product.name)}`;
  const image = product.images[0] ?? '/placeholder.svg';

  return (
    <article className="group overflow-hidden rounded-2xl bg-white shadow-tawar transition hover:shadow-tawar-lg">
      <Link href={href}>
        <div className="relative aspect-square overflow-hidden bg-tawar-cream">
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            loading="lazy"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="p-5">
        <Link href={href}>
          <h3 className="font-display text-xl leading-tight">
            {product.name}
          </h3>
        </Link>
        <p className="mt-2 text-sm text-black/55">{product.duration}</p>

        <div className="mt-4 flex items-center justify-between">
          <span className="font-medium">{formatINR(price)}</span>
          <button
            onClick={() => addItem(product)}
            className="rounded-full bg-tawar-black px-4 py-2 text-xs uppercase tracking-wider text-white transition hover:bg-tawar-charcoal"
          >
            Add
          </button>
        </div>
      </div>
    </article>
  );
}
