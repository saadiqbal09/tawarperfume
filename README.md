<<<<<<< HEAD
# TAWAR Fragrance House

Premium, mobile-first car fragrance storefront built with Next.js App Router, TypeScript, Tailwind and optional Supabase/Resend integrations.

## Run
1. `npm install`
2. Copy `.env.local.example` to `.env.local` and fill values when using Supabase.
3. `npm run dev`
4. Open `http://localhost:3000`.

If Supabase variables are empty, the catalog automatically uses 12 local demo products.

## Admin
Default development password in `.env.local`: `tawar-admin-2025`.
Change it before deployment.

## Supabase
Run `supabase/schema.sql`, then `supabase/seed.sql`. For production administration, use the service role only on the server and never expose it to the browser.

## Order flow
Guest checkout -> order saved as `pending_payment` -> track page -> admin approval -> `payment_confirmed`. WhatsApp can be used to communicate order details.

## Brand
Off-white `#F9F7F4`, cream `#F1ECE3`, black `#1A1A1A`, charcoal `#2E2E2E`, gold `#C9A84C`.
=======
# tawarperfumes
tawarperfumes
>>>>>>> 324e39beac63f363567c69ba4de4d8a1b7677a59
