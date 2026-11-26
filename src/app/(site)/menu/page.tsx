"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CalendarCheck, Sparkles } from "lucide-react";
import { MenuBrowser } from "@/components/site/menu-browser";

function MenuContent() {
  const params = useSearchParams();
  const initialQuery = params.get("q") ?? "";

  return (
    <div className="mx-auto max-w-[1380px] px-4 pb-10 pt-3 sm:px-8 sm:pt-5">
      <header className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#2a0a4f] via-[#4e1d84] to-[#3b0e6e] text-white shadow-[0_20px_50px_-20px_rgba(42,10,79,0.5)]">
        <Image
          src="/img/spread.jpg"
          alt="Coastal Indian dishes at Demo Restaurant"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-25"
        />
        <div className="relative flex flex-col justify-between gap-6 p-6 sm:p-10 lg:flex-row lg:items-end">
          <div>
            <p className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#f5a623]">
              <Sparkles className="size-3.5" /> Demo Restaurant · Indiranagar
            </p>
            <h1 className="mt-2.5 text-[34px] font-extrabold leading-[1.04] tracking-[-0.04em] text-white sm:text-[52px]">
              Tonight&apos;s Menu
            </h1>
            <p className="mt-2.5 max-w-lg text-[14.5px] leading-relaxed text-white/80 sm:text-[15.5px]">
              Fresh catch from Mangalore, Cochin &amp; Goa, hand-ground spice pastes, and warm appams served fresh at your table.
            </p>
          </div>
          <Link
            href="/visit"
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2.5 rounded-full bg-[#f5a623] px-6 text-[14px] font-extrabold text-[#2a0a4f] shadow-lg transition hover:bg-[#fbbf24]"
          >
            <Sparkles className="size-4.5" />
            Visit &amp; Directions
          </Link>
        </div>
      </header>

      <div className="mt-6">
        <MenuBrowser variant="web" initialQuery={initialQuery} onOpenCart={() => {}} />
      </div>
    </div>
  );
}

export default function MenuPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] bg-[#ffffff]" />}>
      <MenuContent />
    </Suspense>
  );
}
