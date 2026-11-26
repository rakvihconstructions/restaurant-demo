"use client";

import { useMemo, useState } from "react";
import { Download, FileText, Printer, RotateCcw, XCircle } from "lucide-react";
import { toast } from "sonner";
import { DataTable, PageHeader, Panel, SearchBox, type Column } from "@/components/admin/kit";
import { Badge, Button, DietMark, Field, Segmented, Select, Sheet, StatusPill, Tabs, Textarea } from "@/components/ui";
import { orders, type Order } from "@/lib/data";
import { cn, inr } from "@/lib/utils";

const channels = ["All", "Dine-in", "QR", "Takeaway", "Delivery", "Online"] as const;

export default function OrdersPage() {
  const [tab, setTab] = useState<"active" | "done" | "cancelled" | "all">("active");
  const [channel, setChannel] = useState<(typeof channels)[number]>("All");
  const [q, setQ] = useState("");
  const [view, setView] = useState<"list" | "board">("list");
  const [open, setOpen] = useState<Order | null>(null);

  const rows = useMemo(
    () =>
      orders.filter((o) => {
        const t =
          tab === "all" ||
          (tab === "active" && ["new", "accepted", "preparing", "ready", "out", "served"].includes(o.status)) ||
          (tab === "done" && o.status === "completed") ||
          (tab === "cancelled" && o.status === "cancelled");
        return t && (channel === "All" || o.channel === channel) && (!q || (o.id + o.customer + (o.table ?? "")).toLowerCase().includes(q.toLowerCase()));
      }),
    [tab, channel, q],
  );

  const cols: Column<Order>[] = [
    { key: "id", header: "Order", mobile: "primary", render: (o) => <span className="flex items-center gap-2"><span className="font-mono text-[12.5px]">{o.id}</span>{o.priority && <Badge tone="red">Priority</Badge>}</span> },
    { key: "cust", header: "Guest", mobile: "secondary", render: (o) => <span>{o.customer}{o.table && <span className="text-mute"> · T{o.table}</span>}</span> },
    { key: "ch", header: "Channel", render: (o) => <span className="text-ink-3">{o.channel}</span> },
    { key: "items", header: "Items", mobile: "hide", className: "max-w-[260px]", render: (o) => <span className="block truncate text-ink-3">{o.lines.map((l) => `${l.qty}× ${l.item.name}`).join(", ")}</span> },
    { key: "time", header: "Placed", render: (o) => <span className="font-mono text-[12.5px] text-ink-3">{o.time}</span> },
    { key: "pay", header: "Payment", render: (o) => <span className={cn("text-[12.5px]", o.payment === "Unpaid" ? "text-amber-ink" : "text-ink-3")}>{o.payment}</span> },
    { key: "status", header: "Status", mobile: "badge", render: (o) => <StatusPill status={o.status} /> },
    { key: "total", header: "Total", align: "right", render: (o) => <span className="font-mono">{inr(o.total)}</span> },
  ];

  const board = ["new", "preparing", "ready", "out"] as const;

  return (
    <>
      <PageHeader
        eyebrow="Sales & Operations"
        title="Orders"
        description="Every dine-in, QR, takeaway, online and delivery order in one place. Cancellations and refunds require a reason and manager approval."
        actions={
          <>
            <Segmented size="sm" value={view} onChange={setView} options={[{ value: "list", label: "List" }, { value: "board", label: "Board" }]} />
            <Button variant="outline" size="sm"><Download className="size-3.5" /> Export CSV</Button>
          </>
        }
      />

      {view === "list" ? (
        <Panel flush>
          <div className="space-y-4 px-4 pt-4 sm:px-5">
            <Tabs
              value={tab}
              onChange={setTab}
              tabs={[
                { value: "active", label: "Active", count: orders.filter((o) => !["completed", "cancelled"].includes(o.status)).length },
                { value: "done", label: "Completed", count: orders.filter((o) => o.status === "completed").length },
                { value: "cancelled", label: "Cancelled", count: orders.filter((o) => o.status === "cancelled").length },
                { value: "all", label: "All today", count: orders.length },
              ]}
            />
            <div className="flex flex-col gap-3 pb-4 sm:flex-row sm:items-center">
              <SearchBox value={q} onChange={setQ} placeholder="Order ID, guest, table…" className="sm:w-72" />
              <div className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 sm:mx-0 sm:px-0">
                {channels.map((c) => (
                  <button key={c} onClick={() => setChannel(c)} className={cn("shrink-0 rounded-full border px-3 py-1.5 text-[12.5px]", channel === c ? "border-ink bg-ink text-paper" : "border-line bg-white text-ink-2")}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DataTable rows={rows} columns={cols} rowKey={(o) => o.id} onRow={setOpen} empty="No orders match these filters." />
        </Panel>
      ) : (
        <div className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0 lg:grid lg:grid-cols-4 lg:overflow-visible">
          {board.map((s) => {
            const list = orders.filter((o) => o.status === s || (s === "new" && o.status === "accepted"));
            return (
              <div key={s} className="w-[80vw] shrink-0 snap-start sm:w-[340px] lg:w-auto">
                <div className="mb-3 flex items-center justify-between px-1">
                  <StatusPill status={s} />
                  <span className="font-mono text-[12px] text-mute">{list.length}</span>
                </div>
                <div className="space-y-2.5">
                  {list.map((o) => (
                    <button key={o.id} onClick={() => setOpen(o)} className="card block w-full p-4 text-left transition hover:-translate-y-0.5 hover:shadow-lg">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[12px]">{o.id}</span>
                        <span className="font-mono text-[11.5px] text-mute">{o.minutesAgo}m</span>
                      </div>
                      <p className="mt-2 text-[13.5px] font-medium">{o.customer}</p>
                      <p className="text-[12px] text-mute">{o.channel}{o.table && ` · Table ${o.table}`}{o.rider && ` · ${o.rider}`}</p>
                      <p className="mt-2 line-clamp-2 text-[12.5px] text-ink-3">{o.lines.map((l) => `${l.qty}× ${l.item.name}`).join(", ")}</p>
                      <p className="mt-3 border-t border-line-2 pt-2 text-right font-mono text-[13px]">{inr(o.total)}</p>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <OrderSheet order={open} onClose={() => setOpen(null)} />
    </>
  );
}

function OrderSheet({ order, onClose }: { order: Order | null; onClose: () => void }) {
  const [mode, setMode] = useState<"view" | "cancel" | "refund">("view");
  const close = () => { setMode("view"); onClose(); };
  if (!order) return <Sheet open={false} onClose={close}>{null}</Sheet>;
  const steps = ["new", "preparing", "ready", order.channel === "Delivery" ? "out" : "served", "completed"];
  const at = Math.max(0, steps.indexOf(order.status === "accepted" ? "new" : order.status));

  return (
    <Sheet
      open={!!order}
      onClose={close}
      width="max-w-lg"
      title={<span className="font-mono text-[20px]">{order.id}</span>}
      subtitle={`${order.channel} · ${order.time} · taken by ${order.staff}`}
      footer={
        mode === "view" ? (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Button variant="outline" size="sm" onClick={() => toast.success("Sent to receipt printer", { description: "Epson TM-T82X · Counter" })}><Printer className="size-3.5" /> Print</Button>
            <Button variant="outline" size="sm" onClick={() => toast.success("Invoice PDF downloaded", { description: `INV/2026-27/${order.id.slice(3)}` })}><FileText className="size-3.5" /> Invoice</Button>
            <Button variant="outline" size="sm" onClick={() => setMode("refund")} disabled={order.payment === "Unpaid"}><RotateCcw className="size-3.5" /> Refund</Button>
            <Button variant="outline" size="sm" className="text-chili" onClick={() => setMode("cancel")} disabled={order.status === "cancelled"}><XCircle className="size-3.5" /> Cancel</Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setMode("view")}>Back</Button>
            <Button variant="danger" className="flex-1" onClick={() => { toast.success(mode === "cancel" ? "Cancellation sent for approval" : "Refund sent for approval", { description: "Ananya R. (Branch Manager) has been notified · logged in audit trail" }); close(); }}>
              Request {mode === "cancel" ? "cancellation" : "refund"}
            </Button>
          </div>
        )
      }
    >
      {mode === "view" ? (
        <div className="space-y-6 p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <StatusPill status={order.status} />
            {order.priority && <Badge tone="red">Priority</Badge>}
          </div>
          {order.status !== "cancelled" && (
            <div className="flex gap-1">
              {steps.map((s, i) => (
                <div key={s} className="flex-1">
                  <div className={cn("h-1 rounded-full", i <= at ? "bg-ink" : "bg-paper-3")} />
                  <p className={cn("mt-1.5 text-[10.5px] capitalize", i <= at ? "text-ink" : "text-mute")}>{s === "out" ? "On the way" : s}</p>
                </div>
              ))}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4 rounded-xl bg-paper-2/60 p-4 text-[13px]">
            <div><p className="text-mute">Guest</p><p className="mt-0.5 font-medium">{order.customer}</p></div>
            <div><p className="text-mute">Phone</p><p className="mt-0.5 font-mono">{order.phone}</p></div>
            <div><p className="text-mute">{order.table ? "Table" : order.rider ? "Rider" : "Pickup"}</p><p className="mt-0.5">{order.table ?? order.rider ?? "Counter"}</p></div>
            <div><p className="text-mute">Payment</p><p className="mt-0.5">{order.payment}</p></div>
          </div>
          <ul className="divide-y divide-line-2">
            {order.lines.map((l) => (
              <li key={l.item.id} className="flex items-center gap-3 py-3">
                <DietMark diet={l.item.diet} />
                <span className="flex-1 text-[14px]"><span className="font-mono text-mute">{l.qty}×</span> {l.item.name}</span>
                <span className="text-[11.5px] text-mute">{l.item.station}</span>
                <span className="w-16 text-right font-mono text-[13px]">{inr(l.item.price * l.qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="space-y-1.5 border-t border-line pt-4 text-[13.5px]">
            <div className="flex justify-between text-ink-3"><dt>Subtotal</dt><dd className="font-mono">{inr(order.subtotal)}</dd></div>
            {order.discount > 0 && <div className="flex justify-between text-leaf"><dt>Discount (TIDE15)</dt><dd className="font-mono">− {inr(order.discount)}</dd></div>}
            <div className="flex justify-between text-ink-3"><dt>CGST 2.5% + SGST 2.5%</dt><dd className="font-mono">{inr(order.tax)}</dd></div>
            {order.channel === "Delivery" && <div className="flex justify-between text-ink-3"><dt>Delivery</dt><dd className="font-mono">{inr(49)}</dd></div>}
            <div className="flex justify-between pt-1 text-[16px] font-medium"><dt>Total</dt><dd className="font-mono">{inr(order.total)}</dd></div>
          </dl>
        </div>
      ) : (
        <div className="space-y-5 p-5 sm:p-6">
          <div className="rounded-xl border border-chili/20 bg-chili-soft/60 p-4 text-[13px] text-chili">
            {mode === "cancel" ? "Cancelling" : "Refunding"} <span className="font-mono">{order.id}</span> ({inr(order.total)}) needs approval from a Branch Manager. The request, reason and approver are written to the audit log.
          </div>
          <Field label="Reason">
            <Select defaultValue="">
              <option value="" disabled>Choose a reason</option>
              <option>Guest changed mind</option>
              <option>Item unavailable (86&apos;d)</option>
              <option>Quality complaint</option>
              <option>Long wait time</option>
              <option>Duplicate order</option>
            </Select>
          </Field>
          {mode === "refund" && (
            <Field label="Refund to">
              <Select><option>Original method ({order.payment})</option><option>Store credit (loyalty points)</option><option>Cash</option></Select>
            </Field>
          )}
          <Field label="Note"><Textarea placeholder="Visible to the approver and in the audit trail" /></Field>
        </div>
      )}
    </Sheet>
  );
}
