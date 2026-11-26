"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Download, ExternalLink, Printer } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Panel } from "@/components/admin/kit";
import { NeelaMark } from "@/components/brand";
import { Button, Field, Input, Segmented, Switch } from "@/components/ui";
import { tables } from "@/lib/data";
import {
  downloadAllQrLabelsPdf,
  downloadQrLabelPdf,
  svgToPngDataUrl,
} from "@/lib/pdf-documents";
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
  const [printAll, setPrintAll] = useState(false);
  const th = themes[theme];

  useEffect(() => {
    if (!printAll) return;
    const clearPrintAll = () => setPrintAll(false);
    window.addEventListener("afterprint", clearPrintAll);
    return () => window.removeEventListener("afterprint", clearPrintAll);
  }, [printAll]);

  const qrPng = async (label: string) => {
    const svg = document.querySelector<SVGSVGElement>(`[data-qr-table="${label}"] svg`);
    if (!svg) throw new Error(`The QR code for table ${label} is not available.`);
    return svgToPngDataUrl(svg);
  };

  const printAllLabels = () => {
    setPrintAll(true);
    window.setTimeout(() => window.print(), 100);
  };

  const downloadSelectedLabel = async () => {
    try {
      downloadQrLabelPdf(selected, await qrPng(selected), th);
      toast.success(`Table ${selected} label downloaded`, { description: "PDF · 60 × 90 mm" });
    } catch (error) {
      console.error("QR label PDF generation failed", error);
      toast.error(error instanceof Error ? error.message : "Could not download the QR label.");
    }
  };

  const downloadAllLabels = async () => {
    try {
      const labels = await Promise.all(tables.map(async (table) => ({
        label: table.label,
        png: await qrPng(table.label),
      })));
      downloadAllQrLabelsPdf(labels, th);
      toast.success("All table labels downloaded", { description: "A4 PDF · 60 × 90 mm labels" });
    } catch (error) {
      console.error("Bulk QR label PDF generation failed", error);
      toast.error(error instanceof Error ? error.message : "Could not download the table labels.");
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Sales & Operations"
        title={<>QR <em>ordering</em></>}
        description="One unique code per table. Guests browse, customise and send orders straight to the kitchen, call a waiter, ask for the bill and leave feedback."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={printAllLabels}><Printer className="size-3.5" /> Print all</Button>
            <Button variant="outline" size="sm" onClick={downloadAllLabels}><Download className="size-3.5" /> Download all</Button>
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
                  data-qr-table={t.label}
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
            <Button variant="outline" size="sm" onClick={downloadSelectedLabel}><Download className="size-3.5" /> Download label PDF</Button>
          </div>
        </div>
      </div>
      {printAll && (
        <div className="print-document qr-print-document">
          {Array.from({ length: Math.ceil(tables.length / 6) }, (_, page) => (
            <div className="qr-print-page" key={page}>
              {tables.slice(page * 6, page * 6 + 6).map((table) => (
                <article className="qr-print-label" key={table.id} style={{ backgroundColor: th.bg, color: th.fg }}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold tracking-widest">NEELA</span>
                    <span className="font-mono text-[8pt] uppercase tracking-widest">Table</span>
                  </div>
                  <p className="mt-4 font-display text-[36pt] leading-none" style={{ color: th.accent }}>{table.label}</p>
                  <div className="mt-3 bg-white p-2">
                    <QRCodeSVG value={`https://neela.kitchen/t/${table.label}`} size={180} level="H" fgColor="#15140f" style={{ display: "block", width: "100%", height: "auto" }} />
                  </div>
                  <p className="mt-3 text-center font-mono text-[7pt] uppercase tracking-widest">Scan · order · pay</p>
                </article>
              ))}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
