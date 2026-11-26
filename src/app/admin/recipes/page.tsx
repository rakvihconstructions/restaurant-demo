"use client";

import Image from "next/image";
import { useState } from "react";
import { GitBranch, History } from "lucide-react";
import { PageHeader, Panel } from "@/components/admin/kit";
import { Badge, DietMark } from "@/components/ui";
import { recipes } from "@/lib/data";
import { menu } from "@/lib/menu";
import { cn, inr } from "@/lib/utils";

export default function RecipesPage() {
  const [sel, setSel] = useState(0);
  const r = recipes[sel];
  const cost = r.lines.reduce((s, l) => s + l.cost, 0);
  const pct = (cost / r.item.price) * 100;
  const margin = r.item.price - cost;
  const table = [...menu].filter((m) => m.cost).sort((a, b) => (b.cost! / b.price) - (a.cost! / a.price));

  return (
    <>
      <PageHeader eyebrow="Supply & Team" title={<>Recipes &amp; <em>food costing</em></>} description="Map every dish to ingredients and quantities. Cost per serving, food-cost % and gross margin update the moment a supplier price changes." />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div className="space-y-2 xl:col-span-3">
          {recipes.map((x, i) => (
            <button key={x.item.id} onClick={() => setSel(i)} className={cn("flex w-full items-center gap-3 rounded-xl border p-2.5 text-left transition", sel === i ? "border-ink bg-white" : "border-transparent hover:bg-white/60")}>
              <span className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-paper-2">{x.item.image && <Image src={x.item.image} alt="" fill sizes="48px" className="object-cover" />}</span>
              <span className="min-w-0">
                <span className="block truncate text-[13.5px] font-medium">{x.item.name}</span>
                <span className="block font-mono text-[11px] text-mute">{x.version}</span>
              </span>
            </button>
          ))}
        </div>

        <div className="space-y-5 xl:col-span-9">
          <Panel>
            <div className="flex flex-col gap-6 lg:flex-row">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2"><DietMark diet={r.item.diet} /><Badge tone="outline"><GitBranch className="size-3" />{r.version}</Badge></div>
                <h2 className="mt-2 font-display text-[32px] leading-tight">{r.item.name}</h2>
                <p className="text-[13px] text-mute">{r.yieldNote} · {r.item.station} station · {r.item.prep} min</p>

                <table className="mt-5 w-full text-[13.5px]">
                  <thead><tr className="border-b border-line text-left font-mono text-[10.5px] uppercase tracking-[0.14em] text-mute"><th className="py-2 font-normal">Ingredient</th><th className="py-2 font-normal">Qty</th><th className="py-2 text-right font-normal">Cost</th></tr></thead>
                  <tbody className="divide-y divide-line-2">
                    {r.lines.map((l) => (
                      <tr key={l.name}><td className="py-2.5">{l.name}</td><td className="py-2.5 font-mono text-[12.5px] text-ink-3">{l.qty}</td><td className="py-2.5 text-right font-mono">{inr(l.cost)}</td></tr>
                    ))}
                  </tbody>
                  <tfoot><tr className="border-t border-ink"><td className="pt-3 font-medium" colSpan={2}>Cost per serving</td><td className="pt-3 text-right font-mono font-medium">{inr(cost)}</td></tr></tfoot>
                </table>
              </div>

              <div className="w-full shrink-0 space-y-3 lg:w-64">
                <div className="rounded-xl bg-night p-5 text-paper">
                  <p className="eyebrow text-paper/45">Food cost</p>
                  <p className={cn("mt-2 font-display text-5xl leading-none", pct > 33 ? "text-[#f08a73]" : "text-turmeric")}>{pct.toFixed(1)}%</p>
                  <p className="mt-2 text-[12px] text-paper/55">Target ≤ 32% for {r.item.station.toLowerCase()} dishes</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="card p-4"><p className="text-[12px] text-mute">Selling price</p><p className="mt-1 font-mono text-[15px]">{inr(r.item.price)}</p></div>
                  <div className="card p-4"><p className="text-[12px] text-mute">Gross margin</p><p className="mt-1 font-mono text-[15px] text-leaf">{inr(margin)}</p></div>
                </div>
                <div className="card p-4">
                  <p className="text-[12px] text-mute">Monthly gross profit</p>
                  <p className="mt-1 font-mono text-[15px]">{inr(margin * (r.item.sold ?? 0))}</p>
                  <p className="text-[11.5px] text-mute">{r.item.sold} sold this month</p>
                </div>
              </div>
            </div>
          </Panel>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <Panel title="Method">
              <ol className="space-y-3">
                {r.steps.map((s, i) => (
                  <li key={i} className="flex gap-3 text-[13.5px]"><span className="font-display text-xl leading-none text-turmeric">{i + 1}</span><span className="text-ink-2">{s}</span></li>
                ))}
              </ol>
            </Panel>
            <Panel title="Change history" subtitle="Recipe & ingredient cost changes">
              <ul className="space-y-3 text-[13px]">
                {[["02 Nov", "Tiger prawns ₹920 → ₹980/kg", "+₹11 per serving"], ["12 Oct", "Recipe v4 — coconut milk 180 → 150 ml", "−₹4 per serving"], ["01 Sep", "Matta rice supplier changed", "−₹2 per serving"]].map(([d, w, e]) => (
                  <li key={d} className="flex gap-3"><History className="mt-0.5 size-3.5 shrink-0 text-mute" /><div className="flex-1"><p>{w}</p><p className="font-mono text-[11.5px] text-mute">{d} · {e}</p></div></li>
                ))}
              </ul>
            </Panel>
          </div>

          <Panel title="Menu engineering" subtitle="Food-cost % for every costed dish — red is over target" flush>
            <div className="thin-scroll max-h-[360px] overflow-y-auto border-t border-line-2">
              {table.map((m) => {
                const p = (m.cost! / m.price) * 100;
                return (
                  <div key={m.id} className="flex items-center gap-3 border-b border-line-2 px-4 py-2.5 text-[13px] last:border-0 sm:px-5">
                    <DietMark diet={m.diet} />
                    <span className="min-w-0 flex-1 truncate">{m.name}</span>
                    <div className="hidden w-40 sm:block"><div className="h-1.5 overflow-hidden rounded-full bg-paper-2"><div className={cn("h-full rounded-full", p > 33 ? "bg-chili" : "bg-ink")} style={{ width: `${Math.min(100, p * 2)}%` }} /></div></div>
                    <span className={cn("w-12 text-right font-mono", p > 33 && "text-chili")}>{p.toFixed(0)}%</span>
                    <span className="w-16 text-right font-mono text-mute">{inr(m.price - m.cost!)}</span>
                  </div>
                );
              })}
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}
