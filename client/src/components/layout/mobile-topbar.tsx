import { ThemeToggle } from "./theme-toggle";

export function MobileTopbar() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-background px-4 py-3 md:hidden">
      <div className="text-[19px] font-semibold tracking-[-0.045em]">
        Brisq<span className="text-brand">.</span>
      </div>
      <ThemeToggle />
    </header>
  );
}
