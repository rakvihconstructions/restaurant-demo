"use client";

import Link from "next/link";
import { ArrowUpRight, Clock, MapPin, Phone, UtensilsCrossed } from "lucide-react";
import { DEFAULT_SITE_CONTENT, useHydrated, useStore } from "@/lib/store";

export function SiteFooter() {
  const hydrated = useHydrated();
  const tenantLogos = useStore((s) => s.tenantLogos);
  const storedContent = useStore((s) => s.siteContent);
  const content = hydrated && storedContent ? storedContent : DEFAULT_SITE_CONTENT;
  const logoUrl = hydrated ? tenantLogos["neela"] : undefined;

  return (
    <footer className="mt-6 rounded-t-[32px] bg-[#2a0a4f] text-white sm:mt-8">
      <div className="mx-auto max-w-[1380px] px-5 pb-28 pt-8 sm:px-8 sm:pt-10 lg:pb-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              {logoUrl ? (
                <img src={logoUrl} alt={content.name} className="size-10 rounded-xl bg-white object-contain p-1" />
              ) : (
                <span className="grid size-10 place-items-center rounded-xl bg-[#f5a623] text-[#2a0a4f]">
                  <UtensilsCrossed className="size-5" />
                </span>
              )}
              <span className="text-[22px] font-extrabold uppercase tracking-[-0.04em]">{content.name}</span>
            </div>
            <p className="mt-4 max-w-sm text-[14.5px] leading-relaxed text-white/75">
              {content.tagline}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/menu"
                className="inline-flex h-10 items-center gap-2 rounded-full bg-[#f5a623] px-5 text-[13.5px] font-extrabold text-[#2a0a4f] transition hover:bg-[#fbbf24]"
              >
                Explore Menu <ArrowUpRight className="size-4" />
              </Link>
              <Link
                href="/visit"
                className="inline-flex h-10 items-center rounded-full border border-white/20 px-5 text-[13.5px] font-bold text-white transition hover:bg-white/10"
              >
                Visit &amp; Contact
              </Link>
            </div>
          </div>

          <div className="md:col-span-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#f5a623]">Explore</p>
            <ul className="mt-4 space-y-2.5 text-[14px] text-white/75">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              <li><Link href="/menu" className="hover:text-white">Menu Showcase</Link></li>
              <li><Link href="/testimonials" className="hover:text-white">Testimonials</Link></li>
              <li><Link href="/reviews" className="hover:text-white">Guest Reviews</Link></li>
              <li><Link href="/visit" className="hover:text-white">Visit &amp; Contact</Link></li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#f5a623]">Location &amp; Hours</p>
            <ul className="mt-4 space-y-3 text-[14px] text-white/75">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-[#f5a623]" />
                <span>{content.address}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="mt-0.5 size-4 shrink-0 text-[#f5a623]" />
                <span>{content.hours}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="size-4 shrink-0 text-[#f5a623]" />
                <span className="font-mono">{content.phone}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5 text-[12.5px] text-white/60">
          <span>© 2026 {content.name}. All rights reserved.</span>

          <a
            href="https://www.rakvih.in"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 font-semibold text-white/75 transition-all duration-300 hover:text-[#facc15] hover:drop-shadow-[0_0_12px_rgba(250,204,21,0.95)]"
          >
            <span>Designed &amp; Developed by:-</span>
            <span className="font-extrabold tracking-wide text-[#fde047] transition-all duration-300 group-hover:text-[#fef08a]">
              Rakvih
            </span>
          </a>

          <Link href="/admin" className="font-semibold text-white/75 hover:text-[#f5a623]">
            Staff &amp; Admin Portal →
          </Link>
        </div>
      </div>
    </footer>
  );
}
