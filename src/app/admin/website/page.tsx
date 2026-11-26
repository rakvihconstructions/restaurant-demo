"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { ExternalLink, Globe, Monitor, Smartphone, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Panel } from "@/components/admin/kit";
import { Badge, Button, Field, Input, Segmented, Switch, Textarea } from "@/components/ui";
import { DEFAULT_SITE_CONTENT, useHydrated, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function WebsitePage() {
  const hydrated = useHydrated();
  const storedContent = useStore((s) => s.siteContent);
  const updateSiteContent = useStore((s) => s.updateSiteContent);
  const tenantLogos = useStore((s) => s.tenantLogos);
  const setTenantLogo = useStore((s) => s.setTenantLogo);

  const logoRef = useRef<HTMLInputElement>(null);
  const desktopBannerRef = useRef<HTMLInputElement>(null);
  const mobileBannerRef = useRef<HTMLInputElement>(null);

  const content = hydrated && storedContent ? storedContent : DEFAULT_SITE_CONTENT;
  const logoUrl = hydrated ? tenantLogos["neela"] : undefined;

  const [live, setLive] = useState(true);
  const [reservations, setReservations] = useState(true);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");

  const readImageFile = (
    e: React.ChangeEvent<HTMLInputElement>,
    maxMb: number,
    onDone: (dataUrl: string) => void,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > maxMb * 1024 * 1024) {
      toast.error("Image too large", { description: `Please upload an image under ${maxMb} MB.` });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") onDone(reader.result);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const previewBanner =
    device === "desktop"
      ? content.desktopBannerImage || "/img/spread.jpg"
      : content.mobileBannerImage || content.desktopBannerImage || "/img/spread.jpg";

  return (
    <>
      <PageHeader
        eyebrow="Digital Presence"
        title="Website, Profile & Logo"
        description="Manage Demo Restaurant's brand logo, separate Desktop & Mobile hero banners, website copy, and restaurant contact profile — all in one place."
        actions={
          <>
            <Link href="/" target="_blank">
              <Button variant="outline" size="sm">
                <ExternalLink className="size-3.5" /> View Live Site
              </Button>
            </Link>
            <Button
              size="sm"
              onClick={() => toast.success("Website & profile published", { description: "All banner images and copy are live on the site." })}
            >
              Publish Changes
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div className="space-y-5 xl:col-span-6">
          {/* 1. Brand Logo Upload */}
          <Panel
            title="Brand Logo (Website & Admin Panel)"
            subtitle="Updates the website header, footer, Admin sidebar, POS, Kitchen, and QR menu"
          >
            <input
              ref={logoRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              onChange={(e) =>
                readImageFile(e, 2, (url) => {
                  setTenantLogo("neela", url);
                  toast.success("Brand logo updated", {
                    description: "Applied to both the live website and Admin Panel.",
                  });
                })
              }
              className="hidden"
            />
            <div className="flex flex-wrap items-center gap-4">
              <div className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-2xl border border-[#e6eaf2] bg-[#f7f8fc] p-1.5">
                {logoUrl ? (
                  <img src={logoUrl} alt={content.name} className="size-full object-contain" />
                ) : (
                  <span className="text-[22px] font-extrabold text-[#4e1d84]">{content.name[0]}</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13.5px] font-bold text-[#0f172a]">
                  {logoUrl ? "Custom logo active" : "Upload your restaurant logo"}
                </p>
                <p className="mt-0.5 text-[12px] text-[#64748b]">PNG, SVG, JPG or WebP up to 2 MB.</p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" className="rounded-xl" onClick={() => logoRef.current?.click()}>
                    <Upload className="size-3.5" /> {logoUrl ? "Replace logo" : "Upload logo"}
                  </Button>
                  {logoUrl && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="rounded-xl text-[#ef4444] hover:bg-[#fef2f2]"
                      onClick={() => {
                        setTenantLogo("neela", null);
                        toast("Logo removed");
                      }}
                    >
                      <Trash2 className="size-3.5" /> Remove
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Panel>

          {/* 2. Separate Desktop & Mobile Banner Image Uploads */}
          <Panel
            title="Hero Banner Images (Desktop & Mobile)"
            subtitle="Upload separate widescreen (Desktop) and vertical/compact (Mobile) banner photos"
          >
            <input
              ref={desktopBannerRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) =>
                readImageFile(e, 5, (url) => {
                  updateSiteContent({ desktopBannerImage: url });
                  setDevice("desktop");
                  toast.success("Desktop banner uploaded", { description: "Live on the desktop homepage." });
                })
              }
              className="hidden"
            />
            <input
              ref={mobileBannerRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) =>
                readImageFile(e, 5, (url) => {
                  updateSiteContent({ mobileBannerImage: url });
                  setDevice("mobile");
                  toast.success("Mobile banner uploaded", { description: "Live on the mobile homepage." });
                })
              }
              className="hidden"
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Desktop Banner Card */}
              <div className="rounded-2xl border border-[#e6eaf2] bg-[#f7f8fc] p-3.5">
                <div className="mb-2.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[12.5px] font-bold text-[#0f172a]">
                    <Monitor className="size-4 text-[#4e1d84]" /> Desktop Banner
                  </span>
                  <span className="font-mono text-[10.5px] text-[#64748b]">16:9 wide</span>
                </div>
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-[#e6eaf2] bg-white">
                  {content.desktopBannerImage ? (
                    <img src={content.desktopBannerImage} alt="Desktop banner" className="size-full object-cover" />
                  ) : (
                    <Image src="/img/spread.jpg" alt="Default desktop banner" fill sizes="280px" className="object-cover opacity-80" />
                  )}
                </div>
                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 rounded-xl bg-white"
                    onClick={() => desktopBannerRef.current?.click()}
                  >
                    <Upload className="size-3.5" /> {content.desktopBannerImage ? "Replace" : "Upload"}
                  </Button>
                  {content.desktopBannerImage && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="rounded-xl text-[#ef4444] hover:bg-[#fef2f2]"
                      onClick={() => {
                        updateSiteContent({ desktopBannerImage: null });
                        toast("Desktop banner reset to default");
                      }}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Mobile Banner Card */}
              <div className="rounded-2xl border border-[#e6eaf2] bg-[#f7f8fc] p-3.5">
                <div className="mb-2.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[12.5px] font-bold text-[#0f172a]">
                    <Smartphone className="size-4 text-[#4e1d84]" /> Mobile Banner
                  </span>
                  <span className="font-mono text-[10.5px] text-[#64748b]">4:3 mobile</span>
                </div>
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-[#e6eaf2] bg-white">
                  {content.mobileBannerImage ? (
                    <img src={content.mobileBannerImage} alt="Mobile banner" className="size-full object-cover" />
                  ) : (
                    <Image src="/img/prawn-moilee.jpg" alt="Default mobile banner" fill sizes="280px" className="object-cover opacity-80" />
                  )}
                </div>
                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 rounded-xl bg-white"
                    onClick={() => mobileBannerRef.current?.click()}
                  >
                    <Upload className="size-3.5" /> {content.mobileBannerImage ? "Replace" : "Upload"}
                  </Button>
                  {content.mobileBannerImage && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="rounded-xl text-[#ef4444] hover:bg-[#fef2f2]"
                      onClick={() => {
                        updateSiteContent({ mobileBannerImage: null });
                        toast("Mobile banner reset to default");
                      }}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Panel>

          {/* 3. Hero Banner Copy & Content */}
          <Panel title="Hero Banner Content" subtitle="Updates the live homepage headline, accent text, and subtitle immediately">
            <div className="space-y-4">
              <Field label="Hero Headline">
                <Textarea
                  value={content.headline}
                  onChange={(e) => updateSiteContent({ headline: e.target.value })}
                  rows={2}
                />
              </Field>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Golden Accent Line">
                  <Input
                    value={content.accent}
                    onChange={(e) => updateSiteContent({ accent: e.target.value })}
                    placeholder="Live Fresh"
                  />
                </Field>
                <Field label="Restaurant Display Name">
                  <Input
                    value={content.name}
                    onChange={(e) => updateSiteContent({ name: e.target.value })}
                    placeholder="Demo Restaurant"
                  />
                </Field>
              </div>
              <Field label="Hero Subtitle">
                <Textarea
                  value={content.subtitle}
                  onChange={(e) => updateSiteContent({ subtitle: e.target.value })}
                  rows={2}
                />
              </Field>
            </div>
          </Panel>

          {/* 4. Restaurant Profile & Contact Details (Consolidated from Restaurant Profile) */}
          <Panel title="Restaurant Profile & Contact" subtitle="Shown in the website footer, Visit page, and GST receipts">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="About / Footer Tagline" className="sm:col-span-2">
                <Textarea
                  value={content.tagline}
                  onChange={(e) => updateSiteContent({ tagline: e.target.value })}
                  rows={2}
                />
              </Field>
              <Field label="Street Address" className="sm:col-span-2">
                <Input
                  value={content.address}
                  onChange={(e) => updateSiteContent({ address: e.target.value })}
                />
              </Field>
              <Field label="Phone">
                <Input value={content.phone} onChange={(e) => updateSiteContent({ phone: e.target.value })} />
              </Field>
              <Field label="Email">
                <Input value={content.email} onChange={(e) => updateSiteContent({ email: e.target.value })} />
              </Field>
              <Field label="Operating Hours" className="sm:col-span-2">
                <Input value={content.hours} onChange={(e) => updateSiteContent({ hours: e.target.value })} />
              </Field>
              <Field label="GSTIN">
                <Input
                  value={content.gstin}
                  onChange={(e) => updateSiteContent({ gstin: e.target.value })}
                  className="font-mono"
                />
              </Field>
              <Field label="FSSAI License">
                <Input
                  value={content.fssai}
                  onChange={(e) => updateSiteContent({ fssai: e.target.value })}
                  className="font-mono"
                />
              </Field>
            </div>
          </Panel>

          {/* 5. Status & Domain */}
          <Panel title="Status & Domain">
            <div className="divide-y divide-[#edf0f7]">
              <Row l="Website live" d="demorestaurant.in" on={live} set={setLive} />
              <Row l="Online table bookings" d="Instant reservation confirmation" on={reservations} set={setReservations} />
              <div className="flex items-center justify-between pt-3">
                <span className="flex items-center gap-2 font-mono text-[13px] text-[#334155]">
                  <Globe className="size-4 text-[#94a3b8]" />
                  demorestaurant.in
                </span>
                <Badge tone="green" dot>SSL active</Badge>
              </div>
            </div>
          </Panel>
        </div>

        {/* Live Desktop / Mobile Preview */}
        <div className="xl:col-span-6">
          <div className="sticky top-24">
            <div className="mb-3 flex items-center justify-between">
              <p className="eyebrow text-[#64748b]">
                Live Preview · {device === "desktop" ? "Desktop Banner" : "Mobile Banner"}
              </p>
              <Segmented
                size="sm"
                value={device}
                onChange={setDevice}
                options={[
                  { value: "desktop", label: "Desktop" },
                  { value: "mobile", label: "Mobile" },
                ]}
              />
            </div>

            <div
              className={cn(
                "mx-auto overflow-hidden rounded-3xl border border-[#e6eaf2] bg-white shadow-xl transition-all duration-500",
                device === "mobile" ? "max-w-[340px]" : "max-w-full",
              )}
            >
              <div className="flex items-center gap-1.5 bg-[#2a0a4f] px-3 py-2">
                <span className="size-2.5 rounded-full bg-[#ef4444]/80" />
                <span className="size-2.5 rounded-full bg-[#f5a623]/80" />
                <span className="size-2.5 rounded-full bg-[#10b981]/80" />
                <span className="ml-3 flex-1 rounded bg-white/10 px-2 py-0.5 font-mono text-[10.5px] text-white/70">
                  demorestaurant.in
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-[#4e1d84]/10 bg-white px-4 py-3">
                <div className="flex items-center gap-2">
                  {logoUrl && <img src={logoUrl} alt={content.name} className="size-6 rounded-md object-contain" />}
                  <span className="text-[14px] font-extrabold uppercase tracking-[-0.03em] text-[#4e1d84]">
                    {content.name}
                  </span>
                </div>
                <span className="rounded-full bg-[#4e1d84] px-3 py-1 text-[10.5px] font-bold text-white">
                  Book a Table
                </span>
              </div>

              <div className="p-4">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2a0a4f] via-[#4e1d84] to-[#3b0e6e] p-5 text-white">
                  <div className={cn("grid items-center gap-4", device === "mobile" ? "grid-cols-1" : "grid-cols-12")}>
                    <div className={device === "mobile" ? "" : "col-span-6"}>
                      <p className="whitespace-pre-line text-[17px] font-extrabold uppercase leading-tight">
                        {content.headline}
                      </p>
                      <p className="mt-1 font-display text-[19px] italic text-[#f5a623]">{content.accent}</p>
                      <p className="mt-1.5 line-clamp-2 text-[11px] text-white/80">{content.subtitle}</p>
                      <span className="mt-3 inline-flex rounded-full bg-[#f5a623] px-3.5 py-1 text-[10.5px] font-extrabold text-[#2a0a4f]">
                        Explore Menu →
                      </span>
                    </div>
                    <div className={cn("relative overflow-hidden rounded-xl", device === "mobile" ? "aspect-[16/10]" : "col-span-6 aspect-[16/10]")}>
                      {previewBanner.startsWith("data:") ? (
                        <img src={previewBanner} alt="Banner preview" className="size-full object-cover" />
                      ) : (
                        <Image src={previewBanner} alt="Banner preview" fill sizes="320px" className="object-cover" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-[#e6eaf2] bg-[#f8fafc] p-3 text-[11px] text-[#475569]">
                  <p className="font-bold text-[#0f172a]">{content.address}</p>
                  <p className="mt-0.5">{content.hours} · {content.phone}</p>
                </div>
              </div>

              {!live && (
                <div className="bg-black/80 py-3 text-center text-[12px] font-bold text-white">Site currently offline</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Row({ l, d, on, set }: { l: string; d: string; on: boolean; set: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="text-[13.5px] font-semibold text-[#0f172a]">{l}</p>
        <p className="text-[12px] text-[#64748b]">{d}</p>
      </div>
      <Switch checked={on} onChange={set} label={l} />
    </div>
  );
}
