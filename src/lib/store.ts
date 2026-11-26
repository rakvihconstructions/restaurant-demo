"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useEffect, useState } from "react";
import { menuById, type MenuItem } from "./menu";
import { plans, tables as initialTables, type Table, type TableStatus } from "./data";
import type { ThemeId } from "./tenant-catalog";

export type CartLine = {
  key: string;
  itemId: string;
  qty: number;
  variant?: { id: string; label: string; price: number };
  addons: { id: string; label: string; price: number }[];
  note?: string;
};

export type LiveOrder = {
  id: string;
  source: "Website" | "QR" | "POS";
  table?: string;
  mode: "Dine-in" | "Takeaway" | "Delivery";
  lines: { name: string; qty: number; mods: string[]; station: MenuItem["station"] }[];
  total: number;
  createdAt: number;
  status: "new" | "preparing" | "ready" | "served";
  customer: string;
  userEmail?: string;
};

export type PlanId = "starter" | "growth" | "estate";
export type Cycle = "monthly" | "annual";

export type Signup = {
  id: string;
  restaurant: string;
  owner: string;
  email: string;
  phone: string;
  city: string;
  kind: string;
  branches: number;
  plan: PlanId;
  cycle: Cycle;
  autopay: "upi" | "card" | "none";
  status: "pending" | "trial" | "active" | "declined";
  createdAt: number;
};

export type Subscription = {
  plan: PlanId;
  cycle: Cycle;
  status: "active" | "trial" | "cancelling" | "past-due";
  renews: string;
  method: string;
  trialDaysLeft?: number;
};

export type Invoice = {
  id: string;
  date: string;
  period: string;
  plan: string;
  amount: number;
  status: "Paid" | "Pending";
};

export type ActiveTenant = {
  id: string;
  name: string;
  slug: string;
  city: string;
  owner: string;
  branches: number;
  gstin: string;
  email: string;
};

export type User = { name: string; phone: string; email: string; since: string; points: number };

export type Booking = {
  id: string;
  kind: "Table" | "Private room";
  day: string;
  time: string;
  guests: number;
  seating: string;
  occasion?: string;
  note?: string;
  createdAt: number;
  userEmail: string;
};

export type SiteContent = {
  name: string;
  headline: string;
  accent: string;
  subtitle: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  gstin: string;
  fssai: string;
  desktopBannerImage: string | null;
  mobileBannerImage: string | null;
};

export const DEFAULT_SITE_CONTENT: SiteContent = {
  name: "Demo Restaurant",
  headline: "COASTAL FLAVORS.\nEPIC CRAVINGS.",
  accent: "Live Fresh",
  subtitle: "Charcoal-fired seafood & heirloom curries from Mangalore, Cochin & Goa.",
  tagline: "Coastal Indian kitchen on 12th Main, Indiranagar. Fresh catch from Mangalore, Cochin & Goa, cooked over charcoal and served across four intimate rooms.",
  address: "748, 12th Main Rd, HAL 2nd Stage, Indiranagar, Bengaluru 560038",
  phone: "+91 80 4718 2290",
  email: "hello@demorestaurant.in",
  hours: "Tue–Sun · Lunch 12:00–15:30 · Dinner 18:30–23:30",
  gstin: "29AAKCN4821M1Z6",
  fssai: "11224998000612",
  desktopBannerImage: null,
  mobileBannerImage: null,
};

export type GuestReview = {
  id: string;
  guest: string;
  city: string;
  room: string;
  rating: number;
  date: string;
  dish: string;
  quote: string;
  source: string;
  status: "published" | "pending" | "flagged";
  reply?: string;
};

