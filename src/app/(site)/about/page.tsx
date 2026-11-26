"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  ChefHat,
  Clock,
  Flame,
  HeartHandshake,
  Leaf,
  MapPin,
  Sparkles,
  UtensilsCrossed,
  Waves,
} from "lucide-react";
import { DEFAULT_SITE_CONTENT, useHydrated, useStore } from "@/lib/store";

const PILLARS = [
  {
    icon: Waves,
    tone: "bg-[#f3e8ff] text-[#4e1d84]",
    title: "Coast-to-Table Catch",
    desc: "Line-caught seer fish, tiger prawns, and blue crab sourced daily from Mangalore, Fort Kochi, and Karwar boats.",
  },
  {
    icon: Flame,
    tone: "bg-[#fef3c7] text-[#b45309]",
    title: "Charcoal & Clay-Pot Craft",
    desc: "Every masala is roasted whole and stone-ground each morning, then slow-simmered in seasoned earthenware or kissed by live tamarind wood.",
  },
  {
    icon: Leaf,
    tone: "bg-[#ecfdf5] text-[#059669]",
    title: "Heirloom Ingredients",
    desc: "Single-estate Tellicherry black pepper, sun-dried Byadagi chillies, cold-pressed coconut milk, and hand-harvested Malabar kokum.",
  },
  {
    icon: HeartHandshake,
    tone: "bg-[#fce7f3] text-[#be185d]",
    title: "Unhurried Hospitality",
    desc: "Four intimate dining spaces designed for lingering conversations, celebratory family thalis, and warm neighbourhood evenings.",
  },
];

const JOURNEY = [
  {
    year: "2019",
    title: "The First Spice Notebook",
    desc: "Founders Ananya Rao and Chef Vikram Shetty spent a year travelling the Konkan and Malabar coastline documenting family recipes.",
  },
  {
    year: "2021",
    title: "Opening on 12th Main",
    desc: "We restored a sunlit Indiranagar bungalow with a forty-year-old rain tree and fired up our first charcoal grill and appam tawa.",
  },
  {
    year: "2024",
    title: "Four Dining Rooms & Coastal Bar",
    desc: "Expanded with The Verandah, our botanical Kokum & Toddy Bar, and the sunset Sea Deck for coastal tasting dinners.",
  },
  {
    year: "2026",
    title: "Recognised Across India",
    desc: "Named among India's Top 30 Restaurants with 1,420+ verified 4.9★ guest stories and a dedicated neighbourhood following.",
  },
];

const SPACES = [
  {
    name: "The Dining Room",
    caption: "Warm teak, brass lamps & open spice bar",
    image: "/img/interior-warm.jpg",
  },
  {
    name: "The Verandah",
    caption: "Breezy garden tables under the rain tree",
    image: "/img/garden.jpg",
  },
  {
    name: "The Coastal Bar",
    caption: "Kokum highballs, toddy infusions & small plates",
    image: "/img/bar.jpg",
  },
  {
    name: "The Sea Deck",
    caption: "Open-air evening terrace for coastal tastings",
    image: "/img/terrace-sea.jpg",
  },
];

