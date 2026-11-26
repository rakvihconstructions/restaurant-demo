import { cn } from "@/lib/utils";

/** Restaurant wordmark. */
export function NeelaMark({ className, light }: { className?: string; light?: boolean }) {
  return (
    <span className={cn("inline-flex items-baseline gap-1.5 select-none", light ? "text-paper" : "text-ink", className)}>
      <span className="font-display text-[1.25em] font-extrabold leading-none tracking-tight">
        Demo Restaurant
      </span>
    </span>
  );
}

/** Mise — platform mark: architectural plate emblem + Manrope wordmark. */
export function MiseMark({ className, light, withWord = true }: { className?: string; light?: boolean; withWord?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 select-none", light ? "text-white" : "text-[#0b111e]", className)}>
      <svg viewBox="0 0 32 32" className="size-8 shrink-0" aria-hidden>
        <rect width="32" height="32" rx="10" fill={light ? "#ffffff" : "#0b111e"} />
        <circle cx="16" cy="16" r="8.5" fill="none" stroke={light ? "#0b111e" : "#faf8f4"} strokeWidth="1.6" />
        <circle cx="21" cy="11" r="3" fill="#d9a03e" />
      </svg>
      {withWord && (
        <span className="font-[var(--font-manrope)] text-[21px] font-extrabold leading-none tracking-[-0.04em]">
          mise<span className="text-[#d9a03e]">.</span>
        </span>
      )}
    </span>
  );
}
