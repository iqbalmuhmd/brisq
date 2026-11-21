import { AppSidebar } from "@/components/layout/app-sidebar";
import { UserMenu } from "@/features/auth/components/user-menu";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AppSidebar footer={<UserMenu />} />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