export const INITIAL_GUEST_REVIEWS: GuestReview[] = [
  {
    id: "rv-1",
    guest: "Meera Krishnan",
    city: "Bengaluru",
    room: "The Dining Room",
    rating: 5,
    date: "2 days ago",
    dish: "Malabar Prawn Moilee & Palappam",
    quote:
      "The Prawn Moilee tastes like a Sunday afternoon in Fort Kochi — silky coconut milk, zero shortcuts, and warm lacy appams straight off the tawa. Easily our favourite coastal dinner spot in Indiranagar.",
    source: "Website",
    status: "published",
  },
  {
    id: "rv-2",
    guest: "Siddharth Menon",
    city: "Bengaluru",
    room: "The Verandah",
    rating: 5,
    date: "5 days ago",
    dish: "Demo Restaurant Coastal Thali",
    quote:
      "Booked the verandah for a family lunch under the rain tree. Every single katori on the coastal thali was balanced, the fish fry was crisp, and our captain Rahul made our parents feel completely at home.",
    source: "Google",
    status: "published",
  },
  {
    id: "rv-3",
    guest: "Aisha & Dev Patel",
    city: "Mumbai",
    room: "The Bar",
    rating: 5,
    date: "1 week ago",
    dish: "Kokum Collins & Tuna Kokum Tartare",
    quote:
      "Came for one drink and stayed three hours. The Kokum Collins and Toddy Shop Sour are world-class, and the Tuna Kokum Tartare with curry-leaf oil is something I'm still thinking about.",
    source: "Website",
    status: "published",
  },
  {
    id: "rv-4",
    guest: "Rohan Deshmukh",
    city: "Bengaluru",
    room: "The Dining Room",
    rating: 5,
    date: "2 weeks ago",
    dish: "Thalassery Chicken Biryani",
    quote:
      "They crack the dum pastry seal right at the table and the aroma fills the whole corner. Short-grain kaima rice, sweet caramelised shallots, and tender chicken — unbeatable.",
    source: "QR Table",
    status: "pending",
  },
  {
    id: "rv-5",
    guest: "Nandini Rao",
    city: "Hyderabad",
    room: "The Sea Deck",
    rating: 5,
    date: "3 weeks ago",
    dish: "Kerala Meen Curry & Filter Coffee Sundae",
    quote:
      "We celebrated our anniversary at the Sea Deck at sunset. Clay-pot seer fish curry followed by the Filter Coffee Sundae with jaggery fudge was pure magic from start to finish.",
    source: "Website",
    status: "published",
  },
  {
    id: "rv-6",
    guest: "Karthik Subramanian",
    city: "Chennai",
    room: "The Dining Room",
    rating: 4,
    date: "1 month ago",
    dish: "Chettinad Kozhi & Malabar Parotta",
    quote:
      "Bold black pepper heat and flaky hand-slapped parottas. Friday nights get lively so definitely book a table ahead — well worth it.",
    source: "Google",
    status: "flagged",
  },
];

export type EnquiryStatus = "new" | "replied" | "resolved";

export type ContactEnquiry = {
  id: string;
  name: string;
  contact: string;
  topic: string;
  message: string;
  createdAt: number;
  date: string;
  status: EnquiryStatus;
  reply?: string;
};

export const INITIAL_ENQUIRIES: ContactEnquiry[] = [
  {
    id: "enq-1",
    name: "Priya Ramanathan",
    contact: "+91 98450 22419",
    topic: "Group Dining & Celebrations",
    message: "Hi team, we're planning a 50th anniversary family dinner for 18 guests next Saturday evening. Do you have a set coastal tasting menu or sharing platters you recommend?",
    createdAt: Date.now() - 1000 * 60 * 42,
    date: "42 mins ago",
    status: "new",
  },
  {
    id: "enq-2",
    name: "Arjun Malhotra",
    contact: "arjun.m@gmail.com",
    topic: "Dietary & Allergy Question",
    message: "My partner has a severe shellfish allergy, though fin-fish is fine. Can the kitchen prepare the Kerala Meen Curry and Thalassery Biryani safely with separate pans?",
    createdAt: Date.now() - 1000 * 60 * 60 * 3,
    date: "3 hours ago",
    status: "new",
  },
  {
    id: "enq-3",
    name: "Sneha Kulkarni",
    contact: "+91 99001 77312",
    topic: "General Enquiry",
    message: "Is valet parking available during weekday lunch hours as well, or only for dinner service?",
    createdAt: Date.now() - 1000 * 60 * 60 * 22,
    date: "Yesterday",
    status: "replied",
    reply: "Hi Sneha! Yes, complimentary valet parking is available right at our main gate for both lunch (12:00–15:30) and dinner (18:30–23:30), Tuesday to Sunday.",
  },
  {
    id: "enq-4",
    name: "Vikramaditya Joshi",
    contact: "vikram.joshi@outlook.com",
    topic: "Guest Feedback",
    message: "Stopped by last Sunday for the Coastal Thali and Filter Coffee Sundae. Just wanted to thank the verandah team for the warm hospitality!",
    createdAt: Date.now() - 1000 * 60 * 60 * 54,
    date: "2 days ago",
    status: "resolved",
    reply: "Thank you so much, Vikramaditya! We've shared your kind note with the verandah team and Chef Vikram. Hope to welcome you back soon.",
  },
];

