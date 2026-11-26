"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flame,
  MapPin,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import { DietMark, Sheet } from "@/components/ui";
import { categories, menu, type MenuItem } from "@/lib/menu";
import { DEFAULT_SITE_CONTENT, useHydrated, useStore } from "@/lib/store";
import { cn, inr } from "@/lib/utils";

const HERO_SLIDES = [
  {
    headline: "COASTAL FLAVORS.\nEPIC CRAVINGS.",
    accent: "Live Fresh",
    subtitle: "Charcoal-fired seafood & heirloom curries from Mangalore, Cochin & Goa.",
    cta: "Explore Menu",
    href: "/menu",
    image: "/img/spread.jpg",
  },
  {
    headline: "LOVED BY.\nOUR GUESTS.",
    accent: "4.9★ Rated",
    subtitle: "Read stories from anniversaries, family lunches, and coastal tasting dinners on 12th Main.",
    cta: "Testimonials",
    href: "/testimonials",
    image: "/img/interior-warm.jpg",
  },
  {
    headline: "WOOD-FIRED.\nHAND-GROUND.",
    accent: "Tonight's Catch",
    subtitle: "Fresh-pressed coconut milk, Byadagi chilli ghee roast & warm lacy appams.",
    cta: "Read Reviews",
    href: "/reviews",
    image: "/img/prawn-moilee.jpg",
  },
];

const CATEGORY_THUMBS: { id: string; label: string; image: string }[] = [
  { id: "all", label: "All", image: "/img/spread-top.jpg" },
  { id: "small-plates", label: "Small Plates", image: "/img/tuna-tartare.jpg" },
  { id: "coastal", label: "Curries", image: "/img/prawn-moilee.jpg" },
  { id: "tandoor", label: "Tandoor", image: "/img/tandoori-kozhi.jpg" },
  { id: "rice", label: "Biryani & Rice", image: "/img/thalassery-biryani.jpg" },
  { id: "thali", label: "Thalis", image: "/img/thali.jpg" },
  { id: "bar", label: "Bar", image: "/img/bar.jpg" },
  { id: "desserts", label: "Desserts", image: "/img/rose-cake.jpg" },
];

const ROOM_CARDS = [
  { name: "The Dining Room", seats: "48 seats", note: "Warm teak, brass lamps & open spice bar", image: "/img/interior-warm.jpg" },
  { name: "The Verandah", seats: "24 seats", note: "Breezy garden seating under the rain tree", image: "/img/garden.jpg" },
  { name: "The Bar", seats: "16 seats", note: "Kokum highballs, toddy infusions & small plates", image: "/img/bar.jpg" },
  { name: "The Sea Deck", seats: "60 seats", note: "Coastal sunset terrace overlooking the water", image: "/img/terrace-sea.jpg" },
];

function ratingFor(idx: number) {
  const scores = ["4.9 (1.4K+)", "4.8 (980+)", "4.9 (1.1K+)", "4.7 (740+)", "4.8 (860+)", "4.9 (1.2K+)"];
  return scores[idx % scores.length];
}

function badgeFor(m: MenuItem, idx: number): { text: string; tone: "purple" | "amber" } | null {
  if (m.tags?.includes("bestseller")) return { text: "BESTSELLER", tone: "purple" };
  if (m.tags?.includes("chef")) return { text: "CHEF'S PICK", tone: "amber" };
  if (m.tags?.includes("new")) return { text: "NEW", tone: "purple" };
  if (idx === 1) return { text: "POPULAR", tone: "amber" };
  return null;
}

