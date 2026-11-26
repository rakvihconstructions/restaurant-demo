import type { MenuItem } from "./menu";
import type { PlanId } from "./store";

export type ThemeId = "obsidian-gold" | "ivory-emerald" | "terracotta-sand" | "royal-noir";

export type SiteTheme = {
  id: ThemeId;
  name: string;
  tagline: string;
  swatch: [string, string, string];
  pageBg: string;
  pageText: string;
  headerBg: string;
  heroBg: string;
  heroAccent: string;
  cardBg: string;
  cardBorder: string;
  mutedText: string;
  primaryBtn: string;
  accentPill: string;
  isDark?: boolean;
};

export const SITE_THEMES: Record<ThemeId, SiteTheme> = {
  "obsidian-gold": {
    id: "obsidian-gold",
    name: "Obsidian & Gold",
    tagline: "Luxury fine dining · Midnight & warm ivory",
    swatch: ["#0b111e", "#d9a03e", "#faf8f4"],
    pageBg: "bg-[#faf8f4]",
    pageText: "text-[#151311]",
    headerBg: "bg-[#faf8f4]/90 border-[#151311]/8",
    heroBg: "bg-[#0b111e]",
    heroAccent: "text-[#e5bc6f]",
    cardBg: "bg-white",
    cardBorder: "border-[#151311]/8",
    mutedText: "text-[#5c564d]",
    primaryBtn: "bg-[#0b111e] text-white hover:bg-[#192642]",
    accentPill: "bg-[#f6ebd4] text-[#8f560b]",
  },
  "ivory-emerald": {
    id: "ivory-emerald",
    name: "Botanical Emerald",
    tagline: "Heritage bistro · Deep forest & antique brass",
    swatch: ["#103329", "#c89b3c", "#f5f8f5"],
    pageBg: "bg-[#f5f8f5]",
    pageText: "text-[#10221c]",
    headerBg: "bg-[#f5f8f5]/92 border-[#103329]/10",
    heroBg: "bg-[#103329]",
    heroAccent: "text-[#e5c06e]",
    cardBg: "bg-white",
    cardBorder: "border-[#103329]/10",
    mutedText: "text-[#4a6158]",
    primaryBtn: "bg-[#103329] text-white hover:bg-[#184a3c]",
    accentPill: "bg-[#e3f0ea] text-[#103329]",
  },
  "terracotta-sand": {
    id: "terracotta-sand",
    name: "Warm Terracotta",
    tagline: "Artisanal café · Linen sand & spiced clay",
    swatch: ["#3b1912", "#c2492c", "#fbf6f0"],
    pageBg: "bg-[#fbf6f0]",
    pageText: "text-[#231511]",
    headerBg: "bg-[#fbf6f0]/92 border-[#3b1912]/10",
    heroBg: "bg-[#2c130e]",
    heroAccent: "text-[#f2a679]",
    cardBg: "bg-white",
    cardBorder: "border-[#3b1912]/10",
    mutedText: "text-[#6c5249]",
    primaryBtn: "bg-[#b84229] text-white hover:bg-[#96331e]",
    accentPill: "bg-[#f9e5dc] text-[#96331e]",
  },
  "royal-noir": {
    id: "royal-noir",
    name: "Midnight Noir",
    tagline: "Modern lounge · Full dark velvet & champagne",
    swatch: ["#090b10", "#e5bc6f", "#141824"],
    pageBg: "bg-[#090b10]",
    pageText: "text-[#f8fafc]",
    headerBg: "bg-[#090b10]/90 border-white/10",
    heroBg: "bg-[#0e121d]",
    heroAccent: "text-[#e5bc6f]",
    cardBg: "bg-[#131824]",
    cardBorder: "border-white/10",
    mutedText: "text-white/60",
    primaryBtn: "bg-[#d9a03e] text-[#090b10] hover:bg-[#e5bc6f]",
    accentPill: "bg-[#d9a03e]/15 text-[#e5bc6f]",
    isDark: true,
  },
};

export type TenantDish = {
  id: string;
  name: string;
  category: string;
  price: number;
  diet: MenuItem["diet"];
  prep: number;
  station: MenuItem["station"];
  description: string;
  image: string;
  tag?: string;
};