export const slugify = (name: string) =>
  name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const defaultInvoices: Invoice[] = [
  { id: "MS-INV-11802", date: "14 Jan 2026", period: "Jan 2026 – Jan 2027", plan: "Estate · annual", amount: 99990, status: "Paid" },
  { id: "MS-INV-09114", date: "14 Jan 2025", period: "Jan 2025 – Jan 2026", plan: "Growth · annual", amount: 39990, status: "Paid" },
  { id: "MS-INV-08870", date: "14 Dec 2024", period: "Dec 2024", plan: "Growth · monthly", amount: 3999, status: "Paid" },
  { id: "MS-INV-08402", date: "14 Nov 2024", period: "Nov 2024", plan: "Growth · monthly", amount: 3999, status: "Paid" },
];

type State = {
  cart: CartLine[];
  liveOrders: LiveOrder[];
  add: (line: Omit<CartLine, "key">) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
  placeOrder: (o: Omit<LiveOrder, "id" | "createdAt" | "status">) => LiveOrder;
  advance: (id: string) => void;
  user: User | null;
  bookings: Booking[];
  signIn: (u: User) => void;
  signOut: () => void;
  addBooking: (b: Omit<Booking, "id" | "createdAt" | "userEmail">) => Booking | null;
  signups: Signup[];
  register: (s: Omit<Signup, "id" | "createdAt" | "status">) => Signup;
  setSignupStatus: (id: string, status: Signup["status"]) => void;
  activeTenant: ActiveTenant;
  switchTenant: (t: {
    id: string;
    name: string;
    city: string;
    owner: string;
    branches: number;
    plan: PlanId;
    cycle?: Cycle;
    status: Subscription["status"];
    method?: string;
    gstin?: string;
    email?: string;
  }) => void;
  sub: Subscription;
  setSub: (patch: Partial<Subscription>) => void;
  invoices: Invoice[];
  simulateTrialEnd: () => { paid: boolean; amount: number; invoiceId?: string };
  payPastDue: () => void;
  siteHeadline: string;
  setSiteHeadline: (h: string) => void;
  tenantThemes: Record<string, ThemeId>;
  setTenantTheme: (slug: string, theme: ThemeId) => void;
  tenantLogos: Record<string, string>;
  setTenantLogo: (slug: string, dataUrl: string | null) => void;
  guestReviews: GuestReview[];
  addGuestReview: (r: Omit<GuestReview, "id" | "date" | "status" | "source">) => GuestReview;
  deleteGuestReview: (id: string) => void;
  replyGuestReview: (id: string, reply: string) => void;
  enquiries: ContactEnquiry[];
  addEnquiry: (e: Omit<ContactEnquiry, "id" | "createdAt" | "date" | "status">) => ContactEnquiry;
  updateEnquiryStatus: (id: string, status: EnquiryStatus) => void;
  replyEnquiry: (id: string, reply: string) => void;
  deleteEnquiry: (id: string) => void;
  floorTables: Table[];
  addFloorTable: (t: Table) => void;
  moveFloorTable: (id: string, x: number, y: number) => void;
  setFloorTableStatus: (id: string, status: TableStatus, extra?: Partial<Table>) => void;
  autoArrangeFloor: (floor: Table["floor"]) => void;
  siteContent: SiteContent;
  updateSiteContent: (patch: Partial<SiteContent>) => void;
};

