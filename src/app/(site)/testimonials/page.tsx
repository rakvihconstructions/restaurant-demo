"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, CalendarCheck, Quote, Sparkles, Star } from "lucide-react";

const FEATURED_STORIES = [
  {
    name: "Priya & Aditya Nambiar",
    occasion: "10th Anniversary · Private Dining Room",
    image: "/img/guests.jpg",
    quote:
      "We hosted 18 family members at Demo Restaurant for our anniversary dinner. Chef Vikram walked out to explain the coastal tasting menu, the clay-pot Meen Curry brought tears to my grandmother's eyes, and the service felt effortless all night.",
    highlight: "5-Course Coastal Tasting",
  },
  {
    name: "Vikramaditya Sengupta",
    occasion: "Food Writer & Culinary Critic",
    image: "/img/chef-plating.jpg",
    quote:
      "Rarely does an Indiranagar kitchen treat Mangalore, Cochin, and Goan techniques with this much restraint and respect. The Malabar Prawn Moilee and hand-slapped parotta belong on every Bengaluru dining list.",
    highlight: "Best Coastal Kitchen · 2026",
  },
  {
    name: "Dr. Kavitha & Family",
    occasion: "Sunday Lunch · The Verandah",
    image: "/img/garden.jpg",
    quote:
      "Sitting under the rain tree on a breezy Sunday afternoon with Demo Restaurant's Coastal Thali and Filter Coffee Sundae has become our monthly family ritual. Warm, unhurried hospitality every single visit.",
    highlight: "Sunday Verandah Thali",
  },
];

const PRESS_QUOTES = [
  {
    outlet: "Condé Nast Traveller India",
    quote: "A jewel box of southern coastal cooking — smokier, brighter, and far more intimate than anything else on 12th Main.",
    badge: "Top 30 Restaurants",
  },
  {
    outlet: "GQ India Food Awards",
    quote: "The Kokum Collins alone justifies the drive to Indiranagar, and the Thalassery Biryani seals the deal.",
    badge: "Editor's Pick",
  },
  {
    outlet: "Architectural Digest",
    quote: "Teak, brass lamps, and a verandah shaded by a forty-year-old rain tree — dining design done with quiet confidence.",
    badge: "Design & Dining",
  },
];

export default function TestimonialsPage() {
  return (
    <div className="mx-auto max-w-[1380px] px-4 pb-4 pt-2 sm:px-8 sm:pt-3">
      {/* Purple & Amber Hero */}
      <header className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#2a0a4f] via-[#4e1d84] to-[#3b0e6e] text-white shadow-[0_24px_56px_-20px_rgba(42,10,79,0.55)]">
        <Image
          src="/img/interior-warm.jpg"
          alt="Demo Restaurant dining room"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-25"
        />
        <div className="relative grid grid-cols-1 items-center gap-6 p-5 sm:p-8 lg:grid-cols-12 lg:px-12 lg:py-9">
          <div className="lg:col-span-7">
            <p className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#f5a623]">
              <Sparkles className="size-3.5" /> Testimonials &amp; Stories
            </p>
            <h1 className="mt-3 text-[34px] font-extrabold leading-[1.04] tracking-[-0.04em] text-white sm:text-[54px]">
              Evenings people still talk about.
            </h1>
            <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-white/80">
              Stories from anniversaries, Sunday verandah lunches, private dining celebrations, and culinary critics across India.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/menu"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-[#f5a623] px-6 text-[13.5px] font-extrabold text-[#2a0a4f] shadow-lg transition hover:bg-[#fbbf24]"
              >
                <Sparkles className="size-4" /> Explore Menu
              </Link>
              <Link
                href="/reviews"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 text-[13.5px] font-bold text-white backdrop-blur-md transition hover:bg-white/20"
              >
                Read All Guest Reviews <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:col-span-5">
            {[
              ["4.9★", "Average guest rating"],
              ["1,420+", "Verified dining stories"],
              ["320+", "Private events hosted"],
              ["3", "National dining awards"],
            ].map(([val, label]) => (
              <div key={label} className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
                <p className="text-[28px] font-extrabold leading-none text-[#f5a623] sm:text-[32px]">{val}</p>
                <p className="mt-1.5 text-[12px] font-semibold text-white/75">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Featured Guest Stories */}
      <section className="mt-5 space-y-4 sm:mt-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#4e1d84]">Guest Stories</p>
            <h2 className="mt-1 text-[26px] font-extrabold tracking-[-0.03em] text-[#0f172a] sm:text-[32px]">
              From Our Table to Yours
            </h2>
          </div>
          <Link href="/reviews#write-review" className="text-[13.5px] font-bold text-[#4e1d84] hover:underline">
            Share your own review →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {FEATURED_STORIES.map((s) => (
            <article
              key={s.name}
              className="flex flex-col overflow-hidden rounded-[26px] border border-[#4e1d84]/10 bg-white shadow-[0_14px_38px_-20px_rgba(78,29,132,0.18)]"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image src={s.image} alt={s.name} fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover" />
                <span className="absolute left-4 top-4 rounded-full bg-[#4e1d84] px-3 py-1 text-[11px] font-bold text-[#f5a623]">
                  {s.highlight}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <Quote className="size-7 text-[#4e1d84]/25" />
                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-[#2b1b3d]">
                  &ldquo;{s.quote}&rdquo;
                </p>
                <div className="mt-5 flex items-center justify-between border-t border-[#4e1d84]/8 pt-4">
                  <div>
                    <p className="text-[14.5px] font-extrabold text-[#0f172a]">{s.name}</p>
                    <p className="text-[12px] text-[#64748b]">{s.occasion}</p>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star key={n} className="size-3.5 fill-[#f5a623] text-[#f5a623]" />
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Press & Critic Praise */}
      <section className="mt-6 rounded-[28px] border border-[#4e1d84]/10 bg-gradient-to-r from-[#f3e8ff] via-[#efe3fc] to-[#e6d3fa] p-5 sm:p-7">
        <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#4e1d84]">
          <Award className="size-4" /> Press &amp; Culinary Praise
        </div>
        <h2 className="mt-1.5 text-[24px] font-extrabold tracking-[-0.03em] text-[#0f172a] sm:text-[30px]">
          What Critics Say About Demo Restaurant
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {PRESS_QUOTES.map((p) => (
            <div key={p.outlet} className="rounded-[22px] bg-white p-6 shadow-sm">
              <span className="inline-flex rounded-full bg-[#fef3c7] px-3 py-0.5 text-[11px] font-extrabold text-[#92400e]">
                {p.badge}
              </span>
              <p className="mt-3.5 text-[14.5px] leading-relaxed text-[#2b1b3d]">&ldquo;{p.quote}&rdquo;</p>
              <p className="mt-4 text-[13px] font-extrabold text-[#4e1d84]">— {p.outlet}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
