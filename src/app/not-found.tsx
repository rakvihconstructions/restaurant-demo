import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mise hero-mesh-dark grid min-h-dvh place-items-center px-6 text-center text-[#faf8f4]">
      <div>
        <p className="wide text-[#e5bc6f]">404 · Page Not Found</p>
        <p className="mt-4 text-[52px] font-extrabold leading-none tracking-[-0.04em] text-white sm:text-[72px]">
          Off the menu.
        </p>
        <p className="mx-auto mt-4 max-w-sm text-[15.5px] text-white/65">
          The page you&apos;re looking for isn&apos;t being served right now.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-[#d9a03e] px-7 text-[14.5px] font-bold text-[#0b111e] transition hover:bg-[#e5bc6f]"
        >
          <Home className="size-4" /> Back to Home
        </Link>
      </div>
    </div>
  );
}
