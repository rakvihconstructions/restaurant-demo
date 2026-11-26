"use client";

import { useState } from "react";
import { Check, Plus, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Panel } from "@/components/admin/kit";
import { Button, Select } from "@/components/ui";
import { permissionActions, permissionModules, roles } from "@/lib/data";
import { cn } from "@/lib/utils";

function defaults(role: string) {
  const grid: Record<string, Record<string, boolean>> = {};
  permissionModules.forEach((m, mi) => {
    grid[m] = {};
    permissionActions.forEach((a, ai) => {
      let v = false;
      if (role === "Restaurant Admin") v = true;
      else if (role === "Branch Manager") v = !(m === "Settings" && a === "delete");
      else if (role === "Cashier") v = ["Orders", "POS & Billing"].includes(m) ? ai < 3 : m === "Discounts" || m === "Customers" ? a === "view" || a === "create" : false;
      else if (role === "Waiter") v = ["Orders", "POS & Billing"].includes(m) && ai < 2;
      else if (role === "Kitchen Staff") v = m === "Orders" ? a === "view" || a === "edit" : m === "Menu" && a === "view";
      else if (role === "Inventory Manager") v = ["Inventory", "Menu"].includes(m) ? ai < 5 : m === "Reports" && a === "view";
      else if (role === "Accountant") v = ["Reports", "Refunds"].includes(m) ? a === "view" || a === "export" || (m === "Refunds" && a === "approve") : false;
      else if (role === "Delivery Staff") v = m === "Orders" && (a === "view" || a === "edit");
      grid[m][a] = v || (mi === 0 && ai === 0);
    });
  });
  return grid;
}

export default function RolesPage() {
  const [role, setRole] = useState(roles[2].name);
  const [grid, setGrid] = useState(() => defaults(roles[2].name));
  const pick = (r: string) => { setRole(r); setGrid(defaults(r)); };

  return (
    <>
      <PageHeader
        eyebrow="Administration"
        title={<>Roles &amp; <em>permissions</em></>}
        description="Role templates with granular view / create / edit / delete / approve / export rights, branch restrictions, and approval rules for sensitive actions. Enforced server-side with row-level security."
        actions={<Button size="sm"><Plus className="size-3.5" /> Custom role</Button>}
      />
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div className="xl:col-span-4">
          <div className="hidden space-y-1.5 xl:block">
            {roles.map((r) => (
              <button key={r.name} onClick={() => pick(r.name)} className={cn("w-full rounded-xl border p-4 text-left transition", role === r.name ? "border-ink bg-white" : "border-transparent hover:bg-white/60")}>
                <div className="flex items-center justify-between"><p className="text-[14px] font-medium">{r.name}</p><span className="font-mono text-[11.5px] text-mute">{r.users} users</span></div>
                <p className="mt-1 text-[12.5px] text-mute">{r.desc}</p>
              </button>
            ))}
          </div>
          <div className="xl:hidden"><Select value={role} onChange={(e) => pick(e.target.value)}>{roles.map((r) => <option key={r.name}>{r.name}</option>)}</Select></div>
        </div>

        <div className="space-y-5 xl:col-span-8">
          <Panel title={role} subtitle={roles.find((r) => r.name === role)?.desc} actions={<Button size="sm" onClick={() => toast.success("Permissions saved", { description: `${role} · change logged in audit trail` })}>Save</Button>} flush>
            <div className="thin-scroll overflow-x-auto border-t border-line-2">
              <table className="w-full min-w-[600px] text-[13px]">
                <thead>
                  <tr className="bg-paper/50">
                    <th className="px-5 py-2.5 text-left font-mono text-[10.5px] font-normal uppercase tracking-[0.14em] text-mute">Module</th>
                    {permissionActions.map((a) => <th key={a} className="py-2.5 text-center font-mono text-[10.5px] font-normal uppercase tracking-[0.14em] text-mute">{a}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-line-2">
                  {permissionModules.map((m) => (
                    <tr key={m}>
                      <td className="px-5 py-2.5 font-medium">{m}</td>
                      {permissionActions.map((a) => {
                        const on = grid[m][a];
                        return (
                          <td key={a} className="py-2 text-center">
                            <button
                              aria-label={`${m} ${a}`}
                              onClick={() => setGrid((g) => ({ ...g, [m]: { ...g[m], [a]: !on } }))}
                              className={cn("mx-auto grid size-7 place-items-center rounded-md border transition", on ? "border-ink bg-ink text-paper" : "border-line bg-white text-transparent hover:border-ink-3")}
                            >
                              <Check className="size-3.5" />
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Panel title="Branch access">
              <div className="space-y-2 text-[13.5px]">
                {["Indiranagar", "Sea Deck, Kovalam", "Bandra West", "Jubilee Hills"].map((b, i) => (
                  <label key={b} className="flex items-center justify-between rounded-lg border border-line-2 px-3 py-2.5"><span>{b}</span><input type="checkbox" defaultChecked={i === 0 || role === "Restaurant Admin"} className="size-4 accent-[#15140f]" /></label>
                ))}
              </div>
            </Panel>
            <Panel title="Approval rules">
              <ul className="space-y-3 text-[13px]">
                {[["Discount above 20%", "Branch Manager"], ["Any refund", "Branch Manager"], ["Void after KOT printed", "Captain or above"], ["Price change", "Restaurant Admin"], ["Customer data export", "Restaurant Admin"]].map(([a, b]) => (
                  <li key={a} className="flex items-start gap-2.5"><ShieldAlert className="mt-0.5 size-4 shrink-0 text-turmeric" /><span className="flex-1">{a}</span><span className="text-mute">{b}</span></li>
                ))}
              </ul>
            </Panel>
          </div>
        </div>
      </div>
    </>
  );
}
