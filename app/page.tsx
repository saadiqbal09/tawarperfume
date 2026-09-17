'use client';

import { useState, useMemo } from 'react';
import HeroSlider from '@/components/HeroSlider';
import CategoryStrip from '@/components/CategoryStrip';
import ProductGrid from '@/components/ProductGrid';
import ComboCard from '@/components/ComboCard';
import AboutFounder from '@/components/AboutFounder';
import Link from 'next/link';
import { mockProducts, comboProducts, singleProducts } from '@/lib/mock-data';

const TABS = [
  { id: 'all', label: 'All Products' },
  { id: 'hanging', label: 'Hanging' },
  { id: 'vent', label: 'AC Vent' },
  { id: 'spray', label: 'Sprays' },
  { id: 'cards', label: 'Cards' },
  { id: 'combos', label: 'Combos' },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('all');

  // Memoize filtered products — only recalculates when activeTab changes
  const filteredSingles = useMemo(() => {
    if (activeTab === 'all' || activeTab === 'combos') return singleProducts;
    return singleProducts.filter((p) => p.category === activeTab);
  }, [activeTab]);

  const showCombos = activeTab === 'all' || activeTab === 'combos';

  return (
    <div className="space-y-16">
      <HeroSlider />

      <section>
        <div className="mb-6">
          <p className="text-xs uppercase tracking-luxury text-tawar-gold">
            Shop by format
          </p>
          <h2 className="mt-2 font-display text-4xl">Find your signature</h2>
        </div>
        <CategoryStrip />
      </section>

      {/* Featured Combos */}
      <section>
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-luxury text-tawar-gold">
              Value Bundles
            </p>
            <h2 className="mt-2 font-display text-4xl">Featured Combos</h2>
          </div>
          <button
            onClick={() => setActiveTab('combos')}
            className="text-sm underline"
          >
            View all combos
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {comboProducts.slice(0, 3).map((c) => (
            <ComboCard key={c.id} combo={c} />
          ))}
        </div>
      </section>

      {/* Category Tabs */}
      <section>
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-luxury text-tawar-gold">
              Curated
            </p>
            <h2 className="mt-2 font-display text-4xl">
              {activeTab === 'combos' ? 'All Combos' : 'Our Collection'}
            </h2>
          </div>
          <Link href="/products" className="text-sm underline">
            View all
          </Link>
        </div>

        {/* Tab bar */}
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap rounded-full px-5 py-2 text-xs font-medium tracking-wider uppercase transition ${
                activeTab === tab.id
                  ? 'bg-tawar-black text-white'
                  : 'border border-black/10 bg-white text-black/60 hover:text-black'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'combos' ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {comboProducts.map((c) => (
              <ComboCard key={c.id} combo={c} />
            ))}
          </div>
        ) : (
          <>
            <ProductGrid products={filteredSingles} />
          </>
        )}
      </section>

      {/* Master Combo highlight */}
      <section className="rounded-[2rem] bg-tawar-cream p-8 md:p-14">
        <p className="text-xs uppercase tracking-luxury text-tawar-gold">
          TAWAR Signature
        </p>
        <h2 className="mt-3 max-w-2xl font-display text-5xl">
          Master Combo. One ritual, every drive.
        </h2>
        <p className="mt-5 max-w-xl text-black/60">
          A considered collection of hanging, vent and spray fragrances — plus
          four signature cards — for a cabin that feels unmistakably yours.
        </p>
        <button
          onClick={() => setActiveTab('combos')}
          className="mt-8 inline-flex rounded-full bg-tawar-black px-7 py-3 text-sm text-white hover:bg-tawar-charcoal transition"
        >
          Discover the Master Combo
        </button>
      </section>

      {/* About Founder */}
      <AboutFounder />
    </div>
  );
}
