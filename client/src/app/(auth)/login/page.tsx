import { LoginForm } from "@/features/auth/components/login-form";
import { safeNext } from "@/features/auth/utils/safe-next";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const { next } = await searchParams;
  return <LoginForm next={safeNext(next)} />;
}
