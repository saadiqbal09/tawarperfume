import Link from 'next/link';

export default function AboutFounder() {
  const services = [
    '3D Wheel Alignment',
    'Wheel Balancing',
    'Tyre Services',
    'Nitrogen Filling',
    'Tyre Rotation',
    'Rim Straightening',
    'Puncture / Valve',
  ];

  return (
    <section className="rounded-[2rem] bg-white border border-black/5 p-8 md:p-14 shadow-tawar">
      {/* Section label */}
      <p className="text-xs uppercase tracking-luxury text-tawar-gold">
        About the House
      </p>
      <h2 className="mt-2 font-display text-4xl md:text-5xl">
        Built on wheels. Crafted in fragrance.
      </h2>

      <div className="mt-12 grid gap-12 md:grid-cols-2 md:gap-16">
        {/* ──────── ABOUT FOUNDER ──────── */}
        <div>
          <p className="text-[11px] font-medium uppercase tracking-luxury text-tawar-gold">
            About Founder
          </p>
          <h3 className="mt-3 font-display text-3xl">Faiz Tawar</h3>
          <p className="mt-1 text-sm italic text-black/50">
            Founder &amp; Creative Director
          </p>

          <div className="mt-6 space-y-4 text-sm leading-relaxed text-black/70">
            <p>
              Faiz Tawar is the founder of{' '}
              <strong className="font-medium text-black">Tawar Car Perfumes</strong>,
              and the owner of{' '}
              <strong className="font-medium text-black">Tawar Wheels</strong> —
              with a passion for automotive culture, refined design and premium
              fragrances.
            </p>
            <p>
              Built from a genuine connection with the automotive world, Tawar
              brings together functionality, aesthetics and fragrance to create
              products made for modern drivers.
            </p>
          </div>
        </div>

        {/* ──────── TAWAR WHEELS ──────── */}
        <div>
          <p className="text-[11px] font-medium uppercase tracking-luxury text-tawar-gold">
            Tawar Wheels
          </p>
          <h3 className="mt-3 font-display text-3xl">
            Automotive Service &amp; Wheel Care
          </h3>
          <p className="mt-1 text-sm italic text-black/50">
            Based in Nanded, Maharashtra
          </p>

          <div className="mt-6 space-y-4 text-sm leading-relaxed text-black/70">
            <p>
              Tawar Wheels is an established automotive service business based in
              Nanded, Maharashtra, specializing in 3D wheel alignment, wheel
              balancing, tyre services, nitrogen filling, tyre rotation, rim
              straightening and puncture/valve services.
            </p>
            <p>
              With years of hands-on experience in the automotive field, Tawar
              Wheels forms the foundation behind Tawar's understanding of cars,
              drivers and the automotive lifestyle.
            </p>
          </div>

          {/* Services list */}
          <div className="mt-6">
            <p className="text-[11px] font-medium uppercase tracking-luxury text-black/40">
              Services
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {services.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-black/10 bg-tawar-cream px-3 py-1.5 text-[11px] font-medium text-black/70"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mt-12 border-t border-black/5 pt-8 text-center">
        <p className="text-sm text-black/50">
          Crafted with the same precision we've trusted on the road for years.
        </p>
        <Link
          href="/products"
          className="mt-5 inline-flex rounded-full bg-tawar-black px-7 py-3 text-sm text-white transition hover:bg-tawar-charcoal"
        >
          Explore Fragrances
        </Link>
      </div>
    </section>
  );
}
