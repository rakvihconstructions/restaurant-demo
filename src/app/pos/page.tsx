"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  Bookmark,
  ChefHat,
  ClipboardList,
  CreditCard,
  Delete,
  FileDown,
  LayoutGrid,
  Minus,
  PauseCircle,
  Percent,
  Plus,
  Printer,
  ScanBarcode,
  Search,
  Smartphone,
  SplitSquareHorizontal,
  Store,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button, DietMark, Select, Sheet } from "@/components/ui";
import { customers as seedCustomers, tables } from "@/lib/data";
import { categories, menu, type MenuItem } from "@/lib/menu";
import { downloadInvoicePdf, downloadReceiptPdf } from "@/lib/pdf-documents";
import { useHydrated, useStore } from "@/lib/store";
import { cn, inr } from "@/lib/utils";

type Line = { id: string; item: MenuItem; qty: number; variant?: string; extra: number; note?: string };
type Held = { id: string; label: string; lines: Line[] };

export default function POS() {
  const [mode, setMode] = useState<"Dine-in" | "Takeaway">("Dine-in");
  const [table, setTable] = useState("07");
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");
  const [lines, setLines] = useState<Line[]>([]);
  const [discount, setDiscount] = useState(0);
  const [held, setHeld] = useState<Held[]>([
    { id: "H1", label: "Table 03 · Meera", lines: [] },
    { id: "H2", label: "Takeaway · Rohan", lines: [] },
  ]);
  const [payOpen, setPayOpen] = useState(false);
  const [ticketOpen, setTicketOpen] = useState(false);
  const [variantFor, setVariantFor] = useState<MenuItem | null>(null);
  const [customerList, setCustomerList] = useState(() =>
    seedCustomers.map((c) => ({ id: c.id, name: c.name, phone: c.phone, visits: c.visits, tier: c.tier })),
  );
  const [guest, setGuest] = useState<{ name: string; phone: string } | null>(null);
  const [guestOpen, setGuestOpen] = useState(false);
  const [guestTab, setGuestTab] = useState<"existing" | "new">("existing");
  const [guestSearch, setGuestSearch] = useState("");
  const [newGuestName, setNewGuestName] = useState("");
  const [newGuestPhone, setNewGuestPhone] = useState("");
  const hydrated = useHydrated();
  const placeOrder = useStore((s) => s.placeOrder);
  const activeTenant = useStore((s) => s.activeTenant);
  const tenantLogos = useStore((s) => s.tenantLogos);
  const tenantName = hydrated ? activeTenant.name : "Demo Restaurant";
  const tenantCity = hydrated ? activeTenant.city : "Bengaluru";
  const tenantGstin = hydrated ? activeTenant.gstin : "29AAKCN4821M1Z6";
  const tenantSlug = hydrated ? activeTenant.slug : "neela";
  const customLogo = hydrated ? tenantLogos[tenantSlug] : undefined;

  const items = useMemo(
    () =>
      menu.filter(
        (m) => (cat === "all" || m.category === cat) && (!q || m.name.toLowerCase().includes(q.toLowerCase())),
      ),
    [cat, q],
  );
  const subtotal = lines.reduce((s, l) => s + (l.item.price + l.extra) * l.qty, 0);
  const disc = Math.round((subtotal * discount) / 100);
  const cgst = Math.round((subtotal - disc) * 0.025);
  const total = subtotal - disc + cgst * 2;
  const count = lines.reduce((s, l) => s + l.qty, 0);

  const add = (item: MenuItem, variant?: { label: string; price: number }) => {
    if (item.variants && !variant) return setVariantFor(item);
    setLines((ls) => {
      const id = item.id + (variant?.label ?? "");
      const ex = ls.find((l) => l.id === id);
      if (ex) return ls.map((l) => (l.id === id ? { ...l, qty: l.qty + 1 } : l));
      return [...ls, { id, item, qty: 1, variant: variant?.label, extra: variant?.price ?? 0 }];
    });
  };
  const qty = (id: string, d: number) =>
    setLines((ls) => ls.flatMap((l) => (l.id === id ? (l.qty + d <= 0 ? [] : [{ ...l, qty: l.qty + d }]) : [l])));

  const sendKot = () => {
    if (!lines.length) return;
    const o = placeOrder({
      source: "POS",
      table: mode === "Dine-in" ? table : undefined,
      mode,
      customer: guest ? `${guest.name} (${guest.phone})` : mode === "Dine-in" ? `Table ${table}` : "Counter guest",
      total,
      lines: lines.map((l) => ({
        name: l.item.name,
        qty: l.qty,
        mods: l.variant ? [l.variant] : [],
        station: l.item.station,
      })),
    });
    toast.success(`KOT sent · ${o.id}`, {
      description: `${count} items → ${Array.from(new Set(lines.map((l) => l.item.station))).join(", ")}`,
    });
    return o.id;
  };

  const hold = () => {
    if (!lines.length) return;
    setHeld((h) => [
      ...h,
      { id: `H${h.length + 1}`, label: `${mode === "Dine-in" ? `Table ${table}` : mode} · ${count} items`, lines },
    ]);
    setLines([]);
    toast("Saved as draft", { description: "Resume it anytime from Held orders." });
  };

  const Ticket = (
    <div className="flex h-full flex-col bg-white">
      <div className="space-y-3 border-b border-[#edf0f7] p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[16px] font-extrabold tracking-[-0.02em] text-[#0f172a]">Current Order</h2>
          <span className="rounded-full bg-[#ecfdf5] px-2.5 py-1 text-[11.5px] font-bold text-[#10b981]">
            {mode === "Dine-in" ? `Table ${table}` : mode}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-1 rounded-xl bg-[#f1f3f9] p-1">
          {(["Dine-in", "Takeaway"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={cn(
                "rounded-lg py-1.5 text-[12px] font-semibold transition",
                mode === m ? "bg-white text-[#4e1d84] shadow-xs" : "text-[#64748b] hover:text-[#0f172a]",
              )}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {mode === "Dine-in" ? (
            <Select value={table} onChange={(e) => setTable(e.target.value)} className="h-9 rounded-xl border-[#e6eaf2] text-[12.5px]">
              {tables.map((t) => (
                <option key={t.id} value={t.label}>
                  Table {t.label} · {t.status}
                </option>
              ))}
            </Select>
          ) : (
            <Select className="h-9 rounded-xl border-[#e6eaf2] text-[12.5px]">
              <option>Pickup · 20 min</option>
            </Select>
          )}
          <button
            onClick={() => setGuestOpen(true)}
            className={cn(
              "flex h-9 items-center gap-2 rounded-xl border px-3 text-left text-[12.5px] font-semibold transition",
              guest
                ? "border-[#4e1d84]/30 bg-[#f3e8ff] text-[#4e1d84]"
                : "border-[#e6eaf2] bg-[#f7f8fc] text-[#475569] hover:bg-white",
            )}
          >
            <UserRound className="size-3.5 shrink-0 text-[#4e1d84]" />
            <span className="truncate">{guest ? guest.name : "Add customer"}</span>
          </button>
        </div>
        {guest && (
          <div className="flex items-center justify-between gap-2 rounded-xl border border-[#4e1d84]/20 bg-[#f3e8ff] px-3 py-2 text-[12px]">
            <div className="min-w-0">
              <p className="truncate font-bold text-[#0f172a]">{guest.name}</p>
              <p className="font-mono text-[11px] text-[#4e1d84]">{guest.phone}</p>
            </div>
            <button
              type="button"
              onClick={() => setGuest(null)}
              className="grid size-6 shrink-0 place-items-center rounded-lg text-[#64748b] hover:bg-white hover:text-[#ef4444]"
              aria-label="Remove customer"
            >
              <X className="size-3.5" />
            </button>
          </div>
        )}
      </div>

      <div className="thin-scroll min-h-0 flex-1 overflow-y-auto">
        {lines.length === 0 ? (
          <div className="grid h-full min-h-48 place-items-center p-8 text-center">
            <div>
              <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-[#f3e8ff] text-[#4e1d84]">
                <ClipboardList className="size-5" />
              </span>
              <p className="mt-3 text-[16px] font-bold text-[#0f172a]">New Order</p>
              <p className="mt-1 text-[12.5px] text-[#94a3b8]">
                Tap dishes on the left or scan a barcode to start billing.
              </p>
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-[#edf0f7]">
            {lines.map((l) => (
              <li key={l.id} className="flex items-center gap-3 px-4 py-3">
                <div className="relative size-11 shrink-0 overflow-hidden rounded-xl bg-[#f1f3f9]">
                  {l.item.image ? (
                    <Image src={l.item.image} alt="" fill sizes="44px" className="object-cover" />
                  ) : (
                    <span className="grid h-full place-items-center text-sm font-bold text-[#4e1d84]">{l.item.name[0]}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-bold text-[#0f172a]">{l.item.name}</p>
                  <p className="text-[11.5px] font-medium text-[#64748b]">
                    {inr(l.item.price + l.extra)}
                    {l.variant ? ` · ${l.variant}` : ""}
                  </p>
                </div>
                <div className="flex items-center rounded-lg border border-[#e6eaf2] bg-[#f7f8fc]">
                  <button
                    className="grid size-7 place-items-center text-[#475569] hover:text-[#0f172a]"
                    onClick={() => qty(l.id, -1)}
                    aria-label="Less"
                  >
                    <Minus className="size-3" />
                  </button>
                  <span className="w-5 text-center text-[12.5px] font-bold text-[#0f172a] tnum">{l.qty}</span>
                  <button
                    className="grid size-7 place-items-center text-[#475569] hover:text-[#0f172a]"
                    onClick={() => qty(l.id, 1)}
                    aria-label="More"
                  >
                    <Plus className="size-3" />
                  </button>
                </div>
                <button
                  onClick={() => qty(l.id, -l.qty)}
                  className="grid size-7 shrink-0 place-items-center rounded-lg text-[#ef4444]/75 hover:bg-[#fef2f2] hover:text-[#ef4444]"
                  aria-label="Remove item"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="safe-bottom border-t border-[#edf0f7] bg-white p-4">
        <div className="mb-3 flex gap-1.5">
          {[0, 10, 15, 20].map((d) => (
            <button
              key={d}
              onClick={() => {
                setDiscount(d);
                if (d > 15) toast("Manager PIN required above 15%", { description: "Approved by Ananya R. (demo)" });
              }}
              className={cn(
                "flex-1 rounded-xl border py-1.5 text-[12px] font-bold transition tnum",
                discount === d
                  ? "border-[#4e1d84] bg-[#f3e8ff] text-[#4e1d84]"
                  : "border-[#e6eaf2] bg-[#f7f8fc] text-[#64748b] hover:bg-white",
              )}
            >
              {d ? `${d}%` : <span className="inline-flex items-center gap-1"><Percent className="size-3" />0%</span>}
            </button>
          ))}
        </div>

        <dl className="space-y-1.5 text-[13px] text-[#64748b]">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd className="font-semibold text-[#0f172a] tnum">{inr(subtotal)}</dd>
          </div>
          {disc > 0 && (
            <div className="flex justify-between text-[#10b981]">
              <dt>Discount ({discount}%)</dt>
              <dd className="font-semibold tnum">− {inr(disc)}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt>Tax (GST 5%)</dt>
            <dd className="font-semibold text-[#0f172a] tnum">{inr(cgst * 2)}</dd>
          </div>
        </dl>

        <div className="mt-3 flex items-baseline justify-between border-t border-[#edf0f7] pt-3">
          <span className="text-[14px] font-bold text-[#0f172a]">Total</span>
          <span className="text-[24px] font-extrabold leading-none text-[#0f172a] tnum">{inr(total)}</span>
        </div>

        <div className="mt-4 space-y-2">
          <button
            onClick={() => {
              setTicketOpen(false);
              setPayOpen(true);
            }}
            disabled={!lines.length}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#4e1d84] text-[14.5px] font-bold text-white shadow-[0_10px_24px_-8px_rgba(78,29,132,0.75)] transition hover:bg-[#3d116d] disabled:opacity-45"
          >
            Charge {lines.length ? inr(total) : ""} <ArrowRight className="size-4" />
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={hold}
              disabled={!lines.length}
              className="flex h-10 items-center justify-center gap-1.5 rounded-xl border border-[#e9d5ff] bg-[#f3e8ff] text-[13px] font-bold text-[#4e1d84] transition hover:bg-[#eceaff] disabled:opacity-45"
            >
              <Bookmark className="size-3.5" /> Save as Draft
            </button>
            <button
              onClick={sendKot}
              disabled={!lines.length}
              className="flex h-10 items-center justify-center gap-1.5 rounded-xl border border-[#e6eaf2] bg-[#f7f8fc] text-[13px] font-bold text-[#334155] transition hover:bg-white disabled:opacity-45"
            >
              <ChefHat className="size-3.5 text-[#4e1d84]" /> Send KOT
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="admin-theme flex h-dvh overflow-hidden bg-[#f7f8fc] text-[#0f172a]">
      {/* Crisp White Side Rail */}
      <aside className="hidden w-[76px] shrink-0 flex-col items-center gap-2 border-r border-[#edf0f7] bg-white py-4 md:flex">
        <Link
          href="/admin"
          className="mb-4 grid size-10 place-items-center overflow-hidden rounded-xl bg-[#4e1d84] text-white shadow-[0_8px_18px_-6px_rgba(78,29,132,0.65)]"
          title={`Back to ${tenantName} Admin`}
        >
          {customLogo ? (
            <img src={customLogo} alt={tenantName} className="size-full bg-white object-contain p-0.5" />
          ) : (
            <Store className="size-5" />
          )}
        </Link>
        {[
          [LayoutGrid, "POS", "/pos", true],
          [ClipboardList, "Orders", "/admin/orders"],
          [ChefHat, "Kitchen", "/kitchen"],
        ].map(([I, l, h, a]) => {
          const Icon = I as typeof ChefHat;
          return (
            <Link
              key={l as string}
              href={h as string}
              className={cn(
                "flex w-14 flex-col items-center gap-1 rounded-xl py-2.5 text-[10.5px] font-semibold transition",
                a ? "bg-[#f3e8ff] text-[#4e1d84]" : "text-[#64748b] hover:bg-[#f7f8fc] hover:text-[#0f172a]",
              )}
            >
              <Icon className="size-5" strokeWidth={a ? 2.1 : 1.75} />
              {l as string}
            </Link>
          );
        })}
        <Link
          href="/admin"
          className="mt-auto flex w-14 flex-col items-center gap-1 rounded-xl py-2.5 text-[10.5px] font-semibold text-[#64748b] hover:bg-[#f7f8fc] hover:text-[#0f172a]"
        >
          <ArrowLeft className="size-5" strokeWidth={1.75} />
          Admin
        </Link>
      </aside>

      {/* Main Catalogue */}
      <section className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-[#edf0f7] bg-white px-4 py-3 sm:px-6">
          <Link
            href="/admin"
            className="grid size-9 place-items-center overflow-hidden rounded-xl bg-[#4e1d84] text-white md:hidden"
            aria-label="Back to Admin"
          >
            {customLogo ? (
              <img src={customLogo} alt={tenantName} className="size-full bg-white object-contain p-0.5" />
            ) : (
              <Store className="size-4.5" />
            )}
          </Link>
          <div className="hidden sm:block">
            <p className="text-[17px] font-extrabold leading-none tracking-[-0.02em] text-[#0f172a]">{tenantName} · POS 01</p>
            <p className="mt-1 text-[11.5px] font-medium text-[#94a3b8]">Arjun N. · {tenantCity} · Dinner Service</p>
          </div>
          <label className="ml-auto flex h-10 w-full max-w-sm items-center gap-2 rounded-xl border border-[#e6eaf2] bg-[#f7f8fc] px-3.5 focus-within:border-[#4e1d84] focus-within:bg-white">
            <Search className="size-4 text-[#94a3b8]" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search menu items or scan…"
              className="min-w-0 flex-1 bg-transparent text-[13.5px] text-[#0f172a] outline-none placeholder:text-[#94a3b8]"
            />
            <ScanBarcode className="size-4 text-[#94a3b8]" />
          </label>
        </header>

        {/* Category Pills */}
        <div className="no-scrollbar flex gap-1.5 overflow-x-auto border-b border-[#edf0f7] bg-white px-4 py-2.5 sm:px-6">
          {[{ id: "all", name: "All Items" }, ...categories].map((c) => (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              className={cn(
                "shrink-0 rounded-xl px-3.5 py-1.5 text-[13px] font-semibold transition",
                cat === c.id ? "bg-[#f3e8ff] text-[#4e1d84]" : "text-[#64748b] hover:bg-[#f7f8fc] hover:text-[#0f172a]",
              )}
            >
              {c.name}
            </button>
          ))}
        </div>

        {held.length > 0 && (
          <div className="no-scrollbar flex items-center gap-2 overflow-x-auto px-4 pt-3 sm:px-6">
            <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#94a3b8]">Drafts</span>
            {held.map((h) => (
              <button
                key={h.id}
                onClick={() => {
                  if (h.lines.length) setLines(h.lines);
                  setHeld((x) => x.filter((y) => y.id !== h.id));
                  toast(`Resumed ${h.label}`);
                }}
                className="flex shrink-0 items-center gap-1.5 rounded-full border border-[#e9d5ff] bg-white px-3 py-1 text-[12px] font-semibold text-[#4e1d84] shadow-2xs transition hover:bg-[#f3e8ff]"
              >
                <PauseCircle className="size-3.5" /> {h.label}
              </button>
            ))}
          </div>
        )}

        {/* Menu Grid matching Reference Cards */}
        <div className="thin-scroll min-h-0 flex-1 overflow-y-auto p-4 pb-28 sm:p-6 lg:pb-6">
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {items.map((m) => {
              const inTicket = lines.filter((l) => l.item.id === m.id).reduce((s, l) => s + l.qty, 0);
              return (
                <button
                  key={m.id}
                  onClick={() => add(m)}
                  className={cn(
                    "group relative flex flex-col overflow-hidden rounded-2xl border bg-white p-3 text-left shadow-[0_4px_18px_-8px_rgba(15,23,42,0.06)] transition active:scale-[0.98]",
                    inTicket ? "border-[#4e1d84] ring-1 ring-[#4e1d84]/30" : "border-[#eceff6] hover:border-[#cbd5e1]",
                  )}
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-[#f1f3f9]">
                    {m.image ? (
                      <Image
                        src={m.image}
                        alt=""
                        fill
                        sizes="220px"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <span className="grid h-full place-items-center text-3xl font-extrabold text-[#4e1d84]/35">
                        {m.name[0]}
                      </span>
                    )}
                    {inTicket > 0 && (
                      <span className="absolute right-2 top-2 grid size-6.5 place-items-center rounded-full bg-[#4e1d84] text-[11.5px] font-bold text-white shadow-md tnum">
                        {inTicket}
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex flex-1 flex-col">
                    <p className="flex items-start gap-1.5 text-[13.5px] font-bold leading-snug text-[#0f172a]">
                      <DietMark diet={m.diet} className="mt-0.5" />
                      <span className="line-clamp-2">{m.name}</span>
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <span className="text-[14px] font-extrabold text-[#4e1d84] tnum">
                        {inr(m.price)}
                        {m.variants && <span className="ml-0.5 text-[11px] font-medium text-[#94a3b8]">+</span>}
                      </span>
                      <span className="grid size-7 place-items-center rounded-full bg-[#f3e8ff] text-[#4e1d84] transition group-hover:bg-[#4e1d84] group-hover:text-white">
                        <Plus className="size-3.5" strokeWidth={2.5} />
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Right Current Order Panel */}
      <aside className="hidden w-[360px] shrink-0 border-l border-[#edf0f7] lg:block">{Ticket}</aside>

      {/* Mobile Floating Ticket Bar */}
      <div className="fixed inset-x-3 bottom-3 z-30 lg:hidden">
        <button
          onClick={() => setTicketOpen(true)}
          className="flex h-14 w-full items-center justify-between rounded-2xl bg-[#4e1d84] pl-5 pr-2 text-white shadow-2xl"
        >
          <span className="text-left">
            <span className="block text-[11px] font-semibold text-white/75">
              {count} items · {mode}
              {mode === "Dine-in" ? ` · T${table}` : ""}
            </span>
            <span className="text-[15.5px] font-extrabold tnum">{inr(total)}</span>
          </span>
          <span className="flex h-10 items-center rounded-xl bg-white px-4 text-[13.5px] font-bold text-[#4e1d84]">
            View Order
          </span>
        </button>
      </div>

      <Sheet open={ticketOpen} onClose={() => setTicketOpen(false)} side="bottom">
        <div className="h-[80dvh]">{Ticket}</div>
      </Sheet>

      {/* Variant Picker */}
      <Sheet open={!!variantFor} onClose={() => setVariantFor(null)} side="center" width="max-w-sm" title={variantFor?.name} subtitle="Choose a portion">
        <div className="grid gap-2 p-5">
          {variantFor?.variants?.map((v) => (
            <button
              key={v.id}
              onClick={() => {
                add(variantFor, v);
                setVariantFor(null);
              }}
              className="flex items-center justify-between rounded-xl border border-[#e6eaf2] bg-white px-4 py-3.5 text-left text-[14px] font-semibold text-[#0f172a] hover:border-[#4e1d84] hover:bg-[#f3e8ff]"
            >
              {v.label}
              <span className="font-bold text-[#4e1d84] tnum">{inr(variantFor.price + v.price)}</span>
            </button>
          ))}
        </div>
      </Sheet>

      {/* New / Existing Customer Picker Sheet */}
      <Sheet
        open={guestOpen}
        onClose={() => setGuestOpen(false)}
        side="center"
        width="max-w-md"
        title="Attach Customer"
        subtitle="Choose an existing customer or register a new one"
      >
        <div className="p-5">
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-[#f1f3f9] p-1">
            {([
              ["existing", "Existing Customer"],
              ["new", "New Customer"],
            ] as const).map(([k, lbl]) => (
              <button
                key={k}
                type="button"
                onClick={() => setGuestTab(k)}
                className={cn(
                  "rounded-lg py-2 text-[12.5px] font-bold transition",
                  guestTab === k ? "bg-white text-[#4e1d84] shadow-xs" : "text-[#64748b] hover:text-[#0f172a]",
                )}
              >
                {lbl}
              </button>
            ))}
          </div>

          {guestTab === "existing" ? (
            <div className="mt-4">
              <label className="flex h-10 items-center gap-2 rounded-xl border border-[#e6eaf2] bg-[#f7f8fc] px-3 focus-within:border-[#4e1d84] focus-within:bg-white">
                <Search className="size-4 text-[#94a3b8]" />
                <input
                  value={guestSearch}
                  onChange={(e) => setGuestSearch(e.target.value)}
                  placeholder="Search by name or phone number…"
                  className="min-w-0 flex-1 bg-transparent text-[13px] text-[#0f172a] outline-none placeholder:text-[#94a3b8]"
                />
              </label>
              <ul className="thin-scroll mt-3 max-h-[290px] divide-y divide-[#edf0f7] overflow-y-auto rounded-xl border border-[#e6eaf2]">
                {customerList
                  .filter(
                    (c) =>
                      !guestSearch ||
                      (c.name + c.phone).toLowerCase().includes(guestSearch.toLowerCase()),
                  )
                  .map((c) => (
                    <li key={c.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setGuest({ name: c.name, phone: c.phone });
                          setGuestOpen(false);
                          toast.success(`Customer attached: ${c.name}`, { description: c.phone });
                        }}
                        className="flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left transition hover:bg-[#f3e8ff]"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-[13.5px] font-bold text-[#0f172a]">{c.name}</p>
                          <p className="font-mono text-[11.5px] text-[#4e1d84]">{c.phone}</p>
                        </div>
                        <span className="shrink-0 rounded-full bg-[#f1f3f9] px-2.5 py-0.5 text-[10.5px] font-semibold text-[#64748b]">
                          {c.visits} visits
                        </span>
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          ) : (
            <form
              className="mt-4 space-y-3.5"
              onSubmit={(e) => {
                e.preventDefault();
                if (!newGuestName.trim() || !newGuestPhone.trim()) return;
                const created = {
                  id: `C-${Date.now()}`,
                  name: newGuestName.trim(),
                  phone: newGuestPhone.trim(),
                  visits: 1,
                  tier: "New" as const,
                };
                setCustomerList((prev) => [created, ...prev]);
                setGuest({ name: created.name, phone: created.phone });
                setNewGuestName("");
                setNewGuestPhone("");
                setGuestOpen(false);
                toast.success(`New customer saved: ${created.name}`, { description: created.phone });
              }}
            >
              <label className="block">
                <span className="mb-1 block text-[12px] font-bold text-[#475569]">Customer Name *</span>
                <input
                  required
                  value={newGuestName}
                  onChange={(e) => setNewGuestName(e.target.value)}
                  placeholder="e.g. Karthik Sharma"
                  className="h-10 w-full rounded-xl border border-[#e6eaf2] bg-[#f7f8fc] px-3 text-[13.5px] text-[#0f172a] outline-none focus:border-[#4e1d84] focus:bg-white"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-[12px] font-bold text-[#475569]">Phone Number *</span>
                <input
                  required
                  value={newGuestPhone}
                  onChange={(e) => setNewGuestPhone(e.target.value)}
                  placeholder="e.g. +91 98450 12345"
                  inputMode="tel"
                  className="h-10 w-full rounded-xl border border-[#e6eaf2] bg-[#f7f8fc] px-3 font-mono text-[13.5px] text-[#0f172a] outline-none focus:border-[#4e1d84] focus:bg-white"
                />
              </label>
              <Button type="submit" className="mt-2 w-full rounded-xl bg-[#4e1d84] text-white hover:bg-[#3d116d]">
                Save &amp; Attach Customer
              </Button>
            </form>
          )}
        </div>
      </Sheet>

      <PaySheet
        open={payOpen}
        onClose={() => setPayOpen(false)}
        total={total}
        lines={lines}
        subtotal={subtotal}
        disc={disc}
        cgst={cgst}
        mode={mode}
        table={table}
        guest={guest}
        tenantName={tenantName}
        tenantCity={tenantCity}
        tenantGstin={tenantGstin}
        tenantSlug={tenantSlug}
        onDone={() => {
          const orderId = sendKot();
          setLines([]);
          setDiscount(0);
          return orderId;
        }}
      />
    </div>
  );
}

function PaySheet({
  open,
  onClose,
  total,
  lines,
  subtotal,
  disc,
  cgst,
  mode,
  table,
  guest,
  tenantName,
  tenantCity,
  tenantGstin,
  tenantSlug,
  onDone,
}: {
  open: boolean;
  onClose: () => void;
  total: number;
  lines: Line[];
  subtotal: number;
  disc: number;
  cgst: number;
  mode: string;
  table: string;
  guest: { name: string; phone: string } | null;
  tenantName: string;
  tenantCity: string;
  tenantGstin: string;
  tenantSlug: string;
  onDone: () => string | undefined;
}) {
  const [method, setMethod] = useState<"cash" | "upi" | "card" | "split">("upi");
  const [tendered, setTendered] = useState("");
  const [done, setDone] = useState(false);
  const [snapshot, setSnapshot] = useState<{ lines: Line[]; total: number; subtotal: number; disc: number; cgst: number } | null>(null);
  const [printMode, setPrintMode] = useState<"receipt" | null>(null);
  const [invoiceNumber, setInvoiceNumber] = useState("INV/2026-27/IND/018342");
  const t = Number(tendered || 0);

  const complete = () => {
    setSnapshot({ lines, total, subtotal, disc, cgst });
    const orderId = onDone();
    if (orderId) setInvoiceNumber(`INV/2026-27/IND/${orderId.replace("NL-", "")}`);
    setDone(true);
  };
  const close = () => {
    onClose();
    setTimeout(() => {
      setDone(false);
      setTendered("");
      setSnapshot(null);
    }, 300);
  };
  const pad = (k: string) => setTendered((v) => (k === "del" ? v.slice(0, -1) : (v + k).slice(0, 6)));
  const paymentLabel = method === "split" ? "Cash + UPI" : method.toUpperCase();
  const dateLabel = new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
  const shortDateLabel = new Date().toLocaleString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  useEffect(() => {
    if (!printMode) return;
    const clearPrintMode = () => setPrintMode(null);
    window.addEventListener("afterprint", clearPrintMode);
    return () => window.removeEventListener("afterprint", clearPrintMode);
  }, [printMode]);

  const printReceipt = () => {
    setPrintMode("receipt");
    window.setTimeout(() => window.print(), 100);
  };

  const saveReceiptPdf = () => {
    if (!snapshot) return;
    try {
      downloadReceiptPdf({
        restaurant: { name: tenantName, city: tenantCity, gstin: tenantGstin },
        receiptNumber: invoiceNumber.replace("INV/", "POS/"),
        date: dateLabel,
        customer: guest?.name ?? (mode === "Dine-in" ? `Table ${table}` : "Counter guest"),
        channel: mode,
        table: mode === "Dine-in" ? table : undefined,
        payment: paymentLabel,
        lines: snapshot.lines.map((l) => ({
          name: `${l.item.name}${l.variant ? ` (${l.variant})` : ""}`,
          qty: l.qty,
          unitPrice: l.item.price + l.extra,
          amount: (l.item.price + l.extra) * l.qty,
        })),
        subtotal: snapshot.subtotal,
        discount: snapshot.disc,
        tax: snapshot.cgst * 2,
        cgst: snapshot.cgst,
        total: snapshot.total,
      });
      toast.success("Receipt PDF downloaded");
    } catch (error) {
      console.error("Receipt PDF generation failed", error);
      toast.error("Could not download the receipt PDF.");
    }
  };

  const saveInvoicePdf = () => {
    if (!snapshot) return;
    try {
      downloadInvoicePdf({
        restaurant: { name: tenantName, city: tenantCity, gstin: tenantGstin },
        invoiceNumber,
        date: dateLabel,
        customer: guest?.name ?? (mode === "Dine-in" ? `Table ${table}` : "Counter guest"),
        phone: guest?.phone,
        channel: mode,
        table: mode === "Dine-in" ? table : undefined,
        payment: paymentLabel,
        lines: snapshot.lines.map((l) => ({
          name: `${l.item.name}${l.variant ? ` (${l.variant})` : ""}`,
          qty: l.qty,
          unitPrice: l.item.price + l.extra,
          amount: (l.item.price + l.extra) * l.qty,
        })),
        subtotal: snapshot.subtotal,
        discount: snapshot.disc,
        tax: snapshot.cgst * 2,
        total: snapshot.total,
      });
      toast.success("Invoice PDF downloaded");
    } catch (error) {
      console.error("Invoice PDF generation failed", error);
      toast.error("Could not download the invoice PDF.");
    }
  };

  return (
    <>
      <Sheet
        open={open}
        onClose={close}
        side="center"
        width="max-w-3xl"
        title={done ? "Payment Received" : `Collect ${inr(total)}`}
        subtitle={done ? "GST receipt ready" : `${mode}${mode === "Dine-in" ? ` · Table ${table}` : ""}`}
      >
      {!done ? (
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr]">
          <div className="grid grid-cols-2 gap-2 border-b border-[#edf0f7] p-4 md:grid-cols-1 md:border-b-0 md:border-r">
            {([
              ["upi", "UPI QR", Smartphone],
              ["card", "Card", CreditCard],
              ["cash", "Cash", Banknote],
              ["split", "Split Bill", SplitSquareHorizontal],
            ] as const).map(([k, l, I]) => (
              <button
                key={k}
                onClick={() => setMethod(k)}
                className={cn(
                  "flex items-center gap-3 rounded-xl border px-4 py-3 text-[14px] font-semibold transition",
                  method === k
                    ? "border-[#4e1d84] bg-[#4e1d84] text-white"
                    : "border-[#e6eaf2] bg-white text-[#334155] hover:border-[#cbd5e1]",
                )}
              >
                <I className="size-4.5" />
                {l}
              </button>
            ))}
          </div>
          <div className="p-5">
            {method === "upi" && (
              <div className="flex flex-col items-center text-center">
                <div className="rounded-2xl border border-[#e6eaf2] bg-white p-4 shadow-xs">
                  <QRCodeSVG value={`upi://pay?pa=${tenantSlug}@razorpay&am=${total}&tn=${encodeURIComponent(tenantName)}`} size={180} />
                </div>
                <p className="mt-4 text-[28px] font-extrabold text-[#0f172a] tnum">{inr(total)}</p>
                <p className="mt-1 text-[13px] text-[#64748b]">Guest scans with any UPI app · {tenantSlug}@razorpay</p>
                <p className="mt-4 flex items-center gap-2 text-[12.5px] font-semibold text-[#4e1d84]">
                  <span className="size-2 animate-pulse rounded-full bg-[#4e1d84]" /> Waiting for payment confirmation…
                </p>
              </div>
            )}
            {method === "card" && (
              <div className="grid place-items-center py-8 text-center">
                <CreditCard className="size-10 text-[#4e1d84]" />
                <p className="mt-4 text-[28px] font-extrabold text-[#0f172a] tnum">{inr(total)}</p>
                <p className="mt-1 text-[13px] text-[#64748b]">Sent to card terminal · Pine Labs Plutus #2</p>
              </div>
            )}
            {method === "cash" && (
              <div>
                <div className="flex items-baseline justify-between rounded-xl bg-[#f7f8fc] p-4">
                  <span className="text-[13px] font-medium text-[#64748b]">Tendered</span>
                  <span className="text-[32px] font-extrabold text-[#0f172a] tnum">{inr(t)}</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {[total, Math.ceil(total / 100) * 100, Math.ceil(total / 500) * 500, 2000]
                    .filter((v, i, a) => a.indexOf(v) === i)
                    .map((v) => (
                      <button
                        key={v}
                        onClick={() => setTendered(String(v))}
                        className="rounded-full border border-[#e6eaf2] bg-white px-3 py-1.5 text-[12.5px] font-bold text-[#334155] tnum"
                      >
                        {inr(v)}
                      </button>
                    ))}
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {["1", "2", "3", "4", "5", "6", "7", "8", "9", "00", "0", "del"].map((k) => (
                    <button
                      key={k}
                      onClick={() => pad(k)}
                      className="grid h-12 place-items-center rounded-xl border border-[#e6eaf2] bg-white font-mono text-lg font-bold hover:bg-[#f7f8fc] active:scale-95"
                    >
                      {k === "del" ? <Delete className="size-5" /> : k}
                    </button>
                  ))}
                </div>
                <p className={cn("mt-3 text-right text-[14px] font-bold tnum", t >= total ? "text-[#10b981]" : "text-[#94a3b8]")}>
                  {t >= total ? `Change ${inr(t - total)}` : `Short ${inr(total - t)}`}
                </p>
              </div>
            )}
            {method === "split" && (
              <div className="space-y-3">
                {[
                  ["Cash", Math.round(total * 0.4)],
                  ["UPI", total - Math.round(total * 0.4)],
                ].map(([m, a]) => (
                  <div key={m as string} className="flex items-center justify-between rounded-xl border border-[#e6eaf2] bg-white p-4">
                    <span className="text-[14px] font-semibold">{m as string}</span>
                    <span className="font-bold tnum">{inr(a as number)}</span>
                  </div>
                ))}
                <p className="text-[12.5px] text-[#64748b]">
                  Or split equally: 2 × {inr(Math.ceil(total / 2))} · 3 × {inr(Math.ceil(total / 3))}
                </p>
              </div>
            )}
            <Button
              size="lg"
              className="mt-6 w-full rounded-xl bg-[#4e1d84] text-white hover:bg-[#3d116d]"
              disabled={method === "cash" && t < total}
              onClick={complete}
            >
              Complete Payment
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 items-start gap-6 p-5 md:grid-cols-[1fr_auto]">
          <div className="space-y-3">
            <p className="text-[26px] font-extrabold text-[#0f172a]">
              Paid via {paymentLabel}.
            </p>
            <p className="text-[13.5px] text-[#64748b]">
              KOT sent to kitchen, table status updated, and stock deducted automatically. Invoice {invoiceNumber}.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <Button variant="outline" className="rounded-xl" onClick={printReceipt}>
                <Printer className="size-4" /> Print
              </Button>
              <Button variant="outline" className="rounded-xl" onClick={saveInvoicePdf}>
                <FileDown className="size-4" /> Invoice PDF
              </Button>
              <Button variant="outline" className="rounded-xl" onClick={saveReceiptPdf}>
                <FileDown className="size-4" /> Receipt PDF
              </Button>
              <Button variant="outline" className="rounded-xl" onClick={() => toast.success("Sent on WhatsApp")}>
                <Smartphone className="size-4" /> WhatsApp
              </Button>
              <Button className="rounded-xl bg-[#4e1d84] text-white hover:bg-[#3d116d]" onClick={close}>
                <X className="size-4" /> New Order
              </Button>
            </div>
          </div>
          {snapshot && (
            <div className="perforated mx-auto w-[280px] rounded-xl border border-[#e6eaf2] bg-white px-5 pb-6 pt-7 font-mono text-[11.5px] leading-relaxed text-[#0f172a] shadow-lg">
              <p className="text-center text-xl font-extrabold">{tenantName}</p>
              <p className="text-center text-[10px] text-[#64748b]">
                {tenantCity}
                <br />
                GSTIN {tenantGstin}
              </p>
              <p className="my-2 border-t border-dashed border-[#cbd5e1]" />
              <p className="flex justify-between"><span>INV {invoiceNumber.split("/").at(-1)}</span><span>{shortDateLabel}</span></p>
              <p>{mode}{mode === "Dine-in" ? ` · T${table}` : ""} · Arjun</p>
              {guest && <p className="truncate">Guest: {guest.name} ({guest.phone})</p>}
              <p className="my-2 border-t border-dashed border-[#cbd5e1]" />
              {snapshot.lines.map((l) => (
                <p key={l.id} className="flex justify-between gap-2">
                  <span className="truncate">{l.qty} {l.item.name}</span>
                  <span>{(l.item.price + l.extra) * l.qty}</span>
                </p>
              ))}
              <p className="my-2 border-t border-dashed border-[#cbd5e1]" />
              <p className="flex justify-between"><span>Subtotal</span><span>{snapshot.subtotal}</span></p>
              {snapshot.disc > 0 && <p className="flex justify-between"><span>Discount</span><span>-{snapshot.disc}</span></p>}
              <p className="flex justify-between"><span>CGST 2.5%</span><span>{snapshot.cgst}</span></p>
              <p className="flex justify-between"><span>SGST 2.5%</span><span>{snapshot.cgst}</span></p>
              <p className="mt-1 flex justify-between text-[14px] font-bold"><span>TOTAL</span><span>₹{snapshot.total}</span></p>
              <p className="my-2 border-t border-dashed border-[#cbd5e1]" />
              <p className="text-center text-[10px] text-[#64748b]">Thank you for dining with us.</p>
            </div>
          )}
        </div>
      )}
      </Sheet>
      {printMode === "receipt" && snapshot && (
        <article className="print-document receipt-print-document" data-print-size="receipt">
          <h1>{tenantName}</h1>
          <p className="text-center">{tenantCity}<br />GSTIN {tenantGstin}</p>
          <hr />
          <p className="flex justify-between"><span>{invoiceNumber.replace("INV/", "POS/")}</span><span>{dateLabel}</span></p>
          <p>{mode}{mode === "Dine-in" ? ` · Table ${table}` : ""} · {paymentLabel}</p>
          <p>Guest: {guest?.name ?? (mode === "Dine-in" ? `Table ${table}` : "Counter guest")}</p>
          <hr />
          {snapshot.lines.map((l) => (
            <p key={l.id} className="flex justify-between gap-2">
              <span>{l.qty} × {l.item.name}{l.variant ? ` (${l.variant})` : ""}</span>
              <span>{inr((l.item.price + l.extra) * l.qty)}</span>
            </p>
          ))}
          <hr />
          <p className="flex justify-between"><span>Subtotal</span><span>{inr(snapshot.subtotal)}</span></p>
          {snapshot.disc > 0 && <p className="flex justify-between"><span>Discount</span><span>- {inr(snapshot.disc)}</span></p>}
          <p className="flex justify-between"><span>CGST</span><span>{inr(snapshot.cgst)}</span></p>
          <p className="flex justify-between"><span>SGST</span><span>{inr(snapshot.cgst)}</span></p>
          <p className="flex justify-between font-bold"><span>Total</span><span>{inr(snapshot.total)}</span></p>
          <hr />
          <p className="text-center">Thank you for dining with us.</p>
        </article>
      )}
    </>
  );
}
