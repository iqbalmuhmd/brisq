import { apiFetch } from "@/lib/api";
import type { User } from "@/types/api";
import { queryOptions, useQuery } from "@tanstack/react-query";

export function getMe(): Promise<User> {
  return apiFetch<User>("/auth/me");
}

export function getMeQueryOptions() {
  return queryOptions({
    queryKey: ["me"],
    queryFn: getMe,
  });
}

export function useMe() {
  return useQuery(getMeQueryOptions());
}
