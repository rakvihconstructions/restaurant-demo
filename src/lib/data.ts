import { menu, menuById, type MenuItem } from "./menu";
import { seeded } from "./utils";

/* ------------------------------------------------------------------ */
/*  Restaurant & branches                                              */
/* ------------------------------------------------------------------ */

export const restaurant = {
  name: "Demo Restaurant",
  legal: "Demo Restaurant Hospitality Pvt. Ltd.",
  tagline: "Coastal Kitchen & Bar",
  gstin: "29AAKCN4821M1Z6",
  fssai: "11224998000612",
  phone: "+91 80 4718 2290",
  email: "hello@demorestaurant.in",
  address: "12th Main, HAL 2nd Stage, Indiranagar, Bengaluru 560038",
  currency: "INR",
  timezone: "Asia/Kolkata (IST, UTC+5:30)",
};

export type Branch = {
  id: string;
  name: string;
  area: string;
  city: string;
  manager: string;
  status: "open" | "closing-soon" | "closed" | "renovation";
  hours: string;
  holiday: string;
  tables: number;
  today: number;
  covers: number;
  rating: number;
  image: string;
};

export const branches: Branch[] = [
  { id: "b1", name: "Demo Restaurant · Indiranagar", area: "Indiranagar", city: "Bengaluru", manager: "Ananya Rao", status: "open", hours: "12:00 – 23:30", holiday: "None", tables: 24, today: 286420, covers: 214, rating: 4.8, image: "/img/interior-warm.jpg" },
  { id: "b2", name: "Demo Restaurant · Sea Deck", area: "Kovalam Beach", city: "Thiruvananthapuram", manager: "Joseph Mathew", status: "open", hours: "11:00 – 23:00", holiday: "Monday", tables: 30, today: 198750, covers: 162, rating: 4.9, image: "/img/terrace-sea.jpg" },
  { id: "b3", name: "Demo Restaurant · Bandra", area: "Bandra West", city: "Mumbai", manager: "Rhea D'Souza", status: "closing-soon", hours: "12:00 – 22:30", holiday: "None", tables: 20, today: 241310, covers: 177, rating: 4.7, image: "/img/interior-dark.jpg" },
  { id: "b4", name: "Demo Restaurant · Garden Room", area: "Jubilee Hills", city: "Hyderabad", manager: "Faiz Ahmed", status: "renovation", hours: "Reopens 12 Dec", holiday: "—", tables: 26, today: 0, covers: 0, rating: 4.6, image: "/img/garden.jpg" },
];

/* ------------------------------------------------------------------ */
/*  Staff                                                              */
/* ------------------------------------------------------------------ */

export type Staff = {
  id: string;
  name: string;
  role: string;
  branch: string;
  phone: string;
  shift: string;
  status: "on-shift" | "off" | "leave" | "break";
  attendance: number;
  rating: number;
  salary: number;
  joined: string;
};

export const staff: Staff[] = [
  { id: "E-1001", name: "Ananya Rao", role: "Branch Manager", branch: "Indiranagar", phone: "98450 11223", shift: "11:00 – 20:00", status: "on-shift", attendance: 98, rating: 4.9, salary: 115000, joined: "Mar 2022" },
  { id: "E-1002", name: "Chef Vikram Menon", role: "Head Chef", branch: "Indiranagar", phone: "98450 33001", shift: "13:00 – 23:30", status: "on-shift", attendance: 96, rating: 4.9, salary: 165000, joined: "Jan 2022" },
  { id: "E-1003", name: "Arjun Nair", role: "Cashier", branch: "Indiranagar", phone: "99001 77812", shift: "16:00 – 23:30", status: "on-shift", attendance: 94, rating: 4.6, salary: 32000, joined: "Aug 2023" },
  { id: "E-1004", name: "Meera Pillai", role: "Captain", branch: "Indiranagar", phone: "99001 22984", shift: "17:00 – 23:30", status: "on-shift", attendance: 97, rating: 4.8, salary: 38000, joined: "Feb 2023" },
  { id: "E-1005", name: "Rahul Shetty", role: "Waiter", branch: "Indiranagar", phone: "90080 11764", shift: "17:00 – 23:30", status: "on-shift", attendance: 91, rating: 4.5, salary: 24000, joined: "Jun 2024" },
  { id: "E-1006", name: "Divya Krishnan", role: "Waiter", branch: "Indiranagar", phone: "90080 55120", shift: "17:00 – 23:30", status: "break", attendance: 93, rating: 4.7, salary: 24000, joined: "Apr 2024" },
  { id: "E-1007", name: "Sanjay Kumar", role: "Waiter", branch: "Indiranagar", phone: "90080 90233", shift: "12:00 – 18:00", status: "off", attendance: 88, rating: 4.3, salary: 23000, joined: "Nov 2024" },
  { id: "E-1008", name: "Fatima Sheikh", role: "Sous Chef", branch: "Indiranagar", phone: "98861 44019", shift: "14:00 – 23:30", status: "on-shift", attendance: 95, rating: 4.8, salary: 78000, joined: "Jul 2022" },
  { id: "E-1009", name: "Ramesh Gowda", role: "Tandoor Chef", branch: "Indiranagar", phone: "98861 70012", shift: "16:00 – 23:30", status: "on-shift", attendance: 99, rating: 4.7, salary: 46000, joined: "Jan 2022" },
  { id: "E-1010", name: "Lakshmi Iyer", role: "Pastry Chef", branch: "Indiranagar", phone: "98861 21987", shift: "12:00 – 21:00", status: "on-shift", attendance: 97, rating: 4.9, salary: 52000, joined: "Sep 2023" },
  { id: "E-1011", name: "Kiran Bhat", role: "Inventory Manager", branch: "Indiranagar", phone: "97400 66102", shift: "09:00 – 18:00", status: "off", attendance: 96, rating: 4.6, salary: 48000, joined: "May 2023" },
  { id: "E-1012", name: "Priya Venkatesh", role: "Accountant", branch: "All branches", phone: "97400 18834", shift: "10:00 – 19:00", status: "off", attendance: 99, rating: 4.8, salary: 72000, joined: "Feb 2022" },
  { id: "E-1013", name: "Imran Pasha", role: "Delivery Staff", branch: "Indiranagar", phone: "96320 44871", shift: "17:00 – 23:30", status: "on-shift", attendance: 90, rating: 4.4, salary: 21000, joined: "Oct 2024" },
  { id: "E-1014", name: "Tenzin Dorje", role: "Bartender", branch: "Indiranagar", phone: "96320 10928", shift: "18:00 – 01:00", status: "on-shift", attendance: 92, rating: 4.8, salary: 42000, joined: "Dec 2023" },
  { id: "E-1015", name: "Neha Joshi", role: "Host", branch: "Indiranagar", phone: "96320 77451", shift: "18:00 – 23:30", status: "leave", attendance: 86, rating: 4.5, salary: 26000, joined: "Jan 2025" },
  { id: "E-1016", name: "Abdul Rahim", role: "Delivery Staff", branch: "Indiranagar", phone: "96320 66213", shift: "17:00 – 23:30", status: "on-shift", attendance: 94, rating: 4.6, salary: 21000, joined: "Mar 2025" },
];

