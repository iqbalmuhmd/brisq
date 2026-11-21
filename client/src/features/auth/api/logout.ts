import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { paths } from "@/config/paths";

export function logout(): Promise<void> {
  return apiFetch<void>("/auth/logout", { method: "POST" });
}

export function useLogout() {
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      window.location.assign(paths.auth.login.getHref());
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
