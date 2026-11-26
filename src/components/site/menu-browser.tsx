"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  ChefHat,
  Clock,
  Flame,
  MapPin,
  Plus,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  Users,
  Utensils,
  Wine,
} from "lucide-react";
import { DietMark, Sheet } from "@/components/ui";
import { categories, menu, type Diet, type MenuItem } from "@/lib/menu";
import { cartTotals, useHydrated, useStore } from "@/lib/store";
import { cn, inr } from "@/lib/utils";
import { ItemSheet } from "./item-sheet";

type PriceBand = "all" | "under350" | "350to600" | "over600";
type SortBy = "recommended" | "price-asc" | "price-desc" | "popular" | "fastest";

/** Derives rich culinary details (ingredients, nutrition, allergens, pairing, serving) for any menu item. */
function getRichDishDetails(m: MenuItem) {
  const text = `${m.name} ${m.description}`.toLowerCase();

  const ingredients = m.description
    .replace(/\.$/, "")
    .split(/,| and | with /i)
    .map((s) => s.trim())
    .filter((s) => s.length > 2 && s.length < 34)
    .slice(0, 6);

  const allergens: string[] = [];
  if (/prawn|fish|tuna|seer|seafood/.test(text)) allergens.push("Seafood / Shellfish");
  if (/paneer|dahi|curd|butter|ghee|milk|cream|ice cream|chantilly/.test(text)) allergens.push("Dairy");
  if (/cashew|almond|nut/.test(text)) allergens.push("Tree Nuts");
  if (/naan|parotta|pav|kulcha|samosa|papdi|sponge|gateau|bread/.test(text)) allergens.push("Gluten");
  if (m.diet === "egg" || /egg/.test(text)) allergens.push("Egg");
  if (allergens.length === 0) allergens.push("Gluten-Free · Dairy-Free");

  const spiceLevel = m.tags?.includes("spicy")
    ? "Medium – Hot"
    : /chilli|pepper|xacuti|chettinad|podi/.test(text)
      ? "Medium Spiced"
      : "Mild & Aromatic";

  const calories =
    m.category === "thali"
      ? "780 kcal"
      : m.category === "rice"
        ? "620 kcal"
        : m.category === "coastal" || m.category === "tandoor"
          ? "460 kcal"
          : m.category === "bar"
            ? "165 kcal"
            : m.category === "breads"
              ? "240 kcal"
              : "340 kcal";

  const serving =
    m.category === "thali"
      ? "Full Platter (1)"
      : m.category === "rice" || m.category === "coastal" || m.category === "tandoor"
        ? "Serves 1–2"
        : m.category === "bar"
          ? "240 ml Glass"
          : m.category === "desserts"
            ? "1 Portion"
            : "Sharing Plate";

  const pairing =
    m.category === "bar"
      ? "Tuna Kokum Tartare or Papdi Chaat"
      : m.category === "desserts"
        ? "Single-Estate Malabar Filter Coffee"
        : m.category === "coastal"
          ? "Palappam (two) & Kokum Collins"
          : m.category === "tandoor"
            ? "Garlic Butter Naan & Toddy Shop Sour"
            : m.category === "rice"
              ? "Burnt Garlic Raita & Sol Kadhi Spritz"
              : "Sol Kadhi Spritz or Kokum Collins";

  const craftNote =
    m.station === "Tandoor"
      ? "Slow-roasted in our clay tandoor over coconut-shell charcoal right before service."
      : m.station === "Curry"
        ? "Simmered to order in small batches using freshly pressed coconut milk and stone-ground spices."
        : m.station === "Bar"
          ? "House-infused coastal botanicals, fresh-pressed citrus, and hand-carved clear ice."
          : m.station === "Pastry"
            ? "Prepared daily in our pastry kitchen using single-origin jaggery and coastal aromatics."
            : "Plated fresh to order from our cold pass with house-pressed curry-leaf oils.";

  return {
    ingredients: ingredients.length > 0 ? ingredients : ["Fresh Coastal Spices", "Hand-ground Masala", "Curry Leaf"],
    allergens,
    spiceLevel,
    calories,
    serving,
    pairing,
    craftNote,
    rating: m.tags?.includes("bestseller") ? "4.9 (1.2K+)" : m.tags?.includes("chef") ? "4.9 (860+)" : "4.8 (540+)",
  };
}

