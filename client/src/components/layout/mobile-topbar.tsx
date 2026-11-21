import { ThemeToggle } from "./theme-toggle";

export function MobileTopbar() {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b bg-background px-4 py-3 md:hidden">
      <div className="flex-1 text-[19px] leading-[normal] font-semibold tracking-[-0.045em] text-foreground">
        Brisq<span className="text-brand">.</span>
      </div>
      <ThemeToggle variant="topbar" />
    </header>
  );
}