export type TenantProfile = {
  slug: string;
  tagline: string;
  heroImage: string;
  defaultTheme: ThemeId;
  story: string;
  hours: string;
  phone: string;
  outlets: { name: string; area: string; seats: number; hours: string }[];
  dishes: TenantDish[];
  metrics: { sales: number; orders: number; guests: number; aov: number; delta: number };
};

const profiles: Record<string, TenantProfile> = {
  "bun-maska-co": {
    slug: "bun-maska-co",
    tagline: "Irani café classics, warm maska buns & slow-brewed chai in Pune.",
    heroImage: "/img/pav-bhaji.jpg",
    defaultTheme: "terracotta-sand",
    story:
      "Born on a quiet corner in Koregaon Park, Bun Maska Co. brings back the warmth of classic Irani cafés — freshly baked sweet buns slathered with cultured butter, spiced keema pav, and Assam kadak chai poured from height.",
    hours: "07:30 – 22:30 · Daily",
    phone: "+91 20 6721 4410",
    outlets: [{ name: "Bun Maska Co. Koregaon Park", area: "Lane 6, Koregaon Park, Pune", seats: 34, hours: "07:30 – 22:30" }],
    metrics: { sales: 68400, orders: 142, guests: 178, aov: 482, delta: 8.4 },
    dishes: [
      { id: "bm1", name: "Classic Irani Bun Maska", category: "Bakery & Toast", price: 120, diet: "veg", prep: 5, station: "Pastry", description: "Soft house-baked sweet bun toasted crisp and generously layered with whipped white butter.", image: "/img/pav-bhaji.jpg", tag: "Bestseller" },
      { id: "bm2", name: "Bombay Butter Pav Bhaji", category: "Hot Plates", price: 245, diet: "veg", prep: 12, station: "Curry", description: "Slow-mashed spiced vegetables finished with Amul butter, served with two toasted ladi pavs.", image: "/img/pav-bhaji.jpg", tag: "Signature" },
      { id: "bm3", name: "Old Pune Samosa Chaat", category: "Small Plates", price: 185, diet: "veg", prep: 8, station: "Cold", description: "Flaky Punjabi samosa crushed with chilled yoghurt, tamarind chutney, sev and pomegranate.", image: "/img/samosa.jpg" },
      { id: "bm4", name: "Crisp Papdi Chaat", category: "Small Plates", price: 175, diet: "veg", prep: 7, station: "Cold", description: "Hand-rolled flour crisps topped with spiced potatoes, mint chutney and sweet curd.", image: "/img/papdi-chaat.jpg" },
      { id: "bm5", name: "Smoked Paneer Tikka Roll", category: "Hot Plates", price: 290, diet: "veg", prep: 14, station: "Tandoor", description: "Char-grilled malai paneer wrapped in flaky parotta with pickled onions and mint mayo.", image: "/img/paneer-tikka.jpg" },
      { id: "bm6", name: "Persian Rose Pistachio Cake", category: "Desserts & Chai", price: 230, diet: "egg", prep: 5, station: "Pastry", description: "Cardamom-scented sponge glazed with rose icing and crushed Iranian pistachios.", image: "/img/rose-cake.jpg", tag: "Café Pick" },
      { id: "bm7", name: "Filter Coffee Ice Cream Sundae", category: "Desserts & Chai", price: 260, diet: "veg", prep: 6, station: "Pastry", description: "Cold-brewed chicory decoction poured over vanilla bean gelato and roasted hazelnut crunch.", image: "/img/coffee-sundae.jpg" },
      { id: "bm8", name: "Kachumber & Mint Salad", category: "Small Plates", price: 140, diet: "veg", prep: 5, station: "Cold", description: "Crisp cucumber, heirloom tomato, red onion, toasted cumin and fresh lime dressing.", image: "/img/kachumber.jpg" },
    ],
  },
  "biryani-barons": {
    slug: "biryani-barons",
    tagline: "Slow-sealed Hyderabadi dum biryani, charcoal kebabs & royal shahi gravies.",
    heroImage: "/img/mutton-biryani.jpg",
    defaultTheme: "royal-noir",
    story:
      "Every handi at Biryani Barons is sealed with wheat dough and slow-cooked over glowing charcoal embers for 90 minutes. Aged basmati, saffron milk, and heritage Deccani spice blends across three Hyderabad outlets.",
    hours: "11:30 – 00:00 · Daily",
    phone: "+91 40 4892 1100",
    outlets: [
      { name: "Biryani Barons Jubilee Hills", area: "Road No. 36, Jubilee Hills, Hyderabad", seats: 68, hours: "11:30 – 00:00" },
      { name: "Biryani Barons Banjara Hills", area: "Road No. 12, Banjara Hills, Hyderabad", seats: 54, hours: "12:00 – 23:30" },
      { name: "Biryani Barons Gachibowli", area: "Financial District, Hyderabad", seats: 82, hours: "11:30 – 23:30" },
    ],
    metrics: { sales: 342800, orders: 218, guests: 294, aov: 1572, delta: 16.2 },
    dishes: [
      { id: "bb1", name: "Nizami Kachche Gosht Dum Biryani", category: "Dum Biryanis", price: 595, diet: "nonveg", prep: 22, station: "Curry", description: "Tender bone-in goat marinated overnight in saffron yoghurt and sealed under aged basmati.", image: "/img/mutton-biryani.jpg", tag: "Bestseller" },
      { id: "bb2", name: "Royal Zafrani Chicken Biryani", category: "Dum Biryanis", price: 485, diet: "nonveg", prep: 18, station: "Curry", description: "Aromatic long-grain basmati layered with spiced chicken, caramelized onions and mint.", image: "/img/thalassery-biryani.jpg", tag: "Signature" },
      { id: "bb3", name: "Charcoal Lamb Seekh Kebab", category: "Tandoor & Kebabs", price: 465, diet: "nonveg", prep: 15, station: "Tandoor", description: "Hand-minced lamb skewered with ginger, green chilli and garam masala over live charcoal.", image: "/img/seekh.jpg" },
      { id: "bb4", name: "Angara Tandoori Chicken", category: "Tandoor & Kebabs", price: 510, diet: "nonveg", prep: 18, station: "Tandoor", description: "Half spring chicken smoked in Kashmiri chilli, hung curd and roasted fenugreek.", image: "/img/tandoori-kozhi.jpg" },
      { id: "bb5", name: "Shahi Paneer Makhani", category: "Royal Gravies", price: 420, diet: "veg", prep: 14, station: "Curry", description: "Charred cottage cheese simmered in velvet heirloom tomato, cashew and kasuri methi gravy.", image: "/img/paneer-makhani.jpg" },
      { id: "bb6", name: "Aromatic Ghee Pulao", category: "Dum Biryanis", price: 340, diet: "veg", prep: 14, station: "Curry", description: "Fragrant whole-spice rice cooked in A2 cow ghee with toasted cashews and golden shallots.", image: "/img/ghee-pulao.jpg" },
    ],
  },
  "the-idli-project": {
    slug: "the-idli-project",
    tagline: "Heirloom fermented batters, wood-fired podis & filter kaapi in Chennai.",
    heroImage: "/img/idli-vada.jpg",
    defaultTheme: "ivory-emerald",
    story:
      "The Idli Project celebrates Tamil Nadu's breakfast and tiffin heritage using single-origin parboiled rice, hand-pounded gunpowders, and fresh cold-pressed gingelly oil.",
    hours: "07:00 – 22:30 · Daily",
    phone: "+91 44 2815 9920",
    outlets: [
      { name: "The Idli Project Alwarpet", area: "TTK Road, Alwarpet, Chennai", seats: 44, hours: "07:00 – 22:30" },
      { name: "The Idli Project Besant Nagar", area: "Elliot's Beach Road, Chennai", seats: 52, hours: "07:00 – 23:00" },
    ],
    metrics: { sales: 154600, orders: 264, guests: 312, aov: 585, delta: 11.8 },
    dishes: [
      { id: "ip1", name: "Ghee Podi Mallipoo Idli & Vada", category: "Tiffin Classics", price: 210, diet: "veg", prep: 8, station: "Curry", description: "Cloud-soft jasmine idlis tossed in house sesame podi and A2 ghee with crisp medu vada.", image: "/img/idli-vada.jpg", tag: "Bestseller" },
      { id: "ip2", name: "Madurai Chettinad Parotta & Salna", category: "Tiffin Classics", price: 295, diet: "nonveg", prep: 14, station: "Tandoor", description: "Flaky hand-beaten coin parottas served with slow-simmered black pepper Chettinad salna.", image: "/img/chettinad-parotta.jpg", tag: "Signature" },
      { id: "ip3", name: "Grand Banana Leaf Meals Thali", category: "Meals", price: 390, diet: "veg", prep: 12, station: "Curry", description: "Traditional 11-item South Indian feast with sambar, rasam, kootu, poriyal and payasam.", image: "/img/thali-plate.jpg" },
      { id: "ip4", name: "Kumbakonam Filter Coffee Sundae", category: "Coffee & Sweets", price: 240, diet: "veg", prep: 6, station: "Pastry", description: "Rich brass-davara decoction over artisanal vanilla ice cream and jaggery praline.", image: "/img/coffee-sundae.jpg" },
      { id: "ip5", name: "Coastal Prawn Ghee Pulao", category: "Meals", price: 465, diet: "nonveg", prep: 16, station: "Curry", description: "Seeraga samba rice cooked with spiced Bay of Bengal prawns and curry leaves.", image: "/img/prawn-pulao.jpg" },
      { id: "ip6", name: "Chettinad Fish Curry", category: "Meals", price: 480, diet: "nonveg", prep: 16, station: "Curry", description: "Tangy tamarind and freshly ground coriander curry simmered with fresh seer steaks.", image: "/img/meen-curry.jpg" },
    ],
  },
  "smoke-saffron": {
    slug: "smoke-saffron",
    tagline: "Contemporary North Indian fire dining across 7 Delhi NCR addresses.",
    heroImage: "/img/interior-dark.jpg",
    defaultTheme: "obsidian-gold",
    story:
      "Seven dining rooms across Delhi, Gurugram and Noida dedicated to live-fire tandoor cooking, heirloom Punjabi gravies, and artisanal craft cocktails.",
    hours: "12:00 – 00:30 · Daily",
    phone: "+91 11 4920 8800",
    outlets: [
      { name: "Smoke & Saffron Khan Market", area: "Middle Lane, New Delhi", seats: 62, hours: "12:00 – 00:30" },
      { name: "Smoke & Saffron CyberHub", area: "DLF CyberCity, Gurugram", seats: 94, hours: "12:00 – 00:30" },
      { name: "Smoke & Saffron Mehrauli", area: "One Style Mile, New Delhi", seats: 88, hours: "12:30 – 01:00" },
      { name: "Smoke & Saffron Noida", area: "Sector 18, Noida", seats: 70, hours: "12:00 – 23:30" },
    ],
    metrics: { sales: 618500, orders: 296, guests: 412, aov: 2089, delta: 19.4 },
    dishes: [
      { id: "ss1", name: "Smoked Malai Paneer Makhani", category: "Signature Curries", price: 545, diet: "veg", prep: 16, station: "Curry", description: "Tandoor-charred cottage cheese in 12-hour simmered tomato makhani finished with white butter.", image: "/img/paneer-makhani.jpg", tag: "Bestseller" },
      { id: "ss2", name: "Charcoal Galouti Seekh", category: "Live Tandoor", price: 625, diet: "nonveg", prep: 15, station: "Tandoor", description: "Melt-in-mouth smoked lamb kebabs infused with clove smoke and saffron.", image: "/img/seekh.jpg", tag: "Chef's Pick" },
      { id: "ss3", name: "Saffron Paneer Tikka Platter", category: "Live Tandoor", price: 495, diet: "veg", prep: 14, station: "Tandoor", description: "Kashmiri saffron and hung-curd marinated paneer roasted over white charcoal.", image: "/img/paneer-tikka.jpg" },
      { id: "ss4", name: "Awadhi Mutton Dum Biryani", category: "Biryani & Breads", price: 695, diet: "nonveg", prep: 22, station: "Curry", description: "Delicate Lucknowi dum biryani perfumed with kewra, saffron and brown onions.", image: "/img/mutton-biryani.jpg" },
      { id: "ss5", name: "Old Delhi Papdi Chaat", category: "Small Plates", price: 345, diet: "veg", prep: 8, station: "Cold", description: "Crisp wafers layered with chilled yoghurt foam, roasted cumin and pomegranate pearls.", image: "/img/papdi-chaat.jpg" },
      { id: "ss6", name: "Rose & Pistachio Tres Leches", category: "Desserts", price: 395, diet: "egg", prep: 6, station: "Pastry", description: "Saffron-rose soaked milk cake topped with roasted Iranian pistachios.", image: "/img/rose-cake.jpg" },
    ],
  },
  "cafe-kolkata-club": {
    slug: "cafe-kolkata-club",
    tagline: "Park Street nostalgia, Bengali seafood & heritage bistro fare.",
    heroImage: "/img/curry-spread.jpg",
    defaultTheme: "ivory-emerald",
    story: "Inspired by Kolkata's storied clubs and heritage tearooms — slow-cooked fish curries, fragrant biryani, flaky singaras, and warm conversation.",
    hours: "11:00 – 23:00 · Daily",
    phone: "+91 33 2229 4100",
    outlets: [{ name: "Café Kolkata Club Park Street", area: "Park Street, Kolkata", seats: 40, hours: "11:00 – 23:00" }],
    metrics: { sales: 52900, orders: 74, guests: 96, aov: 715, delta: 6.2 },
    dishes: [
      { id: "ck1", name: "Calcutta Aloo Mutton Biryani", category: "Heritage Mains", price: 495, diet: "nonveg", prep: 20, station: "Curry", description: "Fragrant long-grain rice with tender goat, saffron potato and soft-boiled egg.", image: "/img/mutton-biryani.jpg", tag: "Bestseller" },
      { id: "ck2", name: "Mustard & Tamarind Fish Curry", category: "Heritage Mains", price: 460, diet: "nonveg", prep: 16, station: "Curry", description: "Fresh river catch simmered in stone-ground mustard, green chilli and cold-pressed oil.", image: "/img/meen-curry.jpg" },
      { id: "ck3", name: "Clubhouse Singara (Samosa)", category: "Tea & Bites", price: 165, diet: "veg", prep: 8, station: "Cold", description: "Crisp flaky pastry filled with spiced cauliflower, peanuts and cumin potatoes.", image: "/img/samosa.jpg" },
      { id: "ck4", name: "Rose Petal Tea Cake", category: "Tea & Bites", price: 220, diet: "egg", prep: 5, station: "Pastry", description: "Warm butter sponge scented with Bengal rosewater and cardamom.", image: "/img/rose-cake.jpg" },
    ],
  },
};

