"use client";

import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { useEffect, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from "react";
import { cn, initials } from "@/lib/utils";
import type { Diet } from "@/lib/menu";

/* ------------------------------- Button -------------------------------- */

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "accent" | "danger" | "outline";
  size?: "sm" | "md" | "lg" | "icon";
};

export function Button({ variant = "primary", size = "md", className, ...props }: BtnProps) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-[background,color,box-shadow,transform] duration-200 active:scale-[0.97] disabled:opacity-45",
        size === "sm" && "h-8 px-3.5 text-[13px]",
        size === "md" && "h-10 px-4.5 text-sm",
        size === "lg" && "h-12 px-6 text-[15px]",
        size === "icon" && "size-9",
        variant === "primary" && "bg-ink text-paper hover:bg-ink-2",
        variant === "secondary" && "bg-paper-2 text-ink hover:bg-paper-3",
        variant === "outline" && "border border-line bg-white text-ink hover:border-ink-3",
        variant === "ghost" && "text-ink-2 hover:bg-paper-2",
        variant === "accent" && "bg-turmeric text-ink hover:bg-turmeric-2",
        variant === "danger" && "bg-chili text-white hover:bg-chili/90",
        className,
      )}
    />
  );
}

/* ------------------------------- Badges -------------------------------- */

const tones = {
  neutral: "bg-paper-2 text-ink-2",
  green: "bg-leaf-soft text-leaf",
  amber: "bg-turmeric-soft text-amber-ink",
  red: "bg-chili-soft text-chili",
  blue: "bg-sky-soft text-sky",
  ink: "bg-ink text-paper",
  outline: "border border-line text-ink-3",
} as const;
export type Tone = keyof typeof tones;

export function Badge({ tone = "neutral", children, className, dot }: { tone?: Tone; children: ReactNode; className?: string; dot?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 text-[11.5px] font-medium leading-5", tones[tone], className)}>
      {dot && <span className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

const statusTone: Record<string, Tone> = {
  new: "blue", accepted: "blue", preparing: "amber", ready: "green", served: "neutral", out: "amber", completed: "green", cancelled: "red",
  confirmed: "green", pending: "amber", seated: "blue", "no-show": "red",
  available: "green", occupied: "amber", reserved: "blue", cleaning: "neutral",
  active: "green", trial: "blue", "past-due": "amber", suspended: "red",
  open: "red", "in-progress": "amber", waiting: "blue", resolved: "green",
  connected: "green", Ordered: "blue", Received: "green", "Partially received": "amber", Invoiced: "neutral", Paid: "green", Returned: "red",
  "on-shift": "green", off: "neutral", leave: "red", break: "amber",
  replied: "green", flagged: "red",
  low: "neutral", medium: "amber", high: "red", urgent: "red", normal: "blue",
};
const statusLabel: Record<string, string> = { out: "Out for delivery", "no-show": "No-show", "on-shift": "On shift", "past-due": "Past due", "in-progress": "In progress" };

export function StatusPill({ status, className }: { status: string; className?: string }) {
  return (
    <Badge tone={statusTone[status] ?? "neutral"} dot className={cn("capitalize", className)}>
      {statusLabel[status] ?? status.replace(/-/g, " ")}
    </Badge>
  );
}

export function DietMark({ diet, className }: { diet: Diet; className?: string }) {
  const color = diet === "veg" ? "border-leaf text-leaf" : diet === "egg" ? "border-turmeric text-turmeric" : "border-chili text-chili";
  return (
    <span title={diet === "veg" ? "Vegetarian" : diet === "egg" ? "Contains egg" : "Non-vegetarian"} className={cn("inline-grid size-3.5 shrink-0 place-items-center rounded-[3px] border-[1.5px] bg-white", color, className)}>
      {diet === "nonveg" ? (
        <span className="h-0 w-0 border-x-[3.5px] border-b-[6px] border-x-transparent border-b-current" />
      ) : (
        <span className="size-1.5 rounded-full bg-current" />
      )}
    </span>
  );
}

/* ------------------------------- Inputs -------------------------------- */

export function Field({ label, hint, children, className }: { label: string; hint?: string; children: ReactNode; className?: string }) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 flex items-baseline justify-between text-[12.5px] font-medium text-ink-2">
        {label}
        {hint && <span className="font-normal text-mute">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "h-10 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink outline-none transition placeholder:text-mute focus:border-ink-3 focus:ring-4 focus:ring-paper-2",
        className,
      )}
    />
  );
}

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "min-h-24 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none transition placeholder:text-mute focus:border-ink-3 focus:ring-4 focus:ring-paper-2",
        className,
      )}
    />
  );
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "h-10 w-full appearance-none rounded-lg border border-line bg-white bg-[length:16px] bg-[right_10px_center] bg-no-repeat pl-3 pr-9 text-sm text-ink outline-none focus:border-ink-3",
        "bg-[url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%235c574c' stroke-width='2'><path d='m6 9 6 6 6-6'/></svg>\")]",
        className,
      )}
    >
      {children}
    </select>
  );
}

