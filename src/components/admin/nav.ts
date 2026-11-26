import {
  BadgePercent,
  BarChart3,
  Bell,
  BookOpenText,
  Boxes,
  Building2,
  ChefHat,
  ClipboardList,
  CreditCard,
  Gauge,
  Globe,
  KeyRound,
  LayoutGrid,
  Mail,
  MessageSquareQuote,
  Monitor,
  QrCode,
  ReceiptIndianRupee,
  ScrollText,
  Settings,
  Soup,
  Store,
  Truck,
  Users,
  UsersRound,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export type NavItem = { href: string; label: string; icon: LucideIcon; badge?: string; external?: boolean };
export type NavGroup = { label: string; items: NavItem[] };

export const adminNav: NavGroup[] = [
  { label: "Overview", items: [{ href: "/admin", label: "Dashboard", icon: Gauge }] },
  {
    label: "Restaurant",
    items: [
      { href: "/admin/branches", label: "Branches", icon: Building2 },
    ],
  },
  {
    label: "Sales & Operations",
    items: [
      { href: "/pos", label: "POS & Billing", icon: Monitor, external: true },
      { href: "/admin/orders", label: "Orders", icon: ClipboardList, badge: "12" },
      { href: "/kitchen", label: "Kitchen Display", icon: ChefHat, external: true },
      { href: "/admin/qr", label: "QR Ordering", icon: QrCode },
    ],
  },
  {
    label: "Catalog",
    items: [
      { href: "/admin/menu", label: "Menu Management", icon: BookOpenText },
    ],
  },
  {
    label: "Guests & Feedback",
    items: [
      { href: "/admin/customers", label: "Customers & Loyalty", icon: UsersRound },
      { href: "/admin/enquiries", label: "Enquiries", icon: Mail },
      { href: "/admin/reviews", label: "Reviews & Feedback", icon: MessageSquareQuote, badge: "6" },
    ],
  },
  {
    label: "Supply & Team",
    items: [
      { href: "/admin/inventory", label: "Inventory & Stock", icon: Boxes, badge: "6" },
      { href: "/admin/recipes", label: "Recipes & Costing", icon: Soup },
      { href: "/admin/suppliers", label: "Suppliers & Purchases", icon: Truck },
      { href: "/admin/staff", label: "Staff & Attendance", icon: Users },
    ],
  },
  {
    label: "Finance",
    items: [
      { href: "/admin/payments", label: "Payments & Refunds", icon: CreditCard },
      { href: "/admin/tax", label: "Tax & Invoices", icon: ReceiptIndianRupee },
      { href: "/admin/expenses", label: "Expenses", icon: Wallet },
    ],
  },
  { label: "Insights", items: [{ href: "/admin/reports", label: "Reports & Analytics", icon: BarChart3 }] },
  {
    label: "Digital Presence",
    items: [
      { href: "/admin/website", label: "Website & Logo", icon: Globe },
      { href: "/admin/notifications", label: "Notifications", icon: Bell },
    ],
  },
  {
    label: "Administration",
    items: [
      { href: "/admin/roles", label: "Roles & Permissions", icon: KeyRound },
      { href: "/admin/settings", label: "Settings & Security", icon: Settings },
    ],
  },
];

export const extraIcons = { ScrollText };
