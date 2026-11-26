"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Shell } from "@/components/admin/shell";
import { DEFAULT_SITE_CONTENT, useHydrated, useStore } from "@/lib/store";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const hydrated = useHydrated();
  const adminAuthed = useStore((s) => s.adminAuthed);
  const storedContent = useStore((s) => s.siteContent);
  const brandName = (hydrated && storedContent?.name) || DEFAULT_SITE_CONTENT.name;

  const isLoginPage = path === "/admin/login";

  useEffect(() => {
    if (!hydrated || isLoginPage) return;
    if (!adminAuthed) {
      router.replace("/admin/login");
    }
  }, [hydrated, isLoginPage, adminAuthed, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!hydrated || !adminAuthed) {
    return (
      <div className="admin-theme grid min-h-dvh place-items-center bg-[#f7f8fc] text-[#64748b]">
        <div className="flex items-center gap-2.5 text-[13.5px] font-medium">
          <span className="size-2.5 animate-pulse rounded-full bg-[#5b4fe9]" />
          Loading Admin Console…
        </div>
      </div>
    );
  }

  return (
    <Shell
      scope="admin"
      user={{ name: "Ananya Rao", role: `${brandName} · Admin` }}
      branches={["Indiranagar, Bengaluru", "Sea Deck, Kovalam", "All branches"]}
    >
      {children}
    </Shell>
  );
}
