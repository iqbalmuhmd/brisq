"use client";

import { useState } from "react";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { ApiRequestError } from "@/lib/api";
import { queryConfig } from "@/lib/react-query";
import { paths } from "@/config/paths";

function handleAuthError(error: Error) {
  if (!(error instanceof ApiRequestError) || error.status !== 401) return;

  const { pathname, search } = window.location;
  if (
    pathname === paths.auth.login.getHref() ||
    pathname === paths.auth.register.getHref()
  ) {
    return;
  }

  window.location.assign(paths.auth.login.getHref(pathname + search));
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: queryConfig,
        queryCache: new QueryCache({ onError: handleAuthError }),
        mutationCache: new MutationCache({ onError: handleAuthError }),
      }),
  );

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <TooltipProvider>
        <QueryClientProvider client={queryClient}>
          {children}
          <Toaster />
        </QueryClientProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
