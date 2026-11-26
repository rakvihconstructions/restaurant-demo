"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowLeft, Check, CreditCard, Loader2, Minus, Plus, ShoppingBag, Smartphone, Wallet } from "lucide-react";
import { DietMark, Sheet } from "@/components/ui";
import { menuById } from "@/lib/menu";
import { cartTotals, lineUnit, requireAuth, useStore, type LiveOrder } from "@/lib/store";
import { cn, inr } from "@/lib/utils";
import { SignButton, SignLink } from "./sign";

type Step = "bag" | "details" | "paying" | "done";

export function CartSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const cart = useStore((s) => s.cart);
  const setQty = useStore((s) => s.setQty);
  const clear = useStore((s) => s.clear);
  const placeOrder = useStore((s) => s.placeOrder);
  const user = useStore((s) => s.user);
  const [step, setStep] = useState<Step>("bag");
  const [mode, setMode] = useState<"Delivery" | "Takeaway">("Delivery");
  const [pay, setPay] = useState<"upi" | "card" | "cod">("upi");
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState(false);
  const [placed, setPlaced] = useState<LiveOrder | null>(null);
  const t = cartTotals(cart);
  const discount = applied ? Math.min(400, Math.round(t.subtotal * 0.15)) : 0;
  const delivery = mode === "Delivery" ? (t.subtotal >= 999 ? 0 : 49) : 0;
  const tax = Math.round((t.subtotal - discount) * 0.05);
  const total = t.subtotal - discount + tax + delivery;

  const close = () => {
    onClose();
    setTimeout(() => {
      if (step === "done") setStep("bag");
    }, 400);
  };

  const submit = () => {
    setStep("paying");
    setTimeout(() => {
      const o = placeOrder({
        source: "Website",
        mode,
        customer: user?.name ?? "Website guest",
        total,
        lines: cart.map((l) => ({
          name: menuById[l.itemId].name,
          qty: l.qty,
          mods: [l.variant?.label, ...l.addons.map((a) => a.label)].filter(Boolean) as string[],
          station: menuById[l.itemId].station,
        })),
      });
      setPlaced(o);
      clear();
      setApplied(false);
      setStep("done");
    }, 1600);
  };

  const titles: Record<Step, string> = {
    bag: "Your Order",
    details: "Checkout",
    paying: "Confirming Payment",
    done: "Order Placed",
  };

  return (
    <Sheet
      open={open}
      onClose={close}
      site
      title={titles[step]}
      subtitle={
        step === "bag"
          ? cart.length
            ? `${t.count} item${t.count > 1 ? "s" : ""} · Indiranagar Kitchen`
            : undefined
          : step === "details"
            ? "Demo payment — nothing is charged"
            : undefined
      }
      footer={
        step === "bag" && cart.length > 0 ? (
          <div className="space-y-3">
            <div className="flex items-baseline justify-between text-[15px]">
              <span className="text-[#5c564d]">Subtotal</span>
              <span className="font-extrabold text-[#0b111e] tnum">{inr(t.subtotal)}</span>
            </div>
            <SignButton tone="red" className="w-full" onClick={() => requireAuth("to place your order", () => setStep("details"))}>
              {user ? "Proceed to checkout" : "Sign in to checkout"}
            </SignButton>
            {!user && (
              <p className="text-center text-[12px] text-[#787166]">
                Sign in so we can track your order and award Pearl points.
              </p>
            )}
          </div>
        ) : step === "details" ? (
          <div className="space-y-3">
            <div className="flex items-baseline justify-between text-[15px]">
              <span className="text-[#5c564d]">Amount payable</span>
              <span className="text-[18px] font-extrabold text-[#0b111e] tnum">{inr(total)}</span>
            </div>
            <div className="flex gap-2.5">
              <button
                onClick={() => setStep("bag")}
                aria-label="Back"
                className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-[#151311]/14 bg-white transition hover:bg-[#f3efe6]"
              >
                <ArrowLeft className="size-4" />
              </button>
              <SignButton tone="red" className="flex-1" onClick={submit}>
                {pay === "cod" ? "Place order" : `Pay ${inr(total)}`}
              </SignButton>
            </div>
          </div>
        ) : undefined
      }
    >
      {step === "bag" &&
        (cart.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#f3efe6] text-[#787166]">
              <ShoppingBag className="size-6" />
            </div>
            <p className="mt-5 text-[22px] font-extrabold tracking-[-0.03em] text-[#0b111e]">Your bag is empty</p>
            <p className="mx-auto mt-2 max-w-xs text-[14.5px] leading-relaxed text-[#5c564d]">
              Nothing in the bag yet. The Malabar prawn moilee is where most guests start.
            </p>
            <SignLink href="/menu" tone="cobalt" small className="mt-6" onClick={close}>
              Explore the menu
            </SignLink>
          </div>
        ) : (
          <ul className="divide-y divide-[#151311]/8 px-5 sm:px-6">
            {cart.map((l) => {
              const item = menuById[l.itemId];
              return (
                <li key={l.key} className="flex gap-3.5 py-4.5">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl bg-[#f3efe6]">
                    {item.image ? (
                      <Image src={item.image} alt="" fill sizes="64px" className="object-cover" />
                    ) : (
                      <span className="grid h-full place-items-center bg-[#0b111e] text-xl font-extrabold text-[#e5bc6f]">
                        {item.name[0]}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start gap-2">
                      <DietMark diet={item.diet} className="mt-1" />
                      <p className="text-[14.5px] font-bold leading-snug text-[#0b111e]">{item.name}</p>
                    </div>
                    {(l.variant || l.addons.length > 0) && (
                      <p className="mt-0.5 truncate pl-5.5 text-[12.5px] text-[#787166]">
                        {[l.variant?.label, ...l.addons.map((a) => a.label)].filter(Boolean).join(" · ")}
                      </p>
                    )}
                    <div className="mt-2.5 flex items-center justify-between">
                      <div className="flex h-8 items-center rounded-full border border-[#151311]/14 bg-white">
                        <button
                          className="grid h-full w-8 place-items-center rounded-l-full hover:bg-[#f3efe6]"
                          onClick={() => setQty(l.key, l.qty - 1)}
                          aria-label="Less"
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="w-6 text-center text-[13.5px] font-bold tnum">{l.qty}</span>
                        <button
                          className="grid h-full w-8 place-items-center rounded-r-full hover:bg-[#f3efe6]"
                          onClick={() => setQty(l.key, l.qty + 1)}
                          aria-label="More"
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                      <span className="text-[14.5px] font-extrabold text-[#0b111e] tnum">{inr(lineUnit(l) * l.qty)}</span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ))}

      {step === "details" && user && (
        <div className="space-y-5 px-5 py-5 sm:px-6">
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#151311]/10 bg-white px-4 py-3.5">
            <div className="min-w-0">
              <p className="wide text-[9.5px] text-[#787166]">Ordering as</p>
              <p className="truncate text-[14.5px] font-bold text-[#0b111e]">
                {user.name} · {user.phone}
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-[#f6ebd4] px-2.5 py-1 text-[11px] font-bold text-[#8f560b]">
              +{Math.round(total * 0.05)} pts
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 rounded-2xl bg-[#f3efe6] p-1">
            {(["Delivery", "Takeaway"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={cn(
                  "rounded-xl px-4 py-2.5 text-left transition",
                  mode === m ? "bg-[#0b111e] text-white shadow-sm" : "text-[#5c564d] hover:text-[#0b111e]",
                )}
              >
                <span className="block text-[14px] font-bold">{m === "Delivery" ? "Delivery" : "Pick up"}</span>
                <span className={cn("block text-[12px]", mode === m ? "text-white/65" : "text-[#787166]")}>
                  {m === "Delivery" ? "About 35 min" : "Ready in 20 min"}
                </span>
              </button>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-[12px] font-semibold text-[#5c564d]">Name</span>
              <input className="site-input" defaultValue={user.name} />
            </label>
            <label className="block">
              <span className="mb-1 block text-[12px] font-semibold text-[#5c564d]">Phone</span>
              <input className="site-input" defaultValue={user.phone.replace("+91 ", "")} inputMode="tel" />
            </label>
            {mode === "Delivery" && (
              <label className="block sm:col-span-2">
                <span className="mb-1 block text-[12px] font-semibold text-[#5c564d]">Delivery address · Free over ₹999</span>
                <input className="site-input" defaultValue="4B Lotus Residency, 100 Ft Road, Indiranagar" />
              </label>
            )}
          </div>

          <div>
            <p className="mb-2 text-[12px] font-semibold text-[#5c564d]">Payment method</p>
            <div className="space-y-2">
              {[
                { id: "upi", label: "UPI", note: "GPay, PhonePe, Paytm", icon: Smartphone },
                { id: "card", label: "Card", note: "Visa, Mastercard, RuPay", icon: CreditCard },
                { id: "cod", label: mode === "Delivery" ? "Cash on delivery" : "Pay at the counter", note: "Keep change handy", icon: Wallet },
              ].map((p) => {
                const selected = pay === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setPay(p.id as typeof pay)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition",
                      selected ? "border-[#0b111e] bg-white ring-1 ring-[#0b111e]" : "border-[#151311]/10 bg-white/70 hover:border-[#151311]/25",
                    )}
                  >
                    <p.icon className="size-4.5 text-[#0b111e]" />
                    <span className="flex-1">
                      <span className="block text-[14.5px] font-bold text-[#0b111e]">{p.label}</span>
                      <span className="block text-[12px] text-[#787166]">{p.note}</span>
                    </span>
                    <span
                      className={cn(
                        "grid size-4.5 place-items-center rounded-full border",
                        selected ? "border-[#0b111e] bg-[#0b111e]" : "border-[#151311]/30",
                      )}
                    >
                      {selected && <span className="size-1.5 rounded-full bg-white" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex gap-2">
              <input
                placeholder="Coupon code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="site-input uppercase"
              />
              <button
                onClick={() => setApplied(code === "TIDE15" || code === "")}
                disabled={applied}
                className="h-12 shrink-0 rounded-xl bg-[#0b111e] px-5 text-[13px] font-bold text-white transition hover:bg-[#192642] disabled:bg-[#2f6b3a]"
              >
                {applied ? <Check className="size-4" /> : "Apply"}
              </button>
            </div>
            {!applied && (
              <p className="mt-1.5 text-[12.5px] text-[#5c564d]">
                Try{" "}
                <button
                  className="font-bold text-[#b84229] underline underline-offset-2"
                  onClick={() => {
                    setCode("TIDE15");
                    setApplied(true);
                  }}
                >
                  TIDE15
                </button>{" "}
                for 15% off this month.
              </p>
            )}
          </div>

          <dl className="space-y-2 border-t border-[#151311]/10 pt-4 text-[14px]">
            <Row k="Items" v={inr(t.subtotal)} />
            {applied && <Row k="TIDE15 (15% off)" v={`− ${inr(discount)}`} accent />}
            <Row k="GST 5% (CGST + SGST)" v={inr(tax)} />
            {mode === "Delivery" && <Row k="Delivery" v={delivery ? inr(delivery) : "Free"} />}
            <div className="flex items-baseline justify-between border-t border-[#151311]/8 pt-2.5 text-[16.5px] font-extrabold text-[#0b111e]">
              <dt>Total</dt>
              <dd className="tnum">{inr(total)}</dd>
            </div>
          </dl>
        </div>
      )}

      {step === "paying" && (
        <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
          <Loader2 className="size-9 animate-spin text-[#d9a03e]" />
          <p className="mt-5 text-[24px] font-extrabold tracking-[-0.03em] text-[#0b111e]">Talking to the bank…</p>
          <p className="mt-1 text-[13.5px] text-[#787166]">Razorpay test mode</p>
        </div>
      )}

      {step === "done" && placed && (
        <div className="px-5 py-8 sm:px-6">
          <div className="overflow-hidden rounded-3xl border border-[#151311]/10 bg-white shadow-lg">
            <div className="flex items-center justify-between bg-[#123c2f] px-5 py-3.5 text-white">
              <span className="wide text-[10.5px] text-[#e5bc6f]">Order {placed.id}</span>
              <Check className="size-5 text-[#e5bc6f]" />
            </div>
            <div className="p-6">
              <p className="text-[28px] font-extrabold tracking-[-0.03em] text-[#0b111e]">The kitchen has it.</p>
              <p className="mt-2 text-[14.5px] leading-relaxed text-[#5c564d]">
                Sent straight to the line at Indiranagar. Open the live kitchen display or track your delivery in real time.
              </p>
            </div>
          </div>
          <div className="mt-5 grid gap-2.5">
            <SignLink href={`/track?id=${placed.id}`} tone="red" className="w-full" onClick={close}>
              Track this order
            </SignLink>
            <SignLink href="/kitchen" tone="cream" className="w-full" onClick={close}>
              Watch on Kitchen Display
            </SignLink>
          </div>
        </div>
      )}
    </Sheet>
  );
}

function Row({ k, v, accent }: { k: string; v: string; accent?: boolean }) {
  return (
    <div className={cn("flex items-baseline justify-between gap-2", accent ? "font-semibold text-[#2f6b3a]" : "text-[#5c564d]")}>
      <dt>{k}</dt>
      <dd className="font-semibold text-[#0b111e] tnum">{v}</dd>
    </div>
  );
}
