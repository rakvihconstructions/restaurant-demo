"use client";

import { useState } from "react";
import { DatabaseBackup, KeyRound, Printer, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { KV, PageHeader, Panel } from "@/components/admin/kit";
import { AuditTable } from "@/components/admin/audit-table";
import { Badge, Button, Field, Input, Select, Switch, Tabs } from "@/components/ui";
import { auditLog } from "@/lib/data";

export default function SettingsPage() {
  const [tab, setTab] = useState<"general" | "pos" | "security" | "audit">("general");
  const [twofa, setTwofa] = useState(true);
  return (
    <>
      <PageHeader eyebrow="Administration" title={<>Settings &amp; <em>security</em></>} description="Time zone, currency, language, receipts, printers, order numbering, POS / QR / kitchen behaviour, backups, audit logs and access security." />
      <div className="mb-5"><Tabs value={tab} onChange={setTab} tabs={[{ value: "general", label: "General" }, { value: "pos", label: "POS, kitchen & printers" }, { value: "security", label: "Security & data" }, { value: "audit", label: "Audit log", count: auditLog.length }]} /></div>

      {tab === "general" && (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <Panel title="Locale">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Time zone"><Select><option>Asia/Kolkata (IST, UTC+5:30)</option></Select></Field>
              <Field label="Currency"><Select><option>INR — Indian Rupee (₹)</option></Select></Field>
              <Field label="Language"><Select><option>English (India)</option><option>ಕನ್ನಡ</option><option>हिन्दी</option><option>മലയാളം</option></Select></Field>
              <Field label="Number format"><Select><option>12,34,567 (Indian)</option><option>1,234,567</option></Select></Field>
            </div>
          </Panel>
          <Panel title="Order numbers & receipts">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Order prefix"><Input defaultValue="NL-" className="font-mono" /></Field>
              <Field label="KOT prefix"><Input defaultValue="K-" className="font-mono" /></Field>
              <Field label="Receipt footer" className="sm:col-span-2"><Input defaultValue="Thank you for eating with us. GSTIN 29AAKCN4821M1Z6" /></Field>
            </div>
          </Panel>
        </div>
      )}

      {tab === "pos" && (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <Panel title="POS & ordering">
            <div className="divide-y divide-line-2">
              {[["Require table for dine-in", true], ["Allow hold & resume orders", true], ["Round off to nearest rupee", true], ["Ask guest phone at billing", false], ["Auto-accept QR orders", true], ["Barcode scanner input", false]].map(([l, v]) => (
                <div key={l as string} className="flex items-center justify-between py-3 text-[13.5px]">{l as string}<Switch checked={v as boolean} onChange={() => toast("Setting saved")} label={l as string} /></div>
              ))}
            </div>
          </Panel>
          <Panel title="Printers & kitchen">
            <ul className="divide-y divide-line-2">
              {[["Counter receipt", "Epson TM-T82X · 10.0.4.50", true], ["KOT — Curry & Tandoor", "Epson TM-T82X · 10.0.4.51", true], ["KOT — Bar", "TVS RP3160 · 10.0.4.52", true], ["Kitchen display", "2 screens · Curry, Tandoor", true], ["Cash drawer", "Via counter printer", false]].map(([n, d, ok]) => (
                <li key={n as string} className="flex items-center gap-3 py-3">
                  <Printer className="size-4 text-mute" />
                  <div className="flex-1"><p className="text-[13.5px]">{n as string}</p><p className="font-mono text-[11.5px] text-mute">{d as string}</p></div>
                  {ok ? <Badge tone="green" dot>Online</Badge> : <Badge tone="amber" dot>Check</Badge>}
                </li>
              ))}
            </ul>
            <Button variant="outline" size="sm" className="mt-3" onClick={() => toast.success("Test page printed")}>Print test page</Button>
          </Panel>
        </div>
      )}

      {tab === "security" && (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <Panel title="Access">
            <div className="divide-y divide-line-2">
              <div className="flex items-center justify-between py-3 text-[13.5px]"><span className="flex items-center gap-2"><KeyRound className="size-4 text-mute" />Manager PIN for voids &amp; discounts</span><Switch checked={twofa} onChange={setTwofa} label="Manager PIN" /></div>
              <KV k="POS idle lock" v="8 hours (shift length)" />
              <KV k="Active terminals" v="4 devices (2 POS · 2 KDS)" />
            </div>
          </Panel>
          <Panel title="Data integrity">
            <div className="space-y-3 text-[13px] text-ink-3">
              <p className="flex gap-2"><ShieldCheck className="size-4 shrink-0 text-leaf" />All orders, KOTs, and table bills are logged with immutable timestamps.</p>
              <p className="flex gap-2"><ShieldCheck className="size-4 shrink-0 text-leaf" />Money stored as integer paise — no floating-point billing.</p>
              <p className="flex gap-2"><ShieldCheck className="size-4 shrink-0 text-leaf" />GST-compliant invoice numbering across dine-in and takeaway.</p>
            </div>
          </Panel>
          <Panel title="Backups">
            <div className="divide-y divide-line-2">
              <KV k="Last backup" v="Today 04:00 · 1.2 GB" />
              <KV k="Point-in-time recovery" v="7 days" />
              <KV k="Last restore test" v={<span className="text-leaf">18 Nov · passed</span>} />
            </div>
            <Button variant="outline" size="sm" className="mt-3" onClick={() => toast.success("Export queued", { description: "You'll get a download link by email" })}><DatabaseBackup className="size-3.5" /> Export all data</Button>
          </Panel>
        </div>
      )}

      {tab === "audit" && <AuditTable />}
    </>
  );
}
