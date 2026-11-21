"use client";

import Link from "next/link";
import { CircleAlert } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useLogin, type LoginInput } from "@/features/auth/api/login";
import { paths } from "@/config/paths";
import { useState } from "react";

function validate(values: LoginInput): string | null {
  if (!/^\S+@\S+\.\S+$/.test(values.email))
    return "Enter a valid email address.";
  if (values.password === "") return "Enter your password.";
  return null;
}

export function LoginForm({ next }: { next: string }) {
  const router = useRouter();
  const loginMutation = useLogin();

  const [formError, setFormError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const values: LoginInput = {
      email: String(formData.get("email") ?? "").trim(),
      password: String(formData.get("password") ?? ""),
    };

    const error = validate(values);
    setFormError(error);
    if (error) return;

    loginMutation.mutate(values, {
      onSuccess: () => {
        router.push(next);
        router.refresh();
      },
    });
  }
  const errorMessage = formError ?? loginMutation.error?.message ?? null;

  return (
    <>
      <p className="mb-2 font-mono text-[11px] leading-[normal] tracking-[0.08em] text-muted-foreground uppercase">
        Sign in
      </p>
      <h1 className="mb-7 text-[26px] leading-[1.15] font-medium tracking-[-0.03em] text-foreground">
        Publish once.
        <br />
        Everywhere at once.
      </h1>

      <form noValidate onSubmit={handleSubmit}>
        <Label
          htmlFor="email"
          className="mb-1.5 text-[12.5px] leading-[normal] text-foreground"
        >
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          className="mb-4"
        />

        <Label
          htmlFor="password"
          className="mb-1.5 text-[12.5px] leading-[normal] text-foreground"
        >
          Password
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          className="mb-5"
        />

        {errorMessage && (
          <Alert variant="destructive" className="mb-4 gap-y-0">
            <CircleAlert strokeWidth={1.8} />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <Button
          type="submit"
          disabled={loginMutation.isPending}
          className="h-10 w-full hover:bg-primary hover:opacity-88"
        >
          {loginMutation.isPending ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <p className="mt-5 mb-[1em] text-[13px] leading-[normal] text-muted-foreground">
        No account?{" "}
        <Link href={paths.auth.register.getHref(next)} className="font-medium">
          Create one →
        </Link>
      </p>
    </>
  );
}
