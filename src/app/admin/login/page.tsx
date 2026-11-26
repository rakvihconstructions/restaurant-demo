"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";
import { toast } from "sonner";
import { DEFAULT_SITE_CONTENT, useHydrated, useStore } from "@/lib/store";

const DEMO_EMAIL = "admin@demorestaurant.in";
const DEMO_PASS = "admin123";

export default function AdminLoginPage() {
  const router = useRouter();
  const hydrated = useHydrated();
  const adminAuthed = useStore((s) => s.adminAuthed);
  const adminSignIn = useStore((s) => s.adminSignIn);
  const tenantLogos = useStore((s) => s.tenantLogos);
  const storedContent = useStore((s) => s.siteContent);

  const brandName = (hydrated && storedContent?.name) || DEFAULT_SITE_CONTENT.name;
  const customLogo = hydrated ? tenantLogos["neela"] : undefined;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (hydrated && adminAuthed) {
      router.replace("/admin");
    }
  }, [hydrated, adminAuthed, router]);

  const completeLogin = (label?: string) => {
    setError("");
    adminSignIn();
    toast.success(`Welcome back to ${brandName}`, {
      description: label ?? "Signed in to the Admin & POS Console.",
    });
    router.replace("/admin");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const em = email.trim().toLowerCase();
    const pw = password.trim();
    if (!em || !pw) {
      setError("Please enter your email and password.");
      return;
    }
    if (em !== DEMO_EMAIL || pw !== DEMO_PASS) {
      setError("Invalid credentials. Use the demo credentials below or tap One-Click Demo Login.");
      return;
    }
    completeLogin();
  };

  const handleOneClickDemo = () => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASS);
    completeLogin("Signed in with One-Click Demo Login.");
  };

  return (
    <div className="admin-theme relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-[#f7f8fc] px-4 py-10 text-[#0f172a]">
      {/* Subtle Deep Purple & Amber Ambient Accents matching Public Site */}
      <div className="pointer-events-none absolute -left-24 -top-24 size-96 rounded-full bg-[#4e1d84]/12 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-24 size-96 rounded-full bg-[#f5a623]/14 blur-3xl" />

      <div className="relative w-full max-w-[440px]">
        {/* Brand Header (Matches Public Site Logo & Title) */}
        <div className="mb-6 flex flex-col items-center text-center">
          {customLogo ? (
            <img
              src={customLogo}
              alt={brandName}
              className="size-13 rounded-2xl border border-[#4e1d84]/15 bg-white object-contain p-1.5 shadow-sm"
            />
          ) : (
            <span className="grid size-13 place-items-center rounded-2xl bg-[#4e1d84] text-[#f5a623] shadow-[0_14px_30px_-10px_rgba(78,29,132,0.65)]">
              <UtensilsCrossed className="size-6" strokeWidth={2.2} />
            </span>
          )}
          <h1 className="mt-3.5 text-[24px] font-extrabold uppercase tracking-[-0.03em] text-[#4e1d84]">
            {brandName}
          </h1>
          <p className="mt-0.5 text-[13px] font-semibold text-[#7c6a96]">
            Admin &amp; POS Console · Staff Sign In
          </p>
        </div>

        {/* Main Login Card */}
        <div className="rounded-[24px] border border-[#4e1d84]/12 bg-white p-6 shadow-[0_24px_60px_-24px_rgba(42,10,79,0.16)] sm:p-7">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[18px] font-bold tracking-[-0.02em] text-[#0f172a]">
                Sign in to Admin Panel
              </h2>
              <p className="mt-0.5 text-[12.5px] text-[#64748b]">
                Manage orders, menu, enquiries, and reports.
              </p>
            </div>
            <span className="grid size-9 place-items-center rounded-xl bg-[#f3e8ff] text-[#4e1d84]">
              <ShieldCheck className="size-4.5" />
            </span>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-[12px] font-semibold text-[#334155]">
                Admin Email
              </span>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#94a3b8]" />
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  placeholder={DEMO_EMAIL}
                  className="h-11 w-full rounded-xl border border-[#e2e8f0] bg-[#f8fafc] pl-10 pr-3.5 text-[14px] text-[#0f172a] outline-none transition focus:border-[#4e1d84] focus:bg-white focus:ring-4 focus:ring-[#4e1d84]/10"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-[12px] font-semibold text-[#334155]">
                Password
              </span>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#94a3b8]" />
                <input
                  type={showPass ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter password"
                  className="h-11 w-full rounded-xl border border-[#e2e8f0] bg-[#f8fafc] pl-10 pr-10 text-[14px] text-[#0f172a] outline-none transition focus:border-[#4e1d84] focus:bg-white focus:ring-4 focus:ring-[#4e1d84]/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  aria-label={showPass ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#4e1d84]"
                >
                  {showPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </label>

            {error && (
              <p className="rounded-xl border border-[#fecaca] bg-[#fef2f2] px-3.5 py-2.5 text-[12.5px] font-medium text-[#dc2626]">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#4e1d84] px-5 text-[14px] font-bold text-white shadow-[0_12px_24px_-8px_rgba(78,29,132,0.65)] transition hover:bg-[#3d116d]"
            >
              Sign in <ArrowRight className="size-4 text-[#f5a623]" />
            </button>
          </form>

          {/* Demo Credentials & One-Click Demo Login */}
          <div className="mt-5 rounded-2xl border border-[#4e1d84]/18 bg-[#f3e8ff]/70 p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="inline-flex items-center gap-1.5 text-[11.5px] font-bold uppercase tracking-[0.1em] text-[#4e1d84]">
                <KeyRound className="size-3.5" /> Demo Credentials
              </p>
              <span className="rounded-full bg-white px-2.5 py-0.5 text-[10.5px] font-bold text-[#4e1d84]">
                Admin Access
              </span>
            </div>

            <div className="mt-2.5 space-y-1.5 rounded-xl bg-white/95 px-3 py-2.5 text-[12.5px]">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[#64748b]">Email</span>
                <code className="font-mono font-semibold text-[#0f172a]">{DEMO_EMAIL}</code>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[#64748b]">Password</span>
                <code className="font-mono font-semibold text-[#0f172a]">{DEMO_PASS}</code>
              </div>
            </div>

            <button
              type="button"
              onClick={handleOneClickDemo}
              className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#4e1d84]/25 bg-white text-[13px] font-bold text-[#4e1d84] shadow-2xs transition hover:bg-[#4e1d84] hover:text-white"
            >
              <Sparkles className="size-4 text-[#f5a623]" /> One-Click Demo Login
            </button>
          </div>
        </div>

        {/* Back to Website */}
        <div className="mt-5 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#64748b] transition hover:text-[#4e1d84]"
          >
            <ArrowLeft className="size-3.5" /> Back to {brandName} Website
          </Link>
        </div>
      </div>
    </div>
  );
}
