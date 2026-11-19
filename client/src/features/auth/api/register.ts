import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type { User } from "@/types/api";
import { login } from "./login";

export type RegisterInput = {
  email: string;
  password: string;
};

export function register(input: RegisterInput): Promise<User> {
  return apiFetch<User>("/auth/register", { method: "POST", body: input });
}

export function useRegister() {
  return useMutation({
    mutationFn: async (input: RegisterInput) => {
      await register(input);
      return login(input);
    },
  });
}
