import { mockProducts } from "./mock-data";
import type { Product, Order } from "./types";
import { createClient } from "./supabase/server";
export async function getProducts(category?: string): Promise<Product[]> {
  const supabase = await createClient();
  if (!supabase) return category ? mockProducts.filter(p=>p.category===category) : mockProducts;
  const q = supabase.from("products").select("*").eq("is_active",true).order("created_at",{ascending:false});
  const {data,error}=category ? await q.eq("category",category) : await q;
  return error || !data?.length ? (category?mockProducts.filter(p=>p.category===category):mockProducts) : data as Product[];
}
export async function getProductBySlug(slug:string): Promise<Product | null> {
  const products=await getProducts();
  return products.find(p=>p.name.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"")===slug) ?? null;
}
export async function getOrder(orderId:string,phone?:string):Promise<Order|null>{
  const supabase=await createClient(); if(!supabase)return null;
  let q=supabase.from("orders").select("*");
  if(phone) q=q.eq("customer_phone",phone).order("created_at",{ascending:false}).limit(1); else q=q.eq("order_id",orderId).limit(1);
  const {data}=await q.maybeSingle(); return data as Order|null;
}