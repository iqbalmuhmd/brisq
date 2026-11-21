import {
  Bell,
  CircleUser,
  History,
  LayoutDashboard,
  SquarePen,
  type LucideIcon,
} from "lucide-react";
import { paths } from "@/config/paths";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const navItems: NavItem[] = [
  {
    href: paths.app.dashboard.getHref(),
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  { href: paths.app.compose.getHref(), label: "Compose", icon: SquarePen },
  { href: paths.app.history.getHref(), label: "History", icon: History },
  {
    href: paths.app.notifications.getHref(),
    label: "Notifications",
    icon: Bell,
  },
  { href: paths.app.account.getHref(), label: "Account", icon: CircleUser },
];
