"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type ThemeToggleVariant = "sidebar" | "topbar";

const buttonClasses: Record<ThemeToggleVariant, string> = {
  sidebar:
    "size-[30px] rounded-md text-muted-foreground hover:bg-accent hover:text-muted-foreground dark:hover:bg-accent",
  topbar:
    "size-9 rounded-md bg-card text-muted-foreground hover:bg-accent hover:text-muted-foreground dark:bg-card dark:hover:bg-accent",
};

const iconClasses: Record<ThemeToggleVariant, string> = {
  sidebar: "size-[15px]",
  topbar: "size-4",
};

export function ThemeToggle({
  variant = "sidebar",
}: {
  variant?: ThemeToggleVariant;
}) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={variant === "topbar" ? "outline" : "ghost"}
          size="icon"
          className={buttonClasses[variant]}
          aria-label="Toggle theme"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        >
          <Moon
            strokeWidth={1.8}
            className={cn(iconClasses[variant], "dark:hidden")}
          />
          <Sun
            strokeWidth={1.8}
            className={cn(iconClasses[variant], "hidden dark:block")}
          />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {resolvedTheme === "dark"
          ? "Switch to light theme"
          : "Switch to dark theme"}
      </TooltipContent>
    </Tooltip>
  );
}
