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

  if (!user) return <div className="h-10" />;

  return (
    <div className="flex items-center gap-3">
      <Avatar className="size-8">
        <AvatarFallback className="bg-primary text-xs text-primary-foreground">
          {getInitials(user.name)}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="truncate text-[13px] font-medium">{user.name}</div>
        <div className="truncate text-xs text-muted-foreground">
          {user.email}
        </div>
      </div>

      <ThemeToggle />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Sign out"
            disabled={logoutMutation.isPending}
            onClick={() => logoutMutation.mutate()}
          >
            <LogOut />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Sign out</TooltipContent>
      </Tooltip>
    </div>
  );
}