export const lineUnit = (l: CartLine) => {
  const item = menuById[l.itemId];
  return item.price + (l.variant?.price ?? 0) + l.addons.reduce((s, a) => s + a.price, 0);
};

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      cart: [],
      liveOrders: [],
      user: null,
      bookings: [],
      signups: [],
      activeTenant: {
        id: "TN-0142",
        name: "Demo Restaurant",
        slug: "neela",
        city: "Bengaluru",
        owner: "Ananya Rao",
        branches: 4,
        gstin: "29AAKCN4821M1Z6",
        email: "accounts@demorestaurant.in",
      },
      siteHeadline: "COASTAL FLAVORS.\nEPIC CRAVINGS.",
      setSiteHeadline: (siteHeadline) =>
        set((s) => ({ siteHeadline, siteContent: { ...s.siteContent, headline: siteHeadline } })),
      siteContent: DEFAULT_SITE_CONTENT,
      updateSiteContent: (patch) =>
        set((s) => ({
          siteContent: { ...s.siteContent, ...patch },
          ...(patch.headline !== undefined ? { siteHeadline: patch.headline } : {}),
        })),
      tenantThemes: {},
      setTenantTheme: (slug, theme) => set((s) => ({ tenantThemes: { ...s.tenantThemes, [slug]: theme } })),
      tenantLogos: {},
      setTenantLogo: (slug, dataUrl) =>
        set((s) => {
          const next = { ...s.tenantLogos };
          if (!dataUrl) delete next[slug];
          else next[slug] = dataUrl;
          return { tenantLogos: next };
        }),
      guestReviews: INITIAL_GUEST_REVIEWS,
      addGuestReview: (r) => {
        const next: GuestReview = {
          ...r,
          id: `rv-${Date.now()}`,
          date: "Just now",
          source: "Website",
          status: "published",
        };
        set((s) => ({ guestReviews: [next, ...s.guestReviews] }));
        return next;
      },
      deleteGuestReview: (id) =>
        set((s) => ({ guestReviews: s.guestReviews.filter((r) => r.id !== id) })),
      replyGuestReview: (id, reply) =>
        set((s) => ({
          guestReviews: s.guestReviews.map((r) => (r.id === id ? { ...r, reply, status: "published" } : r)),
        })),
      enquiries: INITIAL_ENQUIRIES,
      addEnquiry: (e) => {
        const next: ContactEnquiry = {
          ...e,
          id: `enq-${Date.now()}`,
          createdAt: Date.now(),
          date: "Just now",
          status: "new",
        };
        set((s) => ({ enquiries: [next, ...(s.enquiries ?? INITIAL_ENQUIRIES)] }));
        return next;
      },
      updateEnquiryStatus: (id, status) =>
        set((s) => ({
          enquiries: (s.enquiries ?? INITIAL_ENQUIRIES).map((e) => (e.id === id ? { ...e, status } : e)),
        })),
      replyEnquiry: (id, reply) =>
        set((s) => ({
          enquiries: (s.enquiries ?? INITIAL_ENQUIRIES).map((e) =>
            e.id === id ? { ...e, reply, status: "replied" } : e,
          ),
        })),
      deleteEnquiry: (id) =>
        set((s) => ({
          enquiries: (s.enquiries ?? INITIAL_ENQUIRIES).filter((e) => e.id !== id),
        })),
      floorTables: initialTables,
      addFloorTable: (t) => set((s) => ({ floorTables: [...s.floorTables, t] })),
      moveFloorTable: (id, x, y) =>
        set((s) => ({
          floorTables: s.floorTables.map((t) => (t.id === id ? { ...t, x, y } : t)),
        })),
      setFloorTableStatus: (id, status, extra) =>
        set((s) => ({
          floorTables: s.floorTables.map((t) =>
            t.id === id
              ? {
                  ...t,
                  status,
                  ...(status === "available" ? { guests: undefined, waiter: undefined, since: undefined, bill: undefined } : {}),
                  ...extra,
                }
              : t,
          ),
        })),
      autoArrangeFloor: (floor) =>
        set((s) => {
          const onFloor = s.floorTables.filter((t) => t.floor === floor);
          const cols = Math.min(4, Math.max(2, Math.ceil(Math.sqrt(onFloor.length))));
          const rows = Math.max(1, Math.ceil(onFloor.length / cols));
          const posById = new Map<string, { x: number; y: number }>();
          onFloor.forEach((t, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = cols === 1 ? 50 : Math.round(14 + (col * 72) / (cols - 1));
            const y = rows === 1 ? 48 : Math.round(18 + (row * 64) / (rows - 1));
            posById.set(t.id, { x, y });
          });
          return {
            floorTables: s.floorTables.map((t) => (posById.has(t.id) ? { ...t, ...posById.get(t.id)! } : t)),
          };
        }),
      invoices: defaultInvoices,
      register: (x) => {
        const sg: Signup = {
          ...x,
          id: `TN-${String(264 + get().signups.length).padStart(4, "0")}`,
          createdAt: Date.now(),
          status: "pending",
        };
        set((s) => ({ signups: [sg, ...s.signups] }));
        return sg;
      },
      setSignupStatus: (id, status) =>
        set((s) => ({
          signups: s.signups.map((x) => (x.id === id ? { ...x, status } : x)),
          sub: s.activeTenant.id === id && status === "trial" ? { ...s.sub, status: "trial", trialDaysLeft: 14 } : s.sub,
        })),
      switchTenant: (t) => {
        const slug = t.id === "TN-0142" ? "neela" : slugify(t.name);
        const cycle = t.cycle ?? "monthly";
        const method = t.method ?? (t.id === "TN-0142" ? "UPI Autopay · ananya@okhdfc" : "UPI Autopay · owner@okaxis");
        const invs: Invoice[] =
          t.id === "TN-0142"
            ? defaultInvoices
            : t.status === "trial"
              ? []
              : [
                  {
                    id: `MS-INV-${12000 + t.branches * 13}`,
                    date: "01 Nov 2026",
                    period: "Nov 2026",
                    plan: `${plans.find((p) => p.id === t.plan)!.name} · ${cycle}`,
                    amount: cycle === "monthly" ? plans.find((p) => p.id === t.plan)!.monthly : plans.find((p) => p.id === t.plan)!.annual,
                    status: "Paid",
                  },
                ];
        set({
          activeTenant: {
            id: t.id,
            name: t.name,
            slug,
            city: t.city,
            owner: t.owner,
            branches: t.branches,
            gstin: t.gstin ?? "29AAKFK2210R1ZQ",
            email: t.email ?? `accounts@${slug}.in`,
          },
          sub: {
            plan: t.plan,
            cycle,
            status: t.status,
            renews: t.status === "trial" ? "10 Dec 2026" : "01 Dec 2026",
            method,
            trialDaysLeft: t.status === "trial" ? 14 : undefined,
          },
          invoices: invs,
          siteHeadline:
            t.id === "TN-0142"
              ? "COASTAL FLAVORS.\nEPIC CRAVINGS."
              : `${t.name} — Freshly prepared in ${t.city}.`,
        });
      },
      sub: { plan: "estate", cycle: "annual", status: "active", renews: "14 Jan 2027", method: "UPI Autopay · ananya@okhdfc" },
      setSub: (patch) => set((s) => ({ sub: { ...s.sub, ...patch } })),
      simulateTrialEnd: () => {
        const s = get();
        const plan = plans.find((p) => p.id === s.sub.plan)!;
        const base = s.sub.cycle === "monthly" ? plan.monthly : plan.annual;
        const hasMethod = s.sub.method && !s.sub.method.toLowerCase().includes("no payment");
        if (hasMethod) {
          const invId = `MS-INV-${12400 + s.invoices.length}`;
          const newInv: Invoice = {
            id: invId,
            date: "10 Dec 2026",
            period: s.sub.cycle === "monthly" ? "Dec 2026 – Jan 2027" : "Dec 2026 – Dec 2027",
            plan: `${plan.name} · ${s.sub.cycle}`,
            amount: base,
            status: "Paid",
          };
          set({
            sub: {
              ...s.sub,
              status: "active",
              renews: s.sub.cycle === "monthly" ? "10 Jan 2027" : "10 Dec 2027",
              trialDaysLeft: 0,
            },
            invoices: [newInv, ...s.invoices],
            signups: s.signups.map((sg) => (sg.id === s.activeTenant.id ? { ...sg, status: "active" } : sg)),
          });
          return { paid: true, amount: Math.round(base * 1.18), invoiceId: invId };
        }
        set({
          sub: { ...s.sub, status: "past-due", trialDaysLeft: 0 },
        });
        return { paid: false, amount: Math.round(base * 1.18) };
      },
      payPastDue: () => {
        const s = get();
        const plan = plans.find((p) => p.id === s.sub.plan)!;
        const base = s.sub.cycle === "monthly" ? plan.monthly : plan.annual;
        const invId = `MS-INV-${12400 + s.invoices.length}`;
        const newInv: Invoice = {
          id: invId,
          date: "10 Dec 2026",
          period: s.sub.cycle === "monthly" ? "Dec 2026 – Jan 2027" : "Dec 2026 – Dec 2027",
          plan: `${plan.name} · ${s.sub.cycle}`,
          amount: base,
          status: "Paid",
        };
        set({
          sub: {
            ...s.sub,
            status: "active",
            method: "UPI Autopay · accounts@okicici",
            renews: s.sub.cycle === "monthly" ? "10 Jan 2027" : "10 Dec 2027",
          },
          invoices: [newInv, ...s.invoices],
          signups: s.signups.map((sg) => (sg.id === s.activeTenant.id ? { ...sg, status: "active" } : sg)),
        });
      },
      signIn: (u) => set({ user: u }),
      signOut: () => set({ user: null }),
      addBooking: (b) => {
        const u = get().user;
        const booking: Booking = {
          ...b,
          id: `R-${5533 + get().bookings.length}`,
          createdAt: Date.now(),
          userEmail: u?.email ?? "guest@demorestaurant.in",
        };
        set((s) => ({ bookings: [booking, ...s.bookings] }));
        return booking;
      },
      add: (line) =>
        set((s) => {
          const key = [line.itemId, line.variant?.id ?? "", ...line.addons.map((a) => a.id).sort()].join("|");
          const existing = s.cart.find((c) => c.key === key);
          if (existing) {
            return { cart: s.cart.map((c) => (c.key === key ? { ...c, qty: c.qty + line.qty } : c)) };
          }
          return { cart: [...s.cart, { ...line, key }] };
        }),
      setQty: (key, qty) =>
        set((s) => ({
          cart: qty <= 0 ? s.cart.filter((c) => c.key !== key) : s.cart.map((c) => (c.key === key ? { ...c, qty } : c)),
        })),
      clear: () => set({ cart: [] }),
      placeOrder: (o) => {
        const order: LiveOrder = {
          userEmail: get().user?.email,
          ...o,
          id: `NL-${24817 + get().liveOrders.length}`,
          createdAt: Date.now(),
          status: "new",
        };
        set((s) => ({ liveOrders: [order, ...s.liveOrders].slice(0, 20) }));
        return order;
      },
      advance: (id) =>
        set((s) => ({
          liveOrders: s.liveOrders.map((o) =>
            o.id === id
              ? { ...o, status: o.status === "new" ? "preparing" : o.status === "preparing" ? "ready" : "served" }
              : o,
          ),
        })),
    }),
    {
      name: "mise-demo",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);

