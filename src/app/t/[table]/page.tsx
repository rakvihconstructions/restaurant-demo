"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { BellRing, ChefHat, ClipboardList, Minus, Plus, Receipt, Sparkles, UtensilsCrossed } from "lucide-react";
import { toast } from "sonner";
import { MenuBrowser } from "@/components/site/menu-browser";
import { DietMark, Sheet } from "@/components/ui";
import { menuById } from "@/lib/menu";
import { cartTotals, lineUnit, useHydrated, useStore } from "@/lib/store";
import { cn, inr } from "@/lib/utils";

type Tab = "menu" | "orders" | "service";

export default function QrTable() {
  const { table } = useParams<{ table: string }>();
  const [tab, setTab] = useState<Tab>("menu");
  const [cartOpen, setCartOpen] = useState(false);
  const hydrated = useHydrated();
  const cart = useStore((s) => s.cart);
  const setQty = useStore((s) => s.setQty);
  const clear = useStore((s) => s.clear);
  const placeOrder = useStore((s) => s.placeOrder);
  const liveOrders = useStore((s) => s.liveOrders);
  const tenantLogos = useStore((s) => s.tenantLogos);
  const customLogo = hydrated ? tenantLogos["neela"] : undefined;
  const mine = hydrated ? liveOrders.filter((o) => o.table === table) : [];
  const t = cartTotals(cart);
  const [rating, setRating] = useState(0);
  const [guestName, setGuestName] = useState("");

  const sendToKitchen = () => {
    if (!cart.length) return;
    if (!guestName.trim()) {
      toast.error("Please enter your name", { description: "So our kitchen & server know who ordered." });
      return;
    }
    const o = placeOrder({
      source: "QR",
      table,
      mode: "Dine-in",
      customer: `${guestName.trim()} · Table ${table}`,
      total: t.total,
      lines: cart.map((l) => ({
        name: menuById[l.itemId].name,
        qty: l.qty,
        mods: [l.variant?.label, ...l.addons.map((a) => a.label)].filter(Boolean) as string[],
        station: menuById[l.itemId].station,
      })),
    });
    clear();
    setCartOpen(false);
    setTab("orders");
    toast.success("Order sent to the kitchen!", { description: `${o.id} · Table ${table}` });
  };

  return (
    <div className="min-h-dvh bg-[#2a0a4f] sm:py-6">
      <div className="relative mx-auto min-h-dvh max-w-[480px] bg-[#ffffff] text-[#0f172a] sm:min-h-[calc(100dvh-48px)] sm:overflow-hidden sm:rounded-[32px] sm:shadow-2xl">
        <header className="sticky top-0 z-40 flex h-[62px] items-center justify-between border-b border-[#4e1d84]/10 bg-[#ffffff]/95 px-4 backdrop-blur-xl">
          <div className="flex items-center gap-2.5">
            {customLogo ? (
              <img src={customLogo} alt="Demo Restaurant" className="size-8 rounded-lg border border-[#4e1d84]/15 bg-white object-contain p-0.5" />
            ) : (
              <span className="grid size-8 place-items-center rounded-xl bg-[#4e1d84] text-[#f5a623]">
                <UtensilsCrossed className="size-4" />
              </span>
            )}
            <span className="text-[20px] font-extrabold tracking-[-0.04em] text-[#4e1d84]">DEMO RESTAURANT</span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#4e1d84] px-3.5 py-1.5 text-white shadow-xs">
            <span className="size-1.5 rounded-full bg-[#f5a623]" />
            <span className="text-[12px] font-bold">Table {table}</span>
          </div>
        </header>

        {tab === "menu" && (
          <>
            <div className="mx-4 mt-4 overflow-hidden rounded-3xl bg-gradient-to-br from-[#2a0a4f] via-[#4e1d84] to-[#3b0e6e] p-5 text-white shadow-lg">
              <p className="flex items-center gap-1.5 text-[10.5px] font-extrabold uppercase tracking-[0.16em] text-[#f5a623]">
                <Sparkles className="size-3" /> Table {table} · Scan &amp; Order
              </p>
              <p className="mt-2 text-[25px] font-extrabold leading-tight tracking-[-0.03em] text-white">
                Order right from your table.
              </p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-white/80">
                Add dishes to your table cart and fire them straight to Demo Restaurant&apos;s kitchen — no login needed.
              </p>
            </div>
            <div className="px-4">
              <MenuBrowser variant="qr" onOpenCart={() => setCartOpen(true)} />
            </div>
          </>
        )}

        {tab === "orders" && (
          <div className="px-4 pb-32 pt-6">
            <p className="text-[10.5px] font-extrabold uppercase tracking-[0.16em] text-[#4e1d84]">Live Kitchen Sync</p>
            <h1 className="mt-1 text-[28px] font-extrabold tracking-[-0.035em] text-[#0f172a]">Table {table} Orders</h1>
            {mine.length === 0 ? (
              <div className="mt-6 rounded-3xl border border-dashed border-[#4e1d84]/20 bg-white p-8 text-center">
                <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-[#f3e8ff] text-[#4e1d84]">
                  <ClipboardList className="size-5" />
                </span>
                <p className="mt-4 text-[14.5px] font-medium text-[#475569]">
                  Nothing sent yet. Add dishes to your cart from the menu and fire them straight to the kitchen.
                </p>
                <button
                  onClick={() => setTab("menu")}
                  className="mt-5 inline-flex h-10 items-center rounded-full bg-[#4e1d84] px-6 text-[13.5px] font-bold text-white"
                >
                  Browse menu
                </button>
              </div>
            ) : (
              <div className="mt-6 space-y-3.5">
                {mine.map((o) => {
                  const stage = ["new", "preparing", "ready", "served"].indexOf(o.status);
                  return (
                    <div key={o.id} className="overflow-hidden rounded-3xl border border-[#4e1d84]/12 bg-white shadow-xs">
                      <div
                        className={cn(
                          "flex items-center justify-between px-4 py-3",
                          stage >= 2 ? "bg-[#059669] text-white" : "bg-[#4e1d84] text-[#f5a623]",
                        )}
                      >
                        <span className="font-mono text-[11.5px] font-bold">{o.id}</span>
                        <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-bold text-white">
                          {["With the kitchen", "Being cooked", "Coming to you", "Served"][stage]}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-1.5 px-4 pt-3.5">
                        {[0, 1, 2, 3].map((i) => (
                          <span key={i} className={cn("h-1.5 rounded-full", i <= stage ? "bg-[#4e1d84]" : "bg-[#f3e8ff]")} />
                        ))}
                      </div>
                      <ul className="space-y-1.5 px-4 py-3.5 text-[14.5px] text-[#0f172a]">
                        {o.lines.map((l, i) => (
                          <li key={i}>
                            <span className="font-bold text-[#4e1d84]">{l.qty}×</span> {l.name}
                          </li>
                        ))}
                      </ul>
                      <p className="flex items-baseline justify-between border-t border-[#4e1d84]/10 bg-[#ffffff] px-4 py-3 text-[14.5px] font-extrabold text-[#0f172a]">
                        <span>Total</span>
                        <span className="tnum">{inr(o.total)}</span>
                      </p>
                    </div>
                  );
                })}
                <p className="pt-2 text-center text-[12.5px] text-[#64748b]">
                  Open Kitchen Display (`/kitchen`) in another tab and bump the ticket — this screen updates live.
                </p>
              </div>
            )}
          </div>
        )}

        {tab === "service" && (
          <div className="px-4 pb-32 pt-6">
            <p className="text-[10.5px] font-extrabold uppercase tracking-[0.16em] text-[#4e1d84]">Table Service</p>
            <h1 className="mt-1 text-[28px] font-extrabold tracking-[-0.035em] text-[#0f172a]">Need anything?</h1>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <ServiceBtn
                icon={BellRing}
                label="Call Rahul"
                note="Your captain tonight"
                tone="bg-[#f3e8ff] text-[#4e1d84]"
                onClick={() => toast.success("Rahul is on his way", { description: `Table ${table}` })}
              />
              <ServiceBtn
                icon={Receipt}
                label="Request Bill"
                note="Split, UPI or card"
                tone="bg-white text-[#0f172a] border border-[#4e1d84]/12"
                onClick={() => toast.success("Bill requested", { description: "It'll be with you in a minute." })}
              />
              <ServiceBtn
                icon={UtensilsCrossed}
                label="Water & Plates"
                note="Cutlery, napkins"
                tone="bg-white text-[#0f172a] border border-[#4e1d84]/12"
                onClick={() => toast("On its way")}
              />
              <ServiceBtn
                icon={ChefHat}
                label="Allergy Note"
                note="Straight to the chef"
                tone="bg-[#4e1d84] text-white"
                onClick={() => toast("The chef has been notified")}
              />
            </div>

            <div className="mt-6 rounded-3xl border border-[#4e1d84]/10 bg-white p-5 shadow-xs">
              <p className="text-[19px] font-extrabold tracking-[-0.025em] text-[#0f172a]">How was your meal?</p>
              <p className="mt-0.5 text-[13px] text-[#64748b]">Sent directly to Ananya, our General Manager.</p>
              <div className="mt-4 grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setRating(n)}
                    aria-label={`${n} out of 5`}
                    className={cn(
                      "rounded-xl border py-2.5 text-[17px] font-extrabold transition tnum",
                      n <= rating
                        ? "border-[#f5a623] bg-[#f5a623] text-[#2a0a4f]"
                        : "border-[#4e1d84]/12 bg-[#ffffff] text-[#475569]",
                    )}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <textarea className="site-input mt-3 h-22 resize-none py-3" placeholder="Anything we should know?" />
              <button
                disabled={!rating}
                onClick={() => toast.success("Thank you", { description: "Ananya reads every note." })}
                className="mt-3 flex h-11 w-full items-center justify-center rounded-full bg-[#4e1d84] text-[14px] font-bold text-white transition hover:bg-[#3d116d] disabled:opacity-45"
              >
                Send feedback
              </button>
            </div>
          </div>
        )}

        <nav className="safe-bottom fixed inset-x-0 bottom-0 z-30 mx-auto grid max-w-[480px] grid-cols-3 border-t border-[#4e1d84]/10 bg-white/95 backdrop-blur-xl sm:absolute">
          {([
            ["menu", "Menu", UtensilsCrossed],
            ["orders", "Orders", ClipboardList],
            ["service", "Service", BellRing],
          ] as const).map(([k, l, Icon]) => (
            <button
              key={k}
              onClick={() => {
                setTab(k);
                window.scrollTo({ top: 0 });
              }}
              className={cn(
                "relative flex flex-col items-center gap-1 py-2.5 text-[11px] font-bold transition",
                tab === k ? "text-[#4e1d84]" : "text-[#8e7ea3]",
              )}
            >
              <Icon className="size-5" strokeWidth={tab === k ? 2.2 : 1.7} />
              {l}
              {tab === k && <span className="absolute top-0 h-0.5 w-10 rounded-full bg-[#f5a623]" />}
              {k === "orders" && mine.length > 0 && <span className="absolute right-[32%] top-2 size-2 rounded-full bg-[#f5a623]" />}
            </button>
          ))}
        </nav>

        <Sheet
          open={cartOpen}
          onClose={() => setCartOpen(false)}
          side="bottom"
          site
          title={`Table ${table} Cart`}
          subtitle="Review items before sending to kitchen"
          footer={
            <div className="space-y-3">
              <label className="block">
                <span className="mb-1 block text-[11.5px] font-bold uppercase tracking-wider text-[#64748b]">
                  Your Name *
                </span>
                <input
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Enter your name to place order…"
                  className="h-11 w-full rounded-xl border border-[#4e1d84]/20 bg-white px-3.5 text-[14px] text-[#0f172a] outline-none focus:border-[#4e1d84]"
                />
              </label>
              <p className="flex items-baseline justify-between text-[15px]">
                <span className="text-[#475569]">Items + GST 5%</span>
                <span className="font-extrabold text-[#0f172a] tnum">{inr(t.total)}</span>
              </p>
              <button
                onClick={sendToKitchen}
                disabled={!cart.length}
                className="flex h-12 w-full items-center justify-center rounded-full bg-[#4e1d84] text-[14.5px] font-extrabold text-white shadow-lg transition hover:bg-[#3d116d] disabled:opacity-45"
              >
                Send Order to Kitchen · {inr(t.total)}
              </button>
            </div>
          }
        >
          <ul className="divide-y divide-[#4e1d84]/10 px-5">
            {cart.map((l) => {
              const item = menuById[l.itemId];
              return (
                <li key={l.key} className="flex items-center gap-3 py-3.5">
                  <DietMark diet={item.diet} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[14.5px] font-bold text-[#0f172a]">{item.name}</p>
                    {(l.variant || l.addons.length > 0) && (
                      <p className="truncate text-[12px] text-[#64748b]">
                        {[l.variant?.label, ...l.addons.map((a) => a.label)].filter(Boolean).join(" · ")}
                      </p>
                    )}
                  </div>
                  <div className="flex h-8 items-center rounded-full border border-[#4e1d84]/15 bg-white">
                    <button className="grid h-full w-8 place-items-center text-[#4e1d84]" onClick={() => setQty(l.key, l.qty - 1)} aria-label="Less">
                      <Minus className="size-3.5" />
                    </button>
                    <span className="w-5 text-center text-[13.5px] font-bold tnum">{l.qty}</span>
                    <button className="grid h-full w-8 place-items-center text-[#4e1d84]" onClick={() => setQty(l.key, l.qty + 1)} aria-label="More">
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                  <span className="w-16 text-right text-[14px] font-bold text-[#0f172a] tnum">{inr(lineUnit(l) * l.qty)}</span>
                </li>
              );
            })}
          </ul>
        </Sheet>
      </div>
    </div>
  );
}

function ServiceBtn({
  icon: Icon,
  label,
  note,
  onClick,
  tone,
}: {
  icon: typeof BellRing;
  label: string;
  note: string;
  onClick: () => void;
  tone: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn("flex flex-col items-start rounded-2xl p-4 text-left shadow-xs transition active:scale-[0.98]", tone)}
    >
      <Icon className="size-5" />
      <span className="mt-5 text-[16px] font-extrabold tracking-[-0.02em]">{label}</span>
      <span className="mt-0.5 text-[12px] opacity-75">{note}</span>
    </button>
  );
}
