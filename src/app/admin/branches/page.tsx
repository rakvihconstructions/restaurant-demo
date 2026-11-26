"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Clock, MapPin, Plus, Star, Trash2, Upload, Users } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/kit";
import { Badge, Button, Field, Input, Select, Sheet, Switch } from "@/components/ui";
import { branches as initialBranches, type Branch } from "@/lib/data";
import { compactInr } from "@/lib/utils";

const tone = { open: "green", "closing-soon": "amber", closed: "neutral", renovation: "red" } as const;
const label = { open: "Open", "closing-soon": "Closing soon", closed: "Closed", renovation: "Renovation" };
const week = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function BranchesPage() {
  const [branchList, setBranchList] = useState<Branch[]>(initialBranches);
  const [sel, setSel] = useState<Branch | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  // Add Branch form state
  const [name, setName] = useState("");
  const [area, setArea] = useState("");
  const [city, setCity] = useState("Bengaluru");
  const [manager, setManager] = useState("");
  const [tablesCount, setTablesCount] = useState("24");
  const [hours, setHours] = useState("12:00 – 23:30");
  const [holiday, setHoliday] = useState("Monday");
  const [status, setStatus] = useState<Branch["status"]>("open");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const onPhotoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      toast.error("Image too large", { description: "Please choose an image under 4 MB." });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setName("");
    setArea("");
    setCity("Bengaluru");
    setManager("");
    setTablesCount("24");
    setHours("12:00 – 23:30");
    setHoliday("Monday");
    setStatus("open");
    setPhotoPreview(null);
  };

  const createBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !area.trim()) {
      toast.error("Please enter branch name and area");
      return;
    }
    const next: Branch = {
      id: `BR-${branchList.length + 1}`,
      name: name.trim(),
      area: area.trim(),
      city: city.trim() || "Bengaluru",
      manager: manager.trim() || "Branch Manager",
      tables: Math.max(1, Number(tablesCount) || 20),
      hours: hours.trim() || "12:00 – 23:30",
      holiday,
      status,
      today: 0,
      covers: 0,
      rating: 4.9,
      image: photoPreview || "/img/interior-warm.jpg",
    };
    setBranchList((prev) => [next, ...prev]);
    setAddOpen(false);
    resetForm();
    toast.success(`${next.name} branch added`, {
      description: `${next.area}, ${next.city} · ${next.tables} tables`,
    });
  };

  return (
    <>
      <PageHeader
        eyebrow="Restaurant"
        title="Branches"
        description="Manage Demo Restaurant's dining locations — hours, holidays, seating capacity, photos, and branch managers."
        actions={
          <Button size="sm" onClick={() => setAddOpen(true)}>
            <Plus className="size-3.5" /> Add branch
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {branchList.map((b) => (
          <button
            key={b.id}
            onClick={() => setSel(b)}
            className="card group overflow-hidden text-left transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            <div className="relative aspect-[16/7] overflow-hidden bg-[#1e293b]">
              {b.image.startsWith("data:") ? (
                <img
                  src={b.image}
                  alt={b.name}
                  className="size-full object-cover transition duration-700 group-hover:scale-105"
                />
              ) : (
                <Image
                  src={b.image}
                  alt={b.name}
                  fill
                  sizes="(min-width:768px) 50vw, 100vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-night/80 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-5 text-paper">
                <div>
                  <p className="font-display text-[28px] leading-none">{b.name}</p>
                  <p className="mt-1 flex items-center gap-1 text-[12.5px] text-paper/75">
                    <MapPin className="size-3" />
                    {b.area}, {b.city}
                  </p>
                </div>
                <Badge tone={tone[b.status]} dot>
                  {label[b.status]}
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-4 divide-x divide-line-2 text-center">
              {[
                ["Today", b.today ? compactInr(b.today) : "—"],
                ["Covers", b.covers || "—"],
                ["Tables", b.tables],
                ["Rating", b.rating],
              ].map(([k, v]) => (
                <div key={k as string} className="px-2 py-3.5">
                  <p className="text-[11px] text-mute">{k}</p>
                  <p className="mt-0.5 font-mono text-[14px]">{v}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-line-2 px-5 py-3 text-[12.5px] text-ink-3">
              <span className="flex items-center gap-1.5">
                <Clock className="size-3.5" />
                {b.hours}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="size-3.5" />
                {b.manager}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Add New Branch Sheet with Image Upload */}
      <Sheet
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add New Branch"
        subtitle="Upload a branch photo and enter outlet details"
        footer={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button form="add-branch-form" type="submit" className="flex-1">
              <Plus className="size-4" /> Create Branch
            </Button>
          </div>
        }
      >
        <form id="add-branch-form" onSubmit={createBranch} className="space-y-5 p-5 sm:p-6">
          {/* Image Upload Box */}
          <div>
            <p className="mb-2 text-[12px] font-bold uppercase tracking-wider text-mute">Branch Photo</p>
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={onPhotoFile}
              className="hidden"
            />
            {photoPreview ? (
              <div className="relative aspect-[16/8] w-full overflow-hidden rounded-2xl border border-[#e6eaf2]">
                <img src={photoPreview} alt="Branch preview" className="size-full object-cover" />
                <div className="absolute bottom-3 right-3 flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="bg-white/95"
                    onClick={() => fileRef.current?.click()}
                  >
                    <Upload className="size-3.5" /> Replace
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="danger"
                    onClick={() => setPhotoPreview(null)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex aspect-[16/7] w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#cbd5e1] bg-[#f7f8fc] p-5 text-center transition hover:border-[#5b4fe9] hover:bg-[#f5f4ff]"
              >
                <span className="grid size-11 place-items-center rounded-xl bg-white text-[#5b4fe9] shadow-xs">
                  <Upload className="size-5" />
                </span>
                <span className="text-[13.5px] font-bold text-[#0f172a]">Click to upload branch photo</span>
                <span className="text-[11.5px] text-[#64748b]">PNG, JPG or WebP up to 4 MB</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Branch Name *" className="sm:col-span-2">
              <Input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Koramangala Flagship"
              />
            </Field>
            <Field label="Area / Street *">
              <Input
                required
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="e.g. 80 Feet Road"
              />
            </Field>
            <Field label="City *">
              <Input
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Bengaluru"
              />
            </Field>
            <Field label="Branch Manager">
              <Input
                value={manager}
                onChange={(e) => setManager(e.target.value)}
                placeholder="e.g. Kavya Nair"
              />
            </Field>
            <Field label="Number of Tables">
              <Input
                type="number"
                min={1}
                max={200}
                value={tablesCount}
                onChange={(e) => setTablesCount(e.target.value)}
              />
            </Field>
            <Field label="Operating Hours">
              <Input value={hours} onChange={(e) => setHours(e.target.value)} placeholder="12:00 – 23:30" />
            </Field>
            <Field label="Weekly Holiday">
              <Select value={holiday} onChange={(e) => setHoliday(e.target.value)}>
                <option>None</option>
                <option>Monday</option>
                <option>Tuesday</option>
              </Select>
            </Field>
            <Field label="Status" className="sm:col-span-2">
              <Select value={status} onChange={(e) => setStatus(e.target.value as Branch["status"])}>
                <option value="open">Open</option>
                <option value="closing-soon">Closing soon</option>
                <option value="closed">Temporarily closed</option>
                <option value="renovation">Renovation</option>
              </Select>
            </Field>
          </div>
        </form>
      </Sheet>

      {/* Edit Existing Branch Sheet */}
      <Sheet
        open={!!sel}
        onClose={() => setSel(null)}
        title={sel?.name}
        subtitle={sel ? `${sel.area}, ${sel.city}` : ""}
        footer={
          <Button
            className="w-full"
            onClick={() => {
              setSel(null);
              toast.success("Branch settings saved");
            }}
          >
            Save
          </Button>
        }
      >
        {sel && (
          <div className="space-y-6 p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <Badge tone={tone[sel.status]} dot>
                {label[sel.status]}
              </Badge>
              <span className="flex items-center gap-1 text-[12.5px] text-mute">
                <Star className="size-3 fill-turmeric text-turmeric" />
                {sel.rating}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Branch manager" className="col-span-2">
                <Input defaultValue={sel.manager} />
              </Field>
              <Field label="Status">
                <Select defaultValue={sel.status}>
                  <option value="open">Open</option>
                  <option value="closing-soon">Closing soon</option>
                  <option value="closed">Temporarily closed</option>
                  <option value="renovation">Renovation</option>
                </Select>
              </Field>
              <Field label="Weekly holiday">
                <Select defaultValue={sel.holiday}>
                  <option>None</option>
                  <option>Monday</option>
                  <option>Tuesday</option>
                </Select>
              </Field>
              <Field label="Currency">
                <Select>
                  <option>INR (₹)</option>
                </Select>
              </Field>
              <Field label="Time zone">
                <Select>
                  <option>Asia/Kolkata</option>
                </Select>
              </Field>
            </div>
            <div>
              <p className="eyebrow mb-2 text-mute">Operating hours</p>
              <ul className="divide-y divide-line-2 rounded-xl border border-line bg-white">
                {week.map((d) => {
                  const off = sel.holiday === (d === "Mon" ? "Monday" : "");
                  return (
                    <li key={d} className="flex items-center gap-3 px-4 py-2.5 text-[13px]">
                      <span className="w-10 font-medium">{d}</span>
                      <span className="flex-1 font-mono text-[12.5px] text-ink-3">
                        {off ? "Closed" : "12:00 – 15:30 · 19:00 – 23:30"}
                      </span>
                      <Switch checked={!off} onChange={() => {}} label={`${d} open`} />
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}
      </Sheet>
    </>
  );
}