export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn("relative inline-flex h-6 w-10.5 shrink-0 items-center rounded-full transition-colors duration-300", checked ? "bg-ink" : "bg-paper-3")}
    >
      <span className={cn("absolute left-0.5 size-5 rounded-full bg-white shadow-sm transition-transform duration-300 ease-out-expo", checked && "translate-x-4.5")} />
    </button>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  className,
  size = "md",
}: {
  options: { value: T; label: ReactNode }[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
  size?: "sm" | "md";
}) {
  return (
    <div className={cn("no-scrollbar inline-flex max-w-full overflow-x-auto rounded-full bg-paper-2 p-1", className)}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={cn(
            "relative shrink-0 whitespace-nowrap rounded-full font-medium transition-colors",
            size === "sm" ? "px-3 py-1 text-[12.5px]" : "px-3.5 py-1.5 text-[13px]",
            value === o.value ? "text-paper" : "text-ink-3 hover:text-ink",
          )}
        >
          {value === o.value && (
            <motion.span layoutId={`seg-${options.map((x) => x.value).join("")}`} className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", bounce: 0.15, duration: 0.45 }} />
          )}
          <span className="relative">{o.label}</span>
        </button>
      ))}
    </div>
  );
}

export function Tabs<T extends string>({ tabs, value, onChange }: { tabs: { value: T; label: string; count?: number }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="no-scrollbar -mx-4 flex gap-6 overflow-x-auto border-b border-line-2 px-4 sm:mx-0 sm:px-0">
      {tabs.map((t) => (
        <button
          key={t.value}
          onClick={() => onChange(t.value)}
          className={cn("relative shrink-0 pb-3 text-[13.5px] font-medium transition-colors", value === t.value ? "text-ink" : "text-mute hover:text-ink-2")}
        >
          {t.label}
          {t.count !== undefined && <span className="ml-1.5 font-mono text-[11px] text-mute">{t.count}</span>}
          {value === t.value && <motion.span layoutId={`tab-${tabs[0].value}`} className="absolute inset-x-0 -bottom-px h-[2px] bg-ink" />}
        </button>
      ))}
    </div>
  );
}

/* ------------------------------- Display ------------------------------- */

export function Avatar({ name, className, tone = 0 }: { name: string; className?: string; tone?: number }) {
  const palettes = ["bg-neela text-paper", "bg-turmeric-soft text-amber-ink", "bg-leaf-soft text-leaf", "bg-chili-soft text-chili", "bg-sky-soft text-sky", "bg-paper-3 text-ink-2"];
  const idx = (tone || [...name].reduce((s, c) => s + c.charCodeAt(0), 0)) % palettes.length;
  return (
    <span className={cn("inline-grid size-8 shrink-0 place-items-center rounded-full text-[11px] font-semibold tracking-wide", palettes[idx], className)}>
      {initials(name)}
    </span>
  );
}

export function Progress({ value, tone = "ink", className }: { value: number; tone?: "ink" | "turmeric" | "chili" | "leaf"; className?: string }) {
  const bg = { ink: "bg-ink", turmeric: "bg-turmeric", chili: "bg-chili", leaf: "bg-leaf" }[tone];
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-paper-2", className)}>
      <div className={cn("h-full rounded-full transition-[width] duration-700 ease-out-expo", bg)} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}

