"use client";

import { Panel } from "@/components/admin/kit";
import { Badge, type Tone } from "@/components/ui";
import { auditLog } from "@/lib/data";

export function AuditTable() {
  const tone: Record<string, Tone> = { low: "neutral", medium: "amber", high: "red" };
  return (
    <Panel flush>
      <div className="thin-scroll overflow-x-auto">
        <table className="w-full min-w-[760px] text-[13px]">
          <thead><tr className="border-b border-line-2 bg-paper/50 text-left font-mono text-[10.5px] uppercase tracking-[0.14em] text-mute">{["Time", "User", "Action", "Target", "IP", "Risk"].map((h) => <th key={h} className="px-4 py-2.5 font-normal first:pl-5">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-line-2">
            {auditLog.map((a, i) => (
              <tr key={i} className={a.risk === "high" ? "bg-chili-soft/30" : ""}>
                <td className="px-4 py-3 pl-5 font-mono text-[12px] text-mute">{a.time}</td>
                <td className="px-4 py-3"><span className="font-medium">{a.user}</span> <span className="text-mute">· {a.role}</span></td>
                <td className="px-4 py-3">{a.action}</td>
                <td className="px-4 py-3 text-ink-3">{a.target}</td>
                <td className="px-4 py-3 font-mono text-[12px] text-mute">{a.ip}</td>
                <td className="px-4 py-3"><Badge tone={tone[a.risk]} className="capitalize">{a.risk}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