export function getTenantProfile(slug: string, name: string, city: string, branchCount: number): TenantProfile {
  if (profiles[slug]) return profiles[slug];

  // Generate a distinct, realistic profile for any other tenant or newly registered restaurant
  const seed = [...slug].reduce((s, c) => s + c.charCodeAt(0), 0);
  const themeOrder: ThemeId[] = ["obsidian-gold", "ivory-emerald", "terracotta-sand", "royal-noir"];
  const defaultTheme = themeOrder[seed % themeOrder.length];
  const heroPool = ["/img/spread.jpg", "/img/interior-warm.jpg", "/img/curry-spread.jpg", "/img/bar.jpg"];

  const outlets = Array.from({ length: Math.max(1, Math.min(branchCount, 4)) }, (_, i) => ({
    name: i === 0 ? `${name} Flagship` : `${name} Outlet ${i + 1}`,
    area: i === 0 ? `Central District, ${city}` : `North Avenue, ${city}`,
    seats: 40 + i * 12,
    hours: "11:30 – 23:30",
  }));

  const isCoastal = /konkan|sea|coast|goa|malabar|fish/i.test(name);
  const dishes: TenantDish[] = isCoastal
    ? [
        { id: `${slug}-1`, name: "Konkan Prawn Curry", category: "Coastal Mains", price: 620, diet: "nonveg", prep: 16, station: "Curry", description: "Fresh tiger prawns simmered in roasted coconut, kokum and Byadgi chilli.", image: "/img/prawn-moilee.jpg", tag: "Signature" },
        { id: `${slug}-2`, name: "Goan Chicken Xacuti", category: "Coastal Mains", price: 540, diet: "nonveg", prep: 18, station: "Curry", description: "Aromatic roasted poppy seed, star anise and coconut masala.", image: "/img/goan-xacuti.jpg" },
        { id: `${slug}-3`, name: "Mangalorean Ghee Roast Pulao", category: "Rice & Breads", price: 460, diet: "nonveg", prep: 15, station: "Curry", description: "Fragrant rice tossed in clarified butter and coastal spice blend.", image: "/img/prawn-pulao.jpg" },
        { id: `${slug}-4`, name: "Smoked Paneer Tikka", category: "Starters", price: 390, diet: "veg", prep: 12, station: "Tandoor", description: "Char-grilled cottage cheese finished with coastal pepper glaze.", image: "/img/paneer-tikka.jpg" },
        { id: `${slug}-5`, name: "Kundapur Filter Coffee Sundae", category: "Desserts", price: 260, diet: "veg", prep: 6, station: "Pastry", description: "Estate coffee decoction poured over chilled vanilla bean cream.", image: "/img/coffee-sundae.jpg" },
        { id: `${slug}-6`, name: "Traditional Coastal Thali", category: "Thalis", price: 495, diet: "nonveg", prep: 14, station: "Curry", description: "Complete regional platter with red rice, curry, fry, sol kadhi and sweet.", image: "/img/thali.jpg", tag: "Bestseller" },
      ]
    : [
        { id: `${slug}-1`, name: "Chef's Signature Thali", category: "House Specials", price: 445, diet: "veg", prep: 14, station: "Curry", description: "Curated multi-course platter crafted fresh each service.", image: "/img/thali-plate.jpg", tag: "Bestseller" },
        { id: `${slug}-2`, name: "Charcoal Paneer Tikka", category: "Small Plates", price: 380, diet: "veg", prep: 12, station: "Tandoor", description: "Hand-cut malai paneer roasted over live embers with mint chutney.", image: "/img/paneer-tikka.jpg" },
        { id: `${slug}-3`, name: "Slow-Cooked Dum Biryani", category: "Mains", price: 520, diet: "nonveg", prep: 20, station: "Curry", description: "Aged basmati layered with whole spices, saffron and caramelized shallots.", image: "/img/mutton-biryani.jpg", tag: "Signature" },
        { id: `${slug}-4`, name: "Velvet Paneer Makhani", category: "Mains", price: 410, diet: "veg", prep: 15, station: "Curry", description: "Heirloom tomato and butter gravy finished with toasted fenugreek.", image: "/img/paneer-makhani.jpg" },
        { id: `${slug}-5`, name: "Crisp Samosa Chaat", category: "Small Plates", price: 210, diet: "veg", prep: 8, station: "Cold", description: "Flaky house samosa topped with spiced yoghurt, tamarind and sev.", image: "/img/samosa.jpg" },
        { id: `${slug}-6`, name: "Warm Rose & Pistachio Cake", category: "Desserts", price: 275, diet: "egg", prep: 6, station: "Pastry", description: "Cardamom butter sponge glazed with rose icing and crushed pistachios.", image: "/img/rose-cake.jpg" },
      ];

  const baseSales = 48000 + (seed % 9) * 24500 * Math.max(1, Math.min(branchCount, 4));
  const baseOrders = Math.round(baseSales / 980);

  return {
    slug,
    tagline: `Freshly crafted hospitality & direct online ordering in ${city}.`,
    heroImage: heroPool[seed % heroPool.length],
    defaultTheme,
    story: `${name} brings thoughtful regional cooking, warm service, and seamless digital dining to ${city}. Every dish is prepared to order with locally sourced ingredients.`,
    hours: "11:30 – 23:30 · Daily",
    phone: "+91 80 4412 8900",
    outlets,
    dishes,
    metrics: {
      sales: baseSales,
      orders: baseOrders,
      guests: Math.round(baseOrders * 1.35),
      aov: Math.round(baseSales / Math.max(1, baseOrders)),
      delta: Number((4.5 + (seed % 14)).toFixed(1)),
    },
  };
}

/** Plan-level module gating for Admin Panel sidebar & features */
export const PLAN_RANK: Record<PlanId, number> = {
  starter: 1,
  growth: 2,
  estate: 3,
};

export const ROUTE_MIN_PLAN: Record<string, PlanId> = {
  "/kitchen": "growth",
  "/waiter": "growth",
  "/admin/delivery": "growth",
  "/admin/customers": "growth",
  "/admin/offers": "growth",
  "/admin/reviews": "growth",
  "/admin/website": "growth",
  "/admin/inventory": "growth",
  "/admin/recipes": "growth",
  "/admin/suppliers": "growth",
  "/admin/integrations": "estate",
  "/admin/security": "estate",
  "/admin/notifications": "growth",
};

export function isRouteAllowedForPlan(href: string, plan: PlanId): boolean {
  const minPlan = ROUTE_MIN_PLAN[href];
  if (!minPlan) return true;
  return PLAN_RANK[plan] >= PLAN_RANK[minPlan];
}
