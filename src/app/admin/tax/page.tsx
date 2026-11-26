"use client";

import { useState } from "react";
import { AlertCircle, Download, FileText } from "lucide-react";
import { toast } from "sonner";
import { KV, PageHeader, Panel, Stat } from "@/components/admin/kit";
import { Badge, Button, Field, Input, Segmented, Select, Switch } from "@/components/ui";
import { restaurant } from "@/lib/data";
import { compactInr, inr } from "@/lib/utils";

export default function TaxPage() {
  const [mode, setMode] = useState<"exclusive" | "inclusive">("exclusive");
  const [service, setService] = useState(false);
  const base = 1000;
  const gst = mode === "exclusive" ? base * 0.05 : base - base / 1.05;

  return (
    <>
      <PageHeader eyebrow="Finance" title={<>Tax &amp; <em>invoices</em></>} description="GST configuration, invoice numbering, credit notes and GST reports. Tax treatment must be validated against your actual registration." actions={<Button variant="outline" size="sm" onClick={() => toast.success("GSTR-1 export ready", { description: "November 2026 · CSV + JSON" })}><Download className="size-3.5" /> GSTR-1 (Nov)</Button>} />

      <div className="mb-5 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <Stat label="Taxable sales (Nov)" value={compactInr(7323800)} />
        <Stat label="CGST collected" value={compactInr(183095)} />
        <Stat label="SGST collected" value={compactInr(183095)} />
        <Stat label="Credit notes" value="14" hint={inr(18420)} />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <Panel className="xl:col-span-7" title="GST configuration" subtitle={`GSTIN ${restaurant.gstin} · Karnataka (29)`}>
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Registration type"><Select><option>Regular — restaurant service (5%, no ITC)</option><option>Composition scheme</option><option>Hotel restaurant (tariff &gt; ₹7,500)</option></Select></Field>
              <Field label="Default SAC"><Input defaultValue="996331" className="font-mono" /></Field>
              <Field label="Intra-state split"><Input defaultValue="CGST 2.5% + SGST 2.5%" readOnly /></Field>
              <Field label="Inter-state (delivery)"><Input defaultValue="IGST 5%" readOnly /></Field>
            </div>
            <Field label="Menu prices are">
              <Segmented value={mode} onChange={setMode} options={[{ value: "exclusive", label: "GST-exclusive" }, { value: "inclusive", label: "GST-inclusive" }]} />
            </Field>
            <div className="flex items-center justify-between rounded-xl border border-line-2 p-4">
              <div><p className="text-[13.5px] font-medium">Service charge</p><p className="text-[12px] text-mute">Must be optional and shown separately. Off by default.</p></div>
              <Switch checked={service} onChange={setService} label="Service charge" />
            </div>
            <div className="flex gap-3 rounded-xl bg-turmeric-soft/70 p-4 text-[12.5px] text-amber-ink">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              This demo shows typical settings. Confirm tax treatment with your CA against your registration before going live.
            </div>
          </div>
        </Panel>

        <div className="space-y-5 xl:col-span-5">
          <Panel title="Preview" subtitle={`An item priced ${inr(base)}`}>
            <div className="divide-y divide-line-2">
              <KV k="Taxable value" v={inr(mode === "exclusive" ? base : base - gst, true)} mono />
              <KV k="CGST 2.5%" v={inr(gst / 2, true)} mono />
              <KV k="SGST 2.5%" v={inr(gst / 2, true)} mono />
              {service && <KV k="Service charge 5% (optional)" v={inr(base * 0.05, true)} mono />}
              <KV k="Guest pays" v={<span className="font-medium">{inr((mode === "exclusive" ? base + gst : base) + (service ? base * 0.05 : 0), true)}</span>} mono />
            </div>
          </Panel>
          <Panel title="Invoice numbering">
            <div className="divide-y divide-line-2">
              <KV k="Format" v="INV/{FY}/{BRANCH}/{SEQ}" mono />
              <KV k="Next number" v="INV/2026-27/IND/018342" mono />
              <KV k="Credit notes" v="CN/2026-27/IND/000214" mono />
              <KV k="Reset" v="Every financial year (1 Apr)" />
            </div>
          </Panel>
        </div>

        <Panel className="xl:col-span-12" title="Recent tax documents" flush>
          <ul className="divide-y divide-line-2 border-t border-line-2">
            {[["INV/2026-27/IND/018341", "Tax invoice", "Aman Gupta", 2997], ["INV/2026-27/IND/018340", "Tax invoice", "Walk-in guest", 1840], ["CN/2026-27/IND/000214", "Credit note", "NL-24771 refund", -745], ["INV/2026-27/IND/018339", "B2B invoice", "Infosys Ltd · GSTIN 29AABCI…", 18450], ["INV/2026-27/IND/018338", "Tax invoice", "Meghna Das", 1556]].map(([n, t, c, a]) => (
              <li key={n as string} className="flex flex-wrap items-center gap-3 px-4 py-3 text-[13.5px] sm:px-5">
                <FileText className="size-4 text-mute" />
                <span className="font-mono text-[12.5px]">{n as string}</span>
                <Badge tone={(a as number) < 0 ? "red" : t === "B2B invoice" ? "blue" : "outline"}>{t as string}</Badge>
                <span className="text-ink-3">{c as string}</span>
                <span className="ml-auto font-mono">{inr(a as number)}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}
