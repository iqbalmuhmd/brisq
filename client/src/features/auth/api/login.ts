import { apiFetch } from "@/lib/api";
import type { User } from "@/types/api";
import { useMutation } from "@tanstack/react-query";

export type LoginInput = {
  email: string;
  password: string;
};

export function login(input: LoginInput): Promise<User> {
  return apiFetch<User>("/auth/login", { method: "POST", body: input });
}

export function useLogin() {
  return useMutation({
    mutationFn: login,
  });
}
