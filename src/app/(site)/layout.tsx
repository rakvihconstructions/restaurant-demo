import { SiteFooter } from "@/components/site/footer";
import { SiteNav } from "@/components/site/nav";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-[#ffffff] text-[#0f172a]">
      <SiteNav />
      <main className="pt-[72px] lg:pt-[76px]">{children}</main>
      <SiteFooter />
    </div>
  );
}
