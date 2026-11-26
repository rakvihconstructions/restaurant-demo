"use client";

import { useState } from "react";
import { CalendarDays, Clock, Plus, Star } from "lucide-react";
import { toast } from "sonner";
import { DataTable, PageHeader, Panel, Stat, type Column } from "@/components/admin/kit";
import { Avatar, Badge, Button, Progress, Sheet, StatusPill, Tabs } from "@/components/ui";
import { staff, type Staff } from "@/lib/data";
import { cn, compactInr, inr } from "@/lib/utils";

const days = ["Mon 23", "Tue 24", "Wed 25", "Thu 26", "Fri 27", "Sat 28", "Sun 29"];

export default function StaffPage() {
  const [tab, setTab] = useState<"team" | "rota" | "leave">("team");
  const [sel, setSel] = useState<Staff | null>(null);
  const cols: Column<Staff>[] = [
    { key: "n", header: "Employee", mobile: "primary", render: (s) => <span className="flex items-center gap-3"><Avatar name={s.name.replace("Chef ", "")} className="hidden md:inline-grid" /><span><span className="block font-medium">{s.name}</span><span className="hidden font-mono text-[11px] text-mute md:block">{s.id}</span></span></span> },
    { key: "r", header: "Role", mobile: "secondary", render: (s) => <span className="text-ink-3">{s.role} · {s.branch}</span> },
    { key: "sh", header: "Today", render: (s) => <span className="font-mono text-[12.5px]">{s.shift}</span> },
    { key: "a", header: "Attendance", render: (s) => <div className="flex w-28 items-center gap-2"><Progress value={s.attendance} tone={s.attendance < 90 ? "turmeric" : "ink"} /><span className="font-mono text-[11.5px]">{s.attendance}%</span></div> },
    { key: "rt", header: "Rating", render: (s) => <span className="flex items-center gap-1 font-mono text-[12.5px]"><Star className="size-3 fill-turmeric text-turmeric" />{s.rating}</span> },
    { key: "st", header: "Status", mobile: "badge", render: (s) => <StatusPill status={s.status} /> },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Supply & Team"
        title={<>Staff &amp; <em>attendance</em></>}
        description="Profiles, IDs, branch assignment, logins, shifts, attendance, leave and salary records — with performance for every role."
        actions={<Button size="sm" onClick={() => toast.success("Invite sent", { description: "Staff app login via OTP" })}><Plus className="size-3.5" /> Add employee</Button>}
      />
      <div className="mb-5 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <Stat label="On shift now" value={staff.filter((s) => s.status === "on-shift").length} hint={`of ${staff.length} at Indiranagar`} />
        <Stat label="Attendance (Nov)" value="94.6%" delta={1.8} />
        <Stat label="Payroll (Nov)" value={compactInr(1864000)} hint="all branches" />
        <Stat label="Leave requests" value="2" hint="1 pending approval" />
      </div>
      <Panel flush>
        <div className="px-4 pt-4 sm:px-5"><Tabs value={tab} onChange={setTab} tabs={[{ value: "team", label: "Team", count: staff.length }, { value: "rota", label: "Shift rota" }, { value: "leave", label: "Leave" }]} /></div>
        {tab === "team" && <div className="pt-3"><DataTable rows={staff} columns={cols} rowKey={(s) => s.id} onRow={setSel} /></div>}
        {tab === "rota" && (
          <div className="thin-scroll overflow-x-auto p-4 sm:p-5">
            <table className="w-full min-w-[820px] text-[12.5px]">
              <thead><tr><th className="w-48 pb-3 text-left font-mono text-[10.5px] font-normal uppercase tracking-[0.14em] text-mute">Employee</th>{days.map((d) => <th key={d} className={cn("pb-3 font-mono text-[10.5px] font-normal uppercase tracking-[0.1em]", d === "Thu 26" ? "text-ink" : "text-mute")}>{d}</th>)}</tr></thead>
              <tbody>
                {staff.slice(0, 10).map((s, r) => (
                  <tr key={s.id} className="border-t border-line-2">
                    <td className="py-2 pr-3"><span className="block truncate font-medium">{s.name}</span><span className="text-[11px] text-mute">{s.role}</span></td>
                    {days.map((d, i) => {
                      const off = (r + i) % 6 === 0;
                      const late = (r + i) % 4 === 1;
                      return (
                        <td key={d} className="p-1">
                          <div className={cn("rounded-lg px-2 py-1.5 text-center font-mono text-[11px]", off ? "bg-paper-2 text-mute" : late ? "bg-neela text-paper" : "bg-turmeric-soft text-amber-ink", d === "Thu 26" && "ring-1 ring-ink")}>
                            {off ? "Off" : late ? "17–23:30" : "11–20"}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {tab === "leave" && (
          <ul className="mt-3 divide-y divide-line-2 border-t border-line-2">
            {[["Neha Joshi", "Sick leave", "26 – 27 Nov", "approved"], ["Rahul Shetty", "Casual leave", "4 – 5 Dec", "pending"], ["Divya Krishnan", "Earned leave", "24 – 31 Dec", "pending"]].map(([n, t, d, s]) => (
              <li key={n} className="flex flex-wrap items-center gap-3 px-4 py-3.5 sm:px-5">
                <Avatar name={n} />
                <div className="min-w-0 flex-1"><p className="text-[13.5px] font-medium">{n}</p><p className="text-[12px] text-mute">{t} · {d}</p></div>
                {s === "pending" ? <div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => toast("Leave declined")}>Decline</Button><Button size="sm" onClick={() => toast.success("Leave approved", { description: "Rota updated automatically" })}>Approve</Button></div> : <Badge tone="green" dot>Approved</Badge>}
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Sheet open={!!sel} onClose={() => setSel(null)} title={sel?.name} subtitle={sel ? `${sel.id} · ${sel.role}` : ""}>
        {sel && (
          <div className="space-y-5 p-5 sm:p-6">
            <div className="flex items-center gap-4"><Avatar name={sel.name.replace("Chef ", "")} className="size-14 text-base" /><div><StatusPill status={sel.status} /><p className="mt-1 text-[13px] text-mute">Joined {sel.joined} · {sel.branch}</p></div></div>
            <div className="grid grid-cols-3 gap-3">
              <div className="card p-3"><p className="text-[11.5px] text-mute">Attendance</p><p className="mt-1 font-display text-2xl">{sel.attendance}%</p></div>
              <div className="card p-3"><p className="text-[11.5px] text-mute">Rating</p><p className="mt-1 font-display text-2xl">{sel.rating}</p></div>
              <div className="card p-3"><p className="text-[11.5px] text-mute">CTC / mo</p><p className="mt-1 font-display text-2xl">{compactInr(sel.salary)}</p></div>
            </div>
            <div className="space-y-2 text-[13px]">
              <p className="flex items-center gap-2 text-ink-3"><Clock className="size-3.5" /> Today {sel.shift} · clocked in 16:52 (geo-fenced)</p>
              <p className="flex items-center gap-2 text-ink-3"><CalendarDays className="size-3.5" /> 12 days leave balance</p>
            </div>
            <div>
              <p className="eyebrow mb-2 text-mute">Salary record</p>
              <ul className="divide-y divide-line-2 rounded-xl border border-line bg-white text-[13px]">
                {["Nov 2026", "Oct 2026", "Sep 2026"].map((m, i) => <li key={m} className="flex justify-between px-4 py-2.5"><span>{m}</span><span className="font-mono">{inr(sel.salary + (i === 1 ? 2500 : 0))}</span><Badge tone={i === 0 ? "amber" : "green"}>{i === 0 ? "Processing" : "Paid"}</Badge></li>)}
              </ul>
            </div>
          </div>
        )}
      </Sheet>
    </>
  );
}
