"use client";

import { useState } from "react";
import { Paperclip, Plus, Repeat } from "lucide-react";
import { toast } from "sonner";
import { DataTable, PageHeader, Panel, Stat, type Column } from "@/components/admin/kit";
import { Bars } from "@/components/charts";
import { Badge, Button, Field, Input, Select, Sheet, Switch } from "@/components/ui";
import { expenses } from "@/lib/data";
import { compactInr, inr } from "@/lib/utils";

type Ex = (typeof expenses)[number];

export default function ExpensesPage() {
  const [open, setOpen] = useState(false);
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const byCat = Object.entries(expenses.reduce<Record<string, number>>((a, e) => ({ ...a, [e.category]: (a[e.category] ?? 0) + e.amount }), {}))
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);

  const cols: Column<Ex>[] = [
    { key: "t", header: "Expense", mobile: "primary", render: (e) => <span className="font-medium">{e.title}</span> },
    { key: "c", header: "Category", mobile: "secondary", render: (e) => <span className="text-ink-3">{e.category} · {e.branch}</span> },
    { key: "d", header: "Date", render: (e) => <span className="font-mono text-[12.5px] text-ink-3">{e.date}</span> },
    { key: "r", header: "Type", render: (e) => (e.recurring ? <Badge tone="blue"><Repeat className="size-3" />Recurring</Badge> : <Badge tone="outline">One-off</Badge>) },
    { key: "rc", header: "Receipt", render: (e) => (e.receipt ? <Paperclip className="size-4 text-ink-3" /> : <span className="text-[12px] text-chili">Missing</span>) },
    { key: "b", header: "By", render: (e) => <span className="text-ink-3">{e.by}</span> },
    { key: "a", header: "Amount", align: "right", mobile: "badge", render: (e) => <span className="font-mono">{inr(e.amount)}</span> },
  ];

  return (
    <>
      <PageHeader eyebrow="Finance" title="Expenses" description="Rent, utilities, staff, maintenance, marketing and transport — categorised, branch-wise, with receipts and recurring entries." actions={<Button size="sm" onClick={() => setOpen(true)}><Plus className="size-3.5" /> Record expense</Button>} />
      <div className="mb-5 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <Stat label="November expenses" value={compactInr(total)} delta={2.4} />
        <Stat label="As % of revenue" value="34.6%" delta={-1.1} hint="excl. food cost" />
        <Stat label="Recurring" value={expenses.filter((e) => e.recurring).length} hint="auto-posted monthly" />
        <Stat label="Missing receipts" value={expenses.filter((e) => !e.receipt).length} tone="chili" />
      </div>
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <Panel className="xl:col-span-8" flush><div className="pt-1"><DataTable rows={expenses} columns={cols} rowKey={(e) => e.id} /></div></Panel>
        <Panel className="xl:col-span-4" title="By category" subtitle="November">
          <Bars horizontal data={byCat} x="category" y="amount" name="Spent" height={300} />
        </Panel>
      </div>

      <Sheet open={open} onClose={() => setOpen(false)} title="Record expense" footer={<Button className="w-full" onClick={() => { setOpen(false); toast.success("Expense recorded", { description: "Sent to Priya V. for approval" }); }}>Save</Button>}>
        <div className="space-y-4 p-5 sm:p-6">
          <Field label="Title"><Input defaultValue="Kitchen exhaust cleaning" /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Amount (₹)"><Input defaultValue="18500" className="font-mono" /></Field>
            <Field label="Date"><Input type="date" defaultValue="2026-11-26" /></Field>
            <Field label="Category"><Select><option>Maintenance</option><option>Rent</option><option>Utilities</option><option>Staff</option><option>Marketing</option><option>Transport</option></Select></Field>
            <Field label="Branch"><Select><option>Indiranagar</option><option>Kovalam</option><option>Bandra</option></Select></Field>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-line-2 p-4"><span className="text-[13.5px]">Repeat monthly</span><Switch checked={false} onChange={() => {}} label="Recurring" /></div>
          <div className="grid place-items-center rounded-xl border border-dashed border-line p-6 text-[13px] text-mute"><Paperclip className="mb-2 size-5" />Drop receipt (PDF, JPG)</div>
        </div>
      </Sheet>
    </>
  );
}
