'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/cart');
  }, [router]);

  return (
    <div className="py-20 text-center">
      <p className="text-black/60">Redirecting to your cart…</p>
    </div>
  );
}
