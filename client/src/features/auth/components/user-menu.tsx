"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";
import { useMe } from "@/features/auth/api/get-me";
import { useLogout } from "@/features/auth/api/logout";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

export function UserMenu() {
  const { data: user } = useMe();
  const logoutMutation = useLogout();

  if (!user) return <div className="h-9" />;

  return (
    <div className="flex items-center gap-2.5">
      <Avatar className="size-8">
        <AvatarFallback className="bg-foreground text-xs font-medium text-background">
          {getInitials(user.name)}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="truncate text-[13px] leading-5 font-medium text-foreground">
          {user.name}
        </div>
        <div className="truncate text-xs leading-4 text-muted-foreground">
          {user.email}
        </div>
      </div>

      <ThemeToggle variant="sidebar" />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-[30px] rounded-md text-muted-foreground hover:bg-accent hover:text-muted-foreground dark:hover:bg-accent"
            aria-label="Sign out"
            disabled={logoutMutation.isPending}
            onClick={() => logoutMutation.mutate()}
          >
            <LogOut strokeWidth={1.8} className="size-[15px]" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Sign out</TooltipContent>
      </Tooltip>
    </div>
  );
}
