"use client";

import type { ReactNode } from "react";
import { Shell } from "@/components/admin/shell";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <Shell
      scope="admin"
      user={{ name: "Ananya Rao", role: "Demo Restaurant · Admin" }}
      branches={["Indiranagar, Bengaluru", "Sea Deck, Kovalam", "All branches"]}
    >
      {children}
    </Shell>
  );
}
