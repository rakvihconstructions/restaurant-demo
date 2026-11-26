"use client";

import { useState } from "react";
import { Phone, Plus, Star } from "lucide-react";
import { toast } from "sonner";
import { DataTable, PageHeader, Panel, Stat, type Column } from "@/components/admin/kit";
import { Avatar, Badge, Button, Progress, StatusPill, Tabs } from "@/components/ui";
import { purchaseOrders, suppliers } from "@/lib/data";
import { compactInr, inr } from "@/lib/utils";

type Sup = (typeof suppliers)[number];
type PO = (typeof purchaseOrders)[number];

export default function SuppliersPage() {
  const [tab, setTab] = useState<"suppliers" | "po">("suppliers");
  const outstanding = suppliers.reduce((s, x) => s + x.outstanding, 0);

  const supCols: Column<Sup>[] = [
    { key: "n", header: "Supplier", mobile: "primary", render: (s) => <span className="flex items-center gap-3"><Avatar name={s.name} className="hidden md:inline-grid" /><span className="font-medium">{s.name}</span></span> },
    { key: "c", header: "Category", mobile: "secondary", render: (s) => <span className="text-ink-3">{s.category} · {s.contact}</span> },
    { key: "p", header: "Phone", render: (s) => <span className="flex items-center gap-1.5 font-mono text-[12.5px]"><Phone className="size-3 text-mute" />{s.phone}</span> },
    { key: "t", header: "Terms", render: (s) => <span className="text-ink-3">{s.terms}</span> },
    { key: "o", header: "On-time", render: (s) => <div className="flex w-28 items-center gap-2"><Progress value={s.onTime} tone={s.onTime < 90 ? "turmeric" : "ink"} /><span className="font-mono text-[11.5px]">{s.onTime}%</span></div> },
    { key: "r", header: "Rating", render: (s) => <span className="flex items-center gap-1 font-mono text-[12.5px]"><Star className="size-3 fill-turmeric text-turmeric" />{s.rating}</span> },
    { key: "b", header: "Outstanding", align: "right", mobile: "badge", render: (s) => (s.outstanding ? <span className="font-mono">{inr(s.outstanding)}</span> : <Badge tone="green">Settled</Badge>) },
  ];
  const poCols: Column<PO>[] = [
    { key: "id", header: "PO", mobile: "primary", render: (p) => <span className="font-mono">{p.id}</span> },
    { key: "s", header: "Supplier", mobile: "secondary", render: (p) => p.supplier },
    { key: "d", header: "Date", render: (p) => <span className="font-mono text-[12.5px] text-ink-3">{p.date}</span> },
    { key: "i", header: "Lines", render: (p) => <span className="font-mono">{p.items}</span> },
    { key: "e", header: "Expected", render: (p) => <span className="text-ink-3">{p.eta}</span> },
    { key: "a", header: "Amount", align: "right", render: (p) => <span className="font-mono">{inr(p.amount)}</span> },
    { key: "st", header: "Status", mobile: "badge", render: (p) => <StatusPill status={p.status} /> },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Supply & Team"
        title={<>Suppliers &amp; <em>purchases</em></>}
        description="Supplier directory, purchase orders, goods-received notes, invoices, payments, outstanding balances and returns."
        actions={<Button size="sm" onClick={() => toast.success("PO-1183 drafted", { description: "From 4 low-stock items · Malabar Catch Co." })}><Plus className="size-3.5" /> New purchase order</Button>}
      />
      <div className="mb-5 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <Stat label="Active suppliers" value={suppliers.length} hint="62 across all branches" />
        <Stat label="Purchases (Nov)" value={compactInr(1842000)} delta={-3.4} />
        <Stat label="Outstanding" value={compactInr(outstanding)} hint="3 due this week" tone="chili" />
        <Stat label="Avg. on-time" value="94%" delta={1.2} />
      </div>
      <Panel flush>
        <div className="px-4 pt-4 sm:px-5"><Tabs value={tab} onChange={setTab} tabs={[{ value: "suppliers", label: "Suppliers", count: suppliers.length }, { value: "po", label: "Purchase orders", count: purchaseOrders.length }]} /></div>
        <div className="pt-3">
          {tab === "suppliers" ? <DataTable rows={suppliers} columns={supCols} rowKey={(s) => s.id} /> : <DataTable rows={purchaseOrders} columns={poCols} rowKey={(p) => p.id} />}
        </div>
      </Panel>
    </>
  );
}
