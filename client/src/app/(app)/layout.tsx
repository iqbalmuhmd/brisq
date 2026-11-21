import { AppSidebar } from "@/components/layout/app-sidebar";
import { MobileTabbar } from "@/components/layout/mobile-tabbar";
import { MobileTopbar } from "@/components/layout/mobile-topbar";
import { UserMenu } from "@/features/auth/components/user-menu";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AppSidebar footer={<UserMenu />} />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileTopbar />
        <main className="flex-1 pb-[calc(128px+env(safe-area-inset-bottom))] md:pb-0">
          <div className="mx-auto max-w-[1040px] px-[18px] pt-7 md:px-14 md:pt-14 md:pb-24">
            {children}
          </div>
        </main>
      </div>
      <MobileTabbar />
    </div>
  );
}
