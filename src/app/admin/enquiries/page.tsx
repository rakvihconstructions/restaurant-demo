"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Clock,
  Mail,
  MessageSquareReply,
  Phone,
  RotateCcw,
  Search,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Panel, Stat } from "@/components/admin/kit";
import { Avatar, Badge, Button, Segmented, Textarea } from "@/components/ui";
import {
  DEFAULT_SITE_CONTENT,
  INITIAL_ENQUIRIES,
  useHydrated,
  useStore,
  type EnquiryStatus,
} from "@/lib/store";
import { cn } from "@/lib/utils";

const STATUS_META: Record<
  EnquiryStatus,
  { label: string; className: string }
> = {
  new: {
    label: "New",
    className: "border-[#4e1d84]/25 bg-[#f3e8ff] text-[#4e1d84]",
  },
  replied: {
    label: "Replied",
    className: "border-[#f5a623]/35 bg-[#fffbeb] text-[#b45309]",
  },
  resolved: {
    label: "Resolved",
    className: "border-[#10b981]/25 bg-[#ecfdf5] text-[#047857]",
  },
};

export default function AdminEnquiriesPage() {
  const hydrated = useHydrated();
  const storedEnquiries = useStore((s) => s.enquiries);
  const storedContent = useStore((s) => s.siteContent);
  const updateEnquiryStatus = useStore((s) => s.updateEnquiryStatus);
  const replyEnquiry = useStore((s) => s.replyEnquiry);
  const deleteEnquiry = useStore((s) => s.deleteEnquiry);

  const enquiries =
    hydrated && Array.isArray(storedEnquiries) ? storedEnquiries : INITIAL_ENQUIRIES;
  const brandName = (hydrated && storedContent?.name) || DEFAULT_SITE_CONTENT.name;

  const [filter, setFilter] = useState<"all" | EnquiryStatus>("all");
  const [query, setQuery] = useState("");
  const [replyId, setReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const newCount = enquiries.filter((e) => e.status === "new").length;
  const repliedCount = enquiries.filter((e) => e.status === "replied").length;
  const resolvedCount = enquiries.filter((e) => e.status === "resolved").length;

  const q = query.trim().toLowerCase();
  const rows = enquiries.filter((e) => {
    if (filter !== "all" && e.status !== filter) return false;
    if (
      q &&
      !(
        e.name.toLowerCase().includes(q) ||
        e.contact.toLowerCase().includes(q) ||
        e.topic.toLowerCase().includes(q) ||
        e.message.toLowerCase().includes(q)
      )
    ) {
      return false;
    }
    return true;
  });

  const topicCounts = enquiries.reduce<Record<string, number>>((acc, e) => {
    acc[e.topic] = (acc[e.topic] ?? 0) + 1;
    return acc;
  }, {});

  const handleDelete = (id: string, name: string) => {
    deleteEnquiry(id);
    if (replyId === id) setReplyId(null);
    toast.success("Enquiry deleted", {
      description: `Removed ${name}'s enquiry from the inbox.`,
    });
  };

  return (
    <>
      <PageHeader
        eyebrow="Guests & Feedback"
        title={
          <>
            Contact <em>enquiries</em>
          </>
        }
        description={`Every message submitted on ${brandName}'s Contact page lands here live so your team can reply, resolve, or follow up.`}
      />

      <div className="mb-5 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <Stat label="Total enquiries" value={String(enquiries.length)} hint="synced from /visit" />
        <Stat
          label="New / unread"
          value={String(newCount)}
          tone={newCount > 0 ? "chili" : undefined}
          hint="awaiting response"
        />
        <Stat label="Replied" value={String(repliedCount)} hint="guest contacted" />
        <Stat label="Resolved" value={String(resolvedCount)} hint="closed threads" />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div className="space-y-5 xl:col-span-4">
          <Panel title="Search & Quick Tips">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-mute" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search guest, contact, topic…"
                className="h-10 w-full rounded-xl border border-line bg-white pl-9 pr-3 text-[13.5px] outline-none transition focus:border-[#4e1d84] focus:ring-2 focus:ring-[#4e1d84]/15"
              />
            </div>
            <p className="mt-3 text-[12.5px] leading-relaxed text-mute">
              Submit a test message on the public <span className="font-semibold text-[#0f172a]">Contact</span> page and it will appear at the top of this inbox immediately.
            </p>
          </Panel>

          <Panel title="Topics breakdown">
            {Object.keys(topicCounts).length === 0 ? (
              <p className="text-[13px] text-mute">No enquiries yet.</p>
            ) : (
              <ul className="space-y-2.5">
                {Object.entries(topicCounts)
                  .sort((a, b) => b[1] - a[1])
                  .map(([topic, count]) => (
                    <li
                      key={topic}
                      className="flex items-center justify-between gap-2 text-[13px]"
                    >
                      <span className="truncate text-[#334155]">{topic}</span>
                      <span className="rounded-full bg-[#f3e8ff] px-2.5 py-0.5 font-mono text-[11.5px] font-semibold text-[#4e1d84]">
                        {count}
                      </span>
                    </li>
                  ))}
              </ul>
            )}
          </Panel>
        </div>

        <Panel
          className="xl:col-span-8"
          title="Enquiries Inbox"
          actions={
            <Segmented
              size="sm"
              value={filter}
              onChange={setFilter}
              options={[
                { value: "all", label: `All (${enquiries.length})` },
                { value: "new", label: `New (${newCount})` },
                { value: "replied", label: "Replied" },
                { value: "resolved", label: "Resolved" },
              ]}
            />
          }
          flush
        >
          {rows.length === 0 ? (
            <div className="border-t border-line-2 px-5 py-12 text-center text-[14px] text-mute">
              No enquiries match this filter.
            </div>
          ) : (
            <ul className="divide-y divide-line-2 border-t border-line-2">
              {rows.map((e) => {
                const isEmail = e.contact.includes("@");
                const meta = STATUS_META[e.status];
                return (
                  <li
                    key={e.id}
                    className={cn(
                      "px-4 py-5 sm:px-5",
                      e.status === "new" && "bg-[#f3e8ff]/35",
                    )}
                  >
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                      <Avatar name={e.name} className="size-8 text-[11px]" />
                      <span className="text-[14px] font-semibold text-[#0f172a]">
                        {e.name}
                      </span>
                      <Badge tone="ink">{e.topic}</Badge>
                      <span className="inline-flex items-center gap-1 text-[12px] text-mute">
                        <Clock className="size-3" /> {e.date}
                      </span>
                      <span
                        className={cn(
                          "ml-auto inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11.5px] font-semibold",
                          meta.className,
                        )}
                      >
                        {meta.label}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-3 text-[12.5px] text-mute">
                      <a
                        href={
                          isEmail
                            ? `mailto:${e.contact}`
                            : `tel:${e.contact.replace(/\s+/g, "")}`
                        }
                        className="inline-flex items-center gap-1.5 font-medium text-[#4e1d84] hover:underline"
                      >
                        {isEmail ? (
                          <Mail className="size-3.5" />
                        ) : (
                          <Phone className="size-3.5" />
                        )}
                        {e.contact}
                      </a>
                    </div>

                    <p className="mt-3 max-w-2xl text-[14.5px] leading-relaxed text-[#1e293b]">
                      {e.message}
                    </p>

                    {e.reply && (
                      <div className="mt-3 rounded-xl border border-[#4e1d84]/15 bg-[#f3e8ff] p-3 text-[13px] text-[#334155]">
                        <span className="font-bold text-[#4e1d84]">
                          {brandName} reply:
                        </span>{" "}
                        {e.reply}
                      </div>
                    )}

                    {replyId === e.id ? (
                      <div className="mt-4 space-y-2">
                        <Textarea
                          value={replyText}
                          onChange={(ev) => setReplyText(ev.target.value)}
                          placeholder={`Write a reply to ${e.name}…`}
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => {
                              if (!replyText.trim()) return;
                              replyEnquiry(e.id, replyText.trim());
                              setReplyId(null);
                              setReplyText("");
                              toast.success("Reply saved", {
                                description: `Marked ${e.name}'s enquiry as Replied.`,
                              });
                            }}
                          >
                            Save &amp; mark replied
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setReplyId(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setReplyId(e.id);
                            setReplyText(
                              e.reply ??
                                `Hi ${e.name.split(" ")[0]}, thank you for reaching out to ${brandName}. `,
                            );
                          }}
                        >
                          <MessageSquareReply className="size-3.5" />{" "}
                          {e.reply ? "Edit reply" : "Reply"}
                        </Button>

                        {e.status !== "resolved" ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              updateEnquiryStatus(e.id, "resolved");
                              toast.success("Marked as resolved");
                            }}
                          >
                            <CheckCircle2 className="size-3.5 text-[#059669]" />{" "}
                            Mark resolved
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              updateEnquiryStatus(e.id, "new");
                              toast("Reopened enquiry");
                            }}
                          >
                            <RotateCcw className="size-3.5" /> Reopen
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="ghost"
                          className="ml-auto text-[#ef4444] hover:bg-[#fef2f2] hover:text-[#dc2626]"
                          onClick={() => handleDelete(e.id, e.name)}
                        >
                          <Trash2 className="size-3.5" /> Delete
                        </Button>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}
