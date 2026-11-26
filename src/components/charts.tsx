"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useSyncExternalStore } from "react";
import { inr } from "@/lib/utils";

/** Validated categorical order (dataviz validator: all checks pass, turmeric needs labels → legends carry values). */
export const SERIES = ["#3358a8", "#cf8a1c", "#c4452d", "#2e9170", "#9a63b8"];
const INK = "#15140f";
const GRID = "#ece6da";
const AXIS = "#8a8374";

const noop = () => () => {};

/** Short rupee labels for axes: ₹26L, ₹1.2Cr, ₹80k. */
function axisInr(v: number) {
  const trim = (n: number) => (n >= 10 ? Math.round(n).toString() : n.toFixed(1).replace(/\.0$/, ""));
  if (v >= 1_00_00_000) return `₹${trim(v / 1_00_00_000)}Cr`;
  if (v >= 1_00_000) return `₹${trim(v / 1_00_000)}L`;
  if (v >= 1000) return `₹${trim(v / 1000)}k`;
  return `₹${v}`;
}
function useMounted() {
  return useSyncExternalStore(noop, () => true, () => false);
}

type Fmt = (v: number) => string;

type TipProps = { active?: boolean; payload?: readonly { dataKey?: unknown; name?: unknown; value?: unknown; color?: string }[]; label?: unknown; fmt: Fmt };

function TipBox({ active, payload, label, fmt }: TipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="min-w-36 rounded-lg border border-white/10 bg-night px-3 py-2 text-[12px] text-paper shadow-xl">
      {label !== undefined && label !== null && <p className="mb-1 font-mono text-[10.5px] uppercase tracking-wider text-paper/50">{String(label)}</p>}
      {payload.map((p) => (
        <p key={String(p.dataKey)} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-paper/75">
            <span className="size-2 rounded-full" style={{ background: (p.color as string) || INK }} />
            {String(p.name)}
          </span>
          <span className="font-mono">{fmt(Number(p.value))}</span>
        </p>
      ))}
    </div>
  );
}

const axisProps = {
  tickLine: false,
  axisLine: false,
  tick: { fill: AXIS, fontSize: 11, fontFamily: "var(--font-jetbrains)" },
} as const;

