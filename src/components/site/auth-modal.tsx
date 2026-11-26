"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, Check, Eye, EyeOff, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { clearPending, takePending, useAuthUI, useStore, type User } from "@/lib/store";
import { cn } from "@/lib/utils";
import { SignButton, Wordmark } from "./sign";

type Method = "phone" | "email";
type Stage = "form" | "otp" | "done";

const DEMO_CODE = "2611";

export function AuthModal() {
  const { open, mode, reason, hide } = useAuthUI();

  const close = () => {
    clearPending();
    hide();
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        clearPending();
        useAuthUI.getState().hide();
      }
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div
          className="site fixed inset-0 z-[90] flex items-end justify-center !bg-transparent sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Sign in to Neela"
        >
          <motion.div
            className="absolute inset-0 bg-[#0b111e]/70 backdrop-blur-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.div
            initial={{ y: 32, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", damping: 30, stiffness: 340 }}
            className="relative grid max-h-[94dvh] w-full max-w-[900px] grid-cols-1 overflow-hidden rounded-t-3xl border border-[#151311]/10 bg-[#faf8f4] shadow-2xl sm:rounded-3xl md:grid-cols-[0.85fr_1.15fr]"
          >
            <Aside reason={reason} />
            <div className="thin-scroll relative min-h-0 overflow-y-auto bg-white">
              <button
                onClick={close}
                aria-label="Close"
                className="absolute right-4 top-4 z-10 grid size-9 place-items-center rounded-full border border-[#151311]/12 bg-white text-[#151311] transition hover:bg-[#0b111e] hover:text-white"
              >
                <X className="size-4" />
              </button>
              <Body key={mode} initialMode={mode} reason={reason} onDone={hide} />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function Aside({ reason }: { reason?: string }) {
  return (
    <>
      {/* Mobile strip */}
      <div className="flex items-center gap-3 bg-[#0b111e] px-5 py-4 pr-16 text-white md:hidden">
        <Wordmark className="text-[24px] text-white" />
        {reason && <p className="text-[13px] text-white/75">Sign in {reason}.</p>}
      </div>
      {/* Desktop panel */}
      <div className="relative hidden flex-col bg-[#0b111e] text-[#faf8f4] md:flex">
        <div className="relative h-56 overflow-hidden">
          <Image src="/img/thalassery-biryani.jpg" alt="" fill sizes="400px" className="object-cover opacity-85" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b111e] via-transparent to-transparent" />
          <span className="absolute left-4 top-4 rounded-full bg-[#0b111e]/80 px-3 py-1 text-[10.5px] font-bold text-[#e5bc6f] backdrop-blur-md">
            Members dine first
          </span>
        </div>
        <div className="flex flex-1 flex-col p-7">
          <Wordmark className="text-[38px] text-white" />
          {reason && <p className="mt-3 text-[13.5px] font-semibold text-[#e5bc6f]">Sign in {reason}</p>}
          <ul className="mt-6 space-y-3.5 text-[14px] text-white/80">
            {[
              "Order home and follow your rider in real time.",
              "Book tables — we remember your preferred room and allergies.",
              "Earn 5% back as Pearl points on every bill.",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3">
                <span className="mt-0.5 grid size-4.5 shrink-0 place-items-center rounded-full bg-[#d9a03e] text-[#0b111e]">
                  <Check className="size-3" strokeWidth={3} />
                </span>
                {t}
              </li>
            ))}
          </ul>
          <p className="mt-auto pt-8 text-[11.5px] text-white/45">
            Demo mode — no real account is created and no SMS is sent.
          </p>
        </div>
      </div>
    </>
  );
}

function Body({ initialMode, onDone }: { initialMode: "signin" | "register"; reason?: string; onDone: () => void }) {
  const signIn = useStore((s) => s.signIn);
  const [mode, setMode] = useState(initialMode);
  const [method, setMethod] = useState<Method>("phone");
  const [stage, setStage] = useState<Stage>("form");
  const [busy, setBusy] = useState(false);
  const [show, setShow] = useState(false);
  const [name, setName] = useState("Ritika Kapoor");
  const [phone, setPhone] = useState("98110 22334");
  const [email, setEmail] = useState("ritika@mail.com");
  const [password, setPassword] = useState("neela-demo");
  const [code, setCode] = useState(["", "", "", ""]);
  const [agree, setAgree] = useState(true);
  const [err, setErr] = useState("");
  const boxes = useRef<(HTMLInputElement | null)[]>([]);

  const wait = (fn: () => void, ms = 900) => {
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      fn();
    }, ms);
  };

  const finish = () => {
    const u: User = {
      name: mode === "register" ? name : "Ritika Kapoor",
      phone: `+91 ${phone}`,
      email,
      since: mode === "register" ? "Nov 2026" : "Mar 2024",
      points: mode === "register" ? 250 : 1840,
    };
    signIn(u);
    setStage("done");
    setTimeout(() => {
      onDone();
      toast.success(mode === "register" ? `Welcome to Neela, ${u.name.split(" ")[0]}` : `Welcome back, ${u.name.split(" ")[0]}`, {
        description: mode === "register" ? "250 welcome points added" : `${u.points.toLocaleString("en-IN")} points in your account`,
      });
      takePending()?.();
    }, 900);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    if (mode === "register") {
      if (name.trim().length < 2) return setErr("Tell us your name.");
      if (phone.replace(/\D/g, "").length !== 10) return setErr("That mobile number needs 10 digits.");
      if (!/^\S+@\S+\.\S+$/.test(email)) return setErr("That email doesn't look right.");
      if (password.length < 6) return setErr("Use at least 6 characters for the password.");
      if (!agree) return setErr("Please accept the terms to continue.");
      return wait(() => setStage("otp"));
    }
    if (method === "phone") {
      if (phone.replace(/\D/g, "").length !== 10) return setErr("That mobile number needs 10 digits.");
      return wait(() => setStage("otp"));
    }
    if (!/^\S+@\S+\.\S+$/.test(email) || password.length < 6) return setErr("Check your email and password.");
    wait(finish, 1000);
  };

  const verify = () => {
    if (code.join("") !== DEMO_CODE) return setErr(`That code isn't right. For the demo, use ${DEMO_CODE}.`);
    setErr("");
    wait(finish, 800);
  };

  const setDigit = (i: number, v: string) => {
    const d = v.replace(/\D/g, "").slice(-1);
    setCode((c) => c.map((x, k) => (k === i ? d : x)));
    if (d && i < 3) boxes.current[i + 1]?.focus();
  };

  if (stage === "done") {
    return (
      <div className="grid min-h-[420px] place-items-center p-8 text-center">
        <div>
          <span className="mx-auto grid size-15 place-items-center rounded-2xl bg-[#2f6b3a] text-white shadow-lg">
            <Check className="size-7" strokeWidth={3} />
          </span>
          <p className="mt-5 text-[30px] font-extrabold tracking-[-0.03em] text-[#0b111e]">You&apos;re in.</p>
          <p className="mt-1 text-[14.5px] text-[#5c564d]">Taking you back to where you were…</p>
        </div>
      </div>
    );
  }

  if (stage === "otp") {
    return (
      <div className="p-6 pt-8 sm:p-10">
        <button
          onClick={() => {
            setStage("form");
            setErr("");
          }}
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#787166] hover:text-[#0b111e]"
        >
          <ArrowLeft className="size-3.5" /> Change number
        </button>
        <h2 className="mt-4 text-[30px] font-extrabold tracking-[-0.035em] text-[#0b111e] sm:text-[36px]">
          Check your phone.
        </h2>
        <p className="mt-2 text-[14.5px] text-[#5c564d]">
          We sent a 4-digit code to <strong className="text-[#0b111e]">+91 {phone}</strong> by SMS and WhatsApp.
        </p>
        <div className="mt-7 flex gap-3">
          {code.map((d, i) => (
            <input
              key={i}
              ref={(el) => {
                boxes.current[i] = el;
              }}
              value={d}
              onChange={(e) => setDigit(i, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Backspace" && !code[i] && i > 0) boxes.current[i - 1]?.focus();
                if (e.key === "Enter") verify();
              }}
              inputMode="numeric"
              autoFocus={i === 0}
              aria-label={`Digit ${i + 1}`}
              className="h-18 w-16 rounded-2xl border border-[#151311]/16 bg-[#faf8f4] text-center text-[30px] font-extrabold text-[#0b111e] outline-none transition focus:border-[#0b111e] focus:bg-white focus:ring-4 focus:ring-[#d9a03e]/20 sm:w-18"
            />
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px]">
          <span className="text-[#5c564d]">
            Demo code:{" "}
            <button
              className="rounded-full bg-[#f6ebd4] px-2.5 py-0.5 font-mono font-bold text-[#8f560b]"
              onClick={() => setCode(DEMO_CODE.split(""))}
            >
              {DEMO_CODE}
            </button>
          </span>
          <button className="font-medium text-[#787166] hover:text-[#0b111e]" onClick={() => toast("Code sent again")}>
            Resend in 0:28
          </button>
        </div>
        {err && <p className="mt-4 rounded-xl bg-[#f5dfd8] px-3.5 py-2.5 text-[13px] font-medium text-[#b84229]">{err}</p>}
        <SignButton tone="red" className="mt-7 w-full" onClick={verify} disabled={busy || code.some((c) => !c)}>
          {busy ? <Loader2 className="size-4 animate-spin" /> : mode === "register" ? "Verify & create account" : "Verify & sign in"}
        </SignButton>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="p-6 pt-8 sm:p-10" noValidate>
      <div className="mr-12 grid grid-cols-2 gap-1 rounded-full bg-[#f3efe6] p-1">
        {(["signin", "register"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              setErr("");
            }}
            className={cn(
              "rounded-full py-2 text-[13px] font-semibold transition",
              mode === m ? "bg-[#0b111e] text-white shadow-sm" : "text-[#5c564d] hover:text-[#0b111e]",
            )}
          >
            {m === "signin" ? "Sign in" : "Create account"}
          </button>
        ))}
      </div>

      <h2 className="mt-7 text-[30px] font-extrabold tracking-[-0.035em] text-[#0b111e] sm:text-[34px]">
        {mode === "signin" ? "Good to see you." : "Pull up a chair."}
      </h2>
      <p className="mt-1.5 text-[14.5px] text-[#5c564d]">
        {mode === "signin"
          ? "Sign in to order, book tables, and collect Pearl points."
          : "One account for online orders, reservations, and member perks."}
      </p>

      {mode === "signin" && (
        <div className="mt-6 flex gap-5 border-b border-[#151311]/10 text-[13.5px]">
          {(["phone", "email"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMethod(m);
                setErr("");
              }}
              className={cn(
                "-mb-px border-b-2 pb-2.5 font-semibold transition",
                method === m ? "border-[#b84229] text-[#0b111e]" : "border-transparent text-[#787166]",
              )}
            >
              {m === "phone" ? "Mobile number" : "Email & password"}
            </button>
          ))}
        </div>
      )}

      <div className="mt-6 grid gap-4">
        {mode === "register" && (
          <Field label="Full name">
            <input className="site-input" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
          </Field>
        )}
        {(mode === "register" || method === "phone") && (
          <Field label="Mobile number">
            <div className="flex">
              <span className="grid h-12 shrink-0 place-items-center rounded-l-xl border border-r-0 border-[#151311]/14 bg-[#f3efe6] px-3.5 text-[14.5px] font-semibold text-[#4a453e]">
                +91
              </span>
              <input
                className="site-input rounded-l-none"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                inputMode="tel"
                autoComplete="tel-national"
              />
            </div>
          </Field>
        )}
        {(mode === "register" || method === "email") && (
          <Field label="Email">
            <input className="site-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </Field>
        )}
        {(mode === "register" || method === "email") && (
          <Field
            label={mode === "register" ? "Choose a password" : "Password"}
            aside={
              mode === "signin" ? (
                <button
                  type="button"
                  className="text-[12px] font-semibold text-[#787166] underline"
                  onClick={() => toast("Reset link sent", { description: email })}
                >
                  Forgot?
                </button>
              ) : undefined
            }
          >
            <div className="relative">
              <input
                className="site-input pr-12"
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === "register" ? "new-password" : "current-password"}
              />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                className="absolute right-0 top-0 grid h-12 w-12 place-items-center text-[#787166]"
                aria-label={show ? "Hide password" : "Show password"}
              >
                {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </Field>
        )}
        {mode === "register" && (
          <label className="flex cursor-pointer items-start gap-3 text-[13px] text-[#5c564d]">
            <button
              type="button"
              role="checkbox"
              aria-checked={agree}
              onClick={() => setAgree((v) => !v)}
              className={cn(
                "mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border",
                agree ? "border-[#0b111e] bg-[#0b111e] text-white" : "border-[#151311]/25 bg-white",
              )}
            >
              {agree && <Check className="size-3.5" strokeWidth={3} />}
            </button>
            <span>I agree to the terms and privacy policy, and I&apos;m happy to get order updates on WhatsApp.</span>
          </label>
        )}
      </div>

      {err && <p className="mt-4 rounded-xl bg-[#f5dfd8] px-3.5 py-2.5 text-[13px] font-medium text-[#b84229]">{err}</p>}

      <SignButton tone="red" type="submit" className="mt-7 w-full" disabled={busy}>
        {busy ? (
          <Loader2 className="size-4 animate-spin" />
        ) : mode === "register" ? (
          "Create account"
        ) : method === "phone" ? (
          "Send verification code"
        ) : (
          "Sign in"
        )}
      </SignButton>

      <p className="mt-5 text-center text-[13.5px] text-[#5c564d]">
        {mode === "signin" ? "New to Neela? " : "Already have an account? "}
        <button
          type="button"
          className="font-bold text-[#0b111e] underline decoration-[#d9a03e] underline-offset-4"
          onClick={() => {
            setMode(mode === "signin" ? "register" : "signin");
            setErr("");
          }}
        >
          {mode === "signin" ? "Create an account" : "Sign in"}
        </button>
      </p>
    </form>
  );
}

function Field({ label, aside, children }: { label: string; aside?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <span className="mb-1.5 flex items-baseline justify-between text-[12.5px] font-semibold text-[#4a453e]">
        {label}
        {aside}
      </span>
      {children}
    </div>
  );
}
