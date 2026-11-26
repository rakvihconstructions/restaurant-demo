"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  AlertTriangle,
  ArrowLeft,
  Bell,
  BellOff,
  Check,
  CheckCircle2,
  ChefHat,
  Clock,
  Flame,
  Maximize2,
  Sparkles,
  Timer,
} from "lucide-react";
import { toast } from "sonner";
import { orders } from "@/lib/data";
import { useHydrated, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

type Stage = "new" | "preparing" | "ready";
type Ticket = {
  id: string;
  label: string;
  channel: string;
  stage: Stage;
  startedAgo: number;
  createdAt?: number;
  priority?: boolean;
  target: number;
  items: { name: string; qty: number; mods: string[]; station: string; done?: boolean }[];
  note?: string;
  live?: boolean;
};

const stations = ["All", "Curry", "Tandoor", "Grill", "Cold", "Pastry", "Bar"];

const stageOf = (i: number): Stage => (i < 4 ? "new" : i < 8 ? "preparing" : "ready");
const agoOf = [45, 110, 175, 260, 390, 620, 840, 1290, 960, 1150];

const seed: Ticket[] = orders.slice(0, 10).map((o, i) => ({
  id: o.id,
  label: o.table
    ? `Table ${o.table}`
    : o.channel === "Delivery"
      ? `Delivery · ${o.customer.split(" ")[0]}`
      : `${o.channel} · ${o.customer.split(" ")[0]}`,
  channel: o.channel,
  stage: stageOf(i),
  startedAgo: agoOf[i],
  priority: o.priority || i === 5,
  target: Math.min(22, Math.max(...o.lines.map((l) => l.item.prep)) + 4),
  items: o.lines.map((l, k) => ({
    name: l.item.name,
    qty: l.qty,
    mods: k === 0 && i % 3 === 1 ? ["Less spicy"] : [],
    station: l.item.station,
    done: stageOf(i) === "ready" || (stageOf(i) === "preparing" && k === 0),
  })),
  note: i === 6 ? "Cashew allergy — no cashew garnish" : undefined,
}));

export default function Kitchen() {
  const hydrated = useHydrated();
  const liveOrders = useStore((s) => s.liveOrders);
  const advanceLive = useStore((s) => s.advance);
  const tenantLogos = useStore((s) => s.tenantLogos);
  const customLogo = hydrated ? tenantLogos["neela"] : undefined;

  const [tickets, setTickets] = useState<Ticket[]>(seed);
  const [servedCount, setServedCount] = useState(42);
  const [station, setStation] = useState("All");
  const [now, setNow] = useState<number | null>(null);
  const [mountAt] = useState(() => Date.now());
  const [sound, setSound] = useState(true);
  const seen = useRef<Set<string>>(new Set());

  useEffect(() => {
    const first = setTimeout(() => setNow(Date.now()), 0);
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      clearTimeout(first);
      clearInterval(t);
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const fresh = liveOrders.filter((o) => o.status !== "served" && !seen.current.has(o.id));
    if (!fresh.length) return;
    fresh.forEach((o) => seen.current.add(o.id));
    setTickets((ts) => [
      ...fresh.map<Ticket>((o) => ({
        id: o.id,
        label: o.table ? `Table ${o.table}` : `${o.mode} · ${o.source}`,
        channel: o.source === "QR" ? "QR Table" : o.mode,
        stage: o.status === "ready" ? "ready" : o.status === "preparing" ? "preparing" : "new",
        startedAgo: 0,
        createdAt: o.createdAt,
        target: 18,
        live: true,
        items: o.lines.map((l) => ({ ...l, done: false })),
      })),
      ...ts,
    ]);
    toast(`New ${fresh[0].source} order · ${fresh[0].id}`, {
      description: fresh[0].lines.map((l) => `${l.qty}× ${l.name}`).join(", "),
    });
    if (sound) beep();
  }, [hydrated, liveOrders, sound]);

  const elapsed = (t: Ticket) =>
    now === null ? 0 : t.createdAt ? Math.floor((now - t.createdAt) / 1000) : t.startedAgo + Math.floor((now - mountAt) / 1000);

  const visible = useMemo(
    () => tickets.filter((t) => station === "All" || t.items.some((i) => i.station === station)),
    [tickets, station],
  );

  const countForStation = (s: string) =>
    s === "All" ? tickets.length : tickets.filter((t) => t.items.some((i) => i.station === s)).length;

  const bump = (id: string) => {
    setTickets((ts) =>
      ts.flatMap((t) => {
        if (t.id !== id) return [t];
        if (t.live) advanceLive(t.id);
        if (t.stage === "ready") {
          setServedCount((c) => c + 1);
          toast.success(`${t.id} cleared & served`, { description: t.label });
          return [];
        }
        return [
          {
            ...t,
            stage: t.stage === "new" ? "preparing" : "ready",
            items: t.stage === "preparing" ? t.items.map((i) => ({ ...i, done: true })) : t.items,
          },
        ];
      }),
    );
  };

  const toggleItem = (id: string, idx: number) =>
    setTickets((ts) =>
      ts.map((t) =>
        t.id === id ? { ...t, items: t.items.map((it, k) => (k === idx ? { ...it, done: !it.done } : it)) } : t,
      ),
    );

  const late = visible.filter((t) => t.stage !== "ready" && elapsed(t) / 60 > t.target).length;
  const activeQueue = visible.filter((t) => t.stage !== "ready").length;

  const cols: { stage: Stage; title: string; subtitle: string; dot: string; ring: string }[] = [
    { stage: "new", title: "Incoming Orders", subtitle: "Waiting for fire", dot: "bg-[#818cf8]", ring: "border-[#818cf8]/25" },
    { stage: "preparing", title: "On the Line", subtitle: "Cooking now", dot: "bg-[#f5a623]", ring: "border-[#f5a623]/25" },
    { stage: "ready", title: "Ready for Pass", subtitle: "Expedite to table", dot: "bg-[#10b981]", ring: "border-[#10b981]/25" },
  ];

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-[#090710] text-white">
      {/* Premium Glassmorphic KDS Command Header */}
      <header className="relative z-20 border-b border-white/10 bg-[#120d1e]/95 px-4 py-3.5 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:px-6">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="grid size-9 place-items-center rounded-xl border border-white/12 bg-white/6 text-white/75 transition hover:bg-white/15 hover:text-white"
              title="Back to Admin"
            >
              <ArrowLeft className="size-4" />
            </Link>
            <div className="flex items-center gap-2.5">
              <span className="grid size-10 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-[#5b4fe9] to-[#0ea5e9] text-[#f5a623] shadow-[0_0_24px_-4px_rgba(91,79,233,0.7)]">
                {customLogo ? (
                  <img src={customLogo} alt="Demo Restaurant" className="size-full bg-white object-contain p-0.5" />
                ) : (
                  <ChefHat className="size-5" />
                )}
              </span>
              <div>
                <p className="flex items-center gap-2 text-[17px] font-extrabold leading-none tracking-[-0.025em] text-white">
                  Demo Restaurant Display
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#10b981]/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#34d399]">
                    <span className="size-1.5 animate-pulse rounded-full bg-[#34d399]" /> Live
                  </span>
                </p>
                <p className="mt-1 text-[11.5px] font-medium text-white/50">
                  Indiranagar Flagship · Dinner Service · Chef Vikram
                </p>
              </div>
            </div>
          </div>

          {/* KPI Pills */}
          <div className="ml-auto flex flex-wrap items-center gap-2 sm:gap-3">
            <KpiPill label="Active" value={activeQueue} tone="indigo" />
            <KpiPill label="Avg Time" value="13:45" tone="neutral" />
            <KpiPill label="Late" value={late} tone={late > 0 ? "danger" : "neutral"} />
            <KpiPill label="Served" value={servedCount} tone="emerald" />

            <div className="hidden items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-mono text-[15px] font-bold tabular-nums text-white/90 md:flex">
              <Clock className="size-3.5 text-[#f5a623]" />
              {now ? new Date(now).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false }) : "--:--"}
            </div>

            <button
              onClick={() => {
                setSound((s) => !s);
                if (!sound) beep();
              }}
              className={cn(
                "grid size-9 place-items-center rounded-xl border transition",
                sound
                  ? "border-[#f5a623]/35 bg-[#f5a623]/15 text-[#f5a623]"
                  : "border-white/10 bg-white/5 text-white/45 hover:bg-white/10",
              )}
              aria-label="Toggle kitchen chime"
              title={sound ? "Chime enabled" : "Chime muted"}
            >
              {sound ? <Bell className="size-4" /> : <BellOff className="size-4" />}
            </button>
            <button
              onClick={() => document.documentElement.requestFullscreen?.()}
              className="hidden size-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-white/75 transition hover:bg-white/12 sm:grid"
              aria-label="Fullscreen"
              title="Fullscreen KDS"
            >
              <Maximize2 className="size-4" />
            </button>
          </div>
        </div>

        {/* Station Filter Strip */}
        <div className="no-scrollbar mt-3 flex items-center gap-2 overflow-x-auto pb-0.5">
          {stations.map((s) => {
            const cnt = countForStation(s);
            const active = station === s;
            return (
              <button
                key={s}
                onClick={() => setStation(s)}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-[12px] font-bold transition",
                  active
                    ? "border-[#5b4fe9] bg-[#5b4fe9] text-white shadow-[0_6px_18px_-6px_rgba(91,79,233,0.9)]"
                    : "border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10 hover:text-white",
                )}
              >
                <span>{s}</span>
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 font-mono text-[10px] leading-none",
                    active ? "bg-white/20 text-white" : "bg-white/10 text-white/55",
                  )}
                >
                  {cnt}
                </span>
              </button>
            );
          })}
        </div>
      </header>

      {/* 3-Column Luminous Kanban Board */}
      <div className="no-scrollbar flex min-h-0 flex-1 snap-x snap-mandatory gap-4 overflow-x-auto p-4 sm:p-5 lg:grid lg:grid-cols-3 lg:overflow-hidden">
        {cols.map((c) => {
          const list = visible
            .filter((t) => t.stage === c.stage)
            .sort(
              (a, b) =>
                Number(!!b.live && b.stage === "new") - Number(!!a.live && a.stage === "new") ||
                Number(b.priority ?? 0) - Number(a.priority ?? 0) ||
                elapsed(b) - elapsed(a),
            );

          return (
            <section
              key={c.stage}
              className={cn(
                "flex w-[88vw] shrink-0 snap-start flex-col rounded-[24px] border bg-[#120d1e]/65 p-3.5 sm:w-[420px] lg:w-auto lg:min-h-0",
                c.ring,
              )}
            >
              {/* Column Header */}
              <div className="mb-3 flex items-center justify-between px-1.5">
                <div className="flex items-center gap-2.5">
                  <span className={cn("size-2.5 rounded-full shadow-sm", c.dot)} />
                  <div>
                    <p className="text-[14px] font-extrabold leading-none text-white">{c.title}</p>
                    <p className="mt-0.5 text-[11px] font-medium text-white/45">{c.subtitle}</p>
                  </div>
                </div>
                <span className="grid size-7 place-items-center rounded-xl bg-white/10 font-mono text-[12px] font-extrabold text-white">
                  {list.length}
                </span>
              </div>

              {/* Ticket Cards */}
              <div className="thin-scroll min-h-0 flex-1 space-y-3 overflow-y-auto pb-2 pr-0.5 [scrollbar-color:rgba(255,255,255,.15)_transparent]">
                <AnimatePresence initial={false}>
                  {list.map((t) => {
                    const sec = elapsed(t);
                    const min = sec / 60;
                    const pct = Math.min(100, Math.round((min / t.target) * 100));
                    const state =
                      t.stage === "ready" ? "ready" : min > t.target ? "late" : min > t.target * 0.72 ? "warn" : "ok";
                    const doneItems = t.items.filter((i) => i.done).length;

                    return (
                      <motion.article
                        key={t.id}
                        layout
                        initial={{ opacity: 0, y: -14, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 50, scale: 0.96 }}
                        transition={{ type: "spring", damping: 26, stiffness: 320 }}
                        className={cn(
                          "overflow-hidden rounded-[20px] border bg-[#1a1429] text-white shadow-[0_14px_34px_-16px_rgba(0,0,0,0.85)] transition",
                          state === "late"
                            ? "border-[#ef4444]/70 ring-1 ring-[#ef4444]/40"
                            : t.live && t.stage === "new"
                              ? "border-[#f5a623]/70 ring-1 ring-[#f5a623]/40"
                              : "border-white/10",
                        )}
                      >
                        {/* Ticket Header */}
                        <div
                          className={cn(
                            "flex items-center justify-between px-4 py-3",
                            state === "late"
                              ? "bg-gradient-to-r from-[#dc2626] to-[#991b1b] text-white"
                              : state === "warn"
                                ? "bg-gradient-to-r from-[#f5a623] to-[#d97706] text-[#0f172a]"
                                : state === "ready"
                                  ? "bg-gradient-to-r from-[#059669] to-[#047857] text-white"
                                  : "bg-gradient-to-r from-[#2b1f47] to-[#211738] text-white",
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-[16px] font-extrabold leading-none tracking-[-0.02em]">{t.label}</span>
                            {t.priority && (
                              <span className="inline-flex items-center gap-0.5 rounded-full bg-black/25 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white">
                                <Flame className="size-3 text-[#f5a623]" /> Rush
                              </span>
                            )}
                            {t.live && t.stage === "new" && (
                              <span className="inline-flex items-center gap-0.5 rounded-full bg-[#f5a623] px-2 py-0.5 text-[10px] font-extrabold uppercase text-[#0c4a6e]">
                                <Sparkles className="size-2.5" /> New
                              </span>
                            )}
                          </div>
                          <span className={cn("flex items-center gap-1 font-mono text-[14px] font-extrabold tabular-nums", state === "late" && "animate-pulse")}>
                            <Timer className="size-3.5" />
                            {now === null
                              ? "--:--"
                              : `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`}
                          </span>
                        </div>

                        {/* SLA Progress Strip */}
                        <div className="h-1 w-full bg-white/8">
                          <div
                            className={cn(
                              "h-full transition-all duration-700",
                              state === "late"
                                ? "bg-[#ef4444]"
                                : state === "warn"
                                  ? "bg-[#f5a623]"
                                  : state === "ready"
                                    ? "bg-[#10b981]"
                                    : "bg-[#818cf8]",
                            )}
                            style={{ width: `${state === "ready" ? 100 : pct}%` }}
                          />
                        </div>

                        {/* Meta Row */}
                        <div className="flex items-center justify-between border-b border-white/8 px-4 py-2 font-mono text-[11px] text-white/50">
                          <span>
                            {t.id} · {t.channel}
                          </span>
                          <span>
                            {doneItems}/{t.items.length} done · SLA {t.target}m
                          </span>
                        </div>

                        {/* Dish Lines */}
                        <ul className="divide-y divide-white/6 px-4 py-1.5">
                          {t.items.map((it, k) => {
                            const dim = station !== "All" && it.station !== station;
                            return (
                              <li key={k} className={cn("flex items-start gap-3 py-2.5", dim && "opacity-30")}>
                                <button
                                  onClick={() => toggleItem(t.id, k)}
                                  className={cn(
                                    "mt-0.5 grid size-5.5 shrink-0 place-items-center rounded-lg border transition",
                                    it.done
                                      ? "border-[#10b981] bg-[#10b981] text-white"
                                      : "border-white/25 bg-white/5 hover:border-[#f5a623]",
                                  )}
                                  aria-label="Toggle item done"
                                >
                                  {it.done && <Check className="size-3.5" strokeWidth={3} />}
                                </button>
                                <div className="min-w-0 flex-1">
                                  <p className={cn("text-[14px] font-bold leading-snug", it.done ? "text-white/35 line-through" : "text-white")}>
                                    <span className="mr-1.5 inline-block rounded-md bg-white/10 px-1.5 py-0.5 font-mono text-[12px] font-extrabold text-[#f5a623]">
                                      {it.qty}×
                                    </span>
                                    {it.name}
                                  </p>
                                  {it.mods.length > 0 && (
                                    <p className="mt-1 text-[11.5px] font-bold text-[#fda4af]">
                                      ↳ {it.mods.join(" · ")}
                                    </p>
                                  )}
                                </div>
                                <span className="shrink-0 rounded-md border border-white/10 bg-white/6 px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-white/65">
                                  {it.station}
                                </span>
                              </li>
                            );
                          })}
                        </ul>

                        {/* Allergy / Kitchen Note */}
                        {t.note && (
                          <p className="mx-4 mb-3 flex items-center gap-2 rounded-xl border border-[#ef4444]/35 bg-[#ef4444]/15 px-3 py-2 text-[12px] font-bold text-[#fca5a5]">
                            <AlertTriangle className="size-3.5 shrink-0 text-[#ef4444]" />
                            {t.note}
                          </p>
                        )}

                        {/* Tactile Bump Button */}
                        <div className="p-3 pt-1">
                          <button
                            onClick={() => bump(t.id)}
                            className={cn(
                              "flex h-10 w-full items-center justify-center gap-2 rounded-xl text-[12.5px] font-extrabold uppercase tracking-[0.08em] transition active:scale-[0.98]",
                              t.stage === "new"
                                ? "bg-[#5b4fe9] text-white shadow-[0_8px_20px_-8px_rgba(91,79,233,0.9)] hover:bg-[#4b3fd6]"
                                : t.stage === "preparing"
                                  ? "bg-[#f5a623] text-[#0f172a] hover:bg-[#fbbf24]"
                                  : "bg-[#10b981] text-white hover:bg-[#059669]",
                            )}
                          >
                            {t.stage === "new" ? (
                              <>Accept &amp; Fire</>
                            ) : t.stage === "preparing" ? (
                              <>Mark Ready for Pass</>
                            ) : (
                              <>
                                <CheckCircle2 className="size-4" /> Bump · Served
                              </>
                            )}
                          </button>
                        </div>
                      </motion.article>
                    );
                  })}
                </AnimatePresence>

                {list.length === 0 && (
                  <div className="grid place-items-center rounded-2xl border border-dashed border-white/12 py-14 text-center">
                    <CheckCircle2 className="size-7 text-[#10b981]/60" />
                    <p className="mt-2 text-[14px] font-bold text-white/45">Station all clear</p>
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function KpiPill({
  label,
  value,
  tone,
}: {
  label: string;
  value: number | string;
  tone: "indigo" | "danger" | "emerald" | "neutral";
}) {
  return (
    <div
      className={cn(
        "rounded-xl border px-3 py-1.5 text-right",
        tone === "indigo" && "border-[#5b4fe9]/35 bg-[#5b4fe9]/15",
        tone === "danger" && "border-[#ef4444]/40 bg-[#ef4444]/15",
        tone === "emerald" && "border-[#10b981]/35 bg-[#10b981]/15",
        tone === "neutral" && "border-white/10 bg-white/5",
      )}
    >
      <p className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-white/50">{label}</p>
      <p
        className={cn(
          "text-[17px] font-extrabold leading-none tnum",
          tone === "danger" ? "text-[#f87171]" : tone === "emerald" ? "text-[#34d399]" : "text-white",
        )}
      >
        {value}
      </p>
    </div>
  );
}

function beep() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    [0, 0.18].forEach((d) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.frequency.value = 880;
      g.gain.setValueAtTime(0.0001, ctx.currentTime + d);
      g.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + d + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + d + 0.15);
      o.connect(g).connect(ctx.destination);
      o.start(ctx.currentTime + d);
      o.stop(ctx.currentTime + d + 0.16);
    });
  } catch {}
}
