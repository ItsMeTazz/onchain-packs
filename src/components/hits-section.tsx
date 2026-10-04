"use client";

import { useState } from "react";
import { formatUsdc } from "@/lib/format";
import type { Hit, Pack } from "@/lib/packs";

export function HitsSection({ pack }: { pack: Pack }) {
  const [tab, setTab] = useState<"inside" | "latest">("inside");
  const hits = tab === "inside" ? pack.hits : pack.latest;

  return (
    <section className="mt-16 border-t border-gold/15 bg-[#100e16]">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            <TabButton active={tab === "inside"} onClick={() => setTab("inside")}>
              What&apos;s inside
            </TabButton>
            <TabButton active={tab === "latest"} onClick={() => setTab("latest")}>
              Latest pulls
            </TabButton>
          </div>
          <p className="text-xs uppercase tracking-[0.16em] text-mist">Guaranteed authenticity</p>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {hits.map((hit) => (
            <HitCard key={hit.id} hit={hit} accent={pack.accent} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm ${
        active ? "bg-gold text-ink" : "text-mist hover:text-paper"
      }`}
    >
      {children}
    </button>
  );
}

function HitCard({ hit, accent }: { hit: Hit; accent: Pack["accent"] }) {
  const wash =
    accent === "sea" ? "from-[#1d4e68]" : accent === "jade" ? "from-[#1d5a40]" : "from-[#6a2430]";

  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-[#18151f]">
      <div className={`relative h-36 bg-gradient-to-br ${wash} to-[#0c0a10]`}>
        <span className="absolute right-2 top-2 rounded-md bg-black/50 px-2 py-1 text-xs text-paper">
          {hit.grade}
        </span>
        <div className="absolute inset-6 rounded-lg border border-white/15" />
      </div>
      <div className="space-y-1 p-3">
        <h3 className="truncate text-sm text-paper">{hit.name}</h3>
        <p className="text-sm text-paper">{formatUsdc(hit.value, 0)}</p>
        <p className="text-xs text-[#8fdfb0]">{hit.multiplier}</p>
        <p className="text-[11px] uppercase tracking-[0.14em] text-mist">{hit.grader}</p>
      </div>
    </article>
  );
}