export function Stars({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn("inline-flex gap-0.5 text-turmeric", className)} aria-label={`${value} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 20 20" className={cn("size-3.5", i < Math.round(value) ? "fill-current" : "fill-paper-3")}>
          <path d="M10 1.5l2.6 5.5 6 .7-4.5 4.1 1.2 5.9L10 14.8l-5.3 2.9 1.2-5.9L1.4 7.7l6-.7z" />
        </svg>
      ))}
    </span>
  );
}

export function Kbd({ children }: { children: ReactNode }) {
  return <kbd className="rounded border border-line bg-white px-1.5 py-0.5 font-mono text-[10.5px] text-ink-3">{children}</kbd>;
}

/* ------------------------------- Overlays ------------------------------ */

export function Sheet({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  side = "right",
  width = "max-w-md",
  dark,
  site,
}: {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  side?: "right" | "bottom" | "center";
  width?: string;
  dark?: boolean;
  site?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  const panelAnim =
    side === "right"
      ? { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" } }
      : side === "bottom"
        ? { initial: { y: "100%" }, animate: { y: 0 }, exit: { y: "100%" } }
        : { initial: { opacity: 0, y: 24, scale: 0.98 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 16, scale: 0.98 } };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true">
          <motion.div
            className="absolute inset-0 bg-night/50 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            {...panelAnim}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            className={cn(
              "absolute flex flex-col overflow-hidden shadow-2xl",
              dark ? "bg-night-2 text-paper" : site ? "site !bg-[#faf8f4] text-[#151311]" : "bg-bone text-ink",
              side === "right" && cn("inset-y-0 right-0 w-full", site ? "sm:border-l sm:border-[#151311]/10" : "sm:border-l sm:border-line", width),
              side === "bottom" && cn("inset-x-0 bottom-0 max-h-[92dvh] sm:inset-x-auto sm:left-1/2 sm:w-[min(560px,92vw)] sm:-translate-x-1/2", site ? "rounded-t-3xl border border-[#151311]/10" : "rounded-t-[22px]"),
              side === "center" && cn("inset-x-3 top-1/2 max-h-[90dvh] -translate-y-1/2 rounded-2xl sm:inset-x-auto sm:left-1/2 sm:w-full sm:-translate-x-1/2", width),
            )}
          >
            {side === "bottom" && !site && <div className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-current opacity-15" />}
            {(title || subtitle) && (
              <div className={cn("flex shrink-0 items-start justify-between gap-4 border-b px-5 py-4 sm:px-6", dark ? "border-white/10" : site ? "border-[#151311]/10 bg-white/85 backdrop-blur-md" : "border-line-2")}>
                <div className="min-w-0">
                  {title && <h3 className={site ? "text-[22px] font-extrabold tracking-[-0.03em] text-[#0b111e]" : "font-display text-[22px] leading-tight"}>{title}</h3>}
                  {subtitle && <p className={cn("mt-0.5 text-[13px]", dark ? "text-paper/55" : site ? "text-[#787166]" : "text-mute")}>{subtitle}</p>}
                </div>
                <button onClick={onClose} aria-label="Close" className={cn("-mr-1.5 grid size-9 shrink-0 place-items-center rounded-full transition", site ? "border border-[#151311]/12 bg-white hover:bg-[#0b111e] hover:text-white" : "", dark ? "hover:bg-white/10" : !site && "hover:bg-paper-2")}>
                  <X className="size-4.5" />
                </button>
              </div>
            )}
            <div className="thin-scroll min-h-0 flex-1 overflow-y-auto">{children}</div>
            {footer && <div className={cn("safe-bottom shrink-0 border-t px-5 py-4 sm:px-6", dark ? "border-white/10" : site ? "border-[#151311]/10 bg-white/90 backdrop-blur-md" : "border-line-2")}>{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function Empty({ icon, title, body }: { icon?: ReactNode; title: string; body?: string }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      {icon && <div className="mb-3 grid size-12 place-items-center rounded-full bg-paper-2 text-ink-3">{icon}</div>}
      <p className="font-display text-xl">{title}</p>
      {body && <p className="mt-1 max-w-xs text-sm text-mute">{body}</p>}
    </div>
  );
}
