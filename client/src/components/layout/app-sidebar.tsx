"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "./nav-items";
import { cn } from "@/lib/utils";

export function AppSidebar({ footer }: { footer: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <aside className="sticky top-0 hidden h-screen w-[232px] flex-col border-r md:flex">
      <div className="px-6 py-6 text-2xl font-semibold">
        Brisq<span className="text-brand">.</span>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 px-3">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex h-9 items-center gap-3 rounded-md px-3 text-sm",
                isActive
                  ? "bg-accent font-medium text-foreground"
                  : "text-muted-foreground",
              )}
            >
              <Icon
                strokeWidth={1.8}
                className={cn("size-[18px]", isActive && "text-brand")}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3">{footer}</div>
    </aside>
  );
}