/* ------------------------------------------------------------------ */
/*  Tables & floor plan                                                */
/* ------------------------------------------------------------------ */

export type TableStatus = "available" | "occupied" | "reserved" | "cleaning";
export type Table = {
  id: string;
  label: string;
  floor: "Verandah" | "Dining Room" | "Sea Deck";
  seats: number;
  shape: "round" | "square" | "long";
  x: number;
  y: number;
  status: TableStatus;
  guests?: number;
  waiter?: string;
  since?: number; // minutes seated
  bill?: number;
  reservedFor?: string;
};

export const tables: Table[] = [
  // Dining room
  { id: "T1", label: "01", floor: "Dining Room", seats: 2, shape: "round", x: 8, y: 12, status: "occupied", guests: 2, waiter: "Rahul", since: 42, bill: 2380 },
  { id: "T2", label: "02", floor: "Dining Room", seats: 2, shape: "round", x: 26, y: 12, status: "available" },
  { id: "T3", label: "03", floor: "Dining Room", seats: 4, shape: "square", x: 46, y: 12, status: "occupied", guests: 4, waiter: "Meera", since: 18, bill: 1840 },
  { id: "T4", label: "04", floor: "Dining Room", seats: 4, shape: "square", x: 66, y: 12, status: "reserved", reservedFor: "Kapoor · 20:45" },
  { id: "T5", label: "05", floor: "Dining Room", seats: 6, shape: "long", x: 86, y: 14, status: "occupied", guests: 6, waiter: "Divya", since: 64, bill: 7920 },
  { id: "T6", label: "06", floor: "Dining Room", seats: 4, shape: "square", x: 8, y: 48, status: "cleaning" },
  { id: "T7", label: "07", floor: "Dining Room", seats: 4, shape: "square", x: 28, y: 48, status: "occupied", guests: 3, waiter: "Rahul", since: 27, bill: 3150 },
  { id: "T8", label: "08", floor: "Dining Room", seats: 8, shape: "long", x: 56, y: 50, status: "occupied", guests: 8, waiter: "Meera", since: 51, bill: 11480 },
  { id: "T9", label: "09", floor: "Dining Room", seats: 2, shape: "round", x: 86, y: 50, status: "available" },
  { id: "T10", label: "10", floor: "Dining Room", seats: 4, shape: "square", x: 10, y: 84, status: "reserved", reservedFor: "Iyer · 21:00" },
  { id: "T11", label: "11", floor: "Dining Room", seats: 4, shape: "square", x: 32, y: 84, status: "occupied", guests: 2, waiter: "Divya", since: 9, bill: 640 },
  { id: "T12", label: "12", floor: "Dining Room", seats: 2, shape: "round", x: 54, y: 84, status: "available" },
  { id: "T13", label: "13", floor: "Dining Room", seats: 6, shape: "long", x: 80, y: 84, status: "occupied", guests: 5, waiter: "Rahul", since: 33, bill: 5260 },
  // Verandah
  { id: "V1", label: "V1", floor: "Verandah", seats: 2, shape: "round", x: 12, y: 20, status: "occupied", guests: 2, waiter: "Meera", since: 21, bill: 1290 },
  { id: "V2", label: "V2", floor: "Verandah", seats: 2, shape: "round", x: 36, y: 20, status: "available" },
  { id: "V3", label: "V3", floor: "Verandah", seats: 4, shape: "square", x: 62, y: 20, status: "reserved", reservedFor: "Sen · 21:15" },
  { id: "V4", label: "V4", floor: "Verandah", seats: 4, shape: "square", x: 86, y: 20, status: "occupied", guests: 4, waiter: "Divya", since: 47, bill: 4410 },
  { id: "V5", label: "V5", floor: "Verandah", seats: 6, shape: "long", x: 24, y: 70, status: "cleaning" },
  { id: "V6", label: "V6", floor: "Verandah", seats: 4, shape: "square", x: 58, y: 70, status: "available" },
  { id: "V7", label: "V7", floor: "Verandah", seats: 2, shape: "round", x: 84, y: 70, status: "occupied", guests: 2, waiter: "Rahul", since: 12, bill: 860 },
  // Sea deck (rooftop)
  { id: "S1", label: "S1", floor: "Sea Deck", seats: 4, shape: "square", x: 14, y: 24, status: "occupied", guests: 4, waiter: "Meera", since: 39, bill: 6120 },
  { id: "S2", label: "S2", floor: "Sea Deck", seats: 4, shape: "square", x: 42, y: 24, status: "reserved", reservedFor: "Banerjee · 21:30" },
  { id: "S3", label: "S3", floor: "Sea Deck", seats: 8, shape: "long", x: 76, y: 26, status: "available" },
  { id: "S4", label: "S4", floor: "Sea Deck", seats: 2, shape: "round", x: 22, y: 74, status: "available" },
  { id: "S5", label: "S5", floor: "Sea Deck", seats: 2, shape: "round", x: 50, y: 74, status: "occupied", guests: 2, waiter: "Divya", since: 55, bill: 3380 },
  { id: "S6", label: "S6", floor: "Sea Deck", seats: 4, shape: "square", x: 80, y: 74, status: "occupied", guests: 3, waiter: "Rahul", since: 6, bill: 0 },
];

/* ------------------------------------------------------------------ */
/*  Orders                                                             */
/* ------------------------------------------------------------------ */

export type Channel = "Dine-in" | "Takeaway" | "Delivery" | "QR" | "Online";
export type OrderStatus = "new" | "accepted" | "preparing" | "ready" | "served" | "out" | "completed" | "cancelled";
export type PayMethod = "UPI" | "Card" | "Cash" | "Split" | "Online" | "Unpaid";

export type OrderLine = { item: MenuItem; qty: number; note?: string };
export type Order = {
  id: string;
  channel: Channel;
  status: OrderStatus;
  time: string;
  minutesAgo: number;
  table?: string;
  customer: string;
  phone: string;
  lines: OrderLine[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  payment: PayMethod;
  staff: string;
  station?: string;
  priority?: boolean;
  rider?: string;
};

const names = [
  "Aditi Sharma", "Rohan Kapoor", "Kavya Reddy", "Siddharth Iyer", "Nikhil Menon", "Sneha Patil", "Varun Hegde",
  "Ishita Banerjee", "Karthik Subramanian", "Pooja Nair", "Aman Gupta", "Zoya Khan", "Rajat Malhotra", "Tanvi Desai",
  "Harsh Vardhan", "Meghna Das", "Vivek Rao", "Anjali Kulkarni", "Dev Anand", "Shruti Hassan", "Farhan Ali", "Nisha Thomas",
];

const rand = seeded(2611);
const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)];

