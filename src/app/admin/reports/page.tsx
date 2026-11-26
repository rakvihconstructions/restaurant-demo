"use client";

import { useState } from "react";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Panel, Stat } from "@/components/admin/kit";
import { Bars, Donut, Legend, Lines, RevenueArea } from "@/components/charts";
import { Button, Segmented, Tabs } from "@/components/ui";
import { branchCompare, channelMix, daily30, monthly, paymentMix, staff } from "@/lib/data";
import { menu } from "@/lib/menu";
import { cn, compactInr, inr } from "@/lib/utils";

export default function ReportsPage() {
  const [tab, setTab] = useState<"sales" | "product" | "finance" | "ops">("sales");
  const [range, setRange] = useState("30d");
  const products = [...menu].sort((a, b) => (b.sold ?? 0) * b.price - (a.sold ?? 0) * a.price);

  return (
    <>
      <PageHeader
        eyebrow="Insights"
        title={<>Reports &amp; <em>analytics</em></>}
        description="Sales, channels, products, finance, operations and staff — by branch, by day, by payment method. Export to CSV, Excel or PDF."
        actions={
          <>
            <Segmented size="sm" value={range} onChange={setRange} options={[{ value: "7d", label: "7D" }, { value: "30d", label: "30D" }, { value: "qtd", label: "QTD" }, { value: "ytd", label: "YTD" }]} />
            <Button variant="outline" size="sm" onClick={() => toast.success("Report exported", { description: "sales_nov_2026.xlsx" })}><Download className="size-3.5" /> Export</Button>
          </>
        }
      />
      <div className="mb-5"><Tabs value={tab} onChange={setTab} tabs={[{ value: "sales", label: "Sales" }, { value: "product", label: "Products" }, { value: "finance", label: "Financial" }, { value: "ops", label: "Operations & staff" }]} /></div>

      {tab === "sales" && (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:col-span-12 xl:grid-cols-4">
            <Stat label="Net sales" value={compactInr(daily30.reduce((s, d) => s + d.revenue, 0))} delta={11.4} />
            <Stat label="Orders" value={daily30.reduce((s, d) => s + d.orders, 0).toLocaleString("en-IN")} delta={8.1} />
            <Stat label="Covers" value={daily30.reduce((s, d) => s + d.covers, 0).toLocaleString("en-IN")} delta={6.6} />
            <Stat label="Avg. order value" value={inr(1720)} delta={3.0} />
          </div>
          <Panel className="xl:col-span-8" title="Daily sales" subtitle="All branches · last 30 days"><RevenueArea data={daily30} x="date" series={[{ key: "revenue", name: "Revenue" }]} height={280} /></Panel>
          <Panel className="xl:col-span-4" title="Channel comparison">
            <Donut data={channelMix} height={170} />
            <div className="mt-4"><Legend items={channelMix} /></div>
          </Panel>
          <Panel className="xl:col-span-6" title="Branch-wise" subtitle="Today"><Bars horizontal data={branchCompare} x="name" y="revenue" name="Revenue" height={200} color="#4e1d84" /></Panel>
          <Panel className="xl:col-span-6" title="Payment-wise" subtitle="Share of collections">
            <div className="grid grid-cols-2 items-center gap-4"><Donut data={paymentMix} height={170} /><Legend items={paymentMix} /></div>
          </Panel>
        </div>
      )}

      {tab === "product" && (
        <Panel title="Item performance" subtitle="Revenue, units and estimated profit · this month" flush>
          <div className="thin-scroll overflow-x-auto border-t border-line-2">
            <table className="w-full min-w-[720px] text-[13px]">
              <thead><tr className="bg-paper/50 text-left font-mono text-[10.5px] uppercase tracking-[0.14em] text-mute"><th className="px-5 py-2.5 font-normal">#</th><th className="py-2.5 font-normal">Item</th><th className="py-2.5 text-right font-normal">Units</th><th className="py-2.5 text-right font-normal">Revenue</th><th className="py-2.5 text-right font-normal">Est. profit</th><th className="px-5 py-2.5 text-right font-normal">Margin</th></tr></thead>
              <tbody className="divide-y divide-line-2">
                {products.map((m, i) => {
                  const rev = (m.sold ?? 0) * m.price;
                  const profit = (m.sold ?? 0) * (m.price - (m.cost ?? 0));
                  return (
                    <tr key={m.id} className={cn(i >= products.length - 4 && "bg-chili-soft/25")}>
                      <td className="px-5 py-2.5 font-mono text-mute">{String(i + 1).padStart(2, "0")}</td>
                      <td className="py-2.5">{m.name}{i >= products.length - 4 && <span className="ml-2 text-[11px] text-chili">least seller</span>}</td>
                      <td className="py-2.5 text-right font-mono">{m.sold}</td>
                      <td className="py-2.5 text-right font-mono">{inr(rev)}</td>
                      <td className="py-2.5 text-right font-mono text-leaf">{inr(profit)}</td>
                      <td className="px-5 py-2.5 text-right font-mono">{Math.round((profit / rev) * 100)}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      {tab === "finance" && (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:col-span-12 xl:grid-cols-4">
            <Stat label="Revenue (Nov)" value={compactInr(7690000)} delta={-6.7} hint="vs festive Oct" />
            <Stat label="Gross profit" value={compactInr(5150000)} hint="67% after food cost" />
            <Stat label="Net profit" value={compactInr(1480000)} delta={-8.6} />
            <Stat label="Taxes · refunds · discounts" value={compactInr(366190 + 18420 + 412600)} />
          </div>
          <Panel className="xl:col-span-6" title="Revenue" subtitle="Monthly, last 12 months"><Bars data={monthly} x="m" y="revenue" name="Revenue" highlightLast height={260} /></Panel>
          <Panel className="xl:col-span-6" title="Net profit" subtitle="Monthly, last 12 months"><Bars data={monthly} x="m" y="profit" name="Net profit" highlightLast height={260} color="#2e9170" /></Panel>
          <Panel className="xl:col-span-12" title="Revenue vs expenses" subtitle="Daily, last 30 days">
            <Lines data={daily30} x="date" series={[{ key: "revenue", name: "Revenue", color: "#4e1d84" }, { key: "expenses", name: "Expenses", color: "#c4452d" }]} height={260} />
            <div className="mt-3 flex gap-4 text-[12px] text-ink-3"><span className="flex items-center gap-1.5"><span className="h-0.5 w-4 bg-[#4e1d84]" />Revenue</span><span className="flex items-center gap-1.5"><span className="h-0.5 w-4 bg-[#c4452d]" />Expenses</span></div>
          </Panel>
        </div>
      )}

      {tab === "ops" && (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:col-span-12 xl:grid-cols-4">
            <Stat label="Avg. prep time" value="14.2 min" delta={-4.1} hint="target 15" />
            <Stat label="Avg. delivery" value="31 min" delta={-6.2} />
            <Stat label="Table turnover" value="2.6×" delta={5.0} hint="per table, dinner" />
            <Stat label="Cancellations" value="1.8%" delta={-0.4} />
          </div>
          <Panel className="xl:col-span-6" title="Kitchen performance" subtitle="Avg. prep minutes by station">
            <Bars horizontal data={[{ s: "Cold", m: 6.1 }, { s: "Bar", m: 4.2 }, { s: "Pastry", m: 3.8 }, { s: "Tandoor", m: 13.9 }, { s: "Grill", m: 16.4 }, { s: "Curry", m: 17.2 }]} x="s" y="m" name="Minutes" fmt={(v) => `${v} min`} height={240} color="#4e1d84" />
          </Panel>
          <Panel className="xl:col-span-6" title="Staff performance" subtitle="Sales handled · rating">
            <ul className="space-y-3">
              {staff.filter((s) => ["Waiter", "Captain", "Cashier", "Bartender"].includes(s.role)).map((s, i) => (
                <li key={s.id} className="flex items-center gap-3 text-[13px]">
                  <span className="w-28 truncate">{s.name}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-paper-2"><div className="h-full rounded-full bg-ink" style={{ width: `${[92, 78, 70, 64, 58, 44][i] ?? 40}%` }} /></div>
                  <span className="w-16 text-right font-mono">{compactInr([412000, 348000, 312000, 286000, 254000, 198000][i] ?? 150000)}</span>
                  <span className="w-10 text-right font-mono text-mute">{s.rating}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-2 text-[12.5px] text-mute">
        Scheduled reports:
        <span className="inline-flex items-center gap-1 rounded-full border border-line bg-white px-2.5 py-0.5"><FileSpreadsheet className="size-3" />Daily sales · 23:45 · email</span>
        <span className="inline-flex items-center gap-1 rounded-full border border-line bg-white px-2.5 py-0.5"><FileText className="size-3" />Weekly P&amp;L · Mon 09:00 · PDF</span>
      </div>
    </>
  );
}
