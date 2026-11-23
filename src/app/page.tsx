import { Logo } from "@/components/layout/Logo";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <Logo size={96} />
      <h1 className="text-3xl font-bold tracking-tight">PoolTechTools</h1>
      <p className="max-w-md text-center text-gray-600">
        Pool volume, chemicals, maintenance, water tests, and service reports — fast, mobile-first, and offline-capable.
      </p>
    </main>
  );
}
