import type { DefaultOptions } from "@tanstack/react-query";
import { ApiRequestError } from "@/lib/api";

export const queryConfig: DefaultOptions = {
  queries: {
    staleTime: 30_000,
    retry: (failureCount, error) => {
      if (
        error instanceof ApiRequestError &&
        error.status >= 400 &&
        error.status < 500
      ) {
        return false;
      }
      return failureCount < 3;
    },
  },
};
