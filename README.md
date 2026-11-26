# Neela × Mise — Restaurant Management & POS (demo)

A front-end demo of the full scope in `restaurant_pos_complete_admin_panel_blueprint.pdf`.
There is no database; every screen runs on mock data in `src/lib/`. Orders placed on the
website, QR menu, POS or waiter app are kept in `localStorage`, so they show up live on the
Kitchen Display (also across browser tabs).

**Stack (as the blueprint suggests):** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 ·
Recharts · Motion · Zustand · lucide-react · qrcode.react. Ready for Vercel.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # production
```

## Surfaces

| URL | What it is |
| --- | --- |
| `/` | Restaurant website (Neela) — homepage |
| `/menu` | Online ordering: menu, customisation, cart, checkout (sign-in required), coupon `TIDE15` |
| `/rooms` · `/story` · `/visit` | Rooms & private dining · The kitchen · Find us |
| `/reserve` · `/track` · `/account` | Table booking (sign-in required) · delivery tracking · guest account |
| `/t/07` | QR table ordering: menu, send to kitchen, order status, call waiter, bill, feedback |
| `/login` | Role-based sign-in (all 9 roles from the blueprint's access matrix) |
| `/admin` | Restaurant admin — 26 modules, sidebar grouped exactly as the blueprint recommends |
| `/pos` | POS & billing: dine-in/takeaway/delivery, hold/resume, discounts, KOT, cash/UPI/card/split, receipt |
| `/kitchen` | Kitchen Display System: stations, timers, late alerts, item-wise prep, bump flow |
| `/waiter` | Waiter handheld app |
| `/platform` | SaaS Super Admin: tenants, plans, revenue, features, support, settings, audit |
| `/mise` · `/mise/signup` | Mise public website with pricing · restaurant registration & free trial |
| `/admin/billing` | Restaurant's own subscription: plan, usage vs limits, upgrade/downgrade, invoices, cancel |

## How the subscription works

1. A restaurant owner finds Mise at `/mise`, compares plans (Starter ₹1,499 · Growth ₹3,999 · Estate ₹9,999 per month, or annual with two months free, + 18% GST) and clicks **Start free trial**.
2. `/mise/signup`: owner details + phone OTP (demo code 2611) → restaurant details & GSTIN → plan & billing cycle → optional Razorpay autopay (UPI or card). Nothing is charged today.
3. The application appears in **Super Admin → Restaurants** as *pending*. The Mise team approves it and the 14-day trial starts.
4. On day 15 the chosen plan starts on autopay. Failed payments get 3 retries over 7 days, then the account goes read-only.
5. Inside the restaurant admin, **Subscription & Billing** shows the plan, usage against plan limits, pro-rated upgrades (immediate), downgrades (at renewal), billing cycle, payment method, GST invoices and cancellation.

Guests can browse freely, but checkout, table bookings, private-dining enquiries and QR orders open a
sign-in / register popup first (mobile OTP or email). Demo OTP code: **2611**. After signing in, the
guest continues where they left off.

Use the **Demo surfaces** button (bottom corner) to jump between them.

## Blueprint coverage

1 Dashboard · 2 Restaurant & branches · 3 Menu · 4 Tables · 5 QR ordering · 6 POS · 7 KDS ·
8 Orders · 9 CRM · 10 Delivery · 11 Inventory · 12 Suppliers · 13 Recipes & costing · 14 Staff ·
15 Roles & permissions · 16 Offers · 17 Payments · 18 Tax & invoices · 19 Reservations & waitlist ·
20 Reports · 21 Expenses · 22 Notifications · 23 Reviews · 24 Website · 25 Settings ·
26 Super Admin · 27 Plans · 28 Integrations · 29 Security & audit.

## Project layout

```
src/app/(site)      public website (home, menu, reserve, track)
src/app/t/[table]   QR table ordering
src/app/admin/*     restaurant admin modules
src/app/platform/*  super admin
src/app/pos | kitchen | waiter | login
src/components      ui kit, charts, admin shell, site components
src/lib             mock data (data.ts, menu.ts), client store (store.ts), utils
public/img          food & interior photography (Unsplash)
```

To go live, replace `src/lib/data.ts` with Supabase queries and move the mutations in
`src/lib/store.ts` to server actions with row-level security, as the blueprint describes.