export function MenuBrowser({
  variant = "web",
  initialQuery = "",
  onOpenCart,
}: {
  variant?: "web" | "qr";
  initialQuery?: string;
  onOpenCart: () => void;
}) {
  const [q, setQ] = useState(initialQuery);
  const [dietFilter, setDietFilter] = useState<"all" | Diet>("all");
  const [tagFilter, setTagFilter] = useState<"all" | "bestseller" | "chef" | "spicy" | "quick">("all");
  const [priceBand, setPriceBand] = useState<PriceBand>("all");
  const [sortBy, setSortBy] = useState<SortBy>("recommended");
  const [active, setActive] = useState(categories[0].id);
  const [item, setItem] = useState<MenuItem | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const hydrated = useHydrated();
  const cart = useStore((s) => s.cart);
  const totals = cartTotals(cart);
  const catBar = useRef<HTMLDivElement>(null);
  const qr = variant === "qr";

  const activeFilterCount =
    (dietFilter !== "all" ? 1 : 0) +
    (tagFilter !== "all" ? 1 : 0) +
    (priceBand !== "all" ? 1 : 0) +
    (sortBy !== "recommended" ? 1 : 0);
  const hasActiveFilters = !!q || activeFilterCount > 0;

  const resetFilters = () => {
    setQ("");
    setDietFilter("all");
    setTagFilter("all");
    setPriceBand("all");
    setSortBy("recommended");
  };

  const filtered = useMemo(() => {
    const base = menu.filter((m) => {
      if (dietFilter !== "all" && m.diet !== dietFilter) return false;
      if (tagFilter === "quick" && m.prep > 12) return false;
      if (tagFilter !== "all" && tagFilter !== "quick" && !m.tags?.includes(tagFilter)) return false;
      if (priceBand === "under350" && m.price >= 350) return false;
      if (priceBand === "350to600" && (m.price < 350 || m.price > 600)) return false;
      if (priceBand === "over600" && m.price <= 600) return false;
      if (q && !(m.name + " " + m.description + " " + m.station).toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });

    const sorted = [...base];
    if (sortBy === "price-asc") sorted.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") sorted.sort((a, b) => b.price - a.price);
    else if (sortBy === "popular") sorted.sort((a, b) => (b.sold ?? 0) - (a.sold ?? 0));
    else if (sortBy === "fastest") sorted.sort((a, b) => a.prep - b.prep);
    return sorted;
  }, [q, dietFilter, tagFilter, priceBand, sortBy]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (vis) setActive(vis.target.id.replace("cat-", ""));
      },
      { rootMargin: "-160px 0px -60% 0px" },
    );
    document.querySelectorAll("[data-cat]").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [filtered]);

  useEffect(() => {
    const bar = catBar.current;
    const btn = bar?.querySelector<HTMLElement>(`[data-chip="${active}"]`);
    if (bar && btn) bar.scrollTo({ left: btn.offsetLeft - 16, behavior: "smooth" });
  }, [active]);

  const jump = (id: string) => {
    const el = document.getElementById(`cat-${id}`);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - (qr ? 130 : 185), behavior: "smooth" });
  };

  const qtyOf = (id: string) => (hydrated ? cart.filter((c) => c.itemId === id).reduce((s, c) => s + c.qty, 0) : 0);
  const dishMeta = item ? getRichDishDetails(item) : null;

  return (
    <div className={cn(!qr && "grid grid-cols-1 gap-8 lg:grid-cols-12")}>
      {/* Desktop Category Sidebar (Web mode) */}
      {!qr && (
        <aside className="hidden lg:col-span-3 lg:block">
          <nav className="sticky top-24 space-y-1 rounded-[24px] border border-[#4e1d84]/10 bg-white p-4 shadow-xs">
            <p className="mb-2.5 px-3 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#64748b]">
              Menu Categories
            </p>
            {categories.map((c) => {
              const cnt = filtered.filter((m) => m.category === c.id).length;
              return (
                <button
                  key={c.id}
                  onClick={() => jump(c.id)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-[14px] font-bold transition",
                    active === c.id
                      ? "bg-[#4e1d84] text-white shadow-sm"
                      : "text-[#3f3152] hover:bg-[#f3e8ff] hover:text-[#4e1d84]",
                    cnt === 0 && "opacity-45",
                  )}
                >
                  <span className="truncate">{c.name}</span>
                  <span className={cn("text-[12px] tnum", active === c.id ? "text-[#f5a623]" : "text-[#9080a4]")}>
                    {cnt}
                  </span>
                </button>
              );
            })}
          </nav>
        </aside>
      )}

      <div className={cn(!qr && "min-w-0 lg:col-span-9")}>
        {/* Sticky Search + Comprehensive Filter Bar */}
        <div
          className={cn(
            "sticky z-30 border-b border-[#4e1d84]/8 bg-white/95 pb-3.5 pt-2 backdrop-blur-xl",
            qr ? "top-[60px] -mx-4 px-4" : "top-[72px] lg:top-[76px]",
          )}
        >
          {/* Clean Single-Row Search + Filter Drawer Trigger */}
          <div className="flex items-center gap-2.5">
            <label className="flex h-11 min-w-0 flex-1 items-center gap-2.5 rounded-full border border-[#4e1d84]/14 bg-white px-4 shadow-2xs focus-within:border-[#4e1d84]">
              <Search className="size-4 shrink-0 text-[#64748b]" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search prawns, moilee, biryani, tandoor…"
                className="min-w-0 flex-1 bg-transparent text-[14px] text-[#0f172a] outline-none placeholder:text-[#9080a4]"
              />
            </label>

            <button
              type="button"
              onClick={() => setFilterOpen(true)}
              className={cn(
                "inline-flex h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-[13px] font-bold shadow-2xs transition",
                activeFilterCount > 0
                  ? "border-[#4e1d84] bg-[#4e1d84] text-white"
                  : "border-[#4e1d84]/14 bg-white text-[#0f172a] hover:border-[#4e1d84]/45 hover:text-[#4e1d84]",
              )}
            >
              <SlidersHorizontal className="size-4" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="grid size-5 place-items-center rounded-full bg-[#f5a623] text-[11px] font-extrabold text-[#2a0a4f]">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                aria-label="Reset filters"
                className="grid size-11 shrink-0 place-items-center rounded-full bg-[#fef2f2] text-[#dc2626] transition hover:bg-[#fee2e2]"
              >
                <RotateCcw className="size-4" />
              </button>
            )}
          </div>

          {/* Mobile Category Strip */}
          <div
            ref={catBar}
            className={cn("no-scrollbar mt-2.5 flex gap-1.5 overflow-x-auto pb-0.5", !qr && "lg:hidden")}
          >
            {categories.map((c) => (
              <button
                key={c.id}
                data-chip={c.id}
                onClick={() => jump(c.id)}
                className={cn(
                  "shrink-0 rounded-full px-4 py-1.5 text-[12.5px] font-bold transition",
                  active === c.id ? "bg-[#4e1d84] text-white" : "border border-[#4e1d84]/12 bg-white text-[#475569]",
                )}
              >
                {c.name}
              </button>
            ))}
          </div>

          {!qr && (
            <p className="mt-2 text-[12px] font-semibold text-[#64748b]">
              Showing <span className="font-bold text-[#4e1d84]">{filtered.length}</span> of {menu.length} dishes · Click any dish for full ingredients, nutrition, allergens &amp; chef pairings
            </p>
          )}
        </div>

        {/* Dish Sections */}
        <div className={cn(qr ? "pb-32" : "pb-16")}>
          {categories.map((c) => {
            const items = filtered.filter((m) => m.category === c.id);
            if (!items.length) return null;
            return (
              <section key={c.id} id={`cat-${c.id}`} data-cat className="pt-8">
                <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h2 className="text-[24px] font-extrabold tracking-[-0.03em] text-[#0f172a] sm:text-[28px]">
                    {c.name}
                  </h2>
                  <p className="text-[13px] font-medium text-[#64748b]">{c.note}</p>
                </div>

                {qr ? (
                  <ul className="space-y-3">
                    {items.map((m) => (
                      <QrDishRow key={m.id} m={m} qty={qtyOf(m.id)} onOpen={() => setItem(m)} />
                    ))}
                  </ul>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {items.map((m, idx) => (
                      <article
                        key={m.id}
                        onClick={() => setItem(m)}
                        className="group flex cursor-pointer flex-col overflow-hidden rounded-[24px] border border-[#4e1d84]/10 bg-white p-4 shadow-[0_10px_28px_-18px_rgba(78,29,132,0.16)] transition hover:-translate-y-0.5 hover:border-[#4e1d84]/30 hover:shadow-[0_18px_38px_-18px_rgba(78,29,132,0.24)]"
                      >
                        <div className="mb-2.5 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            {m.tags?.includes("bestseller") && (
                              <span className="rounded-full bg-[#4e1d84] px-2.5 py-0.5 text-[10px] font-extrabold text-white">
                                BESTSELLER
                              </span>
                            )}
                            {m.tags?.includes("chef") && (
                              <span className="rounded-full bg-[#f5a623] px-2.5 py-0.5 text-[10px] font-extrabold text-[#2a0a4f]">
                                CHEF&apos;S PICK
                              </span>
                            )}
                            {m.tags?.includes("new") && (
                              <span className="rounded-full bg-[#f3e8ff] px-2.5 py-0.5 text-[10px] font-extrabold text-[#4e1d84]">
                                NEW
                              </span>
                            )}
                            {m.tags?.includes("spicy") && <Flame className="size-3.5 text-[#dc2626]" />}
                          </div>
                          <DietMark diet={m.diet} />
                        </div>

                        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[16px] bg-[#f8fafc]">
                          {m.image ? (
                            <Image
                              src={m.image}
                              alt={m.name}
                              fill
                              sizes="(max-width: 768px) 100vw, 33vw"
                              className="object-cover transition duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <span className="grid h-full place-items-center bg-[#f3e8ff] text-3xl font-extrabold text-[#4e1d84]">
                              {m.name[0]}
                            </span>
                          )}
                        </div>

                        <div className="mt-3 flex flex-1 flex-col">
                          <h3 className="text-[16px] font-extrabold tracking-[-0.02em] text-[#0f172a] group-hover:text-[#4e1d84]">
                            {m.name}
                          </h3>
                          <p className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-[#64748b]">
                            {m.description}
                          </p>
                          <p className="mt-2 flex items-center gap-1 text-[11.5px] font-semibold text-[#64748b]">
                            <Star className="size-3.5 fill-[#f5a623] text-[#f5a623]" />
                            <span>{idx % 2 === 0 ? "4.9 (1.1K+)" : "4.8 (840+)"}</span>
                            <span className="mx-1 text-[#cbd5e1]">·</span>
                            <span>{m.prep} min</span>
                          </p>
                          <div className="mt-auto flex items-center justify-between pt-3">
                            <span className="text-[17px] font-extrabold text-[#0f172a] tnum">{inr(m.price)}</span>
                            <span className="rounded-full bg-[#f3e8ff] px-3.5 py-1.5 text-[12px] font-bold text-[#4e1d84] transition group-hover:bg-[#4e1d84] group-hover:text-white">
                              Full Details
                            </span>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            );
          })}
          {filtered.length === 0 && (
            <div className="rounded-3xl border border-dashed border-[#4e1d84]/20 py-16 text-center">
              <p className="text-[20px] font-bold text-[#0f172a]">No dishes match your active filters.</p>
              <p className="mt-1 text-[14px] text-[#64748b]">Try resetting filters or clearing your search.</p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-4 rounded-full bg-[#4e1d84] px-5 py-2 text-[13px] font-bold text-white"
              >
                Reset all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* QR In-Restaurant Floating Bag Bar ONLY */}
      {qr && hydrated && totals.count > 0 && (
        <div className="fixed inset-x-4 bottom-[calc(72px+env(safe-area-inset-bottom))] z-40 mx-auto max-w-[456px]">
          <button
            onClick={onOpenCart}
            className="flex h-15 w-full items-center justify-between rounded-full bg-[#2a0a4f] pl-5 pr-2 text-white shadow-[0_20px_44px_-12px_rgba(42,10,79,0.65)]"
          >
            <span className="text-left">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-[#f5a623]">
                {totals.count} item{totals.count > 1 ? "s" : ""}
              </span>
              <span className="text-[16px] font-extrabold tnum">{inr(totals.subtotal)}</span>
            </span>
            <span className="inline-flex h-11 items-center rounded-full bg-[#f5a623] px-5 text-[13.5px] font-extrabold text-[#2a0a4f]">
              Review order
            </span>
          </button>
        </div>
      )}

      {/* QR uses ItemSheet with Add-to-Table-Order; Public Website uses Rich Dish Details Popup */}
      {qr ? (
        <ItemSheet item={item} onClose={() => setItem(null)} />
      ) : (
        <Sheet
          open={!!item}
          onClose={() => setItem(null)}
          side="center"
          width="max-w-xl"
          title={item?.name}
          subtitle={
            item
              ? `${categories.find((c) => c.id === item.category)?.name ?? "Coastal"} · ${item.station} Kitchen`
              : ""
          }
          footer={
            item && (
              <div className="flex flex-wrap items-center gap-2.5">
                <Link
                  href="/visit"
                  onClick={() => setItem(null)}
                  className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-[#4e1d84] px-5 text-[14px] font-extrabold text-white shadow-md transition hover:bg-[#3d116d]"
                >
                  <MapPin className="size-4 text-[#f5a623]" />
                  Visit &amp; Directions
                </Link>
                <button
                  type="button"
                  onClick={() => setItem(null)}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-[#4e1d84]/20 bg-white px-5 text-[13px] font-bold text-[#4e1d84] hover:bg-[#f3e8ff]"
                >
                  Close
                </button>
              </div>
            )
          }
        >
          {item && dishMeta && (
            <div className="space-y-5 p-5 sm:p-6">
              {/* Hero Photo + Badges */}
              {item.image && (
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-[#f8fafc]">
                  <Image src={item.image} alt={item.name} fill sizes="560px" className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                  <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                    {item.tags?.includes("bestseller") && (
                      <span className="rounded-full bg-[#4e1d84] px-3 py-1 text-[10.5px] font-extrabold text-white shadow">
                        BESTSELLER
                      </span>
                    )}
                    {item.tags?.includes("chef") && (
                      <span className="rounded-full bg-[#f5a623] px-3 py-1 text-[10.5px] font-extrabold text-[#2a0a4f] shadow">
                        CHEF&apos;S PICK
                      </span>
                    )}
                    {item.tags?.includes("spicy") && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#dc2626] px-3 py-1 text-[10.5px] font-extrabold text-white shadow">
                        <Flame className="size-3" /> SPICY
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1 text-[12px] font-bold backdrop-blur-md">
                      <Star className="size-3.5 fill-[#f5a623] text-[#f5a623]" /> {dishMeta.rating}
                    </span>
                    <span className="rounded-full bg-white px-3.5 py-1 text-[16px] font-extrabold text-[#4e1d84] shadow tnum">
                      {inr(item.price)}
                      {item.compareAt && (
                        <span className="ml-1.5 text-[12px] font-medium text-[#94a3b8] line-through">
                          {inr(item.compareAt)}
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              )}

              {/* 4 Quick Info Tiles */}
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {[
                  { icon: Clock, label: "Prep Time", val: `${item.prep} min` },
                  { icon: Users, label: "Portion", val: dishMeta.serving },
                  { icon: Flame, label: "Spice", val: dishMeta.spiceLevel },
                  { icon: Utensils, label: "Energy", val: dishMeta.calories },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-[#4e1d84]/10 bg-[#faf8ff] p-3">
                    <p className="flex items-center gap-1 text-[10.5px] font-bold uppercase tracking-wider text-[#64748b]">
                      <stat.icon className="size-3 text-[#4e1d84]" /> {stat.label}
                    </p>
                    <p className="mt-1 text-[13px] font-extrabold text-[#0f172a]">{stat.val}</p>
                  </div>
                ))}
              </div>

              {/* Description & Chef Craft Note */}
              <div>
                <div className="flex items-center gap-2">
                  <DietMark diet={item.diet} />
                  <p className="text-[12px] font-extrabold uppercase tracking-wider text-[#4e1d84]">
                    About This Dish
                  </p>
                </div>
                <p className="mt-2 text-[14.5px] leading-relaxed text-[#1e293b]">{item.description}</p>
                <p className="mt-2.5 flex items-start gap-2 rounded-xl bg-[#f3e8ff]/55 p-3 text-[12.5px] leading-relaxed text-[#3f3152]">
                  <ChefHat className="mt-0.5 size-4 shrink-0 text-[#4e1d84]" />
                  <span>{dishMeta.craftNote}</span>
                </p>
              </div>

              {/* Key Ingredients */}
              <div>
                <p className="text-[11.5px] font-extrabold uppercase tracking-wider text-[#64748b]">
                  Key Ingredients &amp; Notes
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {dishMeta.ingredients.map((ing) => (
                    <span
                      key={ing}
                      className="rounded-full border border-[#4e1d84]/12 bg-white px-3 py-1 text-[12px] font-semibold capitalize text-[#334155]"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>

              {/* Available Portions & Table Customisations (if any) */}
              {(item.variants || item.addons) && (
                <div className="rounded-2xl border border-[#4e1d84]/10 bg-[#f8fafc] p-4">
                  <p className="flex items-center gap-1.5 text-[11.5px] font-extrabold uppercase tracking-wider text-[#4e1d84]">
                    <Sparkles className="size-3.5" /> Available Portions &amp; Customisations at Table
                  </p>
                  {item.variants && (
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {item.variants.map((v) => (
                        <span
                          key={v.id}
                          className="rounded-xl border border-[#4e1d84]/15 bg-white px-3 py-1.5 text-[12.5px] font-bold text-[#0f172a]"
                        >
                          {v.label} · <span className="text-[#4e1d84]">{inr(item.price + v.price)}</span>
                        </span>
                      ))}
                    </div>
                  )}
                  {item.addons && (
                    <div className="mt-2.5 space-y-1.5 text-[12.5px] text-[#475569]">
                      {item.addons.map((g) => (
                        <p key={g.id}>
                          <span className="font-bold text-[#0f172a]">{g.label}:</span>{" "}
                          {g.options.map((o) => `${o.label}${o.price ? ` (+${inr(o.price)})` : ""}`).join(", ")}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Chef Pairing + Allergens */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-[#f5a623]/30 bg-[#fffbeb] p-3.5">
                  <p className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#92400e]">
                    <Wine className="size-3.5" /> Chef&apos;s Pairing
                  </p>
                  <p className="mt-1 text-[13px] font-bold text-[#0f172a]">{dishMeta.pairing}</p>
                </div>
                <div className="rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] p-3.5">
                  <p className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#475569]">
                    <AlertCircle className="size-3.5" /> Dietary &amp; Allergens
                  </p>
                  <p className="mt-1 text-[13px] font-bold text-[#0f172a]">{dishMeta.allergens.join(" · ")}</p>
                </div>
              </div>
            </div>
          )}
        </Sheet>
      )}

      {/* Clean Collapsible Filter & Sort Sheet (works for both /menu and /t/[table]) */}
      <Sheet
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        side="center"
        width="max-w-md"
        title="Filter & Sort Menu"
        subtitle="Narrow dishes by diet, highlights, price, or prep time"
        footer={
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex h-11 items-center justify-center gap-1.5 rounded-full border border-[#4e1d84]/20 bg-white px-5 text-[13.5px] font-bold text-[#4e1d84] hover:bg-[#f3e8ff]"
            >
              <RotateCcw className="size-3.5" /> Reset
            </button>
            <button
              type="button"
              onClick={() => setFilterOpen(false)}
              className="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-[#4e1d84] px-5 text-[14px] font-extrabold text-white shadow-md hover:bg-[#3d116d]"
            >
              Show {filtered.length} Dishes
            </button>
          </div>
        }
      >
        <div className="space-y-5 p-5 sm:p-6">
          {/* Diet */}
          <div>
            <p className="mb-2 text-[11.5px] font-extrabold uppercase tracking-wider text-[#64748b]">Diet</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {([
                ["all", "All"],
                ["veg", "Veg"],
                ["nonveg", "Non-Veg"],
                ["egg", "Egg"],
              ] as const).map(([val, lbl]) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setDietFilter(val)}
                  className={cn(
                    "rounded-xl border py-2.5 text-[13px] font-bold transition",
                    dietFilter === val
                      ? val === "veg"
                        ? "border-[#15803d] bg-[#15803d] text-white"
                        : val === "nonveg"
                          ? "border-[#b91c1c] bg-[#b91c1c] text-white"
                          : "border-[#4e1d84] bg-[#4e1d84] text-white"
                      : "border-[#4e1d84]/14 bg-white text-[#475569] hover:border-[#4e1d84]/40",
                  )}
                >
                  {lbl}
                </button>
              ))}
            </div>
          </div>

          {/* Highlights */}
          <div>
            <p className="mb-2 text-[11.5px] font-extrabold uppercase tracking-wider text-[#64748b]">Highlights</p>
            <div className="flex flex-wrap gap-2">
              {([
                ["all", "All Dishes"],
                ["bestseller", "★ Bestsellers"],
                ["chef", "Chef's Picks"],
                ["spicy", "🌶 Spicy"],
                ["quick", "⚡ Under 12m"],
              ] as const).map(([val, lbl]) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setTagFilter(val)}
                  className={cn(
                    "rounded-full border px-3.5 py-2 text-[12.5px] font-bold transition",
                    tagFilter === val
                      ? "border-[#f5a623] bg-[#f5a623] text-[#2a0a4f]"
                      : "border-[#4e1d84]/14 bg-[#f8fafc] text-[#475569] hover:border-[#4e1d84]/35",
                  )}
                >
                  {lbl}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <p className="mb-2 text-[11.5px] font-extrabold uppercase tracking-wider text-[#64748b]">Price Range</p>
            <div className="grid grid-cols-2 gap-2">
              {([
                ["all", "All Prices"],
                ["under350", "Under ₹350"],
                ["350to600", "₹350 – ₹600"],
                ["over600", "₹600+"],
              ] as const).map(([val, lbl]) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setPriceBand(val)}
                  className={cn(
                    "rounded-xl border py-2.5 text-[13px] font-bold transition",
                    priceBand === val
                      ? "border-[#4e1d84] bg-[#f3e8ff] text-[#4e1d84]"
                      : "border-[#4e1d84]/14 bg-white text-[#475569] hover:border-[#4e1d84]/35",
                  )}
                >
                  {lbl}
                </button>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div>
            <p className="mb-2 text-[11.5px] font-extrabold uppercase tracking-wider text-[#64748b]">Sort By</p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="h-11 w-full rounded-xl border border-[#4e1d84]/15 bg-white px-3.5 text-[13.5px] font-bold text-[#0f172a] outline-none focus:border-[#4e1d84]"
            >
              <option value="recommended">Recommended</option>
              <option value="popular">Most Popular</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="fastest">Fastest Prep Time</option>
            </select>
          </div>
        </div>
      </Sheet>
    </div>
  );
}

function QrDishRow({ m, qty, onOpen }: { m: MenuItem; qty: number; onOpen: () => void }) {
  return (
    <li className="group flex gap-4 rounded-2xl border border-[#4e1d84]/10 bg-white p-4 shadow-2xs transition hover:border-[#4e1d84]/35 sm:gap-5 sm:p-5">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <DietMark diet={m.diet} />
          {m.tags?.includes("bestseller") && (
            <span className="rounded-full bg-[#4e1d84] px-2.5 py-0.5 text-[10px] font-bold text-white">
              Signature
            </span>
          )}
          {m.tags?.includes("chef") && (
            <span className="rounded-full bg-[#f5a623] px-2.5 py-0.5 text-[10px] font-bold text-[#2a0a4f]">
              Chef&apos;s pick
            </span>
          )}
          {m.tags?.includes("spicy") && <Flame className="size-3.5 text-[#dc2626]" aria-label="Spicy" />}
        </div>

        <button onClick={onOpen} className="mt-2 block text-left">
          <h3 className="text-[17px] font-extrabold tracking-[-0.02em] text-[#0f172a] group-hover:text-[#4e1d84]">
            {m.name}
          </h3>
        </button>

        <p className="mt-1 flex flex-wrap items-baseline gap-x-2.5 text-[15px]">
          <span className="font-extrabold text-[#0f172a] tnum">{inr(m.price)}</span>
          <span className="text-[12px] text-[#64748b]">{m.prep} min</span>
        </p>

        <p className="mt-1.5 line-clamp-2 max-w-lg text-[13px] leading-relaxed text-[#64748b]">{m.description}</p>
      </div>

      <div className="relative w-28 shrink-0">
        <button
          onClick={onOpen}
          className="relative block aspect-square w-full overflow-hidden rounded-2xl bg-[#f8fafc]"
          aria-label={`Open ${m.name}`}
        >
          {m.image ? (
            <Image src={m.image} alt={m.name} fill sizes="112px" className="object-cover" />
          ) : (
            <span className="grid h-full place-items-center bg-[#f3e8ff] text-2xl font-extrabold text-[#4e1d84]">
              {m.name[0]}
            </span>
          )}
        </button>
        <button
          onClick={onOpen}
          className={cn(
            "absolute -bottom-2.5 left-1/2 flex h-8.5 -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full px-3.5 text-[12px] font-bold shadow-md transition",
            qty > 0
              ? "bg-[#4e1d84] text-[#f5a623]"
              : "border border-[#4e1d84]/15 bg-white text-[#4e1d84] hover:bg-[#4e1d84] hover:text-white",
          )}
        >
          {qty > 0 ? `${qty} added` : <><Plus className="size-3.5" /> Add</>}
        </button>
      </div>
    </li>
  );
}
