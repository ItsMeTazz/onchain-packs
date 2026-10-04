"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { formatUsdc } from "@/lib/format";
import { useWallet } from "@/components/wallet-provider";

type Menu = "rewards" | "collection" | null;

export function SiteHeader() {
  const wallet = useWallet();
  const [menu, setMenu] = useState<Menu>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menu) return;
    function onPointer(event: MouseEvent) {
      if (!navRef.current?.contains(event.target as Node)) setMenu(null);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setMenu(null);
    }
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [menu]);

  const label =
    wallet.phase === "ready"
      ? "Smart wallet"
      : wallet.phase === "connected"
        ? "Create wallet"
        : "Smart wallet";

  return (
    <header className="sticky top-0 z-40 border-b border-gold/15 bg-ink/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-4">
        <Link
          href="/"
          aria-label="Onchain Packs home"
          className="mr-auto flex items-center gap-2.5 rounded-full pr-2 transition hover:opacity-80"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/70 bg-gold/10">
            <span className="h-3.5 w-3.5 rotate-45 border border-gold" />
          </span>
          <span className="font-display text-lg leading-none tracking-wide text-paper">Onchain</span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={wallet.openModal}
            className="rounded-full border border-gold bg-gold px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-[#f0d48a]"
          >
            {label}
          </button>
          {wallet.phase === "ready" ? (
            <span className="rounded-full border border-gold/30 px-3 py-2 text-sm text-gold">
              {formatUsdc(wallet.smartUsdc)} USDC
            </span>
          ) : null}
        </div>
        <nav ref={navRef} className="flex flex-wrap items-center justify-center gap-2">
          <div className="relative">
            <button
              type="button"
              aria-expanded={menu === "rewards"}
              onClick={() => setMenu((current) => (current === "rewards" ? null : "rewards"))}
              className="rounded-full border border-gold/40 px-4 py-2 text-sm text-paper transition hover:border-gold"
            >
              rewards
            </button>
            {menu === "rewards" ? (
              <div className="absolute right-0 z-20 mt-2 w-64 rounded-2xl border border-gold/20 bg-[#16131d] p-4 shadow-xl">
                <p className="text-[11px] uppercase tracking-[0.16em] text-mist">Season points</p>
                <p className="mt-1 font-display text-4xl text-paper">0</p>
                <ul className="mt-4 space-y-2 text-sm text-mist">
                  <li className="flex justify-between gap-3">
                    <span>Welcome bonus</span>
                    <span>Locked</span>
                  </li>
                  <li className="flex justify-between gap-3">
                    <span>Daily pull</span>
                    <span>Locked</span>
                  </li>
                </ul>
              </div>
            ) : null}
          </div>

          <div className="relative">
            <button
              type="button"
              aria-expanded={menu === "collection"}
              onClick={() => setMenu((current) => (current === "collection" ? null : "collection"))}
              className="rounded-full border border-gold/40 px-4 py-2 text-sm text-paper transition hover:border-gold"
            >
              My collection
            </button>
            {menu === "collection" ? (
              <div className="absolute right-0 z-20 mt-2 w-64 rounded-2xl border border-gold/20 bg-[#16131d] p-4 shadow-xl">
                <p className="text-[11px] uppercase tracking-[0.16em] text-mist">My collection</p>
                <p className="mt-2 text-sm leading-6 text-paper">
                  No pulls yet. Open a welcome pack and they will show up here.
                </p>
              </div>
            ) : null}
          </div>

          <Link
            href="/marketplace"
            className="rounded-full border border-gold/40 px-4 py-2 text-sm text-paper transition hover:border-gold"
          >
            marketplace
          </Link>
          <Link
            href="/leaderboard"
            className="rounded-full border border-gold/40 px-4 py-2 text-sm text-paper transition hover:border-gold"
          >
            leaderboard
          </Link>
        </nav>
      </div>
    </header>
  );
}
