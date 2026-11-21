"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navItems } from "./nav-items";

export function MobileTabbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t bg-background pb-[env(safe-area-inset-bottom)] md:hidden">
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = pathname.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            aria-label={label}
            aria-current={isActive ? "page" : undefined}
            className="relative flex h-14 items-center justify-center"
          >
            {isActive && (
              <span className="absolute -top-px left-1/2 h-0.5 w-5 -translate-x-1/2 bg-brand" />
            )}
            <Icon
              strokeWidth={1.8}
              className={cn(
                "size-[22px]",
                isActive ? "text-brand" : "text-muted-foreground",
              )}
            />
          </Link>
        );
      })}
    </nav>
  );
}
