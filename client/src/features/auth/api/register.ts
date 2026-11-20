import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type { User } from "@/types/api";
import { login } from "./login";
import { getMeQueryOptions } from "./get-me";

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

export function register(input: RegisterInput): Promise<User> {
  return apiFetch<User>("/auth/register", { method: "POST", body: input });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: RegisterInput) => {
      await register(input);
      return login({ email: input.email, password: input.password });
    },
    onSuccess: (user) => {
      queryClient.setQueryData(getMeQueryOptions().queryKey, user);
    },
  });
}
