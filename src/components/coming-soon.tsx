import Link from "next/link";

export function ComingSoon({
  title,
  detail,
}: {
  title: string;
  detail: string;
}) {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-24">
      <div className="max-w-lg text-center">
        <p className="text-[11px] uppercase tracking-[0.28em] text-gold">Onchain Packs</p>
        <h1 className="mt-3 font-display text-5xl text-paper">{title}</h1>
        <p className="mt-4 text-lg text-mist">{detail}</p>
        <p className="mt-8 font-display text-3xl text-gold">Coming soon</p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-full border border-gold/40 px-5 py-2 text-sm text-paper hover:border-gold"
        >
          Back to welcome packs
        </Link>
      </div>
    </main>
  );
}
