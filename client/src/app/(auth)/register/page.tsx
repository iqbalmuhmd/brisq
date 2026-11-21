import { RegisterForm } from "@/features/auth/components/register-form";
import { safeNext } from "@/features/auth/utils/safe-next";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const { next } = await searchParams;
  return <RegisterForm next={safeNext(next)} />;
}
