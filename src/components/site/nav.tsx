"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Award,
  ChevronRight,
  Home,
  MapPin,
  Menu,
  MessageSquareQuote,
  Phone,
  Search,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { DEFAULT_SITE_CONTENT, useHydrated, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const siteLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/menu", label: "Menu" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/reviews", label: "Reviews" },
  { href: "/visit", label: "Contact" },
];

export function SiteNav() {
  const path = usePathname();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const hydrated = useHydrated();
  const tenantLogos = useStore((s) => s.tenantLogos);
  const storedContent = useStore((s) => s.siteContent);
  const brandName = hydrated && storedContent ? storedContent.name : DEFAULT_SITE_CONTENT.name;
  const neelaLogo = hydrated ? tenantLogos["neela"] : undefined;

  const isActive = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQ.trim();
    router.push(q ? `/menu?q=${encodeURIComponent(q)}` : "/menu");
  };

  return (
    <>
      {/* Desktop & Mobile Top Header */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[#4e1d84]/8 bg-white/95 backdrop-blur-xl">
        {/* Desktop Navbar */}
        <div className="mx-auto hidden h-[76px] max-w-[1400px] items-center justify-between gap-4 px-6 lg:flex xl:px-8">
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            {neelaLogo ? (
              <img
                src={neelaLogo}
                alt={brandName}
                className="size-9 rounded-2xl border border-[#4e1d84]/15 bg-white object-contain p-1 shadow-xs"
              />
            ) : (
              <span className="grid size-9 place-items-center rounded-2xl bg-[#4e1d84] text-[#f5a623] shadow-[0_8px_18px_-6px_rgba(78,29,132,0.55)]">
                <UtensilsCrossed className="size-4.5" strokeWidth={2.2} />
              </span>
            )}
            <div className="leading-tight">
              <span className="block whitespace-nowrap text-[18px] font-extrabold uppercase tracking-[-0.04em] text-[#4e1d84] xl:text-[20px]">
                {brandName}
              </span>
              <span className="block whitespace-nowrap text-[10.5px] font-semibold tracking-[0.05em] text-[#7c6a96]">
                Coastal Indian Kitchen · Indiranagar
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-1">
            {siteLinks.map((l) => {
              const active = isActive(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "whitespace-nowrap rounded-full px-3.5 py-2 text-[13.5px] font-bold tracking-[-0.01em] transition-all xl:px-4",
                    active
                      ? "bg-[#4e1d84] text-white shadow-[0_8px_20px_-6px_rgba(78,29,132,0.6)]"
                      : "text-[#2b1b3d] hover:bg-[#f3e8ff] hover:text-[#4e1d84]",
                  )}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <form
              onSubmit={submitSearch}
              className="flex h-10 w-[180px] items-center gap-2 rounded-full border border-[#4e1d84]/12 bg-white px-3.5 shadow-2xs transition focus-within:border-[#4e1d84] xl:w-[220px]"
            >
              <Search className="size-4 shrink-0 text-[#64748b]" />
              <input
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                placeholder="Search dishes…"
                className="min-w-0 flex-1 bg-transparent text-[13px] text-[#0f172a] outline-none placeholder:text-[#9080a4]"
              />
            </form>

            <Link
              href="/menu"
              className="inline-flex h-10 shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-[#4e1d84] px-5 text-[13px] font-bold text-white shadow-[0_10px_22px_-8px_rgba(78,29,132,0.65)] transition hover:bg-[#3d116d]"
            >
              <UtensilsCrossed className="size-4 text-[#f5a623]" />
              Explore Menu
            </Link>
          </div>
        </div>

        {/* Mobile Top Bar */}
        <div className="flex h-[72px] items-center justify-between gap-3 px-4 lg:hidden">
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            className="grid size-11 shrink-0 place-items-center rounded-2xl border border-[#4e1d84]/10 bg-white text-[#0f172a] shadow-[0_6px_16px_-8px_rgba(78,29,132,0.2)]"
          >
            <Menu className="size-5" />
          </button>

          <Link href="/" className="flex min-w-0 flex-1 items-center gap-2 px-1">
            {neelaLogo ? (
              <img src={neelaLogo} alt={brandName} className="size-8 rounded-xl border border-[#4e1d84]/15 bg-white object-contain p-0.5" />
            ) : (
              <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-[#4e1d84] text-[#f5a623]">
                <UtensilsCrossed className="size-4" strokeWidth={2.2} />
              </span>
            )}
            <div className="min-w-0 leading-tight">
              <span className="block truncate text-[16.5px] font-extrabold uppercase leading-none tracking-[-0.04em] text-[#4e1d84]">
                {brandName}
              </span>
              <span className="mt-0.5 block truncate text-[10px] font-semibold tracking-[0.04em] text-[#7c6a96]">
                Coastal Indian Kitchen
              </span>
            </div>
          </Link>

          <Link
            href="/visit"
            aria-label="Contact Demo Restaurant"
            className="grid size-11 shrink-0 place-items-center rounded-2xl border border-[#4e1d84]/10 bg-white text-[#4e1d84] shadow-[0_6px_16px_-8px_rgba(78,29,132,0.2)]"
          >
            <Phone className="size-4.5" />
          </Link>
        </div>
      </header>

      {/* Mobile Slide-out Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <div className="fixed inset-0 z-[70] lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="absolute inset-0 bg-[#2a0a4f]/50 backdrop-blur-xs"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 320 }}
              className="absolute inset-y-0 left-0 flex w-[82vw] max-w-[320px] flex-col bg-[#2a0a4f] p-6 text-white shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {neelaLogo ? (
                    <img src={neelaLogo} alt={brandName} className="size-9 rounded-xl bg-white object-contain p-1" />
                  ) : (
                    <span className="grid size-9 place-items-center rounded-xl bg-[#f5a623] text-[#2a0a4f]">
                      <UtensilsCrossed className="size-4.5" />
                    </span>
                  )}
                  <span className="text-[18px] font-extrabold uppercase tracking-[-0.03em]">{brandName}</span>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close navigation"
                  className="grid size-9 place-items-center rounded-xl bg-white/10 text-white"
                >
                  <X className="size-4.5" />
                </button>
              </div>

              <nav className="mt-8 flex flex-col divide-y divide-white/10">
                {siteLinks.map((l) => {
                  const active = isActive(l.href);
                  return (
                    <Link
                      key={l.href}
                      href={l.href}
                      onClick={() => setDrawerOpen(false)}
                      className={cn(
                        "flex items-center justify-between py-4 text-[18px] font-bold transition",
                        active ? "text-[#f5a623]" : "text-white hover:text-[#f5a623]",
                      )}
                    >
                      {l.label}
                      <ChevronRight className="size-4 opacity-50" />
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-auto space-y-2 rounded-2xl border border-white/12 bg-white/8 p-4 text-[12.5px] text-white/75">
                <p className="font-bold text-[#f5a623]">Indiranagar Flagship</p>
                <p>12th Main, HAL 2nd Stage, Bengaluru</p>
                <p>Lunch 12:00–15:30 · Dinner 18:30–23:30</p>
                <p className="font-mono text-white">+91 80 4718 2290</p>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Floating Bottom Navigation Bar */}
      <nav
        aria-label="Mobile navigation"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-[#4e1d84]/10 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_30px_-14px_rgba(78,29,132,0.18)] backdrop-blur-xl lg:hidden"
      >
        <div className="mx-auto grid h-[68px] max-w-[520px] grid-cols-5 items-center px-2">
          <BottomNavItem href="/" icon={Home} label="Home" active={path === "/"} />
          <BottomNavItem href="/testimonials" icon={Award} label="Stories" active={path.startsWith("/testimonials")} />

          {/* Elevated Center Purple Circle CTA -> Menu */}
          <div className="flex flex-col items-center justify-center">
            <Link
              href="/menu"
              className={cn(
                "-mt-7 grid size-14 place-items-center rounded-full bg-[#4e1d84] text-white shadow-[0_12px_26px_-6px_rgba(78,29,132,0.75)] ring-4 ring-white transition active:scale-95",
                path.startsWith("/menu") && "bg-[#3d116d]",
              )}
              aria-label="Explore Menu"
            >
              <UtensilsCrossed className="size-6 text-[#f5a623]" />
            </Link>
            <span className="mt-0.5 text-[10.5px] font-bold text-[#4e1d84]">Menu</span>
          </div>

          <BottomNavItem href="/reviews" icon={MessageSquareQuote} label="Reviews" active={path.startsWith("/reviews")} />
          <BottomNavItem href="/visit" icon={MapPin} label="Contact" active={path.startsWith("/visit") || path.startsWith("/story")} />
        </div>
      </nav>
    </>
  );
}

function BottomNavItem({
  href,
  icon: Icon,
  label,
  active,
}: {
  href: string;
  icon: typeof Home;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-center justify-center gap-1 py-1 text-[11px] font-bold transition",
        active ? "text-[#4e1d84]" : "text-[#8e7ea3] hover:text-[#4e1d84]",
      )}
    >
      <Icon className="size-5" strokeWidth={active ? 2.3 : 1.8} />
      <span>{label}</span>
    </Link>
  );
}
