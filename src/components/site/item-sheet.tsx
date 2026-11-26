"use client";

import Image from "next/image";
import { useState } from "react";
import { Minus, Plus, Timer, X } from "lucide-react";
import { toast } from "sonner";
import { DietMark, Sheet } from "@/components/ui";
import type { MenuItem } from "@/lib/menu";
import { useStore } from "@/lib/store";
import { cn, inr } from "@/lib/utils";
import { SignButton } from "./sign";

export function ItemSheet({ item, onClose }: { item: MenuItem | null; onClose: () => void }) {
  return (
    <Sheet open={!!item} onClose={onClose} side="bottom" site>
      {item && <ItemBody key={item.id} item={item} onClose={onClose} />}
    </Sheet>
  );
}

function ItemBody({ item, onClose }: { item: MenuItem; onClose: () => void }) {
  const add = useStore((s) => s.add);
  const [variant, setVariant] = useState(item.variants?.[0]);
  const [addons, setAddons] = useState<Record<string, string[]>>(() =>
    Object.fromEntries((item.addons ?? []).map((g) => [g.id, g.max === 1 ? [g.options[0].id] : []])),
  );
  const [qty, setQty] = useState(1);

  const chosen = (item.addons ?? []).flatMap((g) => g.options.filter((o) => addons[g.id]?.includes(o.id)));
  const unit = item.price + (variant?.price ?? 0) + chosen.reduce((s, a) => s + a.price, 0);

  const toggle = (gid: string, oid: string, max: number) =>
    setAddons((prev) => {
      const cur = prev[gid] ?? [];
      if (max === 1) return { ...prev, [gid]: [oid] };
      if (cur.includes(oid)) return { ...prev, [gid]: cur.filter((x) => x !== oid) };
      if (cur.length >= max) return prev;
      return { ...prev, [gid]: [...cur, oid] };
    });

  return (
    <div className="flex flex-col">
      <div className="relative">
        {item.image ? (
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image src={item.image} alt={item.name} fill sizes="560px" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b111e]/35 to-transparent" />
          </div>
        ) : (
          <div className="grid h-32 place-items-center bg-[#0b111e]">
            <span className="text-3xl font-extrabold tracking-[-0.03em] text-[#e5bc6f]">{item.name}</span>
          </div>
        )}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 grid size-9 place-items-center rounded-full bg-white/90 text-[#0b111e] shadow-md backdrop-blur-md transition hover:bg-[#0b111e] hover:text-white"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="px-6 pb-2 pt-5">
        <div className="flex items-center gap-3">
          <DietMark diet={item.diet} />
          <span className="inline-flex items-center gap-1 rounded-full bg-[#f3efe6] px-2.5 py-0.5 text-[11.5px] font-semibold text-[#5c564d]">
            <Timer className="size-3" /> {item.prep} min prep
          </span>
        </div>
        <h3 className="mt-3 text-[26px] font-extrabold tracking-[-0.03em] text-[#0b111e]">{item.name}</h3>
        <p className="mt-1.5 text-[14.5px] leading-relaxed text-[#5c564d]">{item.description}</p>
      </div>

      {item.variants && (
        <fieldset className="px-6 pt-5">
          <legend className="mb-2 text-[12px] font-bold uppercase tracking-wider text-[#787166]">Portion</legend>
          <div className="space-y-2">
            {item.variants.map((v) => {
              const selected = variant?.id === v.id;
              return (
                <button
                  key={v.id}
                  onClick={() => setVariant(v)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-[14.5px] font-semibold transition",
                    selected
                      ? "border-[#0b111e] bg-[#0b111e] text-white"
                      : "border-[#151311]/12 bg-white text-[#151311] hover:border-[#0b111e]/35",
                  )}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={cn(
                        "grid size-4 place-items-center rounded-full border",
                        selected ? "border-[#e5bc6f]" : "border-[#151311]/30",
                      )}
                    >
                      {selected && <span className="size-2 rounded-full bg-[#e5bc6f]" />}
                    </span>
                    {v.label}
                  </span>
                  <span className="font-bold tnum">{v.price ? `+ ${inr(v.price)}` : inr(item.price)}</span>
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      {item.addons?.map((g) => (
        <fieldset key={g.id} className="px-6 pt-5">
          <legend className="mb-2 flex w-full justify-between text-[12px] font-bold uppercase tracking-wider text-[#787166]">
            {g.label}
            <span className="font-semibold normal-case tracking-normal">{g.max === 1 ? "Pick one" : `Up to ${g.max}`}</span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {g.options.map((o) => {
              const on = addons[g.id]?.includes(o.id);
              return (
                <button
                  key={o.id}
                  onClick={() => toggle(g.id, o.id, g.max)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-[13.5px] font-semibold transition",
                    on
                      ? "border-[#0b111e] bg-[#0b111e] text-white"
                      : "border-[#151311]/12 bg-white text-[#4a453e] hover:border-[#0b111e]/35",
                  )}
                >
                  {o.label}
                  {o.price > 0 && (
                    <span className={cn("ml-1.5 text-[12px]", on ? "text-[#e5bc6f]" : "text-[#787166]")}>
                      +₹{o.price}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}

      <div className="safe-bottom sticky bottom-0 mt-6 flex items-center gap-3 border-t border-[#151311]/10 bg-white/95 px-6 py-4 backdrop-blur-md">
        <div className="flex h-12 items-center rounded-full border border-[#151311]/14 bg-[#faf8f4]">
          <button
            className="grid h-full w-10 place-items-center rounded-l-full hover:bg-[#f3efe6]"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Less"
          >
            <Minus className="size-4" />
          </button>
          <span className="w-7 text-center text-[15px] font-extrabold tnum">{qty}</span>
          <button
            className="grid h-full w-10 place-items-center rounded-r-full hover:bg-[#f3efe6]"
            onClick={() => setQty((q) => q + 1)}
            aria-label="More"
          >
            <Plus className="size-4" />
          </button>
        </div>
        <SignButton
          tone="red"
          className="flex-1 justify-between"
          onClick={() => {
            add({ itemId: item.id, qty, variant, addons: chosen });
            toast.success(`${item.name} added`, { description: `${qty} × ${inr(unit)}` });
            onClose();
          }}
        >
          <span>Add to order</span>
          <span className="font-bold tnum">{inr(unit * qty)}</span>
        </SignButton>
      </div>
    </div>
  );
}
