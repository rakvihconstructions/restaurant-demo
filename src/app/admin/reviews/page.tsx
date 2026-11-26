"use client";

import { useState } from "react";
import { Flag, MessageSquareReply, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Panel, Stat } from "@/components/admin/kit";
import { Avatar, Badge, Button, Segmented, Stars, StatusPill, Textarea } from "@/components/ui";
import { INITIAL_GUEST_REVIEWS, useHydrated, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function AdminReviewsPage() {
  const hydrated = useHydrated();
  const storedReviews = useStore((s) => s.guestReviews);
  const deleteGuestReview = useStore((s) => s.deleteGuestReview);
  const replyGuestReview = useStore((s) => s.replyGuestReview);

  const reviews = hydrated ? storedReviews : INITIAL_GUEST_REVIEWS;
  const [filter, setFilter] = useState<"all" | "pending" | "flagged">("all");
  const [replyId, setReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const rows = reviews.filter((r) => filter === "all" || r.status === filter);
  const avg = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "5.0";
  const dist = [5, 4, 3, 2, 1].map((s) => ({
    s,
    n: reviews.filter((r) => r.rating === s).length,
  }));
  const total = Math.max(1, reviews.length);

  const handleDelete = (id: string, guest: string) => {
    deleteGuestReview(id);
    if (replyId === id) setReplyId(null);
    toast.success("Review deleted", {
      description: `${guest}'s review has been removed from the Admin inbox and live website.`,
    });
  };

  return (
    <>
      <PageHeader
        eyebrow="Guests & Feedback"
        title={<>Reviews &amp; <em>moderation</em></>}
        description="View, reply to, or delete guest reviews. Changes sync immediately with Demo Restaurant's public Reviews page."
      />

      <div className="mb-5 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <Stat label="Average rating" value={avg} delta={1.4} hint="live guest reviews" />
        <Stat label="Published reviews" value={String(reviews.length)} delta={12.6} />
        <Stat label="Response rate" value="88%" hint="median 3h 20m" />
        <Stat label="Flagged" value={String(reviews.filter((r) => r.status === "flagged").length)} tone="chili" hint="ready to review or delete" />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div className="space-y-5 xl:col-span-4">
          <Panel title="Rating spread">
            <div className="flex items-end gap-4">
              <p className="font-display text-6xl leading-none">{avg}</p>
              <div className="pb-1">
                <Stars value={Number(avg)} />
                <p className="mt-1 text-[12px] text-mute">{reviews.length} live reviews</p>
              </div>
            </div>
            <ul className="mt-5 space-y-2">
              {dist.map((d) => (
                <li key={d.s} className="flex items-center gap-3 text-[12.5px]">
                  <span className="w-3 font-mono">{d.s}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-paper-2">
                    <div
                      className={cn("h-full rounded-full", d.s >= 4 ? "bg-[#4e1d84]" : d.s === 3 ? "bg-turmeric" : "bg-chili")}
                      style={{ width: `${(d.n / total) * 100}%` }}
                    />
                  </div>
                  <span className="w-10 text-right font-mono text-mute">{Math.round((d.n / total) * 100)}%</span>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel title="Most mentioned">
            <div className="flex flex-wrap gap-2">
              {[
                ["prawn moilee", 84, true],
                ["verandah", 61, true],
                ["service", 58, true],
                ["biryani", 52, true],
                ["kokum collins", 41, true],
                ["wait time", 12, false],
              ].map(([w, n, pos]) => (
                <span key={w as string} className={cn("rounded-full px-3 py-1.5 text-[12.5px]", pos ? "bg-leaf-soft text-leaf" : "bg-chili-soft text-chili")}>
                  {w as string} <span className="font-mono text-[11px] opacity-70">{n as number}</span>
                </span>
              ))}
            </div>
          </Panel>
        </div>

        <Panel
          className="xl:col-span-8"
          title="Guest Reviews Inbox"
          actions={
            <Segmented
              size="sm"
              value={filter}
              onChange={setFilter}
              options={[
                { value: "all", label: "All" },
                { value: "pending", label: "Needs reply" },
                { value: "flagged", label: "Flagged" },
              ]}
            />
          }
          flush
        >
          {rows.length === 0 ? (
            <div className="border-t border-line-2 px-5 py-12 text-center text-[14px] text-mute">
              No reviews in this filter.
            </div>
          ) : (
            <ul className="divide-y divide-line-2 border-t border-line-2">
              {rows.map((r) => (
                <li key={r.id} className={cn("px-4 py-5 sm:px-5", r.status === "flagged" && "bg-chili-soft/30")}>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <Avatar name={r.guest} className="size-7 text-[10px]" />
                    <span className="text-[13.5px] font-semibold">{r.guest}</span>
                    <Stars value={r.rating} />
                    <Badge tone="outline">{r.source}</Badge>
                    <Badge tone="ink">{r.room}</Badge>
                    <span className="text-[12px] text-mute">{r.date}</span>
                    <span className="ml-auto"><StatusPill status={r.status} /></span>
                  </div>

                  <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[#1e293b]">“{r.quote}”</p>
                  {r.dish && <p className="mt-2 text-[12px] text-mute">Dish: {r.dish}</p>}

                  {r.reply && (
                    <div className="mt-3 rounded-xl border border-[#4e1d84]/15 bg-[#f3e8ff] p-3 text-[13px] text-[#334155]">
                      <span className="font-bold text-[#4e1d84]">Demo Restaurant reply:</span> {r.reply}
                    </div>
                  )}

                  {replyId === r.id ? (
                    <div className="mt-4 space-y-2">
                      <Textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder={`Reply to ${r.guest}…`}
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            if (replyText.trim()) replyGuestReview(r.id, replyText.trim());
                            setReplyId(null);
                            setReplyText("");
                            toast.success("Reply published");
                          }}
                        >
                          Post reply
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setReplyId(null)}>Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setReplyId(r.id);
                          setReplyText(
                            r.reply ??
                              `Thank you, ${r.guest.split(" ")[0]} — we'll share your note with Chef Vikram and the team. — Ananya, Demo Restaurant`,
                          );
                        }}
                      >
                        <MessageSquareReply className="size-3.5" /> {r.reply ? "Edit reply" : "Reply"}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => toast("Flagged for manager follow-up")}>
                        <Flag className="size-3.5" /> Escalate
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="ml-auto text-[#ef4444] hover:bg-[#fef2f2] hover:text-[#dc2626]"
                        onClick={() => handleDelete(r.id, r.guest)}
                      >
                        <Trash2 className="size-3.5" /> Delete review
                      </Button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}