function buildOrder(i: number): Order {
  const channelRoll = rand();
  const channel: Channel =
    channelRoll < 0.42 ? "Dine-in" : channelRoll < 0.6 ? "QR" : channelRoll < 0.78 ? "Delivery" : channelRoll < 0.9 ? "Takeaway" : "Online";
  const minutesAgo = i * 7 + Math.floor(rand() * 5);
  const lineCount = 1 + Math.floor(rand() * 4);
  const pool = [...menu];
  const lines: OrderLine[] = [];
  for (let l = 0; l < lineCount; l++) {
    const idx = Math.floor(rand() * pool.length);
    const item = pool.splice(idx, 1)[0];
    lines.push({ item, qty: 1 + (rand() < 0.3 ? 1 : 0) });
  }
  const subtotal = lines.reduce((s, l) => s + l.item.price * l.qty, 0);
  const discount = rand() < 0.18 ? Math.round(subtotal * 0.1) : 0;
  const tax = Math.round((subtotal - discount) * 0.05);
  const total = subtotal - discount + tax + (channel === "Delivery" ? 49 : 0);
  let status: OrderStatus;
  if (minutesAgo < 6) status = "new";
  else if (minutesAgo < 14) status = rand() < 0.5 ? "accepted" : "preparing";
  else if (minutesAgo < 26) status = "preparing";
  else if (minutesAgo < 34) status = channel === "Delivery" ? "out" : "ready";
  else if (minutesAgo < 60) status = channel === "Dine-in" || channel === "QR" ? "served" : channel === "Delivery" ? "out" : "completed";
  else status = rand() < 0.06 ? "cancelled" : "completed";

  const h = 20 * 60 + 15 - minutesAgo;
  const time = `${String(Math.floor(h / 60)).padStart(2, "0")}:${String(h % 60).padStart(2, "0")}`;
  const dineTables = tables.filter((t) => t.status === "occupied");
  const payment: PayMethod =
    status === "cancelled" ? "Unpaid" : status === "completed" || channel === "Online" || channel === "Delivery"
      ? pick<PayMethod>(["UPI", "UPI", "Card", "Cash", "Online", "Split"])
      : "Unpaid";

  return {
    id: `NL-${24816 - i}`,
    channel,
    status,
    time,
    minutesAgo,
    table: channel === "Dine-in" || channel === "QR" ? pick(dineTables).label : undefined,
    customer: channel === "Dine-in" && rand() < 0.3 ? "Walk-in guest" : pick(names),
    phone: `9${Math.floor(rand() * 9)}${String(Math.floor(rand() * 1e8)).padStart(8, "0")}`.replace(/(\d{5})(\d{5})/, "$1 $2"),
    lines,
    subtotal,
    tax,
    discount,
    total,
    payment,
    staff: pick(["Arjun", "Meera", "Rahul", "Divya", "QR self-order"]),
    priority: rand() < 0.12,
    rider: channel === "Delivery" ? pick(["Imran P.", "Abdul R.", "Swiggy · Manoj", "Zomato · Ravi"]) : undefined,
  };
}

export const orders: Order[] = Array.from({ length: 42 }, (_, i) => buildOrder(i));

/* ------------------------------------------------------------------ */
/*  Reservations & waitlist                                            */
/* ------------------------------------------------------------------ */

export type Reservation = {
  id: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  table?: string;
  status: "confirmed" | "pending" | "seated" | "cancelled" | "no-show";
  occasion?: string;
  source: "Website" | "Phone" | "Walk-in" | "Google" | "Instagram";
  note?: string;
};

export const reservations: Reservation[] = [
  { id: "R-5521", name: "Ritika Kapoor", phone: "98110 22334", date: "Today", time: "20:45", guests: 4, table: "04", status: "confirmed", occasion: "Anniversary", source: "Website", note: "Window if possible. Allergic to cashew." },
  { id: "R-5522", name: "Sundar Iyer", phone: "98450 88120", date: "Today", time: "21:00", guests: 4, table: "10", status: "confirmed", source: "Phone" },
  { id: "R-5523", name: "Aparna Sen", phone: "99860 41207", date: "Today", time: "21:15", guests: 3, table: "V3", status: "pending", source: "Instagram" },
  { id: "R-5524", name: "Arnab Banerjee", phone: "90080 32190", date: "Today", time: "21:30", guests: 4, table: "S2", status: "confirmed", occasion: "Birthday", source: "Google", note: "Cake at 22:15 — Rose gateau." },
  { id: "R-5525", name: "Leela Fernandes", phone: "97311 00921", date: "Today", time: "21:45", guests: 2, status: "pending", source: "Website" },
  { id: "R-5518", name: "Mohit Bansal", phone: "98860 45512", date: "Today", time: "19:30", guests: 6, table: "05", status: "seated", source: "Phone" },
  { id: "R-5519", name: "Kavitha Raman", phone: "98455 66190", date: "Today", time: "19:45", guests: 8, table: "08", status: "seated", occasion: "Team dinner", source: "Website" },
  { id: "R-5516", name: "Sameer Joshi", phone: "90360 77821", date: "Today", time: "19:00", guests: 2, status: "no-show", source: "Google" },
  { id: "R-5517", name: "Diana Mascarenhas", phone: "98440 21098", date: "Today", time: "19:15", guests: 4, status: "cancelled", source: "Website", note: "Rescheduled to Saturday." },
  { id: "R-5530", name: "Gaurav Mehta", phone: "99011 54321", date: "Fri, 27 Nov", time: "20:00", guests: 5, status: "confirmed", source: "Website" },
  { id: "R-5531", name: "Hema Malini K.", phone: "98450 12876", date: "Fri, 27 Nov", time: "20:30", guests: 2, status: "confirmed", occasion: "Anniversary", source: "Phone" },
  { id: "R-5532", name: "Prakash Raj", phone: "97400 87120", date: "Sat, 28 Nov", time: "13:00", guests: 10, status: "pending", occasion: "Family lunch", source: "Website" },
];

export const waitlist = [
  { id: "W-31", name: "Akash + 1", guests: 2, waiting: 14, quoted: 20, phone: "98450 11008", pref: "Verandah" },
  { id: "W-32", name: "Shalini R.", guests: 4, waiting: 9, quoted: 25, phone: "99010 22871", pref: "Any" },
  { id: "W-33", name: "Thomas family", guests: 5, waiting: 6, quoted: 30, phone: "98861 44982", pref: "Dining Room" },
  { id: "W-34", name: "Ved & Ira", guests: 2, waiting: 2, quoted: 15, phone: "90082 11765", pref: "Sea Deck" },
];

/* ------------------------------------------------------------------ */
/*  Customers                                                          */
/* ------------------------------------------------------------------ */

export type Customer = {
  id: string;
  name: string;
  phone: string;
  email: string;
  visits: number;
  spend: number;
  points: number;
  tier: "Pearl" | "Coral" | "Sapphire" | "New";
  last: string;
  fav: string;
  birthday?: string;
  note?: string;
};

