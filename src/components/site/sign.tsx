import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

const tones = {
  red: "bg-[#b84229] text-white shadow-[0_10px_28px_-10px_rgba(184,66,41,0.6)] hover:bg-[#9c3620]",
  cobalt: "bg-[#0b111e] text-[#faf8f4] shadow-[0_10px_28px_-10px_rgba(11,17,30,0.5)] hover:bg-[#192642]",
  cream: "bg-white text-[#151311] border border-[#151311]/12 shadow-sm hover:border-[#151311]/25 hover:bg-[#faf8f4]",
  coal: "bg-[#151311] text-[#faf8f4] shadow-[0_10px_28px_-10px_rgba(21,19,17,0.45)] hover:bg-[#2a2622]",
  haldi: "bg-[#d9a03e] text-[#0b111e] shadow-[0_10px_28px_-10px_rgba(217,160,62,0.55)] hover:bg-[#e5b55c]",
  ghost: "bg-transparent text-current border border-current/25 hover:bg-current/10",
} as const;
export type SignTone = keyof typeof tones;

export function SignButton({
  tone = "red",
  small,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { tone?: SignTone; small?: boolean }) {
  return <button {...props} className={cn("sign-btn", small && "sign-btn-sm", tones[tone], className)} />;
}

export function SignLink({
  href,
  tone = "red",
  small,
  className,
  children,
  onClick,
}: {
  href: string;
  tone?: SignTone;
  small?: boolean;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link href={href} onClick={onClick} className={cn("sign-btn", small && "sign-btn-sm", tones[tone], className)}>
      {children}
    </Link>
  );
}

/** The Neela wordmark — architectural Manrope with gold accent dot. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("font-sign inline-flex items-baseline leading-none tracking-[-0.045em]", className)}>
      Neela<span className="text-[#d9a03e]">.</span>
    </span>
  );
}

/** Subtle editorial pill badge. */
export function Stamp({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "wide inline-flex items-center gap-2 rounded-full border border-current/20 bg-current/5 px-3.5 py-1.5 text-center text-[10.5px] leading-tight backdrop-blur-md",
        className,
      )}
    >
      {children}
    </span>
  );
}
