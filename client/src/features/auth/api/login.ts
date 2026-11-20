import { apiFetch } from "@/lib/api";
import type { User } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getMeQueryOptions } from "./get-me";

export type LoginInput = {
  email: string;
  password: string;
};

export function login(input: LoginInput): Promise<User> {
  return apiFetch<User>("/auth/login", { method: "POST", body: input });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: (user) => {
      queryClient.setQueryData(getMeQueryOptions().queryKey, user);
    },
  });
}
