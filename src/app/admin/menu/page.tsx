"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { CalendarClock, ImagePlus, LayoutGrid, List, Plus, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { DataTable, PageHeader, Panel, SearchBox, type Column } from "@/components/admin/kit";
import { Badge, Button, DietMark, Field, Input, Segmented, Select, Sheet, Switch, Tabs, Textarea } from "@/components/ui";
import { categories, menu as initial, type MenuItem } from "@/lib/menu";
import { cn, inr } from "@/lib/utils";

export default function MenuAdmin() {
  const [items, setItems] = useState(initial.map((m) => ({ ...m, available: m.id !== "m01" ? true : false })));
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [edit, setEdit] = useState<MenuItem | null>(null);
  const [tab, setTab] = useState<"items" | "combos" | "schedules">("items");

  const rows = useMemo(() => items.filter((m) => (cat === "all" || m.category === cat) && (!q || m.name.toLowerCase().includes(q.toLowerCase()))), [items, cat, q]);
  const toggle = (id: string, v: boolean) => {
    setItems((xs) => xs.map((x) => (x.id === id ? { ...x, available: v } : x)));
    toast(v ? "Back on the menu" : "Marked 86 — hidden on POS, QR & website", { description: items.find((x) => x.id === id)?.name });
  };

  const cols: Column<MenuItem>[] = [
    { key: "name", header: "Item", mobile: "primary", render: (m) => <span className="flex items-center gap-3"><span className="relative hidden size-10 shrink-0 overflow-hidden rounded-lg bg-paper-2 md:block">{m.image && <Image src={m.image} alt="" fill sizes="40px" className="object-cover" />}</span><DietMark diet={m.diet} /><span className="font-medium">{m.name}</span></span> },
    { key: "cat", header: "Category", mobile: "secondary", render: (m) => <span className="text-ink-3">{categories.find((c) => c.id === m.category)?.name}</span> },
    { key: "price", header: "Price", render: (m) => <span className="font-mono">{inr(m.price)}{m.compareAt && <span className="ml-1.5 text-mute line-through">{m.compareAt}</span>}</span> },
    { key: "station", header: "Station", render: (m) => <span className="text-ink-3">{m.station}</span> },
    { key: "prep", header: "Prep", render: (m) => <span className="font-mono text-[12.5px]">{m.prep}m</span> },
    { key: "food", header: "Food cost", render: (m) => <span className={cn("font-mono text-[12.5px]", (m.cost ?? 0) / m.price > 0.33 ? "text-chili" : "text-ink-3")}>{Math.round(((m.cost ?? 0) / m.price) * 100)}%</span> },
    { key: "av", header: "Available", align: "right", mobile: "badge", render: (m) => <span onClick={(e) => e.stopPropagation()}><Switch checked={m.available !== false} onChange={(v) => toggle(m.id, v)} label="Available" /></span> },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Catalog"
        title={<>Menu <em>management</em></>}
        description="Categories, items, variants, add-ons, combos and schedules. Changes publish instantly to POS, QR menu, website, Swiggy and Zomato."
        actions={<Button size="sm" onClick={() => setEdit({ id: "new", name: "", description: "", category: "small-plates", price: 0, diet: "veg", prep: 10, station: "Curry" })}><Plus className="size-3.5" /> New item</Button>}
      />

      <div className="mb-5">
        <Tabs value={tab} onChange={setTab} tabs={[{ value: "items", label: "Items", count: items.length }, { value: "combos", label: "Combos", count: 3 }, { value: "schedules", label: "Schedules & seasonal", count: 4 }]} />
      </div>

      {tab === "items" && (
        <>
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 sm:mx-0 sm:px-0">
              {[{ id: "all", name: "All" }, ...categories].map((c) => (
                <button key={c.id} onClick={() => setCat(c.id)} className={cn("shrink-0 rounded-full border px-3 py-1.5 text-[12.5px]", cat === c.id ? "border-ink bg-ink text-paper" : "border-line bg-white text-ink-2")}>
                  {c.name}
                  <span className="ml-1.5 font-mono text-[10.5px] opacity-60">{c.id === "all" ? items.length : items.filter((i) => i.category === c.id).length}</span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <SearchBox value={q} onChange={setQ} placeholder="Search items" className="flex-1 lg:w-56" />
              <Segmented size="sm" value={view} onChange={setView} options={[{ value: "grid", label: <LayoutGrid className="size-3.5" /> }, { value: "list", label: <List className="size-3.5" /> }]} />
            </div>
          </div>

          {view === "grid" ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {rows.map((m) => (
                <article key={m.id} className={cn("card group overflow-hidden transition", m.available === false && "opacity-60")}>
                  <button onClick={() => setEdit(m)} className="relative block aspect-[16/10] w-full overflow-hidden bg-paper-2 text-left">
                    {m.image ? (
                      <Image src={m.image} alt={m.name} fill sizes="(min-width:1280px) 25vw, (min-width:640px) 50vw, 100vw" className="object-cover transition duration-700 group-hover:scale-105" />
                    ) : (
                      <span className="grid h-full place-items-center font-display text-6xl italic text-paper-3">{m.name[0]}</span>
                    )}
                    <div className="absolute left-3 top-3 flex gap-1.5">
                      {m.tags?.includes("bestseller") && <Badge tone="ink"><Sparkles className="size-3" /> Bestseller</Badge>}
                      {m.available === false && <Badge tone="red">86&apos;d</Badge>}
                    </div>
                  </button>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="flex items-center gap-2 truncate text-[14.5px] font-medium"><DietMark diet={m.diet} />{m.name}</p>
                        <p className="mt-0.5 text-[12px] text-mute">{categories.find((c) => c.id === m.category)?.name} · {m.station} · {m.prep}m</p>
                      </div>
                      <Switch checked={m.available !== false} onChange={(v) => toggle(m.id, v)} label="Available" />
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-line-2 pt-3 text-[12.5px]">
                      <span className="font-mono text-[14px]">{inr(m.price)}</span>
                      <span className="text-mute">{m.variants ? `${m.variants.length} variants` : m.addons ? `${m.addons.length} add-on groups` : "No options"}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <Panel flush><DataTable rows={rows} columns={cols} rowKey={(m) => m.id} onRow={setEdit} /></Panel>
          )}
        </>
      )}

      {tab === "combos" && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { n: "Weekday Thali + Sol Kadhi", p: 999, was: 990 + 295, items: ["Garden or Coastal Thali", "Sol Kadhi Spritz"], when: "Mon–Fri · 12:00–15:30" },
            { n: "Biryani for Two", p: 1290, was: 1590, items: ["Thalassery Biryani (sharing)", "Burnt garlic raita", "2 × Elaneer Payasam"], when: "All day" },
            { n: "Date Night", p: 2990, was: 3480, items: ["Tuna Tartare", "Prawn Moilee + 2 appams", "Rose Gateau", "2 cocktails"], when: "Fri–Sun · after 19:00" },
          ].map((c) => (
            <Panel key={c.n} title={c.n} subtitle={c.when}>
              <ul className="space-y-1.5 text-[13.5px] text-ink-3">{c.items.map((i) => <li key={i}>— {i}</li>)}</ul>
              <div className="mt-4 flex items-baseline gap-2 border-t border-line-2 pt-3">
                <span className="font-display text-3xl">{inr(c.p)}</span>
                <span className="font-mono text-[12.5px] text-mute line-through">{inr(c.was)}</span>
                <Badge tone="green" className="ml-auto">Save {inr(c.was - c.p)}</Badge>
              </div>
            </Panel>
          ))}
        </div>
      )}

      {tab === "schedules" && (
        <Panel flush>
          <ul className="divide-y divide-line-2">
            {[
              ["Lunch menu", "Thalis, idli-vada, weekday combos", "Tue–Sun · 12:00 – 15:30", "All branches", true],
              ["Dinner menu", "Full à la carte", "Daily · 19:00 – 23:30", "All branches", true],
              ["Monsoon specials", "Kozhikode fish fry, Mangalorean buns", "1 Jun – 30 Sep", "Indiranagar, Bandra", false],
              ["Onam Sadya", "26-dish banana-leaf feast", "28 Aug – 7 Sep", "Indiranagar, Kovalam", false],
            ].map(([n, d, t, b, on]) => (
              <li key={n as string} className="flex flex-wrap items-center gap-4 px-4 py-4 sm:px-5">
                <CalendarClock className="size-5 text-mute" />
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-medium">{n as string}</p>
                  <p className="text-[12.5px] text-mute">{d as string}</p>
                </div>
                <p className="font-mono text-[12px] text-ink-3">{t as string}</p>
                <p className="w-40 text-[12.5px] text-ink-3">{b as string}</p>
                <Badge tone={on ? "green" : "neutral"} dot>{on ? "Live" : "Scheduled"}</Badge>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      <ItemEditor item={edit} onClose={() => setEdit(null)} />
    </>
  );
}

function ItemEditor({ item, onClose }: { item: MenuItem | null; onClose: () => void }) {
  return (
    <Sheet
      open={!!item}
      onClose={onClose}
      width="max-w-xl"
      title={item?.id === "new" ? "New item" : item?.name}
      subtitle={item?.id === "new" ? "Add a dish to the catalogue" : "Edit item · changes are versioned"}
      footer={
        <div className="flex gap-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button className="flex-1" onClick={() => { toast.success("Item saved", { description: "Published to POS, QR, website and aggregators" }); onClose(); }}>Save &amp; publish</Button>
        </div>
      }
    >
      {item && (
        <div className="space-y-6 p-5 sm:p-6">
          <div className="relative grid aspect-[16/9] place-items-center overflow-hidden rounded-xl border border-dashed border-line bg-paper-2/50">
            {item.image ? <Image src={item.image} alt="" fill sizes="560px" className="object-cover" /> : <span className="flex flex-col items-center gap-2 text-[13px] text-mute"><ImagePlus className="size-6" />Upload photo (Supabase Storage)</span>}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Name" className="sm:col-span-2"><Input defaultValue={item.name} /></Field>
            <Field label="Description" className="sm:col-span-2"><Textarea defaultValue={item.description} /></Field>
            <Field label="Category">
              <Select defaultValue={item.category}>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select>
            </Field>
            <Field label="Dietary label">
              <Select defaultValue={item.diet}><option value="veg">Veg</option><option value="egg">Egg</option><option value="nonveg">Non-veg</option></Select>
            </Field>
            <Field label="Price (₹)"><Input type="number" defaultValue={item.price} className="font-mono" /></Field>
            <Field label="Discount price (₹)" hint="optional"><Input type="number" defaultValue={item.compareAt ? item.price : ""} className="font-mono" /></Field>
            <Field label="Prep time (min)"><Input type="number" defaultValue={item.prep} className="font-mono" /></Field>
            <Field label="Kitchen station">
              <Select defaultValue={item.station}>{["Tandoor", "Curry", "Grill", "Cold", "Pastry", "Bar"].map((s) => <option key={s}>{s}</option>)}</Select>
            </Field>
            <Field label="HSN / SAC" hint="restaurant service"><Input defaultValue="996331" className="font-mono" /></Field>
            <Field label="GST slab"><Select defaultValue="5"><option value="5">5% (no ITC)</option><option value="18">18% (outdoor catering)</option></Select></Field>
          </div>

          <div>
            <p className="eyebrow mb-2 text-mute">Tags</p>
            <div className="flex flex-wrap gap-2">
              {["Bestseller", "Featured", "Chef's pick", "Spicy", "New", "Seasonal", "Jain option"].map((t) => {
                const on = item.tags?.some((x) => t.toLowerCase().startsWith(x));
                return <span key={t} className={cn("rounded-full border px-3 py-1.5 text-[12.5px]", on ? "border-ink bg-ink text-paper" : "border-line bg-white")}>{t}</span>;
              })}
            </div>
          </div>

          <div>
            <p className="eyebrow mb-2 text-mute">Variants</p>
            <div className="divide-y divide-line-2 rounded-xl border border-line bg-white">
              {(item.variants ?? [{ id: "r", label: "Regular", price: 0 }]).map((v) => (
                <div key={v.id} className="flex items-center justify-between px-4 py-2.5 text-[13.5px]"><span>{v.label}</span><span className="font-mono text-ink-3">{v.price ? `+ ${inr(v.price)}` : "base"}</span></div>
              ))}
            </div>
          </div>

          <div>
            <p className="eyebrow mb-2 text-mute">Branch pricing</p>
            <div className="divide-y divide-line-2 rounded-xl border border-line bg-white text-[13.5px]">
              {[["Indiranagar", 0], ["Sea Deck, Kovalam", 50], ["Bandra West", 80]].map(([b, d]) => (
                <div key={b as string} className="flex items-center justify-between px-4 py-2.5"><span>{b as string}</span><span className="font-mono">{inr(item.price + (d as number))}</span></div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Sheet>
  );
}
