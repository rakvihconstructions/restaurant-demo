"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  AlertTriangle,
  ArrowUpRight,
  Download,
  ExternalLink,
  Plus,
  ShoppingBag,
  ShoppingCart,
  Users,
  Wallet,
} from "lucide-react";
import { Bars, Donut, Legend, RevenueArea } from "@/components/charts";
import { Panel, Stat } from "@/components/admin/kit";
import { Badge, Button, Progress, Segmented, StatusPill } from "@/components/ui";
import { channelMix, daily30, hourlyToday, inventory, monthly, orders, tables } from "@/lib/data";
import { menu } from "@/lib/menu";
import { cn, compactInr, inr, num } from "@/lib/utils";

export default function Dashboard() {
  const [range, setRange] = useState<"today" | "30d" | "12m">("today");
  const occupied = tables.filter((t) => t.status === "occupied").length;
  const pending = orders.filter((o) => ["new", "accepted", "preparing"].includes(o.status)).length;
  const completed = orders.filter((o) => o.status === "completed" || o.status === "served").length;
  const cancelled = orders.filter((o) => o.status === "cancelled").length;
  const low = inventory.filter((i) => i.stock < i.min);

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow flex flex-wrap items-center gap-2 text-[#5b4fe9]">
            <span className="size-2 rounded-full bg-[#10b981]" />
            Demo Restaurant · Indiranagar, Bengaluru · Dinner Service
          </p>
          <h1 className="mt-1.5 text-[28px] font-extrabold leading-[1.1] tracking-[-0.03em] text-[#0f172a] sm:text-[36px]">
            Good evening, Ananya
          </h1>
          <p className="mt-1.5 max-w-xl text-[14px] text-[#64748b]">
            Service is running <span className="font-semibold text-[#0f172a]">14.6% ahead</span> of last Thursday across dining room, verandah, and bar.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Link href="/" target="_blank">
            <Button variant="outline" size="md" className="rounded-xl border-[#e6eaf2] bg-white text-[#334155]">
              <ExternalLink className="size-4" /> View Website
            </Button>
          </Link>
          <Button variant="outline" size="md" className="rounded-xl border-[#e6eaf2] bg-white text-[#334155]">
            <Download className="size-4" /> Export
          </Button>
          <Link href="/pos">
            <Button className="rounded-xl bg-[#5b4fe9] text-white shadow-[0_8px_20px_-6px_rgba(91,79,233,0.65)] hover:bg-[#4b3fd6]">
              <Plus className="size-4" /> New Order
            </Button>
          </Link>
        </div>
      </div>

      {/* Headline KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          label="Today's Sales"
          value={inr(286420)}
          delta={14.6}
          hint="vs last Thursday"
          tone="ink"
          icon={<ShoppingBag className="size-5" />}
        />
        <Stat
          label="Total Orders"
          value={num(166)}
          delta={9.2}
          hint="POS, QR & Takeaway"
          tone="ink"
          icon={<ShoppingCart className="size-5" />}
        />
        <Stat
          label="Guests Served"
          value={num(214)}
          delta={5.4}
          hint="4 dining rooms"
          tone="ink"
          icon={<Users className="size-5" />}
        />
        <Stat
          label="Average Order Value"
          value={inr(1725)}
          delta={4.8}
          hint="Indiranagar flagship"
          tone="leaf"
          icon={<Wallet className="size-5" />}
        />
      </div>

      {/* Crisp White Service Status Bar */}
      <div className="card mt-4 grid grid-cols-2 overflow-hidden sm:mt-5 md:grid-cols-5">
        {[
          { k: "Pending KOTs", v: pending, note: "in kitchen now", tone: "text-[#f59e0b]" },
          { k: "Completed", v: completed, note: "served or closed", tone: "text-[#10b981]" },
          { k: "Cancelled", v: cancelled, note: "1 refund pending", tone: "text-[#ef4444]" },
          { k: "Active Tables", v: `${occupied}/${tables.length}`, note: "3 cleaning", tone: "text-[#5b4fe9]" },
          { k: "Reservations", v: "18", note: "tonight · 74 covers", tone: "text-[#0f172a]" },
        ].map((s, i) => (
          <div
            key={s.k}
            className={cn(
              "border-[#edf0f7] p-4 sm:p-5",
              i % 2 === 0 && "border-r md:border-r",
              i < 4 && "md:border-r",
              i < 4 && "border-b md:border-b-0",
              i === 4 && "col-span-2 md:col-span-1",
            )}
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#94a3b8]">{s.k}</p>
            <p className={cn("mt-2 text-[26px] font-extrabold leading-none tnum", s.tone)}>{s.v}</p>
            <p className="mt-1.5 text-[12px] text-[#64748b]">{s.note}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:mt-5 sm:gap-5 xl:grid-cols-12">
        <Panel
          className="xl:col-span-8"
          title="Revenue Overview"
          subtitle={range === "today" ? "Hourly · Demo Restaurant · Indiranagar" : range === "30d" ? "Daily, last 30 days" : "Monthly, last 12 months"}
          actions={
            <Segmented
              size="sm"
              value={range}
              onChange={setRange}
              options={[
                { value: "today", label: "Today" },
                { value: "30d", label: "30 days" },
                { value: "12m", label: "12 months" },
              ]}
            />
          }
        >
          {range === "today" && (
            <>
              <div className="mb-2 flex flex-wrap gap-4 text-[12px] text-[#64748b]">
                <span className="flex items-center gap-1.5">
                  <span className="h-0.5 w-4 rounded bg-[#5b4fe9]" /> Today · {inr(286420)}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-0.5 w-4 border-t-2 border-dashed border-[#94a3b8]" /> Last Thursday · {inr(249180)}
                </span>
              </div>
              <RevenueArea
                data={hourlyToday.map((h) => ({
                  h: `${h.h}:00`,
                  today: h.today,
                  lastWeek: h.lastWeek,
                }))}
                x="h"
                series={[
                  { key: "lastWeek", name: "Last Thu", color: "#94a3b8", dashed: true },
                  { key: "today", name: "Today", color: "#5b4fe9" },
                ]}
              />
            </>
          )}
          {range === "30d" && (
            <RevenueArea data={daily30} x="date" series={[{ key: "revenue", name: "Revenue", color: "#5b4fe9" }]} />
          )}
          {range === "12m" && (
            <Bars data={monthly} x="m" y="revenue" name="Revenue" highlightLast height={260} />
          )}
        </Panel>

        <Panel className="xl:col-span-4" title="Sales by Channel" subtitle="Today, share of revenue">
          <div className="grid grid-cols-1 items-center gap-6 sm:grid-cols-2 xl:grid-cols-1">
            <Donut data={channelMix} height={190} center={{ value: compactInr(286420), label: "5 channels" }} />
            <Legend items={channelMix} />
          </div>
        </Panel>

        <LiveOrders />

        <Panel
          className="xl:col-span-5"
          title="Top Dishes · Demo Restaurant"
          subtitle="Units this month"
          actions={
            <Link href="/admin/menu" className="text-[12.5px] font-semibold text-[#5b4fe9] hover:underline">
              Edit menu →
            </Link>
          }
        >
          <ol className="space-y-3.5">
            {menu.slice(0, 6).map((d, i) => (
              <li key={d.id} className="flex items-center gap-3">
                <span className="w-5 font-mono text-[11px] font-bold text-[#94a3b8]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="truncate text-[13.5px] font-semibold text-[#0f172a]">{d.name}</p>
                    <p className="shrink-0 font-mono text-[12px] font-semibold text-[#64748b]">{248 - i * 29}</p>
                  </div>
                  <Progress className="mt-1.5" value={100 - i * 13} tone={i === 0 ? "turmeric" : "ink"} />
                </div>
              </li>
            ))}
          </ol>
        </Panel>

        <Panel
          className="xl:col-span-6"
          title="Low Stock Alerts"
          subtitle={`${low.length} ingredients below minimum`}
          actions={
            <Link href="/admin/inventory">
              <Button size="sm" variant="outline" className="rounded-xl">
                Reorder
              </Button>
            </Link>
          }
        >
          <ul className="divide-y divide-[#edf0f7]">
            {low.map((i) => (
              <li key={i.id} className="flex items-center gap-3 py-2.5">
                <AlertTriangle className={cn("size-4 shrink-0", i.stock / i.min < 0.6 ? "text-[#ef4444]" : "text-[#f59e0b]")} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-semibold text-[#0f172a]">{i.name}</p>
                  <p className="text-[11.5px] text-[#94a3b8]">{i.supplier}</p>
                </div>
                <p className="shrink-0 font-mono text-[12.5px] font-semibold">
                  <span className={i.stock / i.min < 0.6 ? "text-[#ef4444]" : "text-[#0f172a]"}>{i.stock}</span>
                  <span className="text-[#94a3b8]"> / {i.min} {i.unit}</span>
                </p>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel
          className="xl:col-span-6"
          title="Recent Transactions"
          actions={
            <Link href="/admin/payments" className="text-[12.5px] font-semibold text-[#5b4fe9] hover:underline">
              All →
            </Link>
          }
        >
          <ul className="divide-y divide-[#edf0f7]">
            {orders
              .filter((o) => o.payment !== "Unpaid")
              .slice(0, 6)
              .map((o) => (
                <li key={o.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-[13.5px] font-semibold text-[#0f172a]">{o.customer}</p>
                    <p className="font-mono text-[11px] text-[#94a3b8]">
                      {o.id} · {o.time} · {o.payment}
                    </p>
                  </div>
                  <p className="shrink-0 font-mono text-[13px] font-bold text-[#0f172a]">{inr(o.total)}</p>
                </li>
              ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}

function LiveOrders() {
  const [feed, setFeed] = useState(() => orders.slice(0, 7));
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => {
      setTick((k) => k + 1);
      setFeed((f) => {
        const next = orders[(7 + tick) % orders.length];
        return [{ ...next, id: `ORD-${24817 + tick}`, status: "new" as const, minutesAgo: 0, time: "now" }, ...f].slice(0, 7);
      });
    }, 7000);
    return () => clearInterval(t);
  }, [tick]);

  return (
    <Panel
      className="xl:col-span-7"
      title={
        <span className="flex items-center gap-2">
          Live Orders <Badge tone="red" dot className="animate-pulse">Live</Badge>
        </span>
      }
      subtitle="Demo Restaurant · All channels"
      actions={
        <Link href="/admin/orders" className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-[#5b4fe9] hover:underline">
          Order board <ArrowUpRight className="size-3.5" />
        </Link>
      }
      flush
    >
      <ul className="divide-y divide-[#edf0f7] border-t border-[#edf0f7]">
        <AnimatePresence initial={false}>
          {feed.map((o) => (
            <motion.li
              key={o.id}
              layout
              initial={{ opacity: 0, backgroundColor: "#f1f0ff" }}
              animate={{ opacity: 1, backgroundColor: "rgba(255,255,255,0)" }}
              transition={{ duration: 1.2 }}
              className="flex items-center gap-3 px-4 py-3 sm:px-5"
            >
              <span className="hidden w-16 shrink-0 font-mono text-[11.5px] text-[#94a3b8] sm:block">{o.time}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13.5px] font-medium text-[#0f172a]">
                  <span className="font-mono text-[12px] text-[#64748b]">{o.id}</span> · {o.lines.map((l) => l.item.name).join(", ")}
                </p>
                <p className="text-[12px] text-[#94a3b8]">
                  {o.channel}
                  {o.table ? ` · Table ${o.table}` : ""} · {o.customer}
                </p>
              </div>
              <StatusPill status={o.status} className="hidden sm:inline-flex" />
              <span className="w-20 shrink-0 text-right font-mono text-[13px] font-bold text-[#0f172a]">{inr(o.total)}</span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </Panel>
  );
}
