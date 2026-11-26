"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Car,
  Clock,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
  Send,
  Sparkles,
  TrainFront,
  UtensilsCrossed,
} from "lucide-react";
import { toast } from "sonner";
import { DEFAULT_SITE_CONTENT, useHydrated, useStore } from "@/lib/store";

export default function VisitPage() {
  const hydrated = useHydrated();
  const storedContent = useStore((s) => s.siteContent);
  const addEnquiry = useStore((s) => s.addEnquiry);
  const content = hydrated && storedContent ? storedContent : DEFAULT_SITE_CONTENT;

  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [topic, setTopic] = useState("General Enquiry");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim() || !message.trim()) return;
    addEnquiry({
      name: name.trim(),
      contact: contact.trim(),
      topic,
      message: message.trim(),
    });
    setSent(true);
    setName("");
    setContact("");
    setTopic("General Enquiry");
    setMessage("");
    toast.success("Message received!", {
      description: `Our team at ${content.name} will get back to you shortly.`,
    });
  };

  return (
    <div className="mx-auto max-w-[1380px] px-4 pb-12 pt-3 sm:px-8 sm:pt-5">
      {/* Purple & Amber Hero Banner (matches Home, Menu, Testimonials & Reviews) */}
      <header className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#2a0a4f] via-[#4e1d84] to-[#3b0e6e] text-white shadow-[0_24px_56px_-20px_rgba(42,10,79,0.55)]">
        <Image
          src="/img/interior-warm.jpg"
          alt={content.name}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-22"
        />
        <div className="pointer-events-none absolute -right-12 -top-12 size-64 rounded-full bg-[#f5a623]/20 blur-3xl" />

        <div className="relative grid grid-cols-1 items-end gap-8 p-6 sm:p-10 lg:grid-cols-12 lg:p-14">
          <div className="lg:col-span-7">
            <p className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#f5a623]">
              <Sparkles className="size-3.5" /> Visit &amp; Contact Us
            </p>
            <h1 className="mt-3 text-[34px] font-extrabold leading-[1.04] tracking-[-0.04em] text-white sm:text-[52px]">
              Come hungry, leave happy.
            </h1>
            <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-white/80">
              Find us on 12th Main, Indiranagar. Drop in for lunch or dinner, call our host desk, or send us a quick note below.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={`tel:${content.phone.replace(/\s+/g, "")}`}
                className="inline-flex h-11 items-center gap-2 rounded-full bg-[#f5a623] px-6 text-[13.5px] font-extrabold text-[#2a0a4f] shadow-lg transition hover:bg-[#fbbf24]"
              >
                <Phone className="size-4" /> Call {content.phone}
              </a>
              <Link
                href="/menu"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 text-[13.5px] font-bold text-white backdrop-blur-md transition hover:bg-white/20"
              >
                <UtensilsCrossed className="size-4 text-[#f5a623]" /> Explore Menu
              </Link>
            </div>
          </div>

          <div className="rounded-[22px] border border-white/15 bg-white/10 p-5 backdrop-blur-xl lg:col-span-5">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#f5a623]">Direct Contact</p>
            <ul className="mt-3 space-y-2.5 text-[14px] text-white/90">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-[#f5a623]" />
                <span>{content.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="size-4 shrink-0 text-[#f5a623]" />
                <span>{content.email}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="size-4 shrink-0 text-[#f5a623]" />
                <span>{content.hours}</span>
              </li>
            </ul>
          </div>
        </div>
      </header>

      {/* 3 Crisp Info Cards */}
      <section className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-[24px] border border-[#4e1d84]/10 bg-white p-6 shadow-[0_10px_28px_-18px_rgba(78,29,132,0.16)]">
          <span className="grid size-11 place-items-center rounded-2xl bg-[#f3e8ff] text-[#4e1d84]">
            <MapPin className="size-5" />
          </span>
          <h2 className="mt-4 text-[18px] font-extrabold text-[#0f172a]">Location</h2>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-[#64748b]">{content.address}</p>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(content.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1 text-[13px] font-bold text-[#4e1d84] hover:underline"
          >
            Get Directions <ExternalLink className="size-3.5" />
          </a>
        </div>

        <div className="rounded-[24px] border border-[#4e1d84]/10 bg-white p-6 shadow-[0_10px_28px_-18px_rgba(78,29,132,0.16)]">
          <span className="grid size-11 place-items-center rounded-2xl bg-[#fef3c7] text-[#b45309]">
            <Clock className="size-5" />
          </span>
          <h2 className="mt-4 text-[18px] font-extrabold text-[#0f172a]">Opening Hours</h2>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-[#64748b]">{content.hours}</p>
          <p className="mt-3 text-[12.5px] font-semibold text-[#4e1d84]">Last kitchen order 30 min before close</p>
        </div>

        <div className="rounded-[24px] border border-[#4e1d84]/10 bg-white p-6 shadow-[0_10px_28px_-18px_rgba(78,29,132,0.16)]">
          <span className="grid size-11 place-items-center rounded-2xl bg-[#ecfdf5] text-[#059669]">
            <Phone className="size-5" />
          </span>
          <h2 className="mt-4 text-[18px] font-extrabold text-[#0f172a]">Host Desk</h2>
          <p className="mt-1.5 font-mono text-[14px] font-bold text-[#0f172a]">{content.phone}</p>
          <p className="mt-1 text-[13px] text-[#64748b]">{content.email}</p>
        </div>
      </section>

      {/* Contact Form + Getting Here Card */}
      <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Send Us a Message Form */}
        <div className="rounded-[28px] border border-[#4e1d84]/10 bg-white p-6 shadow-[0_14px_38px_-22px_rgba(78,29,132,0.18)] sm:p-8 lg:col-span-7">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#4e1d84]">Write to Us</p>
          <h2 className="mt-1.5 text-[26px] font-extrabold tracking-[-0.03em] text-[#0f172a] sm:text-[32px]">
            Send us a message
          </h2>
          <p className="mt-1.5 text-[14px] text-[#64748b]">
            Questions about dietary requirements, group dining, catering, or feedback? We reply within a few hours.
          </p>

          {sent ? (
            <div className="mt-6 rounded-2xl border border-[#10b981]/25 bg-[#ecfdf5] p-6 text-center">
              <p className="text-[20px] font-extrabold text-[#065f46]">Thank you for reaching out!</p>
              <p className="mt-1 text-[13.5px] text-[#047857]">
                Our manager has received your message and will respond shortly.
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-4 rounded-full bg-[#4e1d84] px-5 py-2 text-[13px] font-bold text-white"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-[12px] font-bold text-[#3f3152]">Your Name *</span>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Meera Nair"
                    className="site-input"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[12px] font-bold text-[#3f3152]">Phone or Email *</span>
                  <input
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="+91 98450 00000"
                    className="site-input"
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-1.5 block text-[12px] font-bold text-[#3f3152]">Topic</span>
                <select value={topic} onChange={(e) => setTopic(e.target.value)} className="site-input">
                  <option>General Enquiry</option>
                  <option>Group Dining &amp; Celebrations</option>
                  <option>Dietary &amp; Allergy Question</option>
                  <option>Guest Feedback</option>
                  <option>Careers</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-[12px] font-bold text-[#3f3152]">Message *</span>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help?"
                  className="site-input h-28 resize-none py-3"
                />
              </label>

              <button
                type="submit"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#4e1d84] px-6 text-[14.5px] font-extrabold text-white shadow-[0_12px_26px_-8px_rgba(78,29,132,0.6)] transition hover:bg-[#3d116d]"
              >
                <Send className="size-4 text-[#f5a623]" /> Send Message
              </button>
            </form>
          )}
        </div>

        {/* Getting Here & Practical Details */}
        <div className="flex flex-col overflow-hidden rounded-[28px] border border-[#4e1d84]/10 bg-white shadow-[0_14px_38px_-22px_rgba(78,29,132,0.18)] lg:col-span-5">
          <div className="relative aspect-[16/10] w-full">
            <Image src="/img/garden.jpg" alt={content.name} fill sizes="(max-width: 1024px) 100vw, 42vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2a0a4f]/70 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#f5a623]">Getting Here</p>
              <p className="mt-0.5 text-[18px] font-extrabold">{content.name}</p>
            </div>
          </div>

          <div className="flex flex-1 flex-col space-y-4 p-6">
            <div className="flex items-start gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#f3e8ff] text-[#4e1d84]">
                <Car className="size-4.5" />
              </span>
              <div>
                <p className="text-[14px] font-bold text-[#0f172a]">Complimentary Valet Parking</p>
                <p className="text-[13px] text-[#64748b]">Available right at the main gate from 12:00 PM until close.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#fef3c7] text-[#b45309]">
                <TrainFront className="size-4.5" />
              </span>
              <div>
                <p className="text-[14px] font-bold text-[#0f172a]">Nearest Metro</p>
                <p className="text-[13px] text-[#64748b]">Indiranagar Metro Station (Purple Line) — 6 min walk.</p>
              </div>
            </div>

            <div className="mt-auto pt-3">
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(content.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-[#4e1d84]/20 bg-[#f3e8ff] text-[13.5px] font-extrabold text-[#4e1d84] transition hover:bg-[#4e1d84] hover:text-white"
              >
                Open in Google Maps <ArrowRight className="size-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Soft Lavender Good-to-Know Strip */}
      <section className="mt-8 rounded-[28px] border border-[#4e1d84]/10 bg-gradient-to-r from-[#f3e8ff] via-[#efe3fc] to-[#e6d3fa] p-6 sm:p-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            ["Step-Free Access", "Wide entrance & ground-floor verandah seating for wheelchairs and strollers."],
            ["Allergy Friendly", "Let your server know about nut, shellfish, or dairy allergies — everything is cooked fresh."],
            ["Family Welcome", "High chairs, mild spice options, and sharing platters available at lunch and dinner."],
          ].map(([title, desc]) => (
            <div key={title} className="rounded-2xl bg-white/90 p-5 shadow-2xs">
              <p className="text-[15px] font-extrabold text-[#4e1d84]">{title}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-[#475569]">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
