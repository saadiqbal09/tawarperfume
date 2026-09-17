import fs from 'node:fs';
const required=['package.json','app/page.tsx','app/layout.tsx','supabase/schema.sql','supabase/seed.sql','lib/cart-context.tsx'];
for(const f of required) if(!fs.existsSync(f)) throw new Error(`Missing ${f}`);
console.log('TAWAR project structure OK');
