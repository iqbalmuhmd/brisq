"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CircleAlert } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { paths } from "@/config/paths";
import { useRegister, type RegisterInput } from "@/features/auth/api/register";

type RegisterFormValues = RegisterInput & { confirmPassword: string };

function validate(values: RegisterFormValues): string | null {
  if (!/^\S+@\S+\.\S+$/.test(values.email))
    return "Enter a valid email address.";
  if (values.password.length < 8)
    return "Password must be at least 8 characters.";
  if (values.password !== values.confirmPassword)
    return "Passwords don't match.";
  return null;
}

export function RegisterForm({ next }: { next: string }) {
  const router = useRouter();
  const registerMutation = useRegister();

  const [formError, setFormError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const values: RegisterFormValues = {
      email: String(formData.get("email") ?? "").trim(),
      password: String(formData.get("password") ?? ""),
      confirmPassword: String(formData.get("confirmPassword") ?? ""),
    };

    const error = validate(values);
    setFormError(error);
    if (error) return;

    registerMutation.mutate(
      { email: values.email, password: values.password },
      {
        onSuccess: () => {
          router.push(next);
          router.refresh();
        },
      },
    );
  }

  const errorMessage = formError ?? registerMutation.error?.message ?? null;

  return (
    <>
      <p className="mb-2 font-mono text-[11px] leading-[normal] tracking-[0.08em] text-muted-foreground uppercase">
        Create account
      </p>
      <h1 className="mb-7 text-[26px] leading-[1.15] font-medium tracking-[-0.03em] text-foreground">
        Start cross-posting
        <br />
        in under a minute.
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
          autoComplete="new-password"
          placeholder="••••••••"
          className="mb-4"
        />

        <Label
          htmlFor="confirmPassword"
          className="mb-1.5 text-[12.5px] leading-[normal] text-foreground"
        >
          Confirm password
        </Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
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
          disabled={registerMutation.isPending}
          className="h-10 w-full hover:bg-primary hover:opacity-88"
        >
          {registerMutation.isPending ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <p className="mt-5 mb-[1em] text-[13px] leading-[normal] text-muted-foreground">
        Have an account?{" "}
        <Link href={paths.auth.login.getHref(next)} className="font-medium">
          Sign in →
        </Link>
      </p>
    </>
  );
}
