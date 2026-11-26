"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowUpRight,
  Bell,
  ChevronDown,
  Command,
  ExternalLink,
  LogOut,
  Menu,
  Search,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { Avatar } from "@/components/ui";
import { notifications } from "@/lib/data";
import { DEFAULT_SITE_CONTENT, useHydrated, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { adminNav, type NavGroup } from "./nav";

export function Shell({
  children,
  user,
  branches,
}: {
  children: ReactNode;
  scope?: "admin";
  user: { name: string; role: string };
  branches?: string[];
}) {
  const nav = adminNav;
  const path = usePathname();
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const mobileOpen = openedAt === path;
  const setMobileOpen = (v: boolean) => setOpenedAt(v ? path : null);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="admin-theme min-h-dvh bg-[#f7f8fc] text-[#0f172a]">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[264px] border-r border-[#edf0f7] bg-white lg:block">
        <Sidebar nav={nav} />
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-[65] lg:hidden">
            <motion.div
              className="absolute inset-0 bg-[#0f172a]/40 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 320 }}
              className="absolute inset-y-0 left-0 w-[86vw] max-w-[290px] bg-white shadow-2xl"
            >
              <Sidebar nav={nav} onClose={() => setMobileOpen(false)} />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      <div className="lg:pl-[264px]">
        <Topbar onMenu={() => setMobileOpen(true)} onSearch={() => setPaletteOpen(true)} user={user} branches={branches} />
        <main className="mx-auto w-full max-w-[1480px] px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pt-7">{children}</main>
      </div>

      <Palette open={paletteOpen} onClose={() => setPaletteOpen(false)} nav={nav} />
    </div>
  );
}

function Sidebar({ nav, onClose }: { nav: NavGroup[]; onClose?: () => void }) {
  const path = usePathname();
  const router = useRouter();
  const hydrated = useHydrated();
  const tenantLogos = useStore((s) => s.tenantLogos);
  const storedContent = useStore((s) => s.siteContent);
  const adminSignOut = useStore((s) => s.adminSignOut);
  const brandName = (hydrated && storedContent?.name) || DEFAULT_SITE_CONTENT.name;
  const customLogo = hydrated ? tenantLogos["neela"] : undefined;
  const isActive = (href: string) => (href === "/admin" ? path === href : path.startsWith(href));

  return (
    <div className="flex h-full flex-col bg-white text-[#0f172a]">
      {/* Brand Header (Matches Public Site Logo & Purple Theme) */}
      <div className="flex h-16 shrink-0 items-center justify-between px-5">
        <Link href="/admin" className="flex min-w-0 items-center gap-3">
          {customLogo ? (
            <img
              src={customLogo}
              alt={brandName}
              className="size-9 shrink-0 rounded-2xl border border-[#4e1d84]/15 bg-white object-contain p-1 shadow-xs"
            />
          ) : (
            <span className="grid size-9 shrink-0 place-items-center rounded-2xl bg-[#4e1d84] text-[#f5a623] shadow-[0_8px_18px_-6px_rgba(78,29,132,0.55)]">
              <UtensilsCrossed className="size-4.5" strokeWidth={2.2} />
            </span>
          )}
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-[15px] font-extrabold uppercase tracking-[-0.03em] text-[#4e1d84]">
              {brandName}
            </span>
            <span className="block text-[11px] font-medium text-[#7c6a96]">
              Admin &amp; POS Console
            </span>
          </span>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="grid size-8 place-items-center rounded-lg text-[#64748b] hover:bg-[#f7f8fc]"
            aria-label="Close menu"
          >
            <X className="size-4.5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="thin-scroll flex-1 overflow-y-auto px-3 pb-4">
        {nav.map((g) => (
          <div key={g.label} className="mt-4 first:mt-2">
            <p className="mb-1.5 px-3 text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#94a3b8]">
              {g.label}
            </p>
            <div className="space-y-0.5">
              {g.items.map((it) => {
                const active = isActive(it.href);
                return (
                  <Link
                    key={it.href}
                    href={it.href}
                    className={cn(
                      "group relative flex h-10 items-center gap-3 rounded-xl px-3 text-[13.5px] font-medium transition-colors",
                      active
                        ? "bg-[#f3e8ff] font-semibold text-[#4e1d84]"
                        : "text-[#64748b] hover:bg-[#f7f8fc] hover:text-[#0f172a]",
                    )}
                  >
                    <it.icon
                      className={cn(
                        "size-[17px] shrink-0 transition-colors",
                        active ? "text-[#4e1d84]" : "text-[#94a3b8] group-hover:text-[#475569]",
                      )}
                      strokeWidth={active ? 2.1 : 1.75}
                    />
                    <span className="flex-1 truncate">{it.label}</span>
                    {it.external && <ArrowUpRight className="size-3.5 text-[#94a3b8]" />}
                    {it.badge && (
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[10.5px] font-bold tnum",
                          active ? "bg-[#4e1d84] text-white" : "bg-[#f1f3f9] text-[#64748b]",
                        )}
                      >
                        {it.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Live Website Shortcut + Sign out */}
      <div className="shrink-0 space-y-2.5 border-t border-[#edf0f7] p-3.5 lg:pb-16">
        <Link
          href="/"
          target="_blank"
          className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#f3e8ff] text-[12.5px] font-bold text-[#4e1d84] transition hover:bg-[#e9d5ff]"
        >
          <ExternalLink className="size-3.5" /> View {brandName} Website
        </Link>

        <button
          type="button"
          onClick={() => {
            adminSignOut();
            router.push("/admin/login");
          }}
          className="flex h-9 w-full items-center justify-center gap-2 rounded-xl border border-[#e6eaf2] bg-white text-[12.5px] font-semibold text-[#64748b] transition hover:border-[#fecaca] hover:bg-[#fef2f2] hover:text-[#dc2626]"
        >
          <LogOut className="size-3.5" /> Sign out
        </button>

        <div className="flex items-center justify-between px-1 pt-0.5">
          <span className="text-[11.5px] font-medium text-[#94a3b8]">Indiranagar HQ</span>
          <span className="text-[11.5px] font-semibold text-[#10b981]">● Live</span>
        </div>
      </div>
    </div>
  );
}

function Topbar({
  onMenu,
  onSearch,
  user,
  branches,
}: {
  onMenu: () => void;
  onSearch: () => void;
  user: { name: string; role: string };
  branches?: string[];
}) {
  const [bellOpen, setBellOpen] = useState(false);
  const [branch, setBranch] = useState(branches?.[0]);
  const [branchOpen, setBranchOpen] = useState(false);
  const unread = notifications.filter((n) => n.unread).length;

  return (
    <header className="sticky top-0 z-30 border-b border-[#edf0f7] bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1480px] items-center gap-2 px-4 sm:gap-3 sm:px-6 lg:px-8">
        <button
          onClick={onMenu}
          className="-ml-1 grid size-10 place-items-center rounded-xl text-[#475569] hover:bg-[#f7f8fc] lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="size-5" />
        </button>

        {/* Search Input Trigger */}
        <button
          onClick={onSearch}
          className="hidden h-10 w-full max-w-[380px] items-center gap-2.5 rounded-xl border border-[#e6eaf2] bg-[#f7f8fc] px-3.5 text-[13.5px] text-[#94a3b8] transition hover:border-[#cbd5e1] hover:bg-white sm:flex"
        >
          <Search className="size-4 text-[#94a3b8]" />
          <span className="flex-1 text-left">Search product, order, customer…</span>
          <span className="flex items-center gap-0.5 rounded-md border border-[#e2e8f0] bg-white px-1.5 py-0.5 font-mono text-[10.5px] text-[#64748b]">
            <Command className="size-2.5" />K
          </span>
        </button>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <button
            onClick={onSearch}
            className="grid size-10 place-items-center rounded-xl text-[#475569] hover:bg-[#f7f8fc] sm:hidden"
            aria-label="Search"
          >
            <Search className="size-4.5" />
          </button>

          {branches && (
            <div className="relative">
              <button
                onClick={() => setBranchOpen((v) => !v)}
                className="flex h-10 items-center gap-2 rounded-xl border border-[#e6eaf2] bg-[#f7f8fc] pl-3 pr-2.5 text-[13px] font-semibold text-[#334155] transition hover:border-[#cbd5e1] hover:bg-white"
              >
                <span className="size-2 rounded-full bg-[#10b981]" />
                <span className="hidden max-w-32 truncate sm:inline">{branch}</span>
                <span className="sm:hidden">Branch</span>
                <ChevronDown className="size-3.5 text-[#94a3b8]" />
              </button>
              <AnimatePresence>
                {branchOpen && (
                  <Dropdown onClose={() => setBranchOpen(false)} className="w-60">
                    <p className="px-3 pb-1 pt-2 text-[10.5px] font-bold uppercase tracking-wider text-[#94a3b8]">
                      Switch branch
                    </p>
                    {branches.map((b) => (
                      <button
                        key={b}
                        onClick={() => {
                          setBranch(b);
                          setBranchOpen(false);
                        }}
                        className={cn(
                          "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-[13px] transition hover:bg-[#f7f8fc]",
                          b === branch ? "bg-[#f3e8ff] font-semibold text-[#4e1d84]" : "text-[#334155]",
                        )}
                      >
                        {b}
                        {b === branch && <span className="size-1.5 rounded-full bg-[#4e1d84]" />}
                      </button>
                    ))}
                  </Dropdown>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setBellOpen((v) => !v)}
              className="relative grid size-10 place-items-center rounded-xl border border-[#e6eaf2] bg-white text-[#475569] transition hover:bg-[#f7f8fc]"
              aria-label="Notifications"
            >
              <Bell className="size-[17px]" />
              {unread > 0 && (
                <span className="absolute -right-1 -top-1 grid size-4.5 place-items-center rounded-full bg-[#ef4444] text-[9.5px] font-bold text-white shadow-xs">
                  {unread}
                </span>
              )}
            </button>
            <AnimatePresence>
              {bellOpen && (
                <Dropdown
                  onClose={() => setBellOpen(false)}
                  className="w-[min(380px,calc(100vw-24px))] max-sm:fixed max-sm:inset-x-3 max-sm:top-16 max-sm:w-auto"
                >
                  <div className="flex items-center justify-between px-3 pb-2 pt-2.5">
                    <p className="text-[15px] font-bold text-[#0f172a]">Live activity</p>
                    <Link href="/admin/notifications" className="text-[12px] font-semibold text-[#4e1d84] hover:underline">
                      View all
                    </Link>
                  </div>
                  <ul className="max-h-[60vh] overflow-y-auto">
                    {notifications.map((n) => (
                      <li key={n.id} className="flex gap-3 rounded-xl px-3 py-2.5 hover:bg-[#f7f8fc]">
                        <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", n.unread ? "bg-[#4e1d84]" : "bg-[#cbd5e1]")} />
                        <div className="min-w-0 flex-1">
                          <p className="text-[13px] font-semibold leading-snug text-[#0f172a]">{n.title}</p>
                          <p className="truncate text-[12px] text-[#64748b]">{n.body}</p>
                        </div>
                        <span className="shrink-0 font-mono text-[10.5px] text-[#94a3b8]">{n.time}</span>
                      </li>
                    ))}
                  </ul>
                </Dropdown>
              )}
            </AnimatePresence>
          </div>

          <div className="hidden text-right text-[11.5px] leading-tight text-[#64748b] xl:block">
            <p className="font-semibold text-[#334155]">Nov 26, 2026</p>
            <p>Dinner Service</p>
          </div>

          <div className="flex items-center gap-2.5 border-l border-[#edf0f7] pl-3">
            <Avatar name={user.name} tone={0} className="size-9 bg-[#4e1d84] text-[#f5a623]" />
            <div className="hidden leading-tight xl:block">
              <p className="text-[13px] font-bold text-[#0f172a]">{user.name}</p>
              <p className="text-[11px] font-medium text-[#94a3b8]">{user.role}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function Dropdown({ children, onClose, className }: { children: ReactNode; onClose: () => void; className?: string }) {
  useEffect(() => {
    const t = setTimeout(() => window.addEventListener("click", onClose, { once: true }), 0);
    return () => {
      clearTimeout(t);
      window.removeEventListener("click", onClose);
    };
  }, [onClose]);
  return (
    <motion.div
      initial={{ opacity: 0, y: -6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -4, scale: 0.98 }}
      transition={{ duration: 0.16 }}
      onClick={(e) => e.stopPropagation()}
      className={cn(
        "absolute right-0 top-12 z-50 origin-top-right rounded-2xl border border-[#e6eaf2] bg-white p-1.5 shadow-[0_24px_60px_-20px_rgba(15,23,42,0.18)]",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}

function Palette({ open, onClose, nav }: { open: boolean; onClose: () => void; nav: NavGroup[] }) {
  return <AnimatePresence>{open && <PaletteBody onClose={onClose} nav={nav} />}</AnimatePresence>;
}

function PaletteBody({ onClose, nav }: { onClose: () => void; nav: NavGroup[] }) {
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const router = useRouter();
  const items = useMemo(
    () =>
      nav
        .flatMap((g) => g.items.map((i) => ({ ...i, group: g.label })))
        .filter((i) => (i.label + i.group).toLowerCase().includes(q.toLowerCase())),
    [nav, q],
  );

  const go = (href: string) => {
    router.push(href);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center px-3 pt-[12vh]">
      <motion.div
        className="absolute inset-0 bg-[#0f172a]/35 backdrop-blur-[3px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -6, scale: 0.98 }}
        transition={{ type: "spring", damping: 30, stiffness: 400 }}
        className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-[#e6eaf2] bg-white shadow-2xl"
      >
        <div className="flex items-center gap-3 border-b border-[#edf0f7] px-4">
          <Search className="size-4.5 text-[#94a3b8]" />
          <input
            autoFocus
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setIdx(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setIdx((i) => Math.min(items.length - 1, i + 1));
              }
              if (e.key === "ArrowUp") {
                e.preventDefault();
                setIdx((i) => Math.max(0, i - 1));
              }
              if (e.key === "Enter" && items[idx]) go(items[idx].href);
              if (e.key === "Escape") onClose();
            }}
            placeholder="Jump to a module…"
            className="h-14 flex-1 bg-transparent text-[15px] text-[#0f172a] outline-none placeholder:text-[#94a3b8]"
          />
          <kbd className="rounded-md border border-[#e2e8f0] bg-[#f7f8fc] px-1.5 py-0.5 font-mono text-[10.5px] text-[#64748b]">
            esc
          </kbd>
        </div>
        <ul className="max-h-[50vh] overflow-y-auto p-1.5">
          {items.map((it, i) => (
            <li key={it.href}>
              <button
                onMouseEnter={() => setIdx(i)}
                onClick={() => go(it.href)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition",
                  i === idx ? "bg-[#f3e8ff] font-semibold text-[#4e1d84]" : "text-[#334155]",
                )}
              >
                <it.icon className={cn("size-4", i === idx ? "text-[#4e1d84]" : "text-[#94a3b8]")} />
                <span className="flex-1 text-[14px]">{it.label}</span>
                <span className={cn("text-[11.5px]", i === idx ? "text-[#4e1d84]/70" : "text-[#94a3b8]")}>
                  {it.group}
                </span>
              </button>
            </li>
          ))}
          {!items.length && <li className="px-3 py-8 text-center text-sm text-[#94a3b8]">No module matches &ldquo;{q}&rdquo;.</li>}
        </ul>
      </motion.div>
    </div>
  );
}