export default function AboutPage() {
  const hydrated = useHydrated();
  const storedContent = useStore((s) => s.siteContent);
  const content = hydrated && storedContent ? storedContent : DEFAULT_SITE_CONTENT;

  return (
    <div className="mx-auto max-w-[1380px] px-4 pb-4 pt-2 sm:px-8 sm:pt-3">
      {/* Purple & Amber Hero Banner */}
      <header className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#2a0a4f] via-[#4e1d84] to-[#3b0e6e] text-white shadow-[0_24px_56px_-20px_rgba(42,10,79,0.55)]">
        <Image
          src="/img/chef-flame.jpg"
          alt={`Inside the kitchen at ${content.name}`}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-25"
        />
        <div className="pointer-events-none absolute -right-14 -top-14 size-72 rounded-full bg-[#f5a623]/20 blur-3xl" />

        <div className="relative grid grid-cols-1 items-center gap-6 p-5 sm:p-8 lg:grid-cols-12 lg:px-12 lg:py-9">
          <div className="lg:col-span-7">
            <p className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#f5a623]">
              <Sparkles className="size-3.5" /> Our Story · {content.name}
            </p>
            <h1 className="mt-2.5 text-[34px] font-extrabold leading-[1.04] tracking-[-0.04em] text-white sm:text-[52px]">
              Coastal heirloom cooking, fired fresh every day.
            </h1>
            <p className="mt-3 max-w-xl text-[14.5px] leading-relaxed text-white/80 sm:text-[15.5px]">
              {content.tagline}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/menu"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-[#f5a623] px-6 text-[13.5px] font-extrabold text-[#2a0a4f] shadow-lg transition hover:bg-[#fbbf24]"
              >
                <UtensilsCrossed className="size-4" /> Explore Tonight&apos;s Menu
              </Link>
              <Link
                href="/visit"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 text-[13.5px] font-bold text-white backdrop-blur-md transition hover:bg-white/20"
              >
                Visit Us <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:col-span-5">
            {[
              ["32+", "Coastal signature dishes"],
              ["4.9★", "Guest rating (1,420+)"],
              ["4", "Intimate dining spaces"],
              ["100%", "Fresh-ground masalas"],
            ].map(([val, label]) => (
              <div
                key={label}
                className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md"
              >
                <p className="text-[28px] font-extrabold leading-none text-[#f5a623] sm:text-[32px]">
                  {val}
                </p>
                <p className="mt-1.5 text-[12px] font-semibold text-white/80">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Editorial Story Split */}
      <section className="mt-5 grid grid-cols-1 items-center gap-6 rounded-[28px] border border-[#4e1d84]/10 bg-white p-5 shadow-[0_14px_38px_-22px_rgba(78,29,132,0.16)] sm:mt-6 sm:p-8 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#4e1d84]">
            The Kitchen Philosophy
          </p>
          <h2 className="mt-1.5 text-[26px] font-extrabold leading-tight tracking-[-0.03em] text-[#0f172a] sm:text-[34px]">
            Where Mangalore, Cochin &amp; Goa meet on one table.
          </h2>
          <p className="mt-3 text-[14.5px] leading-relaxed text-[#475569]">
            At <strong className="font-bold text-[#0f172a]">{content.name}</strong>, our menu begins before sunrise with
            the morning catch and whole spices sun-dried along India&apos;s western coast. We never use pre-made bases or
            shortcuts — coconut milk is pressed to order, appam batter ferments naturally overnight, and every curry is
            finished in seasoned clay pots.
          </p>
          <p className="mt-3 text-[14.5px] leading-relaxed text-[#475569]">
            Whether you&apos;re stopping by for a breezy Sunday verandah thali or celebrating a milestone dinner with
            coastal cocktails, our goal is simple: food that feels deeply rooted, bright, and unmistakably homemade.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#f3e8ff] px-4 py-2 text-[12.5px] font-bold text-[#4e1d84]">
              <ChefHat className="size-4" /> Led by Chef Vikram Shetty
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#fef3c7] px-4 py-2 text-[12.5px] font-bold text-[#92400e]">
              <Award className="size-4" /> Top 30 Restaurants · India
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:col-span-6">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[22px] shadow-md">
            <Image
              src="/img/chef-plating.jpg"
              alt="Chef plating coastal dish"
              fill
              sizes="(max-width: 1024px) 50vw, 25vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col gap-3">
            <div className="relative aspect-[4/3] flex-1 overflow-hidden rounded-[22px] shadow-md">
              <Image
                src="/img/spread-top.jpg"
                alt="Coastal Indian spread"
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[4/3] flex-1 overflow-hidden rounded-[22px] shadow-md">
              <Image
                src="/img/chopping.jpg"
                alt="Fresh herbs and spices prep"
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Four Craft Pillars */}
      <section className="mt-5 sm:mt-6">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#4e1d84]">
              What Sets Us Apart
            </p>
            <h2 className="mt-0.5 text-[24px] font-extrabold tracking-[-0.03em] text-[#0f172a] sm:text-[28px]">
              Four Promises on Every Plate
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p) => (
            <div
              key={p.title}
              className="rounded-[24px] border border-[#4e1d84]/10 bg-white p-5 shadow-[0_10px_28px_-18px_rgba(78,29,132,0.16)] transition hover:-translate-y-0.5 hover:border-[#4e1d84]/25"
            >
              <span className={`grid size-11 place-items-center rounded-2xl ${p.tone}`}>
                <p.icon className="size-5" />
              </span>
              <h3 className="mt-4 text-[16.5px] font-extrabold text-[#0f172a]">{p.title}</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-[#64748b]">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Spaces Gallery */}
      <section className="mt-5 sm:mt-6">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#4e1d84]">
              Inside {content.name}
            </p>
            <h2 className="mt-0.5 text-[24px] font-extrabold tracking-[-0.03em] text-[#0f172a] sm:text-[28px]">
              Spaces Built for Lingering
            </h2>
          </div>
          <Link href="/testimonials" className="text-[13.5px] font-bold text-[#4e1d84] hover:underline">
            Read Guest Stories →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SPACES.map((s) => (
            <article
              key={s.name}
              className="group overflow-hidden rounded-[24px] border border-[#4e1d84]/10 bg-white shadow-[0_10px_28px_-18px_rgba(78,29,132,0.16)]"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={s.image}
                  alt={s.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2a0a4f]/70 via-transparent to-transparent" />
                <p className="absolute bottom-3 left-3.5 right-3.5 text-[16px] font-extrabold text-white">
                  {s.name}
                </p>
              </div>
              <p className="p-4 text-[13px] leading-snug text-[#64748b]">{s.caption}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Soft Lavender Journey Timeline */}
      <section className="mt-5 rounded-[28px] border border-[#4e1d84]/10 bg-gradient-to-r from-[#f3e8ff] via-[#efe3fc] to-[#e6d3fa] p-5 sm:mt-6 sm:p-7">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#4e1d84]">
          Our Journey
        </p>
        <h2 className="mt-1 text-[24px] font-extrabold tracking-[-0.03em] text-[#0f172a] sm:text-[30px]">
          From a Coastal Notebook to Indiranagar
        </h2>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {JOURNEY.map((j) => (
            <div key={j.year} className="rounded-[22px] bg-white/95 p-5 shadow-2xs">
              <span className="inline-flex rounded-full bg-[#4e1d84] px-3 py-0.5 font-mono text-[11.5px] font-extrabold text-[#f5a623]">
                {j.year}
              </span>
              <h3 className="mt-3 text-[15.5px] font-extrabold text-[#0f172a]">{j.title}</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-[#475569]">{j.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Visit Strip */}
      <section className="mt-5 grid grid-cols-1 gap-4 rounded-[28px] border border-[#4e1d84]/10 bg-white p-5 shadow-xs sm:mt-6 md:grid-cols-3 md:items-center">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-[#f3e8ff] text-[#4e1d84]">
            <MapPin className="size-5" />
          </span>
          <div>
            <p className="text-[14px] font-extrabold text-[#0f172a]">{content.name}</p>
            <p className="mt-0.5 text-[13px] text-[#64748b]">{content.address}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-[#fef3c7] text-[#b45309]">
            <Clock className="size-5" />
          </span>
          <div>
            <p className="text-[14px] font-extrabold text-[#0f172a]">Opening Hours</p>
            <p className="mt-0.5 text-[13px] text-[#64748b]">{content.hours}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2.5 md:justify-end">
          <Link
            href="/menu"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-[#4e1d84] px-5 text-[13.5px] font-bold text-white transition hover:bg-[#3d116d]"
          >
            Explore Menu <ArrowRight className="size-4 text-[#f5a623]" />
          </Link>
          <Link
            href="/visit"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-[#4e1d84]/20 bg-[#f3e8ff] px-5 text-[13.5px] font-bold text-[#4e1d84] transition hover:bg-[#4e1d84] hover:text-white"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}
