export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="grid min-h-screen place-items-center p-6">
      <div className="w-full max-w-[400px]">
        <div className="mb-8 text-[30px] leading-[normal] font-semibold tracking-[-0.045em] text-foreground">
          Brisq<span className="text-brand">.</span>
        </div>
        <div className="border-t-2 border-rule-strong pt-5">{children}</div>
      </div>
    </main>
  );
}