export function RevenueArea({
  data,
  x,
  series,
  height = 260,
  fmt = inr,
}: {
  data: Record<string, string | number>[];
  x: string;
  series: { key: string; name: string; color?: string; dashed?: boolean }[];
  height?: number;
  fmt?: Fmt;
}) {
  const mounted = useMounted();
  return (
    <div style={{ height }} className="w-full">
      {mounted && (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
            <defs>
              {series.map((s) => (
                <linearGradient key={s.key} id={`g-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={s.color ?? INK} stopOpacity={s.dashed ? 0 : 0.16} />
                  <stop offset="100%" stopColor={s.color ?? INK} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid vertical={false} stroke={GRID} />
            <XAxis dataKey={x} {...axisProps} interval="preserveStartEnd" minTickGap={18} />
            <YAxis {...axisProps} width={54} tickFormatter={(v) => axisInr(v)} />
            <Tooltip content={(p) => <TipBox active={p.active} payload={p.payload} label={p.label} fmt={fmt} />} cursor={{ stroke: INK, strokeWidth: 1, strokeDasharray: "3 3" }} />
            {series.map((s) => (
              <Area
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.name}
                stroke={s.color ?? INK}
                strokeWidth={2}
                strokeDasharray={s.dashed ? "4 4" : undefined}
                fill={`url(#g-${s.key})`}
                dot={false}
                activeDot={{ r: 4.5, strokeWidth: 2, stroke: "#fff" }}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export function Bars({
  data,
  x,
  y,
  name,
  height = 240,
  fmt = inr,
  color = INK,
  highlightLast,
  horizontal,
}: {
  data: Record<string, string | number>[];
  x: string;
  y: string;
  name: string;
  height?: number;
  fmt?: Fmt;
  color?: string;
  highlightLast?: boolean;
  horizontal?: boolean;
}) {
  const mounted = useMounted();
  return (
    <div style={{ height }} className="w-full">
      {mounted && (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout={horizontal ? "vertical" : "horizontal"} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barCategoryGap={horizontal ? 6 : "22%"}>
            <CartesianGrid vertical={horizontal} horizontal={!horizontal} stroke={GRID} />
            {horizontal ? (
              <>
                <XAxis type="number" {...axisProps} tickFormatter={(v) => (fmt === inr ? axisInr(v) : fmt(v))} />
                <YAxis type="category" dataKey={x} {...axisProps} width={96} tick={{ fill: "#34312a", fontSize: 12 }} />
              </>
            ) : (
              <>
                <XAxis dataKey={x} {...axisProps} interval="preserveStartEnd" minTickGap={8} />
                <YAxis {...axisProps} width={54} tickFormatter={(v) => (fmt === inr ? axisInr(v) : fmt(v))} />
              </>
            )}
            <Tooltip content={(p) => <TipBox active={p.active} payload={p.payload} label={p.label} fmt={fmt} />} cursor={{ fill: "rgba(21,20,15,.04)" }} />
            <Bar dataKey={y} name={name} radius={horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]} maxBarSize={horizontal ? 18 : 28}>
              {data.map((_, i) => (
                <Cell key={i} fill={highlightLast && i === data.length - 1 ? SERIES[1] : color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export function Lines({
  data,
  x,
  series,
  height = 240,
  fmt = inr,
}: {
  data: Record<string, string | number>[];
  x: string;
  series: { key: string; name: string; color: string }[];
  height?: number;
  fmt?: Fmt;
}) {
  const mounted = useMounted();
  return (
    <div style={{ height }} className="w-full">
      {mounted && (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke={GRID} />
            <XAxis dataKey={x} {...axisProps} />
            <YAxis {...axisProps} width={54} tickFormatter={(v) => (fmt === inr ? axisInr(v) : fmt(v))} />
            <Tooltip content={(p) => <TipBox active={p.active} payload={p.payload} label={p.label} fmt={fmt} />} cursor={{ stroke: INK, strokeDasharray: "3 3" }} />
            {series.map((s) => (
              <Line key={s.key} dataKey={s.key} name={s.name} stroke={s.color} strokeWidth={2} dot={false} activeDot={{ r: 4.5, stroke: "#fff", strokeWidth: 2 }} type="monotone" />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export function Donut({
  data,
  height = 200,
  fmt = (v: number) => `${v}%`,
  center,
}: {
  data: { name: string; value: number }[];
  height?: number;
  fmt?: Fmt;
  center?: { value: string; label: string };
}) {
  const mounted = useMounted();
  return (
    <div className="relative w-full" style={{ height }}>
      {mounted && (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={(p) => <TipBox active={p.active} payload={p.payload} fmt={fmt} />} />
            <Pie data={data} dataKey="value" nameKey="name" innerRadius="70%" outerRadius="96%" paddingAngle={2} stroke="#fff" strokeWidth={2} cornerRadius={4} startAngle={90} endAngle={-270}>
              {data.map((_, i) => (
                <Cell key={i} fill={SERIES[i % SERIES.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      )}
      {center && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
          <div>
            <p className="font-display text-[26px] leading-none">{center.value}</p>
            <p className="mt-1 text-[11px] text-mute">{center.label}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export function Legend({ items, fmt }: { items: { name: string; value: number }[]; fmt?: Fmt }) {
  return (
    <ul className="space-y-2 text-[13px]">
      {items.map((it, i) => (
        <li key={it.name} className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-2 text-ink-2">
            <span className="size-2.5 rounded-[3px]" style={{ background: SERIES[i % SERIES.length] }} />
            {it.name}
          </span>
          <span className="font-mono text-[12.5px]">{fmt ? fmt(it.value) : `${it.value}%`}</span>
        </li>
      ))}
    </ul>
  );
}

export function Spark({ values, color = INK, height = 32 }: { values: number[]; color?: string; height?: number }) {
  const w = 100;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const pts = values.map((v, i) => [(i / (values.length - 1)) * w, height - 2 - ((v - min) / (max - min || 1)) * (height - 4)]);
  const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" className="h-8 w-full" aria-hidden>
      <path d={`${d} L${w} ${height} L0 ${height}Z`} fill={color} opacity={0.07} />
      <path d={d} fill="none" stroke={color} strokeWidth={1.6} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
    </svg>
  );
}
