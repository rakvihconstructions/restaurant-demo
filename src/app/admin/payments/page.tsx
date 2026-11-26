"use client";

import { useState } from "react";
import { Banknote, CheckCircle2, Lock, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { DataTable, KV, PageHeader, Panel, Stat, type Column } from "@/components/admin/kit";
import { Donut, Legend } from "@/components/charts";
import { Badge, Button, Tabs } from "@/components/ui";
import { cashRegister, orders, paymentMix, type Order } from "@/lib/data";
import { compactInr, inr } from "@/lib/utils";

export default function PaymentsPage() {
  const [tab, setTab] = useState<"tx" | "refunds" | "settlements">("tx");
  const paid = orders.filter((o) => o.payment !== "Unpaid");
  const cols: Column<Order>[] = [
    { key: "id", header: "Transaction", mobile: "primary", render: (o) => <span className="font-mono text-[12.5px]">pay_{o.id.slice(3)}x{o.total % 97}</span> },
    { key: "o", header: "Order", mobile: "secondary", render: (o) => <span className="font-mono text-[12.5px] text-ink-3">{o.id} · {o.customer}</span> },
    { key: "m", header: "Method", render: (o) => <Badge tone="outline">{o.payment === "Split" ? "UPI + Cash" : o.payment}</Badge> },
    { key: "t", header: "Time", render: (o) => <span className="font-mono text-[12.5px] text-ink-3">{o.time}</span> },
    { key: "a", header: "Amount", align: "right", render: (o) => <span className="font-mono">{inr(o.total)}</span> },
    { key: "s", header: "Status", mobile: "badge", render: () => <Badge tone="green" dot>Captured</Badge> },
  ];

  return (
    <>
      <PageHeader eyebrow="Finance" title={<>Payments &amp; <em>refunds</em></>} description="Cash, UPI, card and online payments, partial and split payments, refunds, reconciliation, cash register and daily settlements." />
      <div className="mb-5 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <Stat label="Collected today" value={inr(271880)} delta={13.9} />
        <Stat label="Pending (open bills)" value={inr(14540)} hint="11 tables" />
        <Stat label="Refunds today" value={inr(745)} hint="1 approved, 1 pending" tone="chili" />
        <Stat label="Next settlement" value={compactInr(241880)} hint="Razorpay · tomorrow 10:00" />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <Panel className="xl:col-span-8" flush>
          <div className="px-4 pt-4 sm:px-5"><Tabs value={tab} onChange={setTab} tabs={[{ value: "tx", label: "Transactions", count: paid.length }, { value: "refunds", label: "Refunds", count: 3 }, { value: "settlements", label: "Settlements" }]} /></div>
          <div className="pt-3">
            {tab === "tx" && <DataTable rows={paid} columns={cols} rowKey={(o) => o.id} />}
            {tab === "refunds" && (
              <ul className="divide-y divide-line-2 border-t border-line-2">
                {[["NL-24771", "Kerala Meen Curry — cold on arrival", 745, "approved", "Ananya R."], ["NL-24790", "Duplicate UPI charge", 1556, "pending", "—"], ["NL-24702", "Delivery failed — address not found", 2160, "approved", "Ananya R."]].map(([id, why, amt, st, by]) => (
                  <li key={id as string} className="flex flex-wrap items-center gap-3 px-4 py-3.5 sm:px-5">
                    <RotateCcw className="size-4 text-mute" />
                    <div className="min-w-0 flex-1"><p className="text-[13.5px]"><span className="font-mono text-[12px] text-mute">{id}</span> · {why as string}</p><p className="text-[12px] text-mute">Approver: {by as string} · back to original method</p></div>
                    <span className="font-mono">{inr(amt as number)}</span>
                    {st === "pending" ? <Button size="sm" onClick={() => toast.success("Refund approved", { description: "Razorpay refund rfnd_8812 initiated · audit logged" })}>Approve</Button> : <Badge tone="green" dot>Refunded</Badge>}
                  </li>
                ))}
              </ul>
            )}
            {tab === "settlements" && (
              <ul className="divide-y divide-line-2 border-t border-line-2">
                {[["25 Nov", 241880, "UTR 442118870012", true], ["24 Nov", 198420, "UTR 442118550981", true], ["23 Nov", 312650, "UTR 442118230454", true], ["22 Nov", 288090, "UTR 442117910032", false]].map(([d, a, u, ok]) => (
                  <li key={d as string} className="flex flex-wrap items-center gap-3 px-4 py-3.5 text-[13.5px] sm:px-5">
                    <span className="w-16 font-mono text-[12.5px]">{d as string}</span>
                    <span className="flex-1 font-mono text-[12px] text-mute">{u as string}</span>
                    <span className="font-mono">{inr(a as number)}</span>
                    {ok ? <Badge tone="green" dot>Reconciled</Badge> : <Badge tone="amber" dot>₹340 variance</Badge>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Panel>

        <div className="space-y-5 xl:col-span-4">
          <Panel title="Payment mix" subtitle="Today">
            <div className="grid grid-cols-2 items-center gap-4">
              <Donut data={paymentMix} height={150} />
              <Legend items={paymentMix} />
            </div>
          </Panel>
          <Panel title="Cash register" subtitle={`Counter 01 · opened ${cashRegister.opened}`} actions={<Badge tone="green" dot>Open</Badge>}>
            <div className="divide-y divide-line-2">
              <KV k="Opening float" v={inr(cashRegister.opening)} mono />
              <KV k="Cash sales" v={inr(cashRegister.cashSales)} mono />
              <KV k="Cash in" v={`+ ${inr(cashRegister.cashIn)}`} mono />
              <KV k="Cash out (petty)" v={`− ${inr(cashRegister.cashOut)}`} mono />
              <KV k="Expected in drawer" v={<span className="font-medium">{inr(cashRegister.expected)}</span>} mono />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={() => toast("Cash in/out recorded")}><Banknote className="size-3.5" /> Cash in/out</Button>
              <Button size="sm" onClick={() => toast.success("Register closed", { description: "Counted ₹65,020 · variance ₹0 · Z-report printed" })}><Lock className="size-3.5" /> Close day</Button>
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-[12px] text-leaf"><CheckCircle2 className="size-3.5" /> Yesterday closed with ₹0 variance</p>
          </Panel>
        </div>
      </div>
    </>
  );
}
