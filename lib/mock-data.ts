import type { Product } from './types';
import catalog from './products-catalog.json';
import generatedImages from './generated-images.json';

const PLACEHOLDER = '/placeholder.svg';

type CatalogFragrance = {
  name: string;
  tagline: string;
  description: string;
  top_notes: string[];
  heart_notes: string[];
  base_notes: string[];
};

type CatalogProduct = {
  id: string;
  category: string;
  fragrance?: string;
  name: string;
  price: number;
  size: string;
  duration: string;
  imageFolder: string;
  imagePrefix: string;
  hasDesign?: boolean;
  isCombo?: boolean;
  comboType?: string;
  comboIncludes?: string[];
  youSave?: number;
  fragranceSlots?: number;
  designSlots?: number;
};

/** The 4 signature fragrances with all metadata */
export const FRAGRANCES = Object.entries(catalog.fragrances).map(
  ([slug, f]) => {
    const frag = f as CatalogFragrance;
    return {
      slug,
      name: frag.name,
      tagline: frag.tagline,
      description: frag.description,
      top_notes: frag.top_notes,
      heart_notes: frag.heart_notes,
      base_notes: frag.base_notes,
    };
  }
);

/** Fragrance card design options */
export const CARD_DESIGNS = catalog.designs;

/** Categories with display labels */
export const CATEGORIES = catalog.categories;

/** Lookup helper — fragrance by slug */
export const getFragrance = (slug: string) =>
  FRAGRANCES.find((f) => f.slug === slug);

/** Lookup helper — product by id */
export const getCatalogProduct = (id: string) =>
  (catalog.products as CatalogProduct[]).find((p) => p.id === id);

/** Build Product[] for the store — handles singles AND combos */
export const mockProducts: Product[] = (catalog.products as CatalogProduct[]).map(
  (p) => {
    // Combos may not have a single fragrance (multi-fragrance combos)
    const fragrance = p.fragrance
      ? (catalog.fragrances[
          p.fragrance as keyof typeof catalog.fragrances
        ] as CatalogFragrance)
      : null;

    // Get auto-scanned images for this product; fallback to placeholder
    const images = (generatedImages as Record<string, string[]>)[p.id] || [];
    const finalImages = images.length > 0 ? images : [PLACEHOLDER];

    return {
      id: p.id,
      sku: `TWR-${p.id.toUpperCase()}`,
      name: p.name,
      category: p.category,
      sub_category: p.isCombo
        ? 'combo'
        : p.hasDesign
        ? 'design-selectable'
        : 'fixed',
      description: fragrance
        ? fragrance.description
        : `A curated TAWAR bundle. ${p.comboIncludes?.join(', ') ?? ''}`,
      price: p.price,
      discount_price: null,
      images: finalImages,
      top_notes: fragrance ? fragrance.top_notes : ['Varies by fragrance'],
      heart_notes: fragrance ? fragrance.heart_notes : ['Varies by fragrance'],
      base_notes: fragrance ? fragrance.base_notes : ['Varies by fragrance'],
      duration: p.duration,
      sizes: [{ label: p.size, price: p.price }],
      is_active: true,
      in_stock: true,
      // Combo-specific fields
      isCombo: !!p.isCombo,
      comboIncludes: p.comboIncludes,
      youSave: p.youSave,
    };
  }
);

/** Only single (non-combo) products */
export const singleProducts = mockProducts.filter((p) => !p.isCombo);

/** Only combos */
export const comboProducts = mockProducts.filter((p) => p.isCombo);
