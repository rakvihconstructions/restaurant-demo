"use client";

import { useMemo, useState } from "react";
import { Cake, Download, Gift, Lock, Mail, Phone } from "lucide-react";
import { toast } from "sonner";
import { DataTable, PageHeader, Panel, SearchBox, Stat, type Column } from "@/components/admin/kit";
import { Avatar, Badge, Button, Segmented, Sheet, Textarea, type Tone } from "@/components/ui";
import { customers, type Customer } from "@/lib/data";
import { compactInr, inr, num } from "@/lib/utils";

const tierTone: Record<Customer["tier"], Tone> = { Sapphire: "ink", Coral: "amber", Pearl: "neutral", New: "blue" };

export default function CustomersPage() {
  const [q, setQ] = useState("");
  const [tier, setTier] = useState<"All" | Customer["tier"]>("All");
  const [sel, setSel] = useState<Customer | null>(null);
  const rows = useMemo(() => customers.filter((c) => (tier === "All" || c.tier === tier) && (!q || (c.name + c.phone + c.email).toLowerCase().includes(q.toLowerCase()))), [q, tier]);

  const cols: Column<Customer>[] = [
    { key: "n", header: "Guest", mobile: "primary", render: (c) => <span className="flex items-center gap-3"><Avatar name={c.name} className="hidden md:inline-grid" /><span><span className="block font-medium">{c.name}</span><span className="hidden text-[12px] text-mute md:block">{c.email}</span></span></span> },
    { key: "p", header: "Phone", mobile: "secondary", render: (c) => <span className="font-mono text-[12.5px]">+91 {c.phone.slice(0, 3)}•• ••{c.phone.slice(-3)}</span> },
    { key: "v", header: "Visits", render: (c) => <span className="font-mono">{c.visits}</span> },
    { key: "s", header: "Lifetime spend", render: (c) => <span className="font-mono">{inr(c.spend)}</span> },
    { key: "pt", header: "Points", render: (c) => <span className="font-mono text-ink-3">{num(c.points)}</span> },
    { key: "l", header: "Last visit", render: (c) => <span className="text-ink-3">{c.last}</span> },
    { key: "t", header: "Tier", mobile: "badge", render: (c) => <Badge tone={tierTone[c.tier]}>{c.tier}{c.visits === 1 && " · first visit"}</Badge> },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Customers & Delivery"
        title={<>Customers &amp; <em>loyalty</em></>}
        description="Profiles, order history, spend, loyalty tiers and notes. Phone numbers are masked for roles without customer-export permission."
        actions={<Button variant="outline" size="sm" onClick={() => toast("Export requires approval", { description: "Request sent to Restaurant Admin · logged" })}><Download className="size-3.5" /> Export</Button>}
      />

      <div className="mb-5 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <Stat label="Known guests" value={num(18420)} delta={6.2} hint="this quarter" />
        <Stat label="Returning rate" value="41.8%" delta={3.1} />
        <Stat label="Loyalty members" value={num(6214)} hint="34% of guests" />
        <Stat label="Avg. lifetime value" value={compactInr(14250)} delta={8.4} />
      </div>

      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-4">
        {(["Sapphire", "Coral", "Pearl", "New"] as const).map((t, i) => (
          <div key={t} className={i === 0 ? "rounded-[14px] bg-night p-4 text-paper" : "card p-4"}>
            <p className={i === 0 ? "eyebrow text-turmeric" : "eyebrow text-mute"}>{t}</p>
            <p className="mt-2 font-display text-2xl">{["₹90k+ lifetime", "₹40k+ lifetime", "Every member", "First visit"][i]}</p>
            <p className={i === 0 ? "mt-1 text-[12px] text-paper/55" : "mt-1 text-[12px] text-mute"}>{["10% back · priority tables · chef's table invites", "7% back · birthday dessert", "5% back in points", "Welcome offer FIRSTBITE"][i]}</p>
          </div>
        ))}
      </div>

      <Panel flush>
        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <SearchBox value={q} onChange={setQ} placeholder="Name, phone or email" className="sm:w-72" />
          <Segmented size="sm" value={tier} onChange={setTier} options={(["All", "Sapphire", "Coral", "Pearl", "New"] as const).map((t) => ({ value: t, label: t }))} />
        </div>
        <DataTable rows={rows} columns={cols} rowKey={(c) => c.id} onRow={setSel} />
      </Panel>

      <Sheet open={!!sel} onClose={() => setSel(null)} title={sel?.name} subtitle={sel ? `${sel.id} · ${sel.tier} member · ${sel.visits} visits` : ""}>
        {sel && (
          <div className="space-y-6 p-5 sm:p-6">
            <div className="flex items-center gap-4">
              <Avatar name={sel.name} className="size-14 text-base" />
              <div className="space-y-1 text-[13px] text-ink-3">
                <p className="flex items-center gap-2"><Phone className="size-3.5" /> +91 {sel.phone}</p>
                <p className="flex items-center gap-2"><Mail className="size-3.5" /> {sel.email}</p>
                {sel.birthday && <p className="flex items-center gap-2"><Cake className="size-3.5" /> Birthday {sel.birthday}</p>}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 rounded-xl bg-night p-4 text-paper">
              <div><p className="eyebrow text-paper/45">Spend</p><p className="mt-1 font-display text-xl">{compactInr(sel.spend)}</p></div>
              <div><p className="eyebrow text-paper/45">Points</p><p className="mt-1 font-display text-xl">{num(sel.points)}</p></div>
              <div><p className="eyebrow text-paper/45">Avg bill</p><p className="mt-1 font-display text-xl">{inr(Math.round(sel.spend / sel.visits))}</p></div>
            </div>
            <div>
              <p className="eyebrow mb-2 text-mute">Favourite</p>
              <p className="font-display text-xl italic">{sel.fav}</p>
            </div>
            <div>
              <p className="eyebrow mb-2 text-mute">Recent orders</p>
              <ul className="divide-y divide-line-2 rounded-xl border border-line bg-white text-[13px]">
                {[["NL-24771", "Today", 2380], ["NL-23904", "14 Nov", 3150], ["NL-23122", "2 Nov", 1840]].map(([id, d, a]) => (
                  <li key={id as string} className="flex justify-between px-4 py-2.5"><span className="font-mono">{id}</span><span className="text-mute">{d}</span><span className="font-mono">{inr(a as number)}</span></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-2 text-mute">Notes</p>
              <Textarea defaultValue={sel.note ?? ""} placeholder="Allergies, preferences, occasions…" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => toast.success("500 bonus points added")}><Gift className="size-4" /> Gift points</Button>
              <Button variant="ghost" onClick={() => toast("Data export is restricted", { description: "Requires 'Customers · export' permission" })}><Lock className="size-4" /></Button>
            </div>
          </div>
        )}
      </Sheet>
    </>
  );
}
