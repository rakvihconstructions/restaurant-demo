"use client";

import { ArrowDownRight, ArrowUpRight, Search } from "lucide-react";
import type { ReactNode } from "react";
import { Spark } from "@/components/charts";
import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:mb-7 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        {eyebrow && <p className="eyebrow text-[#4e1d84]">{eyebrow}</p>}
        <h1 className="mt-1.5 text-[28px] font-extrabold leading-[1.1] tracking-[-0.03em] text-[#0f172a] sm:text-[34px]">
          {title}
        </h1>
        {description && <p className="mt-1.5 max-w-2xl text-[14px] leading-relaxed text-[#64748b]">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

const iconTones = {
  ink: "bg-[#f3e8ff] text-[#4e1d84]",
  chili: "bg-[#fef2f2] text-[#ef4444]",
  leaf: "bg-[#ecfdf5] text-[#10b981]",
  turmeric: "bg-[#fff7ed] text-[#f59e0b]",
} as const;

export function Stat({
  label,
  value,
  delta,
  hint,
  spark,
  tone = "ink",
  icon,
}: {
  label: string;
  value: ReactNode;
  delta?: number;
  hint?: string;
  spark?: number[];
  tone?: "ink" | "chili" | "leaf" | "turmeric";
  icon?: ReactNode;
}) {
  const up = (delta ?? 0) >= 0;
  return (
    <div className="card flex flex-col p-4 sm:p-5">
      <div className="flex items-start gap-3.5">
        {icon && (
          <span className={cn("grid size-11 shrink-0 place-items-center rounded-2xl", iconTones[tone])}>
            {icon}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-[12.5px] font-medium text-[#64748b]">{label}</p>
          <div className="mt-1 flex flex-wrap items-baseline gap-2">
            <p className={cn("text-[24px] font-extrabold leading-none tracking-[-0.03em] text-[#0f172a] sm:text-[26px] tnum", tone === "chili" && "text-[#ef4444]")}>
              {value}
            </p>
            {delta !== undefined && (
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 text-[11.5px] font-bold tnum",
                  up ? "text-[#10b981]" : "text-[#ef4444]",
                )}
              >
                {up ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
                {Math.abs(delta).toFixed(1)}%
              </span>
            )}
          </div>
          {hint && <p className="mt-1 truncate text-[11.5px] text-[#94a3b8]">{hint}</p>}
        </div>
      </div>
      {spark && (
        <div className="-mx-1 mt-3">
          <Spark values={spark} color={tone === "chili" ? "#ef4444" : tone === "leaf" ? "#10b981" : "#4e1d84"} />
        </div>
      )}
    </div>
  );
}

export function Panel({
  title,
  subtitle,
  actions,
  children,
  className,
  flush,
}: {
  title?: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  flush?: boolean;
}) {
  return (
    <section className={cn("card min-w-0 overflow-hidden", className)}>
      {(title || actions) && (
        <div className="flex flex-wrap items-start justify-between gap-3 px-4 pb-1 pt-4 sm:px-5 sm:pt-5">
          <div className="min-w-0">
            {title && <h2 className="text-[17.5px] font-bold tracking-[-0.02em] text-[#0f172a]">{title}</h2>}
            {subtitle && <p className="mt-0.5 text-[12.5px] text-[#94a3b8]">{subtitle}</p>}
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={cn(!flush && "px-4 pb-4 pt-3 sm:px-5 sm:pb-5")}>{children}</div>
    </section>
  );
}

export type Column<T> = {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
  align?: "right" | "left";
  mobile?: "primary" | "secondary" | "hide" | "badge";
};

export function DataTable<T>({
  rows,
  columns,
  onRow,
  rowKey,
  empty,
}: {
  rows: T[];
  columns: Column<T>[];
  onRow?: (row: T) => void;
  rowKey: (row: T) => string;
  empty?: string;
}) {
  const primary = columns.find((c) => c.mobile === "primary") ?? columns[0];
  const secondary = columns.find((c) => c.mobile === "secondary");
  const badge = columns.find((c) => c.mobile === "badge");
  const rest = columns.filter((c) => c !== primary && c !== secondary && c !== badge && c.mobile !== "hide");

  if (!rows.length) return <p className="px-5 py-12 text-center text-sm text-[#94a3b8]">{empty ?? "Nothing to show."}</p>;

  return (
    <>
      <div className="thin-scroll hidden overflow-x-auto md:block">
        <table className="w-full min-w-[720px] text-left text-[13.5px]">
          <thead>
            <tr className="border-y border-[#edf0f7] bg-[#f7f8fc]">
              {columns.map((c) => (
                <th
                  key={c.key}
                  className={cn(
                    "whitespace-nowrap px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[#64748b] first:pl-5 last:pr-5",
                    c.align === "right" && "text-right",
                    c.className,
                  )}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#edf0f7]">
            {rows.map((r) => (
              <tr
                key={rowKey(r)}
                onClick={onRow ? () => onRow(r) : undefined}
                className={cn("transition-colors", onRow && "cursor-pointer hover:bg-[#f7f8fc]")}
              >
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={cn("px-4 py-3.5 align-middle text-[#334155] first:pl-5 last:pr-5", c.align === "right" && "text-right", c.className)}
                  >
                    {c.render(r)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="divide-y divide-[#edf0f7] border-t border-[#edf0f7] md:hidden">
        {rows.map((r) => (
          <li key={rowKey(r)} onClick={onRow ? () => onRow(r) : undefined} className={cn("px-4 py-3.5", onRow && "active:bg-[#f7f8fc]")}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[14px] font-semibold text-[#0f172a]">{primary.render(r)}</div>
                {secondary && <div className="mt-0.5 text-[12.5px] text-[#64748b]">{secondary.render(r)}</div>}
              </div>
              {badge && <div className="shrink-0">{badge.render(r)}</div>}
            </div>
            {rest.length > 0 && (
              <dl className="mt-2.5 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[12.5px]">
                {rest.map((c) => (
                  <div key={c.key} className="flex min-w-0 items-center justify-between gap-2">
                    <dt className="shrink-0 text-[#94a3b8]">{c.header}</dt>
                    <dd className="min-w-0 truncate text-right text-[#334155]">{c.render(r)}</dd>
                  </div>
                ))}
              </dl>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}

export function SearchBox({
  value,
  onChange,
  placeholder = "Search…",
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <label className={cn("flex h-9 min-w-0 items-center gap-2 rounded-xl border border-[#e6eaf2] bg-[#f7f8fc] px-3.5 focus-within:border-[#4e1d84] focus-within:bg-white", className)}>
      <Search className="size-3.5 shrink-0 text-[#94a3b8]" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-[13px] text-[#0f172a] outline-none placeholder:text-[#94a3b8]"
      />
    </label>
  );
}

export function KV({ k, v, mono }: { k: string; v: ReactNode; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 text-[13.5px]">
      <span className="text-[#64748b]">{k}</span>
      <span className={cn("text-right font-medium text-[#0f172a]", mono && "font-mono text-[13px]")}>{v}</span>
    </div>
  );
}

export function Grid({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("grid grid-cols-1 gap-4 sm:gap-5", className)}>{children}</div>;
}