export const customers: Customer[] = names.slice(0, 18).map((n, i) => {
  const r = seeded(900 + i);
  const visits = i === 17 ? 1 : 2 + Math.floor(r() * 46);
  const spend = Math.round(visits * (1400 + r() * 2600));
  const tier = visits === 1 ? "New" : spend > 90000 ? "Sapphire" : spend > 40000 ? "Coral" : "Pearl";
  return {
    id: `C-${3100 + i}`,
    name: n,
    phone: `9${String(Math.floor(r() * 1e9)).padStart(9, "0")}`.replace(/(\d{5})(\d{5})/, "$1 $2"),
    email: n.toLowerCase().replace(/[^a-z]+/g, ".") + "@mail.com",
    visits,
    spend,
    points: Math.round(spend / 20),
    tier,
    last: ["Today", "Yesterday", "2 days ago", "Last week", "12 Nov", "3 Nov", "28 Oct"][Math.floor(r() * 7)],
    fav: menu[Math.floor(r() * menu.length)].name,
    birthday: r() < 0.5 ? ["14 Dec", "2 Jan", "29 Nov", "18 Feb", "7 Dec"][Math.floor(r() * 5)] : undefined,
    note: i === 1 ? "Prefers Sea Deck. Pescatarian." : i === 4 ? "Corporate account — invoices to finance@." : undefined,
  } satisfies Customer;
});

/* ------------------------------------------------------------------ */
/*  Inventory, suppliers, purchases                                    */
/* ------------------------------------------------------------------ */

export type Ingredient = {
  id: string;
  name: string;
  category: string;
  unit: "kg" | "L" | "pcs" | "g";
  stock: number;
  min: number;
  cost: number;
  supplier: string;
  expiry: string;
  used7d: number;
};

export const inventory: Ingredient[] = [
  { id: "I-01", name: "Tiger prawns (16/20)", category: "Seafood", unit: "kg", stock: 6.4, min: 10, cost: 980, supplier: "Malabar Catch Co.", expiry: "28 Nov", used7d: 41 },
  { id: "I-02", name: "Seer fish (steaks)", category: "Seafood", unit: "kg", stock: 8.2, min: 6, cost: 1120, supplier: "Malabar Catch Co.", expiry: "27 Nov", used7d: 33 },
  { id: "I-03", name: "Yellowfin tuna loin", category: "Seafood", unit: "kg", stock: 1.6, min: 3, cost: 1650, supplier: "Malabar Catch Co.", expiry: "27 Nov", used7d: 9 },
  { id: "I-04", name: "Chicken (curry cut)", category: "Meat", unit: "kg", stock: 34, min: 20, cost: 265, supplier: "Venkateshwara Poultry", expiry: "28 Nov", used7d: 118 },
  { id: "I-05", name: "Goat (bone-in)", category: "Meat", unit: "kg", stock: 14, min: 12, cost: 780, supplier: "Al-Kareem Meats", expiry: "29 Nov", used7d: 52 },
  { id: "I-06", name: "Lamb mince", category: "Meat", unit: "kg", stock: 5.5, min: 6, cost: 820, supplier: "Al-Kareem Meats", expiry: "28 Nov", used7d: 27 },
  { id: "I-07", name: "Pork shoulder", category: "Meat", unit: "kg", stock: 9, min: 5, cost: 540, supplier: "Goa Meat Traders", expiry: "30 Nov", used7d: 14 },
  { id: "I-08", name: "Paneer (malai)", category: "Dairy", unit: "kg", stock: 18, min: 10, cost: 420, supplier: "Nandini Dairy", expiry: "29 Nov", used7d: 61 },
  { id: "I-09", name: "Cultured butter", category: "Dairy", unit: "kg", stock: 4.2, min: 5, cost: 640, supplier: "Nandini Dairy", expiry: "08 Dec", used7d: 22 },
  { id: "I-10", name: "Coconut milk (fresh)", category: "Produce", unit: "L", stock: 22, min: 15, cost: 140, supplier: "Kerala Coconut Co-op", expiry: "27 Nov", used7d: 96 },
  { id: "I-11", name: "Kaima rice", category: "Dry goods", unit: "kg", stock: 64, min: 40, cost: 165, supplier: "Thalassery Rice Mills", expiry: "Mar 2027", used7d: 88 },
  { id: "I-12", name: "Basmati (aged)", category: "Dry goods", unit: "kg", stock: 38, min: 30, cost: 148, supplier: "Thalassery Rice Mills", expiry: "Jan 2027", used7d: 51 },
  { id: "I-13", name: "Kashmiri chilli", category: "Spices", unit: "kg", stock: 3.1, min: 2, cost: 720, supplier: "Spice Route Traders", expiry: "Jun 2027", used7d: 4.6 },
  { id: "I-14", name: "Kokum (dried)", category: "Spices", unit: "kg", stock: 0.9, min: 1.5, cost: 560, supplier: "Spice Route Traders", expiry: "Aug 2027", used7d: 1.2 },
  { id: "I-15", name: "Curry leaves", category: "Produce", unit: "kg", stock: 2.4, min: 1, cost: 120, supplier: "KR Market Fresh", expiry: "28 Nov", used7d: 6 },
  { id: "I-16", name: "Shallots", category: "Produce", unit: "kg", stock: 26, min: 15, cost: 78, supplier: "KR Market Fresh", expiry: "05 Dec", used7d: 44 },
  { id: "I-17", name: "Heirloom tomatoes", category: "Produce", unit: "kg", stock: 7, min: 8, cost: 160, supplier: "Hosur Farm Collective", expiry: "29 Nov", used7d: 21 },
  { id: "I-18", name: "Ghee (A2)", category: "Dairy", unit: "L", stock: 11, min: 6, cost: 980, supplier: "Nandini Dairy", expiry: "Feb 2027", used7d: 9 },
  { id: "I-19", name: "Malabar parotta dough", category: "Bakery", unit: "pcs", stock: 140, min: 120, cost: 9, supplier: "In-house", expiry: "27 Nov", used7d: 1080 },
  { id: "I-20", name: "Indian single malt", category: "Bar", unit: "L", stock: 4.5, min: 3, cost: 4200, supplier: "United Spirits", expiry: "—", used7d: 3.1 },
  { id: "I-21", name: "London dry gin", category: "Bar", unit: "L", stock: 2.2, min: 3, cost: 2600, supplier: "United Spirits", expiry: "—", used7d: 4.4 },
  { id: "I-22", name: "Palm jaggery", category: "Dry goods", unit: "kg", stock: 6, min: 4, cost: 220, supplier: "Spice Route Traders", expiry: "Apr 2027", used7d: 2.8 },
];