export default function RestaurantHome() {
  const hydrated = useHydrated();
  const storedContent = useStore((s) => s.siteContent);
  const content = hydrated && storedContent ? storedContent : DEFAULT_SITE_CONTENT;
  const [slide, setSlide] = useState(0);
  const [activeCat, setActiveCat] = useState("all");
  const [q, setQ] = useState("");
  const [vegOnly, setVegOnly] = useState(false);
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);

  const cur = HERO_SLIDES[slide];
  const displayHeadline = slide === 0 ? content.headline : cur.headline;
  const displayAccent = slide === 0 ? content.accent : cur.accent;
  const displaySubtitle = slide === 0 ? content.subtitle : cur.subtitle;
  const desktopHeroImg = slide === 0 && content.desktopBannerImage ? content.desktopBannerImage : cur.image;
  const mobileHeroImg = slide === 0 && (content.mobileBannerImage || content.desktopBannerImage) ? (content.mobileBannerImage || content.desktopBannerImage)! : cur.image;

  const visibleDishes = useMemo(() => {
    const list = menu.filter((m) => {
      if (vegOnly && m.diet !== "veg") return false;
      if (activeCat !== "all" && m.category !== activeCat) return false;
      if (q && !(m.name + m.description).toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
    return list.slice(0, 8);
  }, [activeCat, q, vegOnly]);

  const prevSlide = () => setSlide((s) => (s - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  const nextSlide = () => setSlide((s) => (s + 1) % HERO_SLIDES.length);

  return (
    <div className="mx-auto max-w-[1380px] px-4 pb-10 pt-3 sm:px-8 sm:pt-5">
      {/* Mobile Search + Veg Filter Row (matches Mobile Reference -19.jpg) */}
      <div className="mb-4 flex items-center gap-2.5 lg:hidden">
        <label className="flex h-12 min-w-0 flex-1 items-center gap-2.5 rounded-2xl border border-[#4e1d84]/10 bg-white px-4 shadow-[0_6px_18px_-10px_rgba(78,29,132,0.18)] focus-within:border-[#4e1d84]">
          <Search className="size-4.5 shrink-0 text-[#64748b]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search coastal dishes…"
            className="min-w-0 flex-1 bg-transparent text-[14px] text-[#0f172a] outline-none placeholder:text-[#9080a4]"
          />
        </label>
        <button
          type="button"
          onClick={() => setVegOnly((v) => !v)}
          aria-pressed={vegOnly}
          aria-label="Toggle veg only"
          className={cn(
            "grid size-12 shrink-0 place-items-center rounded-2xl border shadow-[0_6px_18px_-10px_rgba(78,29,132,0.18)] transition",
            vegOnly
              ? "border-[#2f6b3a] bg-[#2f6b3a] text-white"
              : "border-[#4e1d84]/10 bg-white text-[#4e1d84]",
          )}
        >
          <SlidersHorizontal className="size-4.5" />
        </button>
      </div>

      {/* Hero Banner Carousel (matches Desktop & Mobile Purple/Amber Reference) */}
      <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#2a0a4f] via-[#4e1d84] to-[#3b0e6e] text-white shadow-[0_24px_56px_-20px_rgba(42,10,79,0.55)]">
        {/* Decorative ambient glow */}
        <div className="pointer-events-none absolute -right-16 -top-16 size-72 rounded-full bg-[#f5a623]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 size-64 rounded-full bg-[#a855f7]/25 blur-3xl" />

        <div className="relative grid grid-cols-1 items-center gap-6 p-6 sm:p-10 lg:grid-cols-12 lg:px-14 lg:py-12">
          <div className="lg:col-span-6">
            <h1 className="whitespace-pre-line text-[30px] font-extrabold uppercase leading-[1.03] tracking-[-0.03em] text-white sm:text-[46px] lg:text-[52px]">
              {displayHeadline}
            </h1>
            <p className="mt-1.5 font-display text-[28px] italic leading-none text-[#f5a623] sm:text-[42px]">
              {displayAccent}
            </p>
            <p className="mt-3 max-w-md text-[14px] leading-relaxed text-white/80 sm:text-[16px]">
              {displaySubtitle}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href={cur.href}
                className="inline-flex h-12 items-center gap-3 rounded-full bg-[#f5a623] pl-6 pr-2.5 text-[14.5px] font-extrabold text-[#2a0a4f] shadow-[0_12px_26px_-8px_rgba(245,166,35,0.75)] transition hover:bg-[#fbbf24]"
              >
                <span>{cur.cta}</span>
                <span className="grid size-8 place-items-center rounded-full bg-white text-[#4e1d84]">
                  <ArrowRight className="size-4" strokeWidth={2.6} />
                </span>
              </Link>
              <Link
                href="/visit"
                className="hidden h-12 items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 text-[14px] font-bold text-white backdrop-blur-md transition hover:bg-white/20 sm:inline-flex"
              >
                <MapPin className="size-4 text-[#f5a623]" />
                Visit Us
              </Link>
            </div>
          </div>

          <div className="relative lg:col-span-6">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[22px] border border-white/15 shadow-2xl sm:aspect-[16/9]">
              {/* Desktop Banner Image */}
              {desktopHeroImg.startsWith("data:") ? (
                <img src={desktopHeroImg} alt={content.name} className="hidden size-full object-cover md:block" />
              ) : (
                <Image
                  src={desktopHeroImg}
                  alt={content.name}
                  fill
                  priority
                  sizes="50vw"
                  className="hidden object-cover md:block"
                />
              )}
              {/* Mobile Banner Image */}
              {mobileHeroImg.startsWith("data:") ? (
                <img src={mobileHeroImg} alt={content.name} className="size-full object-cover md:hidden" />
              ) : (
                <Image
                  src={mobileHeroImg}
                  alt={content.name}
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover md:hidden"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#2a0a4f]/55 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full bg-[#2a0a4f]/80 px-3.5 py-1.5 text-[11.5px] font-bold text-[#f5a623] backdrop-blur-md">
                <Sparkles className="size-3.5" /> Indiranagar · 12th Main
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Dots & Desktop Arrows */}
        <div className="relative flex items-center justify-between px-6 pb-5 sm:px-10 lg:px-14">
          <div className="flex items-center gap-2">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                aria-label={`Slide ${i + 1}`}
                className={cn(
                  "h-2 rounded-full transition-all",
                  slide === i ? "w-6 bg-[#f5a623]" : "w-2 bg-white/40 hover:bg-white/70",
                )}
              />
            ))}
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <button
              onClick={prevSlide}
              aria-label="Previous slide"
              className="grid size-9 place-items-center rounded-full bg-white text-[#4e1d84] shadow-md transition hover:bg-[#f3e8ff]"
            >
              <ChevronLeft className="size-4.5" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next slide"
              className="grid size-9 place-items-center rounded-full bg-white text-[#4e1d84] shadow-md transition hover:bg-[#f3e8ff]"
            >
              <ChevronRight className="size-4.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Circular Dish Category Strip (matches Reference) */}
      <section className="mt-7">
        <div className="no-scrollbar -mx-4 flex items-center gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:justify-between sm:gap-4 sm:px-0">
          {CATEGORY_THUMBS.map((cat) => {
            const active = activeCat === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCat(cat.id)}
                className="group flex shrink-0 flex-col items-center gap-2 focus:outline-none"
              >
                <div
                  className={cn(
                    "relative grid size-[72px] place-items-center overflow-hidden rounded-full border-2 bg-white p-1.5 shadow-[0_8px_22px_-12px_rgba(78,29,132,0.22)] transition sm:h-[82px] sm:w-[136px] sm:rounded-full",
                    active
                      ? "border-[#4e1d84] bg-[#f3e8ff] ring-2 ring-[#4e1d84]/20"
                      : "border-[#4e1d84]/8 hover:border-[#4e1d84]/35",
                  )}
                >
                  <div className="relative size-full overflow-hidden rounded-full">
                    <Image
                      src={cat.image}
                      alt={cat.label}
                      fill
                      sizes="136px"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                </div>
                <span
                  className={cn(
                    "text-[12.5px] font-bold transition",
                    active ? "text-[#4e1d84]" : "text-[#475569] group-hover:text-[#4e1d84]",
                  )}
                >
                  {cat.label}
                </span>
                {active && <span className="h-0.5 w-6 rounded-full bg-[#4e1d84]" />}
              </button>
            );
          })}
        </div>
      </section>

      {/* Popular Picks Grid (NO Add to Cart — Clean Showcase + Dish Details) */}
      <section className="mt-7">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-[22px] font-extrabold tracking-[-0.03em] text-[#0f172a] sm:text-[26px]">
              Popular Picks
            </h2>
            <button
              type="button"
              onClick={() => setVegOnly((v) => !v)}
              className={cn(
                "hidden h-8 items-center gap-1.5 rounded-full border px-3 text-[12px] font-bold transition lg:inline-flex",
                vegOnly
                  ? "border-[#2f6b3a] bg-[#2f6b3a] text-white"
                  : "border-[#4e1d84]/15 bg-white text-[#475569] hover:border-[#2f6b3a]/50",
              )}
            >
              <span className={cn("size-2 rounded-full", vegOnly ? "bg-white" : "bg-[#2f6b3a]")} />
              Veg Only
            </button>
          </div>
          <Link
            href="/menu"
            className="inline-flex items-center gap-1 text-[13.5px] font-bold text-[#4e1d84] hover:underline"
          >
            View All <ArrowRight className="size-4" />
          </Link>
        </div>

        {visibleDishes.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-[#4e1d84]/20 bg-white p-10 text-center">
            <p className="text-[17px] font-bold text-[#0f172a]">No dishes match that filter.</p>
            <button
              onClick={() => {
                setActiveCat("all");
                setQ("");
                setVegOnly(false);
              }}
              className="mt-3 rounded-full bg-[#4e1d84] px-5 py-2 text-[13px] font-bold text-white"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3.5 sm:gap-5 lg:grid-cols-4">
            {visibleDishes.map((m, idx) => {
              const badge = badgeFor(m, idx);
              return (
                <article
                  key={m.id}
                  onClick={() => setSelectedDish(m)}
                  className="group flex cursor-pointer flex-col overflow-hidden rounded-[24px] border border-[#4e1d84]/8 bg-white p-3.5 shadow-[0_10px_28px_-16px_rgba(78,29,132,0.16)] transition hover:-translate-y-0.5 hover:border-[#4e1d84]/25 hover:shadow-[0_18px_36px_-18px_rgba(78,29,132,0.24)] sm:p-4"
                >
                  {/* Card Top Badges */}
                  <div className="mb-2.5 flex items-center justify-between gap-2">
                    {badge ? (
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-[10px] font-extrabold tracking-wide text-white",
                          badge.tone === "purple" ? "bg-[#4e1d84]" : "bg-[#f5a623] text-[#2a0a4f]",
                        )}
                      >
                        {badge.text}
                      </span>
                    ) : (
                      <span className="rounded-full bg-[#f3e8ff] px-2.5 py-0.5 text-[10px] font-bold text-[#4e1d84]">
                        {categories.find((c) => c.id === m.category)?.name ?? "Coastal"}
                      </span>
                    )}
                    <DietMark diet={m.diet} />
                  </div>

                  {/* Dish Image */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[18px] bg-[#f8fafc]">
                    {m.image ? (
                      <Image
                        src={m.image}
                        alt={m.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <span className="grid h-full place-items-center bg-[#f3e8ff] text-3xl font-extrabold text-[#4e1d84]">
                        {m.name[0]}
                      </span>
                    )}
                  </div>

                  {/* Dish Info */}
                  <div className="mt-3 flex flex-1 flex-col">
                    <h3 className="line-clamp-1 text-[14.5px] font-extrabold tracking-[-0.02em] text-[#0f172a] group-hover:text-[#4e1d84] sm:text-[16px]">
                      {m.name}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-[12px] leading-snug text-[#64748b]">
                      {m.description}
                    </p>
                    <p className="mt-2 flex items-center gap-1 text-[11.5px] font-semibold text-[#64748b]">
                      <Star className="size-3.5 fill-[#f5a623] text-[#f5a623]" />
                      <span>{ratingFor(idx)}</span>
                    </p>

                    <div className="mt-auto flex items-center justify-between gap-2 pt-3">
                      <span className="text-[16px] font-extrabold text-[#0f172a] tnum sm:text-[18px]">
                        {inr(m.price)}
                      </span>
                      <span className="inline-flex h-8 items-center gap-1 rounded-full bg-[#4e1d84] px-3 text-[11.5px] font-bold text-white transition group-hover:bg-[#3d116d] sm:h-9 sm:px-4 sm:text-[12px]">
                        View Dish
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Exclusive Virtual View & Chef's Tasting Lavender Banner */}
      <section className="mt-8 overflow-hidden rounded-[28px] border border-[#4e1d84]/10 bg-gradient-to-r from-[#f3e8ff] via-[#efe3fc] to-[#e6d3fa] p-6 sm:px-10 sm:py-8">
        <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#4e1d84]">
              Live Dining Experience
            </p>
            <h2 className="mt-1 text-[26px] font-extrabold leading-tight tracking-[-0.03em] text-[#0f172a] sm:text-[34px]">
              EXPLORE TONIGHT&apos;S COASTAL MENU
            </h2>
            <p className="mt-1.5 text-[14px] text-[#475569]">
              Hand-ground spice pastes, fresh catch from the coast, and wood-fired favourites prepared fresh daily.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link
                href="/menu"
                className="inline-flex h-11 items-center gap-2.5 rounded-full bg-[#4e1d84] pl-5 pr-2 text-[13.5px] font-bold text-white shadow-[0_10px_22px_-8px_rgba(78,29,132,0.6)] transition hover:bg-[#3d116d]"
              >
                <span>Explore Menu</span>
                <span className="grid size-7 place-items-center rounded-full bg-white text-[#4e1d84]">
                  <ArrowRight className="size-3.5" strokeWidth={2.5} />
                </span>
              </Link>
              <Link href="/testimonials" className="text-[13.5px] font-bold text-[#4e1d84] hover:underline">
                Guest Stories →
              </Link>
            </div>
          </div>

          <div className="relative mx-auto h-40 w-full max-w-[300px] overflow-hidden rounded-2xl shadow-lg md:col-span-4 md:h-44">
            <Image src="/img/prawn-moilee.jpg" alt="Demo Restaurant coastal dining" fill sizes="320px" className="object-cover" />
          </div>

          <div className="flex justify-center md:col-span-3 md:justify-end">
            <div className="grid size-28 place-items-center rounded-full bg-[#4e1d84] text-center text-white shadow-[0_16px_32px_-10px_rgba(78,29,132,0.65)] sm:size-32">
              <div>
                <p className="text-[28px] font-extrabold leading-none text-[#f5a623] sm:text-[32px]">4.9★</p>
                <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.14em] text-white/90">Rated</p>
                <p className="text-[10px] text-white/65">1,420+ diners</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Visit & Timings Bar */}
      <section className="mt-10 grid grid-cols-1 gap-4 rounded-[28px] border border-[#4e1d84]/10 bg-white p-6 shadow-xs md:grid-cols-3 md:items-center">
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
        <div className="flex justify-start md:justify-end">
          <Link
            href="/visit"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-[#4e1d84]/20 bg-[#f3e8ff] px-5 text-[13.5px] font-bold text-[#4e1d84] transition hover:bg-[#4e1d84] hover:text-white"
          >
            Directions &amp; Contact <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* Dish Details Modal (Read-only — NO Add to Cart) */}
      <Sheet
        open={!!selectedDish}
        onClose={() => setSelectedDish(null)}
        side="center"
        width="max-w-lg"
        title={selectedDish?.name}
        subtitle={selectedDish ? `${categories.find((c) => c.id === selectedDish.category)?.name ?? "Coastal"} · ${selectedDish.prep} min` : ""}
      >
        {selectedDish && (
          <div className="p-5 sm:p-6">
            {selectedDish.image && (
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-[#f8fafc]">
                <Image src={selectedDish.image} alt={selectedDish.name} fill sizes="500px" className="object-cover" />
              </div>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <DietMark diet={selectedDish.diet} />
              <span className="text-[20px] font-extrabold text-[#4e1d84] tnum">{inr(selectedDish.price)}</span>
              {selectedDish.tags?.includes("spicy") && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#fef2f2] px-2.5 py-0.5 text-[11px] font-bold text-[#dc2626]">
                  <Flame className="size-3" /> Spiced
                </span>
              )}
              <span className="rounded-full bg-[#f3e8ff] px-2.5 py-0.5 text-[11px] font-bold text-[#4e1d84]">
                {selectedDish.station} Station
              </span>
            </div>
            <p className="mt-3 text-[14.5px] leading-relaxed text-[#475569]">{selectedDish.description}</p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <Link
                href="/menu"
                onClick={() => setSelectedDish(null)}
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-[#4e1d84] px-5 text-[14px] font-bold text-white transition hover:bg-[#3d116d]"
              >
                Explore Full Menu <ArrowRight className="size-4 text-[#f5a623]" />
              </Link>
              <Link
                href="/visit"
                onClick={() => setSelectedDish(null)}
                className="inline-flex h-11 items-center justify-center rounded-full border border-[#4e1d84]/20 px-5 text-[13.5px] font-bold text-[#4e1d84] hover:bg-[#f3e8ff]"
              >
                Visit Us
              </Link>
            </div>
          </div>
        )}
      </Sheet>
    </div>
  );
}
