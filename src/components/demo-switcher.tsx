"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { ArrowUpRight, Layers, X } from "lucide-react";
import { cn } from "@/lib/utils";

const surfaces = [
  { href: "/", label: "Demo Restaurant Website", note: "Coastal kitchen homepage & highlights", group: "Guest Website" },
  { href: "/menu", label: "Menu Showcase", note: "Browse dishes, ratings & prices", group: "Guest Website" },
  { href: "/testimonials", label: "Testimonials", note: "Featured dining stories & press praise", group: "Guest Website" },
  { href: "/reviews", label: "Guest Reviews", note: "Ratings & live review wall", group: "Guest Website" },
  { href: "/t/07", label: "QR Table Ordering", note: "Scan-to-order cart, Table 07", group: "Guest Website" },
  { href: "/admin", label: "Restaurant Admin", note: "Dashboard, menu, tables, inventory & reports", group: "Operations" },
  { href: "/pos", label: "POS & Billing", note: "Cashier counter & GST receipts", group: "Operations" },
  { href: "/kitchen", label: "Kitchen Display (KDS)", note: "Live kitchen station tickets", group: "Operations" },
  { href: "/waiter", label: "Waiter App", note: "Captain's handheld for floor service", group: "Operations" },
];

export function DemoSwitcher() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const onApp = ["/admin", "/pos", "/kitchen"].some((p) => path.startsWith(p));
  const raised = path.startsWith("/t/") || path.startsWith("/waiter") || path.startsWith("/pos") || !onApp;

  return (
    <div
      className={cn(
        "fixed z-[60]",
        onApp ? cn("sm:left-5 sm:right-auto", path.startsWith("/pos") && "md:left-[88px]") : "sm:right-5 sm:left-auto",
        raised ? "bottom-[86px] right-3 sm:bottom-5" : "bottom-3 right-3 sm:bottom-5",
      )}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ type: "spring", damping: 26, stiffness: 340 }}
            className={cn(
              "absolute bottom-12 w-[min(320px,calc(100vw-24px))] overflow-hidden rounded-2xl border border-white/10 bg-[#2a0a4f] text-white shadow-[0_30px_80px_-20px_rgba(42,10,79,.75)]",
              onApp ? "right-0 sm:left-0 sm:right-auto sm:origin-bottom-left" : "right-0 origin-bottom-right",
            )}
          >
            <div className="border-b border-white/10 px-4 pb-3 pt-4">
              <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-[#f5a623]">Demo Restaurant · Restaurant OS</p>
              <p className="mt-1 text-[17px] font-extrabold leading-tight">Switch screens</p>
            </div>
            <div className="max-h-[60dvh] overflow-y-auto p-1.5">
              {["Guest Website", "Operations"].map((g) => (
                <div key={g} className="py-1">
                  <p className="px-2.5 pb-1 pt-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">{g}</p>
                  {surfaces
                    .filter((s) => s.group === g)
                    .map((s) => {
                      const active = s.href === "/" ? path === "/" : path.startsWith(s.href);
                      return (
                        <Link
                          key={s.href}
                          href={s.href}
                          onClick={() => setOpen(false)}
                          className={cn("group flex items-center justify-between rounded-xl px-2.5 py-2 transition", active ? "bg-white/14" : "hover:bg-white/8")}
                        >
                          <span>
                            <span className="block text-[13.5px] font-semibold">{s.label}</span>
                            <span className="block text-[11.5px] text-white/55">{s.note}</span>
                          </span>
                          <ArrowUpRight className="size-4 text-white/35 transition group-hover:text-[#f5a623]" />
                        </Link>
                      );
                    })}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex size-10 items-center justify-center gap-2 rounded-full border border-white/15 bg-[#4e1d84] text-[12.5px] font-bold text-white shadow-lg backdrop-blur-md transition hover:bg-[#3d116d] sm:h-10 sm:w-auto sm:pl-3.5 sm:pr-4"
        aria-expanded={open}
        aria-label="Switch Demo Restaurant screens"
      >
        {open ? <X className="size-4" /> : <Layers className="size-4 text-[#f5a623]" />}
        <span className="hidden sm:inline">Demo Restaurant Portals</span>
      </button>
    </div>
  );
}