export const suppliers = [
  { id: "SP-01", name: "Malabar Catch Co.", category: "Seafood", contact: "Shaji K.", phone: "94470 11290", terms: "Net 7", outstanding: 84200, rating: 4.7, orders: 62, onTime: 94 },
  { id: "SP-02", name: "Venkateshwara Poultry", category: "Meat", contact: "Ravi Teja", phone: "98450 66012", terms: "Net 15", outstanding: 21800, rating: 4.4, orders: 88, onTime: 97 },
  { id: "SP-03", name: "Al-Kareem Meats", category: "Meat", contact: "Kareem Shaikh", phone: "98861 23098", terms: "Net 7", outstanding: 46500, rating: 4.6, orders: 54, onTime: 91 },
  { id: "SP-04", name: "Nandini Dairy", category: "Dairy", contact: "Order desk", phone: "1800 425 8030", terms: "Advance", outstanding: 0, rating: 4.8, orders: 120, onTime: 99 },
  { id: "SP-05", name: "Kerala Coconut Co-op", category: "Produce", contact: "Bindu M.", phone: "94950 77120", terms: "Net 15", outstanding: 12600, rating: 4.5, orders: 76, onTime: 89 },
  { id: "SP-06", name: "Thalassery Rice Mills", category: "Dry goods", contact: "Ashraf P.", phone: "94460 22871", terms: "Net 30", outstanding: 38900, rating: 4.9, orders: 24, onTime: 100 },
  { id: "SP-07", name: "Spice Route Traders", category: "Spices", contact: "Jayan V.", phone: "98470 55402", terms: "Net 30", outstanding: 9400, rating: 4.6, orders: 31, onTime: 96 },
  { id: "SP-08", name: "KR Market Fresh", category: "Produce", contact: "Manjunath", phone: "99860 11872", terms: "Cash", outstanding: 0, rating: 4.1, orders: 140, onTime: 86 },
];

export const purchaseOrders = [
  { id: "PO-1182", supplier: "Malabar Catch Co.", items: 4, amount: 46800, date: "26 Nov", status: "Ordered", eta: "Tomorrow 7:00" },
  { id: "PO-1181", supplier: "Nandini Dairy", items: 3, amount: 18240, date: "26 Nov", status: "Received", eta: "—" },
  { id: "PO-1180", supplier: "Spice Route Traders", items: 6, amount: 12950, date: "25 Nov", status: "Partially received", eta: "28 Nov" },
  { id: "PO-1179", supplier: "Al-Kareem Meats", items: 2, amount: 22400, date: "25 Nov", status: "Received", eta: "—" },
  { id: "PO-1178", supplier: "Thalassery Rice Mills", items: 2, amount: 38900, date: "22 Nov", status: "Invoiced", eta: "—" },
  { id: "PO-1177", supplier: "KR Market Fresh", items: 11, amount: 8640, date: "22 Nov", status: "Paid", eta: "—" },
  { id: "PO-1176", supplier: "Kerala Coconut Co-op", items: 2, amount: 6300, date: "21 Nov", status: "Returned", eta: "—" },
];

/* ------------------------------------------------------------------ */
/*  Recipes                                                            */
/* ------------------------------------------------------------------ */

export const recipes = [
  {
    item: menuById["m10"],
    version: "v4 · 12 Oct",
    yieldNote: "1 portion · 320 g",
    lines: [
      { name: "Tiger prawns", qty: "180 g", cost: 176 },
      { name: "Coconut milk", qty: "150 ml", cost: 21 },
      { name: "Shallots", qty: "40 g", cost: 3 },
      { name: "Curry leaves, chilli, ginger", qty: "—", cost: 6 },
      { name: "Turmeric, pepper, coconut oil", qty: "—", cost: 9 },
      { name: "Matta rice", qty: "160 g", cost: 14 },
    ],
    steps: ["Temper mustard seed, curry leaf and shallot in coconut oil.", "Add thin coconut milk, simmer with turmeric and green chilli.", "Poach prawns 3 minutes. Finish with thick milk off the heat."],
  },
  {
    item: menuById["m16"],
    version: "v7 · 02 Nov",
    yieldNote: "1 portion · 450 g",
    lines: [
      { name: "Chicken, curry cut", qty: "220 g", cost: 58 },
      { name: "Kaima rice", qty: "140 g", cost: 23 },
      { name: "Ghee (A2)", qty: "25 ml", cost: 25 },
      { name: "Fried shallot, cashew, raisin", qty: "40 g", cost: 31 },
      { name: "Whole spices & masala", qty: "—", cost: 14 },
      { name: "Raita & pickle", qty: "—", cost: 17 },
    ],
    steps: ["Marinate chicken overnight.", "Par-cook kaima rice in stock, 70%.", "Layer, seal with dough, dum 35 min."],
  },
  {
    item: menuById["m09"],
    version: "v2 · 30 Sep",
    yieldNote: "1 portion · 280 g",
    lines: [
      { name: "Paneer (malai)", qty: "200 g", cost: 84 },
      { name: "Hung curd marinade", qty: "60 g", cost: 12 },
      { name: "Peppers & onion", qty: "80 g", cost: 9 },
      { name: "Butter & spices", qty: "—", cost: 13 },
    ],
    steps: ["Marinate 4 hours.", "Tandoor 6 minutes.", "Finish on cast iron with butter."],
  },
  {
    item: menuById["m29"],
    version: "v3 · 01 Aug",
    yieldNote: "1 drink · 240 ml",
    lines: [
      { name: "London dry gin", qty: "60 ml", cost: 98 },
      { name: "Kokum shrub", qty: "30 ml", cost: 11 },
      { name: "Soda & garnish", qty: "—", cost: 9 },
    ],
    steps: ["Build over ice.", "Top with soda.", "Express kaffir lime."],
  },
];

/* ------------------------------------------------------------------ */
/*  Offers                                                             */
/* ------------------------------------------------------------------ */

export const coupons = [
  { code: "TIDE15", type: "Percentage", value: "15% off", rule: "Min ₹1,500 · max ₹400", scope: "All branches", uses: 412, limit: 1000, from: "01 Nov", to: "30 Nov", active: true, revenue: 684200 },
  { code: "FIRSTBITE", type: "First order", value: "₹250 off", rule: "First online order", scope: "Online & delivery", uses: 268, limit: 0, from: "01 Jan", to: "31 Dec", active: true, revenue: 312800 },
  { code: "BIRYANI2", type: "BOGO", value: "Buy 1 get 1", rule: "Biryani, Mon–Thu lunch", scope: "Indiranagar", uses: 96, limit: 300, from: "10 Nov", to: "10 Dec", active: true, revenue: 104400 },
  { code: "SEADECK", type: "Fixed", value: "₹500 off", rule: "Min ₹4,000, Sea Deck only", scope: "Kovalam", uses: 54, limit: 200, from: "15 Nov", to: "15 Jan", active: true, revenue: 228600 },
  { code: "THALI99", type: "Combo", value: "Thali + drink ₹999", rule: "Weekday lunch", scope: "All branches", uses: 188, limit: 0, from: "01 Oct", to: "31 Dec", active: true, revenue: 187800 },
  { code: "DIWALI25", type: "Percentage", value: "25% off", rule: "Min ₹2,000 · max ₹750", scope: "All branches", uses: 1240, limit: 1200, from: "28 Oct", to: "05 Nov", active: false, revenue: 1984000 },
];

/* ------------------------------------------------------------------ */
/*  Finance                                                            */
/* ------------------------------------------------------------------ */

