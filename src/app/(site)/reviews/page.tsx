"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CalendarCheck, CheckCircle2, MessageSquareQuote, Send, Sparkles, Star } from "lucide-react";
import { toast } from "sonner";
import { INITIAL_GUEST_REVIEWS, useHydrated, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const ROOM_FILTERS = ["All", "The Dining Room", "The Verandah", "The Bar", "The Sea Deck"];

export default function ReviewsPage() {
  const hydrated = useHydrated();
  const storedReviews = useStore((s) => s.guestReviews);
  const addGuestReview = useStore((s) => s.addGuestReview);
  const reviews = hydrated ? storedReviews : INITIAL_GUEST_REVIEWS;

  const [filter, setFilter] = useState("All");
  const [name, setName] = useState("");
  const [room, setRoom] = useState("The Dining Room");
  const [dish, setDish] = useState("");
  const [rating, setRating] = useState(5);
  const [quote, setQuote] = useState("");

  const visible = filter === "All" ? reviews : reviews.filter((r) => r.room === filter);
  const avg = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "5.0";

  const submitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !quote.trim()) return;
    addGuestReview({
      guest: name.trim(),
      city: "Bengaluru",
      room,
      rating,
      dish: dish.trim() || "Coastal Tasting",
      quote: quote.trim(),
    });
    setName("");
    setDish("");
    setQuote("");
    setRating(5);
    toast.success("Thank you for your review!", { description: "Your review is now live and synced with Demo Restaurant Admin." });
  };

  return (
    <div className="mx-auto max-w-[1380px] px-4 pb-4 pt-2 sm:px-8 sm:pt-3">
      {/* Purple-Amber Hero Rating Banner */}
      <header className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#2a0a4f] via-[#4e1d84] to-[#3b0e6e] text-white shadow-[0_24px_56px_-20px_rgba(42,10,79,0.55)]">
        <Image
          src="/img/guests.jpg"
          alt="Guests dining at Demo Restaurant"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-20"
        />
        <div className="relative grid grid-cols-1 items-center gap-6 p-5 sm:p-8 lg:grid-cols-12 lg:px-12 lg:py-9">
          <div className="lg:col-span-7">
            <p className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#f5a623]">
              <Sparkles className="size-3.5" /> Guest Reviews
            </p>
            <h1 className="mt-3 text-[34px] font-extrabold leading-[1.04] tracking-[-0.04em] text-white sm:text-[52px]">
              Rated {avg} across Indiranagar &amp; the coast.
            </h1>
            <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-white/80">
              Real notes from guests who dined across our dining room, verandah, bar, and coastal deck.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#write-review"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-[#f5a623] px-6 text-[13.5px] font-extrabold text-[#2a0a4f] shadow-lg transition hover:bg-[#fbbf24]"
              >
                <MessageSquareQuote className="size-4" /> Write a Review
              </a>
              <Link
                href="/testimonials"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 text-[13.5px] font-bold text-white backdrop-blur-md transition hover:bg-white/20"
              >
                Read Featured Testimonials →
              </Link>
            </div>
          </div>

          <div className="rounded-[24px] border border-white/15 bg-white/10 p-6 backdrop-blur-xl lg:col-span-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[48px] font-extrabold leading-none text-[#f5a623] tnum">{avg}</p>
                <div className="mt-2 flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} className="size-4 fill-[#f5a623] text-[#f5a623]" />
                  ))}
                </div>
                <p className="mt-1.5 text-[12.5px] font-semibold text-white/75">
                  {reviews.length} active guest reviews
                </p>
              </div>
              <div className="space-y-2 text-[12.5px]">
                {[
                  ["Food & Flavor", "4.9"],
                  ["Ambience", "4.9"],
                  ["Hospitality", "4.8"],
                  ["Cocktails", "4.9"],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between gap-4">
                    <span className="text-white/70">{k}</span>
                    <span className="font-mono font-bold text-[#f5a623]">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Room Filter Pills */}
      <div className="no-scrollbar mt-5 flex items-center gap-2 overflow-x-auto pb-1">
        {ROOM_FILTERS.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setFilter(r)}
            className={cn(
              "shrink-0 rounded-full px-5 py-2 text-[13px] font-bold transition",
              filter === r
                ? "bg-[#4e1d84] text-white shadow-sm"
                : "border border-[#4e1d84]/12 bg-white text-[#475569] hover:border-[#4e1d84]/35 hover:text-[#4e1d84]",
            )}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Reviews Grid */}
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((r) => (
          <article
            key={r.id}
            className="flex flex-col rounded-[24px] border border-[#4e1d84]/10 bg-white p-6 shadow-[0_12px_32px_-20px_rgba(78,29,132,0.18)]"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn("size-4", i < r.rating ? "fill-[#f5a623] text-[#f5a623]" : "text-[#e2e8f0]")}
                  />
                ))}
              </div>
              <span className="rounded-full bg-[#f3e8ff] px-3 py-0.5 text-[11px] font-bold text-[#4e1d84]">
                {r.room}
              </span>
            </div>

            <p className="mt-4 flex-1 text-[14.5px] leading-relaxed text-[#2b1b3d]">
              &ldquo;{r.quote}&rdquo;
            </p>

            {r.reply && (
              <div className="mt-3 rounded-xl border border-[#4e1d84]/12 bg-[#f3e8ff]/50 px-3.5 py-2.5 text-[12.5px] text-[#3f3152]">
                <span className="font-bold text-[#4e1d84]">Reply from Demo Restaurant:</span> {r.reply}
              </div>
            )}

            <p className="mt-4 rounded-xl bg-[#ffffff] px-3.5 py-2 text-[12px] font-semibold text-[#475569]">
              Favourite dish: <span className="font-bold text-[#4e1d84]">{r.dish}</span>
            </p>

            <div className="mt-4 flex items-center justify-between border-t border-[#4e1d84]/8 pt-4">
              <div>
                <p className="flex items-center gap-1.5 text-[14px] font-extrabold text-[#0f172a]">
                  {r.guest}
                  <CheckCircle2 className="size-3.5 text-[#10b981]" />
                </p>
                <p className="text-[12px] text-[#64748b]">{r.city} · {r.date}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Write a Review Form (No Login Required) */}
      <section
        id="write-review"
        className="mt-6 scroll-mt-24 overflow-hidden rounded-[28px] border border-[#4e1d84]/10 bg-gradient-to-r from-[#f3e8ff] via-[#efe3fc] to-[#e6d3fa] p-5 sm:p-7"
      >
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#4e1d84]">
              Dined with us recently?
            </p>
            <h2 className="mt-2 text-[28px] font-extrabold leading-tight tracking-[-0.03em] text-[#0f172a] sm:text-[36px]">
              Share your experience.
            </h2>
            <p className="mt-2.5 text-[14.5px] leading-relaxed text-[#475569]">
              Chef Vikram and Ananya read every guest note. No sign-in required — just tell us what stood out at your table.
            </p>
            <Link
              href="/menu"
              className="mt-5 inline-flex h-10 items-center gap-2 rounded-full bg-[#4e1d84] px-5 text-[13px] font-bold text-white"
            >
              <Sparkles className="size-4 text-[#f5a623]" /> Explore Menu
            </Link>
          </div>

          <form onSubmit={submitReview} className="rounded-[24px] bg-white p-6 shadow-lg lg:col-span-7">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-[12px] font-bold text-[#4a3a5e]">Your Name *</span>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Arjun Kumar"
                  className="site-input"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[12px] font-bold text-[#4a3a5e]">Room Visited</span>
                <select value={room} onChange={(e) => setRoom(e.target.value)} className="site-input">
                  {ROOM_FILTERS.slice(1).map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[12px] font-bold text-[#4a3a5e]">Favourite Dish</span>
                <input
                  value={dish}
                  onChange={(e) => setDish(e.target.value)}
                  placeholder="e.g. Malabar Prawn Moilee"
                  className="site-input"
                />
              </label>
              <div>
                <span className="mb-1.5 block text-[12px] font-bold text-[#4a3a5e]">Your Rating</span>
                <div className="flex h-12 items-center gap-2 rounded-xl border border-[#151311]/14 bg-[#ffffff] px-3.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRating(n)}
                      aria-label={`${n} stars`}
                      className="transition hover:scale-110"
                    >
                      <Star
                        className={cn(
                          "size-6",
                          n <= rating ? "fill-[#f5a623] text-[#f5a623]" : "text-[#cbd5e1]",
                        )}
                      />
                    </button>
                  ))}
                  <span className="ml-auto text-[13px] font-bold text-[#4e1d84]">{rating}.0 / 5</span>
                </div>
              </div>
            </div>

            <label className="mt-4 block">
              <span className="mb-1.5 block text-[12px] font-bold text-[#4a3a5e]">Your Review *</span>
              <textarea
                required
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                placeholder="Tell us about the dishes, service, or ambience…"
                className="site-input h-24 resize-none py-3"
              />
            </label>

            <button
              type="submit"
              className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#4e1d84] px-6 text-[14px] font-extrabold text-white shadow-md transition hover:bg-[#3d116d]"
            >
              <Send className="size-4 text-[#f5a623]" /> Post Review
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
