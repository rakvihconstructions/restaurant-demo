"use client";

import { useState } from "react";
import { BellRing, ChefHat, LayoutGrid, Minus, Plus, Receipt, Search, Send, Store, UtensilsCrossed } from "lucide-react";
import { toast } from "sonner";
import { Avatar, Button, DietMark } from "@/components/ui";
import { tables } from "@/lib/data";
import { categories, menu } from "@/lib/menu";
import { useHydrated, useStore } from "@/lib/store";
import { cn, inr } from "@/lib/utils";

type Tab = "tables" | "order" | "alerts";

const alerts0 = [
  { id: 1, t: "07", kind: "bill", text: "Requested the bill", ago: "1m" },
  { id: 2, t: "11", kind: "call", text: "Calling for a waiter", ago: "3m" },
  { id: 3, t: "13", kind: "ready", text: "Prawn Moilee × 2 ready at the pass", ago: "now" },
  { id: 4, t: "V7", kind: "ready", text: "Kokum Collins × 2 ready at the bar", ago: "2m" },
];

export default function Waiter() {
  const [tab, setTab] = useState<Tab>("tables");
  const [active, setActive] = useState("07");
  const [cat, setCat] = useState("small-plates");
  const [q, setQ] = useState("");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [alerts, setAlerts] = useState(alerts0);
  const hydrated = useHydrated();
  const placeOrder = useStore((s) => s.placeOrder);
  const activeTenant = useStore((s) => s.activeTenant);
  const tenantLogos = useStore((s) => s.tenantLogos);
  const tenantName = hydrated ? activeTenant.name : "Demo Restaurant";
  const customLogo = hydrated ? tenantLogos[activeTenant.slug] : undefined;
  const mine = tables.filter((t) => t.waiter === "Rahul" || ["02", "09", "12"].includes(t.label));
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const total = Object.entries(cart).reduce((s, [id, n]) => s + (menu.find((m) => m.id === id)?.price ?? 0) * n, 0);

  const send = () => {
    const o = placeOrder({
      source: "POS",
      table: active,
      mode: "Dine-in",
      customer: `Table ${active}`,
      total: Math.round(total * 1.05),
      lines: Object.entries(cart).map(([id, qty]) => {
        const m = menu.find((x) => x.id === id)!;
        return { name: m.name, qty, mods: [], station: m.station };
      }),
    });
    setCart({});
    toast.success(`KOT sent for Table ${active}`, { description: `${o.id} · ${count} items` });
    setTab("tables");
  };

  return (
    <div className="admin-theme min-h-dvh bg-[#edf0f7] sm:py-6">
      <div className="relative mx-auto min-h-dvh max-w-[480px] bg-[#f7f8fc] pb-24 sm:min-h-[calc(100dvh-48px)] sm:overflow-hidden sm:rounded-[30px] sm:border sm:border-[#e6eaf2] sm:shadow-2xl">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#edf0f7] bg-white px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center overflow-hidden rounded-xl bg-[#5b4fe9] text-white shadow-sm">
              {customLogo ? (
                <img src={customLogo} alt={tenantName} className="size-full bg-white object-contain p-0.5" />
              ) : (
                <Store className="size-4.5" />
              )}
            </span>
            <div>
              <p className="text-[14px] font-bold leading-tight text-[#0f172a]">Rahul Shetty · {tenantName}</p>
              <p className="text-[11.5px] text-[#64748b]">Captain · Dining Room · 17:00–23:30</p>
            </div>
          </div>
          <Avatar name="Rahul Shetty" tone={0} className="bg-[#f1f0ff] text-[#5b4fe9]" />
        </header>

        {tab === "tables" && (
          <div className="p-4">
            <div className="grid grid-cols-3 gap-2.5 text-center">
              {[
                ["My tables", mine.length],
                ["Guests", mine.reduce((s, t) => s + (t.guests ?? 0), 0)],
                ["Tips today", "₹1,240"],
              ].map(([k, v]) => (
                <div key={k as string} className="rounded-2xl border border-[#eceff6] bg-white p-3.5 shadow-2xs">
                  <p className="text-[22px] font-extrabold leading-none text-[#0f172a] tnum">{v}</p>
                  <p className="mt-1 text-[11px] font-medium text-[#64748b]">{k}</p>
                </div>
              ))}
            </div>

            <p className="mb-2.5 mt-6 text-[11px] font-bold uppercase tracking-wider text-[#94a3b8]">My Section</p>
            <div className="grid grid-cols-2 gap-3">
              {mine.map((t) => {
                const alert = alerts.find((a) => a.t === t.label);
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setActive(t.label);
                      setTab("order");
                    }}
                    className={cn(
                      "relative rounded-2xl p-4 text-left transition active:scale-[0.98]",
                      t.status === "occupied"
                        ? "bg-[#5b4fe9] text-white shadow-[0_10px_24px_-8px_rgba(91,79,233,0.65)]"
                        : "border border-[#eceff6] bg-white text-[#0f172a]",
                    )}
                  >
                    {alert && (
                      <span
                        className={cn(
                          "absolute right-3 top-3 size-2.5 animate-pulse rounded-full",
                          alert.kind === "ready" ? "bg-[#10b981]" : "bg-[#f59e0b]",
                        )}
                      />
                    )}
                    <p className="text-[28px] font-extrabold leading-none tnum">{t.label}</p>
                    <p className={cn("mt-2 text-[12px]", t.status === "occupied" ? "text-white/75" : "text-[#64748b]")}>
                      {t.status === "occupied"
                        ? `${t.guests} guests · ${t.since}m · ${inr(t.bill ?? 0)}`
                        : t.status === "available"
                          ? `Free · ${t.seats} seats`
                          : t.status}
                    </p>
                    {alert && (
                      <p className={cn("mt-2 text-[11.5px] font-semibold", t.status === "occupied" ? "text-[#fde68a]" : "text-[#5b4fe9]")}>
                        {alert.text}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {tab === "order" && (
          <div>
            <div className="sticky top-[61px] z-20 space-y-3 border-b border-[#edf0f7] bg-white px-4 pb-3 pt-4">
              <div className="flex items-center justify-between">
                <p className="text-[22px] font-extrabold tracking-[-0.03em] text-[#0f172a]">Table {active}</p>
                <select
                  value={active}
                  onChange={(e) => setActive(e.target.value)}
                  className="rounded-xl border border-[#e6eaf2] bg-[#f7f8fc] px-3 py-1.5 text-[13px] font-semibold text-[#0f172a]"
                >
                  {mine.map((t) => (
                    <option key={t.id}>{t.label}</option>
                  ))}
                </select>
              </div>
              <label className="flex h-10 items-center gap-2 rounded-xl border border-[#e6eaf2] bg-[#f7f8fc] px-3.5 focus-within:border-[#5b4fe9] focus-within:bg-white">
                <Search className="size-4 text-[#94a3b8]" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Quick search dishes…"
                  className="min-w-0 flex-1 bg-transparent text-[13.5px] text-[#0f172a] outline-none placeholder:text-[#94a3b8]"
                />
              </label>
              <div className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCat(c.id)}
                    className={cn(
                      "shrink-0 rounded-xl px-3.5 py-1.5 text-[12.5px] font-semibold transition",
                      cat === c.id ? "bg-[#f1f0ff] text-[#5b4fe9]" : "text-[#64748b] hover:bg-[#f7f8fc]",
                    )}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            <ul className="divide-y divide-[#edf0f7] px-4">
              {menu
                .filter((m) => (q ? m.name.toLowerCase().includes(q.toLowerCase()) : m.category === cat))
                .map((m) => {
                  const n = cart[m.id] ?? 0;
                  return (
                    <li key={m.id} className="flex items-center gap-3 py-3.5">
                      <DietMark diet={m.diet} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[14px] font-bold text-[#0f172a]">{m.name}</p>
                        <p className="text-[12px] font-medium text-[#64748b]">
                          {inr(m.price)} · {m.station}
                        </p>
                      </div>
                      {n === 0 ? (
                        <button
                          onClick={() => setCart((c) => ({ ...c, [m.id]: 1 }))}
                          className="grid size-8.5 place-items-center rounded-full bg-[#f1f0ff] text-[#5b4fe9] transition hover:bg-[#5b4fe9] hover:text-white"
                          aria-label="Add"
                        >
                          <Plus className="size-4" />
                        </button>
                      ) : (
                        <div className="flex items-center rounded-full bg-[#5b4fe9] text-white">
                          <button
                            onClick={() =>
                              setCart((c) => {
                                const x = { ...c };
                                if (n <= 1) delete x[m.id];
                                else x[m.id] = n - 1;
                                return x;
                              })
                            }
                            className="grid size-8 place-items-center"
                            aria-label="Less"
                          >
                            <Minus className="size-3.5" />
                          </button>
                          <span className="w-4 text-center text-[12.5px] font-bold tnum">{n}</span>
                          <button
                            onClick={() => setCart((c) => ({ ...c, [m.id]: n + 1 }))}
                            className="grid size-8 place-items-center"
                            aria-label="More"
                          >
                            <Plus className="size-3.5" />
                          </button>
                        </div>
                      )}
                    </li>
                  );
                })}
            </ul>

            {count > 0 && (
              <div className="fixed inset-x-3 bottom-[76px] z-30 mx-auto max-w-[456px] sm:absolute">
                <Button
                  size="lg"
                  className="h-13 w-full justify-between rounded-2xl bg-[#5b4fe9] text-white shadow-xl hover:bg-[#4b3fd6]"
                  onClick={send}
                >
                  <span className="flex items-center gap-2 font-bold">
                    <Send className="size-4" /> Send {count} to kitchen
                  </span>
                  <span className="font-extrabold tnum">{inr(total)}</span>
                </Button>
              </div>
            )}
          </div>
        )}

        {tab === "alerts" && (
          <div className="space-y-2.5 p-4">
            {alerts.map((a) => (
              <div key={a.id} className="flex items-center gap-3 rounded-2xl border border-[#eceff6] bg-white p-4 shadow-2xs">
                <span
                  className={cn(
                    "grid size-10 shrink-0 place-items-center rounded-xl",
                    a.kind === "ready"
                      ? "bg-[#ecfdf5] text-[#10b981]"
                      : a.kind === "bill"
                        ? "bg-[#fff7ed] text-[#f59e0b]"
                        : "bg-[#f1f0ff] text-[#5b4fe9]",
                  )}
                >
                  {a.kind === "ready" ? <ChefHat className="size-5" /> : a.kind === "bill" ? <Receipt className="size-5" /> : <BellRing className="size-5" />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-bold text-[#0f172a]">Table {a.t}</p>
                  <p className="text-[12.5px] text-[#64748b]">
                    {a.text} · {a.ago}
                  </p>
                </div>
                <Button
                  size="sm"
                  className="rounded-xl bg-[#5b4fe9] text-white hover:bg-[#4b3fd6]"
                  onClick={() => {
                    setAlerts((x) => x.filter((y) => y.id !== a.id));
                    toast.success(a.kind === "ready" ? "Marked served" : "Done");
                  }}
                >
                  {a.kind === "ready" ? "Serve" : "On it"}
                </Button>
              </div>
            ))}
            {alerts.length === 0 && <p className="py-16 text-center text-[16px] font-semibold text-[#94a3b8]">All caught up.</p>}
          </div>
        )}

        <nav className="safe-bottom fixed inset-x-0 bottom-0 z-30 mx-auto grid max-w-[480px] grid-cols-3 border-t border-[#edf0f7] bg-white/95 backdrop-blur-xl sm:absolute">
          {([
            ["tables", "Tables", LayoutGrid],
            ["order", "Take Order", UtensilsCrossed],
            ["alerts", "Alerts", BellRing],
          ] as const).map(([k, l, I]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={cn(
                "relative flex flex-col items-center gap-1 py-2.5 text-[11px] font-bold transition",
                tab === k ? "text-[#5b4fe9]" : "text-[#94a3b8]",
              )}
            >
              <I className="size-5" strokeWidth={tab === k ? 2.2 : 1.7} />
              {l}
              {k === "alerts" && alerts.length > 0 && (
                <span className="absolute left-1/2 top-1.5 ml-2 grid size-4 place-items-center rounded-full bg-[#ef4444] text-[9px] font-bold text-white">
                  {alerts.length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
