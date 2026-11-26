"use client";

import { useMemo, useState } from "react";
import { ArrowDownToLine, ArrowUpFromLine, ClipboardCheck, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { DataTable, PageHeader, Panel, SearchBox, Stat, type Column } from "@/components/admin/kit";
import { Badge, Button, Field, Input, Progress, Segmented, Select, Sheet, Tabs } from "@/components/ui";
import { inventory, type Ingredient } from "@/lib/data";
import { compactInr, inr } from "@/lib/utils";

export default function InventoryPage() {
  const [tab, setTab] = useState<"stock" | "movements" | "wastage">("stock");
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [move, setMove] = useState<null | "in" | "out" | "adjust">(null);
  const cats = ["All", ...Array.from(new Set(inventory.map((i) => i.category)))];
  const rows = useMemo(() => inventory.filter((i) => (cat === "All" || i.category === cat) && (!q || i.name.toLowerCase().includes(q.toLowerCase()))), [q, cat]);
  const value = inventory.reduce((s, i) => s + i.stock * i.cost, 0);
  const low = inventory.filter((i) => i.stock < i.min).length;

  const cols: Column<Ingredient>[] = [
    { key: "n", header: "Ingredient", mobile: "primary", render: (i) => <span className="font-medium">{i.name}</span> },
    { key: "c", header: "Category", mobile: "secondary", render: (i) => <span className="text-ink-3">{i.category} · {i.supplier}</span> },
    {
      key: "s", header: "On hand", className: "w-[200px]", render: (i) => (
        <div className="min-w-[120px]">
          <div className="flex justify-between font-mono text-[12px]"><span className={i.stock < i.min ? "text-chili" : ""}>{i.stock} {i.unit}</span><span className="text-mute">min {i.min}</span></div>
          <Progress className="mt-1" value={(i.stock / (i.min * 2)) * 100} tone={i.stock < i.min * 0.6 ? "chili" : i.stock < i.min ? "turmeric" : "ink"} />
        </div>
      ),
    },
    { key: "u", header: "Used (7d)", render: (i) => <span className="font-mono text-[12.5px] text-ink-3">{i.used7d} {i.unit}</span> },
    { key: "d", header: "Days left", render: (i) => { const d = i.stock / (i.used7d / 7); return <span className={`font-mono text-[12.5px] ${d < 2 ? "text-chili" : "text-ink-3"}`}>{d > 99 ? "99+" : d.toFixed(1)}</span>; } },
    { key: "e", header: "Expiry", render: (i) => <span className={`font-mono text-[12.5px] ${["27 Nov", "28 Nov"].includes(i.expiry) ? "text-amber-ink" : "text-ink-3"}`}>{i.expiry}</span> },
    { key: "v", header: "Value", align: "right", render: (i) => <span className="font-mono">{inr(Math.round(i.stock * i.cost))}</span> },
    { key: "st", header: "Status", mobile: "badge", render: (i) => (i.stock < i.min * 0.6 ? <Badge tone="red" dot>Critical</Badge> : i.stock < i.min ? <Badge tone="amber" dot>Low</Badge> : <Badge tone="green" dot>OK</Badge>) },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Supply & Team"
        title={<>Inventory &amp; <em>stock</em></>}
        description="Ingredients deduct automatically from recipes on every sale. Stock in, stock out, adjustments, expiry and wastage — branch by branch."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => setMove("in")}><ArrowDownToLine className="size-3.5" /> Stock in</Button>
            <Button variant="outline" size="sm" onClick={() => setMove("out")}><ArrowUpFromLine className="size-3.5" /> Stock out</Button>
            <Button size="sm" onClick={() => setMove("adjust")}><ClipboardCheck className="size-3.5" /> Stock take</Button>
          </>
        }
      />
      <div className="mb-5 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <Stat label="Inventory value" value={compactInr(Math.round(value))} hint="Indiranagar" />
        <Stat label="Below minimum" value={low} tone="chili" hint="auto-PO drafted for 4" />
        <Stat label="Expiring in 48h" value="6" hint="use in specials" />
        <Stat label="Wastage (7d)" value={compactInr(18640)} delta={-12.4} hint="2.1% of food cost" />
      </div>

      <Panel flush>
        <div className="px-4 pt-4 sm:px-5">
          <Tabs value={tab} onChange={setTab} tabs={[{ value: "stock", label: "Stock", count: inventory.length }, { value: "movements", label: "Movements" }, { value: "wastage", label: "Wastage" }]} />
        </div>
        {tab === "stock" && (
          <>
            <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:p-5">
              <SearchBox value={q} onChange={setQ} placeholder="Search ingredients" className="sm:w-64" />
              <div className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 sm:mx-0 sm:px-0">
                {cats.map((c) => <button key={c} onClick={() => setCat(c)} className={`shrink-0 rounded-full border px-3 py-1.5 text-[12.5px] ${cat === c ? "border-ink bg-ink text-paper" : "border-line bg-white text-ink-2"}`}>{c}</button>)}
              </div>
            </div>
            <DataTable rows={rows} columns={cols} rowKey={(i) => i.id} />
          </>
        )}
        {tab === "movements" && (
          <ul className="mt-3 divide-y divide-line-2 border-t border-line-2">
            {[
              ["20:14", "Auto-deduct", "Tiger prawns −0.18 kg", "Sale NL-24816 · Prawn Moilee", "out"],
              ["20:09", "Auto-deduct", "Kaima rice −0.14 kg", "Sale NL-24815 · Thalassery Biryani", "out"],
              ["19:40", "Wastage", "Tiger prawns −1.2 kg", "Spoilage · logged by Kiran B.", "waste"],
              ["16:05", "Stock in", "Paneer +12 kg", "PO-1181 · Nandini Dairy · GRN-5521", "in"],
              ["16:02", "Stock in", "Cultured butter +4 kg", "PO-1181 · Nandini Dairy · GRN-5521", "in"],
              ["11:30", "Transfer", "Ghee −3 L → Bandra", "Inter-branch transfer TR-208", "out"],
              ["09:10", "Adjustment", "Shallots +0.8 kg", "Morning stock take · variance 3%", "adj"],
            ].map(([t, type, what, ref, k]) => (
              <li key={t + what} className="flex flex-wrap items-center gap-3 px-4 py-3 text-[13.5px] sm:px-5">
                <span className="w-12 font-mono text-[12px] text-mute">{t}</span>
                <Badge tone={k === "in" ? "green" : k === "waste" ? "red" : k === "adj" ? "blue" : "neutral"}>{type}</Badge>
                <span className="font-medium">{what}</span>
                <span className="w-full text-[12.5px] text-mute sm:ml-auto sm:w-auto">{ref}</span>
              </li>
            ))}
          </ul>
        )}
        {tab === "wastage" && (
          <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-3 sm:p-5">
            {[["Spoilage", 8420, "Seafood mostly — consider smaller, twice-daily drops"], ["Prep trim", 5260, "Within the 4% target"], ["Returned plates", 4960, "3 meen curry, 2 biryani — check spice levels"]].map(([k, v, n]) => (
              <div key={k as string} className="rounded-xl border border-line-2 p-4">
                <div className="flex items-center gap-2 text-[13px] text-ink-3"><Trash2 className="size-3.5" />{k as string}</div>
                <p className="mt-2 font-display text-3xl">{inr(v as number)}</p>
                <p className="mt-1 text-[12px] text-mute">{n as string}</p>
              </div>
            ))}
          </div>
        )}
      </Panel>

      <Sheet
        open={!!move}
        onClose={() => setMove(null)}
        title={move === "in" ? "Stock in" : move === "out" ? "Stock out" : "Stock take"}
        subtitle={move === "in" ? "Record a purchase / goods received" : move === "out" ? "Transfers, wastage, staff meals" : "Count and reconcile variance"}
        footer={<Button className="w-full" onClick={() => { setMove(null); toast.success("Stock updated", { description: "Movement logged in audit trail" }); }}>Save movement</Button>}
      >
        <div className="space-y-4 p-5 sm:p-6">
          <Field label="Ingredient"><Select>{inventory.map((i) => <option key={i.id}>{i.name}</option>)}</Select></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Quantity"><Input defaultValue="10" className="font-mono" /></Field>
            <Field label="Unit"><Select><option>kg</option><option>L</option><option>pcs</option><option>g</option></Select></Field>
          </div>
          {move === "in" && <><Field label="Against PO"><Select><option>PO-1182 · Malabar Catch Co.</option><option>No PO (cash purchase)</option></Select></Field><Field label="Unit cost (₹)"><Input defaultValue="980" className="font-mono" /></Field><Field label="Expiry"><Input type="date" defaultValue="2026-11-29" /></Field></>}
          {move === "out" && <Field label="Reason"><Segmented value="waste" onChange={() => {}} options={[{ value: "waste", label: "Wastage" }, { value: "transfer", label: "Transfer" }, { value: "staff", label: "Staff meal" }]} /></Field>}
          {move === "adjust" && <p className="rounded-xl bg-paper-2/60 p-4 text-[13px] text-ink-3">System says <span className="font-mono">6.4 kg</span>. Enter the counted quantity; variance over 5% needs a manager note.</p>}
          <Button variant="ghost" size="sm"><Plus className="size-3.5" /> Add another line</Button>
        </div>
      </Sheet>
    </>
  );
}