/** Rehydrate persisted state after mount to avoid SSR mismatches. */
export function useHydrated() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    Promise.resolve(useStore.persist.rehydrate()).then(() => setReady(true));
    const onStorage = (e: StorageEvent) => {
      if (e.key === "mise-demo") useStore.persist.rehydrate();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  return ready;
}

export function cartTotals(cart: CartLine[]) {
  const subtotal = cart.reduce((s, l) => s + lineUnit(l) * l.qty, 0);
  const count = cart.reduce((s, l) => s + l.qty, 0);
  const tax = Math.round(subtotal * 0.05);
  return { subtotal, count, tax, total: subtotal + tax };
}

type AuthUI = { open: boolean; mode: "signin" | "register"; reason?: string; show: (reason?: string, mode?: "signin" | "register") => void; hide: () => void };
export const useAuthUI = create<AuthUI>()((set) => ({
  open: false,
  mode: "signin",
  show: (reason, mode = "signin") => set({ open: true, reason, mode }),
  hide: () => set({ open: false }),
}));

let pending: (() => void) | null = null;
export const takePending = () => {
  const p = pending;
  pending = null;
  return p;
};
export const clearPending = () => {
  pending = null;
};

export function requireAuth(reason: string, action: () => void) {
  if (useStore.getState().user) return action();
  pending = action;
  useAuthUI.getState().show(reason);
}
