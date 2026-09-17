create extension if not exists pgcrypto;
create table if not exists products (
 id uuid primary key default gen_random_uuid(), sku text unique not null, name text not null,
 category text not null, sub_category text, description text not null, price integer not null,
 discount_price integer, images text[] not null default '{}', top_notes text[] not null default '{}',
 heart_notes text[] not null default '{}', base_notes text[] not null default '{}', duration text,
 sizes jsonb not null default '[]', is_active boolean not null default true, in_stock boolean not null default true,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists orders (
 id uuid primary key default gen_random_uuid(), order_id text unique not null, customer_name text not null,
 customer_phone text not null, customer_email text, shipping_address text not null, pincode text not null,
 items jsonb not null, subtotal integer not null, tax integer not null default 0, shipping_charge integer not null default 0,
 total integer not null, status text not null default 'pending_payment', payment_method text, payment_reference text,
 courier_tracking text, tracking_url text, notes text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists order_status_history (
 id uuid primary key default gen_random_uuid(), order_id text not null references orders(order_id) on delete cascade,
 status text not null, note text, created_at timestamptz not null default now()
);
create table if not exists admin_users (id uuid primary key default gen_random_uuid(), email text unique not null, created_at timestamptz not null default now());
create index if not exists orders_order_id_idx on orders(order_id);
create index if not exists orders_phone_idx on orders(customer_phone);
create index if not exists orders_status_idx on orders(status);
create index if not exists products_category_idx on products(category);
create index if not exists products_active_idx on products(is_active);
alter table products enable row level security; alter table orders enable row level security; alter table order_status_history enable row level security; alter table admin_users enable row level security;
create policy "public products read" on products for select using (is_active=true);
create policy "public orders insert" on orders for insert with check (true);
create policy "service orders all" on orders for all using (auth.role() = 'service_role');
create policy "service history all" on order_status_history for all using (auth.role() = 'service_role');