"use client";

import { useState } from "react";
import { formatUsd, formatUsdc } from "@/lib/format";
import type { Pack } from "@/lib/packs";
import { useWallet } from "@/components/wallet-provider";

export function BetBox({ pack }: { pack: Pack }) {
  const wallet = useWallet();
  const [quantity, setQuantity] = useState(1);
  const [turbo, setTurbo] = useState(false);
  const [oddsOpen, setOddsOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const total = pack.price * quantity;
  const canOpen = wallet.phase === "ready" && wallet.smartUsdc >= total;

  function changeQuantity(next: number) {
    setQuantity(Math.min(10, Math.max(1, next)));
    setNotice(null);
  }

  function onAction() {
    if (wallet.phase !== "ready") {
      wallet.openModal();
      return;
    }
    if (!canOpen) return;
    setNotice("Pack opening is a placeholder. Nothing was charged.");
  }

  const actionLabel =
    wallet.phase === "disconnected"
      ? "Connect wallet to open"
      : wallet.phase === "connected"
        ? "Create smart wallet"
        : canOpen
          ? "Open pack"
          : "Insufficient USDC";

  return (
    <aside className="h-fit rounded-3xl border border-gold/20 bg-[#120f18] p-5 shadow-2xl shadow-black/30">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl leading-none text-paper">{pack.name}</h1>
          <p className="mt-2 text-sm text-mist">{pack.tagline}</p>
        </div>
        <div className="shrink-0 rounded-full bg-gold px-3 py-1 text-sm font-semibold text-ink">
          {formatUsdc(pack.price, 0)}
        </div>
      </div>

      <div className="mt-6 flex items-end justify-between">
        <p className="text-sm text-[#8fdfb0]">Expected value</p>
        <p className="font-display text-3xl text-[#8fdfb0]">{formatUsd(pack.expectedValue)}</p>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <span className="text-sm text-mist">Packs</span>
        <div className="flex items-center gap-3 rounded-full border border-white/10 px-2 py-1">
          <button
            type="button"
            aria-label="Decrease packs"
            onClick={() => changeQuantity(quantity - 1)}
            className="h-8 w-8 rounded-full text-lg text-paper hover:bg-white/5"
          >
            −
          </button>
          <span className="w-6 text-center text-paper">{quantity}</span>
          <button
            type="button"
            aria-label="Increase packs"
            onClick={() => changeQuantity(quantity + 1)}
            className="h-8 w-8 rounded-full text-lg text-paper hover:bg-white/5"
          >
            +
          </button>
        </div>
      </div>
      <p className="mt-2 text-right text-xs text-mist">Total {formatUsdc(total)} USDC</p>

      <button
        type="button"
        onClick={onAction}
        disabled={wallet.phase === "ready" && !canOpen}
        className="mt-4 w-full rounded-full bg-gold py-3 text-sm font-semibold text-ink disabled:cursor-not-allowed disabled:bg-gold/25 disabled:text-mist"
      >
        {actionLabel}
      </button>
      {notice ? <p className="mt-3 text-sm text-mist">{notice}</p> : null}

      <div className="mt-5 flex items-center justify-between gap-4 border-t border-white/10 pt-4">
        <div>
          <p className="text-sm text-paper">Turbo</p>
          <p className="text-xs text-mist">Auto-sell common pulls for USDC</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={turbo}
          onClick={() => setTurbo((current) => !current)}
          className={`relative h-7 w-12 rounded-full transition ${turbo ? "bg-gold" : "bg-white/15"}`}
        >
          <span
            className={`absolute top-1 h-5 w-5 rounded-full bg-ink transition ${turbo ? "left-6" : "left-1"}`}
          />
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-paper">Instant buyback</p>
          <p className="text-xs text-mist">Sell any pull back for USDC within 3 days</p>
        </div>
        <p className="text-lg font-semibold text-[#8fdfb0]">{pack.buyback}%</p>
      </div>

      <button
        type="button"
        aria-expanded={oddsOpen}
        onClick={() => setOddsOpen((current) => !current)}
        className="mt-4 flex w-full items-center justify-between rounded-2xl border border-white/10 px-4 py-3 text-sm text-paper"
      >
        Statistics & odds
        <span className="text-mist">{oddsOpen ? "▴" : "▾"}</span>
      </button>
      {oddsOpen ? (
        <ul className="mt-3 space-y-2 px-1 text-sm text-mist">
          {[
            ["Common", "72%"],
            ["Uncommon", "18%"],
            ["Rare", "8%"],
            ["Chase", "2%"],
          ].map(([label, chance]) => (
            <li key={label} className="flex justify-between">
              <span>{label}</span>
              <span className="text-paper">{chance}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </aside>
  );
}
