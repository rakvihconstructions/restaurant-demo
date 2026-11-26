"use client";

import { useState } from "react";
import { Bell, Mail, MessageCircle, Smartphone } from "lucide-react";
import { PageHeader, Panel, Stat } from "@/components/admin/kit";
import { Badge, Switch, Tabs } from "@/components/ui";
import { notificationTemplates, notifications } from "@/lib/data";
import { cn } from "@/lib/utils";

const icon = { WhatsApp: MessageCircle, SMS: Smartphone, Email: Mail, Push: Bell } as const;

export default function NotificationsPage() {
  const [tab, setTab] = useState<"feed" | "templates" | "prefs">("feed");
  const [tpl, setTpl] = useState(notificationTemplates);

  return (
    <>
      <PageHeader eyebrow="Digital Presence" title="Notifications" description="Alerts for orders, kitchen, payments, reservations and stock — plus guest messages over SMS, email, WhatsApp Business and push, with templates and delivery logs." />
      <div className="mb-5 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <Stat label="Messages sent (30d)" value="4,372" delta={9.4} />
        <Stat label="Delivery rate" value="98.1%" />
        <Stat label="WhatsApp read rate" value="86%" hint="order updates" />
        <Stat label="Opt-outs" value="12" hint="0.3%" />
      </div>
      <Panel flush>
        <div className="px-4 pt-4 sm:px-5"><Tabs value={tab} onChange={setTab} tabs={[{ value: "feed", label: "Activity", count: notifications.filter((n) => n.unread).length }, { value: "templates", label: "Templates", count: tpl.length }, { value: "prefs", label: "Staff alerts" }]} /></div>
        {tab === "feed" && (
          <ul className="mt-3 divide-y divide-line-2 border-t border-line-2">
            {notifications.map((n) => (
              <li key={n.id} className={cn("flex gap-3 px-4 py-3.5 sm:px-5", n.unread && "bg-turmeric-soft/25")}>
                <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", n.unread ? "bg-chili" : "bg-paper-3")} />
                <div className="min-w-0 flex-1"><p className="text-[13.5px] font-medium">{n.title}</p><p className="text-[12.5px] text-mute">{n.body}</p></div>
                <Badge tone="outline" className="hidden capitalize sm:inline-flex">{n.type}</Badge>
                <span className="shrink-0 font-mono text-[11px] text-mute">{n.time}</span>
              </li>
            ))}
          </ul>
        )}
        {tab === "templates" && (
          <ul className="mt-3 divide-y divide-line-2 border-t border-line-2">
            {tpl.map((t) => {
              const I = icon[t.channel as keyof typeof icon];
              return (
                <li key={t.name} className="flex flex-wrap items-center gap-3 px-4 py-3.5 sm:px-5">
                  <span className="grid size-9 place-items-center rounded-full bg-paper-2"><I className="size-4" /></span>
                  <div className="min-w-0 flex-1"><p className="text-[13.5px] font-medium">{t.name}</p><p className="text-[12px] text-mute">{t.channel} · when {t.trigger.toLowerCase()}</p></div>
                  <span className="font-mono text-[12px] text-ink-3">{t.sent.toLocaleString("en-IN")} sent · {t.delivered}%</span>
                  <Switch checked={t.enabled} onChange={(v) => setTpl((xs) => xs.map((x) => (x.name === t.name ? { ...x, enabled: v } : x)))} label={t.name} />
                </li>
              );
            })}
          </ul>
        )}
        {tab === "prefs" && (
          <div className="thin-scroll overflow-x-auto p-4 sm:p-5">
            <table className="w-full min-w-[560px] text-[13px]">
              <thead><tr className="text-left font-mono text-[10.5px] uppercase tracking-[0.14em] text-mute"><th className="pb-3 font-normal">Event</th>{["Push", "WhatsApp", "Email"].map((c) => <th key={c} className="pb-3 text-center font-normal">{c}</th>)}</tr></thead>
              <tbody className="divide-y divide-line-2">
                {["New order", "Order delayed > target", "Payment failed", "Refund requested", "New reservation", "Low stock", "Negative review"].map((e, i) => (
                  <tr key={e}><td className="py-3">{e}</td>{[0, 1, 2].map((c) => <td key={c} className="py-3 text-center"><span className="inline-flex"><Switch checked={(i + c) % 3 !== 2} onChange={() => {}} label={`${e} ${c}`} /></span></td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </>
  );
}