export const expenses = [
  { id: "EX-301", title: "Rent — Indiranagar (Nov)", category: "Rent", branch: "Indiranagar", amount: 485000, date: "01 Nov", recurring: true, by: "Priya V.", receipt: true },
  { id: "EX-302", title: "BESCOM electricity", category: "Utilities", branch: "Indiranagar", amount: 68420, date: "05 Nov", recurring: true, by: "Priya V.", receipt: true },
  { id: "EX-303", title: "LPG cylinders (commercial × 18)", category: "Utilities", branch: "Indiranagar", amount: 39600, date: "08 Nov", recurring: false, by: "Kiran B.", receipt: true },
  { id: "EX-304", title: "Tandoor relining", category: "Maintenance", branch: "Indiranagar", amount: 24500, date: "11 Nov", recurring: false, by: "Ananya R.", receipt: true },
  { id: "EX-305", title: "Staff payroll (Nov)", category: "Staff", branch: "All branches", amount: 1864000, date: "25 Nov", recurring: true, by: "Priya V.", receipt: false },
  { id: "EX-306", title: "Linen & laundry", category: "Operations", branch: "Indiranagar", amount: 18750, date: "15 Nov", recurring: true, by: "Ananya R.", receipt: true },
  { id: "EX-307", title: "Pest control (quarterly)", category: "Maintenance", branch: "Bandra", amount: 12000, date: "18 Nov", recurring: true, by: "Rhea D.", receipt: true },
  { id: "EX-308", title: "Instagram & Google ads", category: "Marketing", branch: "All branches", amount: 92000, date: "20 Nov", recurring: false, by: "Ananya R.", receipt: true },
  { id: "EX-309", title: "Delivery fuel reimbursements", category: "Transport", branch: "Indiranagar", amount: 14320, date: "22 Nov", recurring: false, by: "Kiran B.", receipt: false },
  { id: "EX-310", title: "Water cans & RO service", category: "Utilities", branch: "Kovalam", amount: 8900, date: "24 Nov", recurring: true, by: "Joseph M.", receipt: true },
];

export const cashRegister = {
  opened: "11:02 by Arjun N.",
  opening: 15000,
  cashSales: 48260,
  cashIn: 5000,
  cashOut: 3240,
  expected: 65020,
};

/* ------------------------------------------------------------------ */
/*  Reviews                                                            */
/* ------------------------------------------------------------------ */

export const reviews = [
  { id: "RV-1", name: "Ishita B.", rating: 5, source: "Google", date: "2h ago", text: "The prawn moilee is the best I've had outside Kochi. Service was warm without hovering. The Sea Deck at sunset is unreal.", dish: "Malabar Prawn Moilee", status: "replied", sentiment: "positive" },
  { id: "RV-2", name: "Karthik S.", rating: 4, source: "Zomato", date: "5h ago", text: "Thalassery biryani was excellent — properly short-grain. Took a while to arrive on a busy Friday though.", dish: "Thalassery Chicken Biryani", status: "pending", sentiment: "positive" },
  { id: "RV-3", name: "Anonymous", rating: 2, source: "QR feedback", date: "Today, 19:58", text: "Table 07 — waited 15 minutes for the bill after requesting twice.", dish: "—", status: "flagged", sentiment: "negative" },
  { id: "RV-4", name: "Pooja N.", rating: 5, source: "Website", date: "Yesterday", text: "Filter coffee sundae. That's the review. Go.", dish: "Filter Coffee Sundae", status: "replied", sentiment: "positive" },
  { id: "RV-5", name: "Rajat M.", rating: 3, source: "Swiggy", date: "Yesterday", text: "Food was great but the meen curry leaked in the box. Packaging needs work.", dish: "Kerala Meen Curry", status: "pending", sentiment: "neutral" },
  { id: "RV-6", name: "Zoya K.", rating: 5, source: "Google", date: "2 days ago", text: "Celebrated our anniversary here. They remembered the cashew allergy from the booking note without us repeating it. Class act.", dish: "—", status: "replied", sentiment: "positive" },
  { id: "RV-7", name: "Varun H.", rating: 4, source: "TripAdvisor", date: "3 days ago", text: "Tamarind old fashioned is a revelation. Slightly loud on weekends.", dish: "Tamarind Old Fashioned", status: "pending", sentiment: "positive" },
];

/* ------------------------------------------------------------------ */
/*  Delivery                                                           */
/* ------------------------------------------------------------------ */

export const riders = [
  { id: "DR-1", name: "Imran Pasha", phone: "96320 44871", status: "On delivery", orders: 14, eta: "6 min", rating: 4.6, vehicle: "KA-03-HM-2291", inHouse: true },
  { id: "DR-2", name: "Abdul Rahim", phone: "96320 66213", status: "Returning", orders: 11, eta: "—", rating: 4.7, vehicle: "KA-01-JK-8812", inHouse: true },
  { id: "DR-3", name: "Swiggy · Manoj", phone: "Platform", status: "Picked up", orders: 9, eta: "12 min", rating: 4.4, vehicle: "—", inHouse: false },
  { id: "DR-4", name: "Zomato · Ravi", phone: "Platform", status: "Arriving", orders: 7, eta: "2 min", rating: 4.5, vehicle: "—", inHouse: false },
  { id: "DR-5", name: "Suresh K.", phone: "96320 11829", status: "Available", orders: 8, eta: "—", rating: 4.3, vehicle: "KA-05-LP-4410", inHouse: true },
];

export const zones = [
  { name: "Zone A · Indiranagar, Domlur", radius: "0 – 3 km", fee: 0, min: 499, eta: "25 min", active: true },
  { name: "Zone B · Koramangala, HAL", radius: "3 – 6 km", fee: 49, min: 799, eta: "35 min", active: true },
  { name: "Zone C · Whitefield road", radius: "6 – 9 km", fee: 89, min: 1199, eta: "50 min", active: true },
  { name: "Zone D · Beyond 9 km", radius: "9 km +", fee: 149, min: 1999, eta: "65 min", active: false },
];

/* ------------------------------------------------------------------ */
/*  Notifications, integrations, roles, audit                          */
/* ------------------------------------------------------------------ */

export const notifications = [
  { id: 1, type: "order", title: "New QR order · Table 11", body: "2 items · ₹640 · sent to Curry station", time: "Just now", unread: true },
  { id: 2, type: "stock", title: "Low stock: Tiger prawns", body: "6.4 kg left, minimum 10 kg. Auto-PO drafted.", time: "4 min", unread: true },
  { id: 3, type: "service", title: "Table 07 requested the bill", body: "Rahul has been notified", time: "6 min", unread: true },
  { id: 4, type: "reservation", title: "Reservation pending · Aparna Sen", body: "3 guests · 21:15 · via Instagram", time: "11 min", unread: false },
  { id: 5, type: "payment", title: "Settlement credited", body: "₹2,41,880 from Razorpay · UTR 4421…", time: "1 h", unread: false },
  { id: 6, type: "review", title: "New 2★ feedback flagged", body: "QR feedback · Table 07", time: "18 min", unread: true },
  { id: 7, type: "kitchen", title: "Delayed ticket · NL-24788", body: "Prep 26 min, target 18 min", time: "2 min", unread: true },
];

