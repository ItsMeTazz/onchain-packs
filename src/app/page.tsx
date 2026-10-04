import Link from "next/link";
import { PackArt } from "@/components/pack-art";
import { packs } from "@/lib/packs";

export default function HomePage() {
  return (
    <main className="relative flex-1">
      <div className="pointer-events-none absolute inset-x-0 top-10 mx-auto h-80 max-w-3xl bg-[radial-gradient(ellipse_at_center,rgba(227,193,106,0.14),transparent_68%)]" />
      <section className="relative mx-auto flex w-full max-w-5xl flex-col items-center px-4 pb-8 pt-14">
        <p className="text-xs uppercase tracking-[0.42em] text-paper">One Piece</p>
        <div className="mt-3 h-px w-40 bg-gold/50" />
        <h1 className="mt-4 font-display text-5xl tracking-wide text-paper sm:text-6xl">
          Welcome Pack
        </h1>

        <div className="mt-14 grid w-full items-center gap-10 lg:grid-cols-[180px_1fr]">
          <div className="mx-auto flex max-w-[180px] flex-col items-center">
            <div className="relative mb-4 rounded-2xl border border-gold/30 bg-[#16131d] px-4 py-3 text-center text-xs uppercase tracking-[0.16em] text-paper">
              Fully
              <br />
              on chain
              <span className="absolute -bottom-2 left-8 h-3 w-3 rotate-45 border-b border-r border-gold/30 bg-[#16131d]" />
            </div>
            <div className="flex h-36 w-28 items-end justify-center rounded-2xl border border-dashed border-gold/30 bg-white/5">
              <span className="pb-4 text-[10px] uppercase tracking-[0.16em] text-mist">
                Placeholder
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {packs.map((pack) => (
              <Link
                key={pack.slug}
                href={`/packs/${pack.slug}`}
                className="group rounded-[1.6rem] p-2 transition hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
              >
                <PackArt accent={pack.accent} label="Placeholder" />
                <p className="mt-3 text-center text-sm text-paper group-hover:text-gold">
                  {pack.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
