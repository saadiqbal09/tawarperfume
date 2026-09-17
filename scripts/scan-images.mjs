#!/usr/bin/env node
/**
 * Auto-scans public/ image folders and generates lib/generated-images.json
 * Runs automatically on `npm run build`.
 *
 * Naming convention: {imagePrefix}-{number}.{jpg|jpeg|png|webp|avif}
 * Example: azezya-1.jpg, azezya-2.jpg
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT, 'public');
const OUTPUT = path.join(ROOT, 'lib', 'generated-images.json');

const VALID_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);

function scanFolder(folderPath, prefix) {
  if (!fs.existsSync(folderPath)) return [];
  const files = fs.readdirSync(folderPath);
  const matches = files
    .filter((f) => {
      const ext = path.extname(f).toLowerCase();
      if (!VALID_EXT.has(ext)) return false;
      // Match files like `{prefix}-{number}.ext`
      return f.startsWith(`${prefix}-`);
    })
    .sort((a, b) => {
      // Sort numerically by the number in the filename
      const numA = parseInt(a.match(/-(\d+)\./)?.[1] || '0', 10);
      const numB = parseInt(b.match(/-(\d+)\./)?.[1] || '0', 10);
      return numA - numB;
    });
  return matches;
}

function main() {
  const catalogPath = path.join(ROOT, 'lib', 'products-catalog.json');
  if (!fs.existsSync(catalogPath)) {
    console.error('❌ products-catalog.json not found');
    process.exit(1);
  }

  const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  const output = {};

  for (const product of catalog.products) {
    const folderPath = path.join(PUBLIC_DIR, product.imageFolder);
    const files = scanFolder(folderPath, product.imagePrefix);
    // Build public URLs
    output[product.id] = files.map((f) => `/${product.imageFolder}/${f}`);
  }

  fs.writeFileSync(OUTPUT, JSON.stringify(output, null, 2));

  const total = Object.values(output).reduce((sum, arr) => sum + arr.length, 0);
  console.log(`✅ Scanned ${Object.keys(output).length} products, found ${total} images`);
  console.log(`   Written to: lib/generated-images.json`);

  // Show products with no images
  const missing = Object.entries(output)
    .filter(([, arr]) => arr.length === 0)
    .map(([id]) => id);
  if (missing.length > 0) {
    console.log(`\n⚠️  Products with no images (will use placeholder):`);
    missing.forEach((id) => console.log(`   - ${id}`));
  }
}

main();