export const notificationTemplates = [
  { name: "Order confirmed", channel: "WhatsApp", trigger: "Order accepted", sent: 1840, delivered: 98.6, enabled: true },
  { name: "Out for delivery", channel: "SMS", trigger: "Rider picked up", sent: 612, delivered: 97.1, enabled: true },
  { name: "Reservation reminder", channel: "WhatsApp", trigger: "2 h before booking", sent: 488, delivered: 99.2, enabled: true },
  { name: "Feedback request", channel: "Email", trigger: "1 h after payment", sent: 1320, delivered: 94.4, enabled: true },
  { name: "Birthday offer", channel: "WhatsApp", trigger: "3 days before birthday", sent: 74, delivered: 100, enabled: false },
  { name: "Low stock alert", channel: "Push", trigger: "Below minimum", sent: 38, delivered: 100, enabled: true },
];

export const integrations = [
  { name: "Razorpay", cat: "Payments", desc: "UPI, cards, netbanking and payment links.", status: "connected", meta: "Settles T+1 · 2.0% MDR" },
  { name: "Cashfree", cat: "Payments", desc: "Backup gateway for online orders.", status: "available", meta: "" },
  { name: "WhatsApp Business", cat: "Messaging", desc: "Order updates, reminders and receipts.", status: "connected", meta: "Verified · 1,840 msgs this month" },
  { name: "MSG91", cat: "Messaging", desc: "Transactional SMS with DLT templates.", status: "connected", meta: "DLT approved" },
  { name: "Swiggy", cat: "Aggregators", desc: "Sync menu, availability and orders.", status: "connected", meta: "Last sync 2 min ago" },
  { name: "Zomato", cat: "Aggregators", desc: "Sync menu, availability and orders.", status: "connected", meta: "Last sync 2 min ago" },
  { name: "Google Maps", cat: "Delivery", desc: "Distance-based fees and rider tracking.", status: "connected", meta: "" },
  { name: "Tally Prime", cat: "Accounting", desc: "Push daily sales vouchers & GST ledgers.", status: "available", meta: "" },
  { name: "Epson TM-T82X", cat: "Hardware", desc: "Thermal receipt printer · LAN.", status: "connected", meta: "Counter · KOT · Bar" },
  { name: "Webhooks & REST API", cat: "Developers", desc: "Order, payment and stock events.", status: "connected", meta: "3 endpoints · 99.98% success" },
];

export const roles = [
  { name: "Restaurant Admin", users: 2, desc: "All permitted operations for the restaurant and every branch." },
  { name: "Branch Manager", users: 4, desc: "Operations and reports for assigned branches." },
  { name: "Cashier", users: 6, desc: "POS, billing, payments and permitted order actions." },
  { name: "Waiter", users: 18, desc: "Assigned tables, dine-in orders and service requests." },
  { name: "Kitchen Staff", users: 22, desc: "Kitchen orders, preparation statuses and stations." },
  { name: "Inventory Manager", users: 2, desc: "Stock, recipes, suppliers and purchases." },
  { name: "Accountant", users: 1, desc: "Financial reports, payments, expenses and tax documents." },
  { name: "Delivery Staff", users: 7, desc: "Only assigned deliveries and status updates." },
];

export const permissionModules = ["Orders", "POS & Billing", "Menu", "Inventory", "Customers", "Reports", "Refunds", "Discounts", "Staff", "Settings"];
export const permissionActions = ["view", "create", "edit", "delete", "approve", "export"] as const;

export const auditLog = [
  { time: "20:12:44", user: "Arjun N.", role: "Cashier", action: "Applied discount", target: "NL-24812 · 10% (TIDE15)", ip: "10.0.4.21", risk: "low" },
  { time: "20:09:03", user: "Ananya R.", role: "Branch Manager", action: "Approved refund", target: "NL-24771 · ₹745 · 'Cold on arrival'", ip: "10.0.4.11", risk: "medium" },
  { time: "20:01:17", user: "Meera P.", role: "Captain", action: "Voided item", target: "NL-24809 · Kokum Collins × 1", ip: "10.0.4.33", risk: "medium" },
  { time: "19:54:40", user: "Unknown", role: "—", action: "Failed login ×3", target: "pos-counter-02", ip: "49.207.12.4", risk: "high" },
  { time: "19:40:22", user: "Kiran B.", role: "Inventory Mgr", action: "Stock adjustment", target: "Tiger prawns −1.2 kg (wastage)", ip: "10.0.4.18", risk: "low" },
  { time: "19:12:09", user: "Ananya R.", role: "Branch Manager", action: "Changed price", target: "Kerala Meen Curry ₹760 → ₹695", ip: "10.0.4.11", risk: "medium" },
  { time: "18:47:55", user: "Priya V.", role: "Accountant", action: "Exported report", target: "GSTR-1 · Nov 2026 (CSV)", ip: "122.171.9.88", risk: "low" },
  { time: "17:02:31", user: "Vikram M.", role: "Head Chef", action: "Marked unavailable", target: "Tuna Kokum Tartare (86'd)", ip: "10.0.4.40", risk: "low" },
  { time: "11:02:00", user: "Arjun N.", role: "Cashier", action: "Opened register", target: "Counter 01 · ₹15,000 float", ip: "10.0.4.21", risk: "low" },
];

/* ------------------------------------------------------------------ */
/*  Analytics series                                                   */
/* ------------------------------------------------------------------ */

export const hourlyToday = [
  { h: "12", today: 14200, lastWeek: 12800 },
  { h: "13", today: 31800, lastWeek: 29400 },
  { h: "14", today: 27600, lastWeek: 26100 },
  { h: "15", today: 9800, lastWeek: 11200 },
  { h: "16", today: 6400, lastWeek: 7300 },
  { h: "17", today: 11900, lastWeek: 10100 },
  { h: "18", today: 22800, lastWeek: 19400 },
  { h: "19", today: 58400, lastWeek: 47900 },
  { h: "20", today: 71300, lastWeek: 62200 },
  { h: "21", today: 0, lastWeek: 58800 },
  { h: "22", today: 0, lastWeek: 34600 },
  { h: "23", today: 0, lastWeek: 12300 },
];

const r2 = seeded(77);
export const daily30 = Array.from({ length: 30 }, (_, i) => {
  const day = 27 + i;
  const date = day <= 31 ? `${day} Oct` : `${day - 31} Nov`;
  const dow = (i + 2) % 7; // 0 = Mon
  const weekend = dow >= 4;
  const base = weekend ? 340000 : 238000;
  const revenue = Math.round(base * (0.88 + r2() * 0.24) + i * 1800);
  return { date, revenue, orders: Math.round(revenue / 1720), covers: Math.round(revenue / 1480), expenses: Math.round(revenue * (0.58 + r2() * 0.08)) };
});

