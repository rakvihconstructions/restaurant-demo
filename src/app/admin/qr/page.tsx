"use client";

import Link from "next/link";
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Download, ExternalLink, Printer } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Panel } from "@/components/admin/kit";
import { NeelaMark } from "@/components/brand";
import { Button, Field, Input, Segmented, Switch } from "@/components/ui";
import { tables } from "@/lib/data";
import { cn } from "@/lib/utils";

const themes = {
  ink: { bg: "#15140f", fg: "#f4efe6", accent: "#d4952a", label: "Ink" },
  paper: { bg: "#f4efe6", fg: "#15140f", accent: "#b23a26", label: "Paper" },
  neela: { bg: "#4e1d84", fg: "#ffffff", accent: "#f5a623", label: "Purple" },
};

export default function QrPage() {
  const [enabled, setEnabled] = useState(true);
  const [payAtTable, setPayAtTable] = useState(true);
  const [callWaiter, setCallWaiter] = useState(true);
  const [feedback, setFeedback] = useState(true);
  const [theme, setTheme] = useState<keyof typeof themes>("ink");
  const [headline, setHeadline] = useState("Order at your own pace.");
  const [selected, setSelected] = useState("07");
  const th = themes[theme];

  return (
    <>
      <PageHeader
        eyebrow="Sales & Operations"
        title={<>QR <em>ordering</em></>}
        description="One unique code per table. Guests browse, customise and send orders straight to the kitchen, call a waiter, ask for the bill and leave feedback."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => toast.success("26 table cards queued", { description: "A5 print sheet · PDF" })}><Printer className="size-3.5" /> Print all</Button>
            <Link href={`/t/${selected}`} target="_blank"><Button size="sm"><ExternalLink className="size-3.5" /> Open guest view</Button></Link>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div className="space-y-5 xl:col-span-4">
          <Panel title="Settings">
            <div className="divide-y divide-line-2">
              {[
                ["QR ordering", "Guests can order from their phone", enabled, setEnabled],
                ["Pay at table", "UPI & card via Razorpay", payAtTable, setPayAtTable],
                ["Call waiter & request bill", "Pings the assigned waiter", callWaiter, setCallWaiter],
                ["Feedback after meal", "Private, goes to the manager", feedback, setFeedback],
              ].map(([l, d, v, set]) => (
                <div key={l as string} className="flex items-center justify-between gap-4 py-3">
                  <div>
                    <p className="text-[13.5px] font-medium">{l as string}</p>
                    <p className="text-[12px] text-mute">{d as string}</p>
                  </div>
                  <Switch checked={v as boolean} onChange={set as (b: boolean) => void} label={l as string} />
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="Digital menu look">
            <div className="space-y-4">
              <Field label="Card theme">
                <Segmented value={theme} onChange={setTheme} options={Object.entries(themes).map(([k, v]) => ({ value: k as keyof typeof themes, label: v.label }))} />
              </Field>
              <Field label="Welcome line"><Input value={headline} onChange={(e) => setHeadline(e.target.value)} /></Field>
            </div>
          </Panel>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-[1fr_auto] xl:col-span-8">
          <Panel title="Table codes" subtitle={`${tables.length} tables · tap to preview`} className="order-2 sm:order-1">
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
              {tables.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelected(t.label)}
                  className={cn("flex flex-col items-center gap-2 rounded-xl border p-3 transition", selected === t.label ? "border-ink bg-paper-2/60" : "border-line-2 hover:border-ink-3", !enabled && "opacity-40")}
                >
                  <QRCodeSVG value={`https://neela.kitchen/t/${t.label}`} size={64} bgColor="transparent" fgColor="#15140f" level="M" />
                  <span className="font-mono text-[11.5px]">T-{t.label}</span>
                </button>
              ))}
            </div>
          </Panel>

          <div className="order-1 flex flex-col items-center gap-3 sm:order-2">
            <div className="w-[260px] rounded-[22px] p-6 shadow-[0_30px_60px_-30px_rgba(21,20,15,.5)] transition-colors duration-500" style={{ background: th.bg, color: th.fg }}>
              <div className="flex items-center justify-between">
                <NeelaMark light={theme !== "paper"} className="text-[13px]" />
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-60">Table</span>
              </div>
              <p className="mt-6 font-display text-[64px] leading-none" style={{ color: th.accent }}>{selected}</p>
              <p className="mt-2 font-display text-[19px] italic leading-tight">{headline}</p>
              <div className="mt-6 rounded-xl bg-white p-3">
                <QRCodeSVG value={`https://neela.kitchen/t/${selected}`} size={188} level="H" fgColor="#15140f" style={{ width: "100%", height: "auto" }} />
              </div>
              <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.18em] opacity-60">Scan · order · pay</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => toast.success(`Table ${selected} card downloaded`, { description: "PNG · 1200×1800" })}><Download className="size-3.5" /> Download card</Button>
          </div>
        </div>
      </div>
    </>
  );
}
