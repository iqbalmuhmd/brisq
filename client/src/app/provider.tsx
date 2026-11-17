"use client";

import { useState } from "react";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { ApiRequestError } from "@/lib/api";
import { queryConfig } from "@/lib/react-query";

function handleAuthError(error: Error) {
  if (!(error instanceof ApiRequestError) || error.status !== 401) return;

  const { pathname, search } = window.location;
  if (pathname === "/login" || pathname === "/register") return;

  const next = encodeURIComponent(pathname + search);
  window.location.assign(`/login?next=${next}`);
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
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster />
    </QueryClientProvider>
  );
}