export const monthly = [
  { m: "Dec", revenue: 6820000, profit: 1180000 },
  { m: "Jan", revenue: 6140000, profit: 980000 },
  { m: "Feb", revenue: 5890000, profit: 910000 },
  { m: "Mar", revenue: 6420000, profit: 1070000 },
  { m: "Apr", revenue: 6010000, profit: 940000 },
  { m: "May", revenue: 6280000, profit: 1010000 },
  { m: "Jun", revenue: 5720000, profit: 860000 },
  { m: "Jul", revenue: 5940000, profit: 890000 },
  { m: "Aug", revenue: 6610000, profit: 1120000 },
  { m: "Sep", revenue: 6880000, profit: 1210000 },
  { m: "Oct", revenue: 8240000, profit: 1620000 },
  { m: "Nov", revenue: 7690000, profit: 1480000 },
];

export const channelMix = [
  { name: "Dine-in", value: 52, amount: 148940 },
  { name: "QR self-order", value: 14, amount: 40100 },
  { name: "Delivery", value: 19, amount: 54420 },
  { name: "Takeaway", value: 9, amount: 25780 },
  { name: "Online", value: 6, amount: 17180 },
];

export const paymentMix = [
  { name: "UPI", value: 58 },
  { name: "Card", value: 24 },
  { name: "Cash", value: 11 },
  { name: "Online", value: 7 },
];

export const branchCompare = branches
  .filter((b) => b.today > 0)
  .map((b) => ({ name: b.area, revenue: b.today, covers: b.covers }));

/* ------------------------------------------------------------------ */
/*  Platform (Super Admin)                                             */
/* ------------------------------------------------------------------ */

export const plans = [
  { id: "starter", name: "Starter", monthly: 1499, annual: 14990, branches: 1, users: 8, features: ["POS & billing", "QR ordering", "Menu & tables", "Basic reports"], tenants: 412, popular: false },
  { id: "growth", name: "Growth", monthly: 3999, annual: 39990, branches: 3, users: 40, features: ["Everything in Starter", "KDS & waiter app", "Inventory & recipes", "CRM & loyalty", "Online ordering website"], tenants: 286, popular: true },
  { id: "estate", name: "Estate", monthly: 9999, annual: 99990, branches: 25, users: 500, features: ["Everything in Growth", "Multi-branch analytics", "API & webhooks", "Custom domain", "Priority support & SLA"], tenants: 64, popular: false },
];

export const tenants = [
  { id: "TN-0142", name: "Demo Restaurant", city: "Bengaluru", plan: "Estate", branches: 4, status: "active", mrr: 9999, gmv: 7690000, since: "Jan 2024", owner: "Ananya Rao", health: 96 },
  { id: "TN-0188", name: "Biryani Barons", city: "Hyderabad", plan: "Growth", branches: 3, status: "active", mrr: 3999, gmv: 4120000, since: "Mar 2024", owner: "Syed Arif", health: 88 },
  { id: "TN-0203", name: "Café Kolkata Club", city: "Kolkata", plan: "Starter", branches: 1, status: "trial", mrr: 0, gmv: 380000, since: "Nov 2026", owner: "Debjani Roy", health: 72 },
  { id: "TN-0211", name: "The Idli Project", city: "Chennai", plan: "Growth", branches: 2, status: "active", mrr: 3999, gmv: 1890000, since: "May 2024", owner: "Hari Prasad", health: 91 },
  { id: "TN-0227", name: "Smoke & Saffron", city: "Delhi NCR", plan: "Estate", branches: 7, status: "active", mrr: 9999, gmv: 11240000, since: "Aug 2023", owner: "Kabir Sethi", health: 94 },
  { id: "TN-0236", name: "Bun Maska Co.", city: "Pune", plan: "Starter", branches: 1, status: "past-due", mrr: 1499, gmv: 410000, since: "Feb 2025", owner: "Farzana Irani", health: 41 },
  { id: "TN-0241", name: "Coorg Table", city: "Madikeri", plan: "Growth", branches: 1, status: "active", mrr: 3999, gmv: 760000, since: "Jun 2025", owner: "Poovamma K.", health: 83 },
  { id: "TN-0252", name: "Momo Republic", city: "Gangtok", plan: "Starter", branches: 2, status: "suspended", mrr: 0, gmv: 0, since: "Sep 2025", owner: "Pemba Sherpa", health: 12 },
  { id: "TN-0260", name: "Konkan Kitchen", city: "Mangaluru", plan: "Growth", branches: 2, status: "pending", mrr: 0, gmv: 0, since: "Applied 24 Nov", owner: "Shenoy Bros.", health: 0 },
  { id: "TN-0263", name: "Ghar Ka Khana", city: "Jaipur", plan: "Starter", branches: 1, status: "trial", mrr: 0, gmv: 112000, since: "Nov 2026", owner: "Ritu Shekhawat", health: 64 },
];

export const platformMrr = [
  { m: "Jun", mrr: 1840000, tenants: 640 },
  { m: "Jul", mrr: 1960000, tenants: 668 },
  { m: "Aug", mrr: 2110000, tenants: 692 },
  { m: "Sep", mrr: 2240000, tenants: 714 },
  { m: "Oct", mrr: 2420000, tenants: 741 },
  { m: "Nov", mrr: 2586000, tenants: 762 },
];

export const tickets = [
  { id: "SUP-9012", tenant: "Bun Maska Co.", subject: "Card payments failing on POS counter 2", priority: "urgent", status: "open", age: "18 min", agent: "Unassigned" },
  { id: "SUP-9011", tenant: "Biryani Barons", subject: "Swiggy menu sync missing variants", priority: "high", status: "in-progress", age: "2 h", agent: "Neha (L2)" },
  { id: "SUP-9009", tenant: "Café Kolkata Club", subject: "How to set up GST-inclusive pricing?", priority: "normal", status: "waiting", age: "5 h", agent: "Ajay (L1)" },
  { id: "SUP-9006", tenant: "Smoke & Saffron", subject: "Request: custom KOT print layout", priority: "low", status: "in-progress", age: "1 d", agent: "Neha (L2)" },
  { id: "SUP-9003", tenant: "The Idli Project", subject: "Duplicate invoice numbers after outage", priority: "high", status: "resolved", age: "2 d", agent: "Rohit (Eng)" },
];

export const platformFeatures = [
  { key: "pos", name: "POS & billing", starter: true, growth: true, estate: true },
  { key: "qr", name: "QR ordering", starter: true, growth: true, estate: true },
  { key: "kds", name: "Kitchen display", starter: false, growth: true, estate: true },
  { key: "inventory", name: "Inventory & recipes", starter: false, growth: true, estate: true },
  { key: "crm", name: "CRM & loyalty", starter: false, growth: true, estate: true },
  { key: "website", name: "Online ordering website", starter: false, growth: true, estate: true },
  { key: "multi", name: "Multi-branch analytics", starter: false, growth: false, estate: true },
  { key: "api", name: "API & webhooks", starter: false, growth: false, estate: true },
  { key: "domain", name: "Custom domain", starter: false, growth: false, estate: true },
];
