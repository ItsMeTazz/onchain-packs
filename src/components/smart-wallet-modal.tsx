"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { formatUsdc, truncateAddress } from "@/lib/format";
import { useWallet } from "@/components/wallet-provider";

type View = "main" | "deposit" | "withdraw";
type Busy = "idle" | "creating" | "created";

export function SmartWalletModal() {
  const wallet = useWallet();
  const titleId = useId();
  const [view, setView] = useState<View>("main");
  const [busy, setBusy] = useState<Busy>("idle");
  const [copied, setCopied] = useState(false);

  const dismiss = useCallback(() => {
    setView("main");
    setBusy("idle");
    wallet.closeModal();
  }, [wallet]);

  useEffect(() => {
    if (!wallet.modalOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") dismiss();
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [wallet.modalOpen, dismiss]);

  useEffect(() => {
    if (busy !== "creating") return;
    const id = window.setTimeout(() => {
      wallet.createSmartWallet();
      setBusy("created");
    }, 900);
    return () => window.clearTimeout(id);
  }, [busy, wallet]);

  useEffect(() => {
    if (busy !== "created") return;
    const id = window.setTimeout(() => setBusy("idle"), 1100);
    return () => window.clearTimeout(id);
  }, [busy]);

  if (!wallet.modalOpen) return null;

  async function copyAddress() {
    if (!wallet.smartWallet) return;
    try {
      await navigator.clipboard.writeText(wallet.smartWallet);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Close smart wallet"
        className="absolute inset-0 bg-black/70"
        onClick={dismiss}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-t-3xl border border-gold/25 bg-gradient-to-b from-[#1c1726] via-[#120f18] to-[#0c0a10] shadow-2xl shadow-black/60 sm:rounded-3xl"
      >
        <div className="flex items-center gap-3 border-b border-gold/15 px-5 py-4 sm:px-6">
          {view !== "main" ? (
            <button
              type="button"
              onClick={() => setView("main")}
              className="rounded-full border border-gold/30 px-3 py-1 text-xs uppercase tracking-[0.16em] text-gold"
            >
              Back
            </button>
          ) : null}
          <h2 id={titleId} className="font-display text-2xl text-paper">
            Smart wallet
          </h2>
          <button
            type="button"
            onClick={dismiss}
            className="ml-auto text-mist transition hover:text-paper"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="relative overflow-y-auto px-5 py-6 sm:px-6">
          {busy !== "idle" ? (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#120f18] px-8 text-center">
              {busy === "creating" ? (
                <>
                  <div className="mb-5 h-12 w-12 animate-spin rounded-full border-4 border-gold/20 border-t-gold" />
                  <h3 className="font-display text-2xl text-paper">Creating wallet</h3>
                  <p className="mt-3 max-w-sm text-sm text-mist">
                    Confirm the transaction in your wallet. This demo finishes on its own.
                  </p>
                </>
              ) : (
                <>
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-2xl text-gold">
                    ✓
                  </div>
                  <h3 className="font-display text-2xl text-paper">Wallet created</h3>
                  <p className="mt-3 max-w-sm text-sm text-mist">
                    Your smart wallet is ready. Add funds when you want to open a pack.
                  </p>
                </>
              )}
            </div>
          ) : null}

          {wallet.phase === "disconnected" ? (
            <Disconnected onConnect={wallet.connect} />
          ) : null}

          {wallet.phase === "connected" ? (
            <CreateWallet
              account={wallet.account}
              onCreate={() => setBusy("creating")}
              onDisconnect={wallet.disconnect}
            />
          ) : null}

          {wallet.phase === "ready" && view === "main" ? (
            <ReadyWallet
              account={wallet.account}
              smartWallet={wallet.smartWallet}
              walletUsdc={wallet.walletUsdc}
              smartUsdc={wallet.smartUsdc}
              copied={copied}
              onCopy={copyAddress}
              onDeposit={() => setView("deposit")}
              onWithdraw={() => setView("withdraw")}
              onDisconnect={wallet.disconnect}
            />
          ) : null}

          {wallet.phase === "ready" && view === "deposit" ? (
            <TransferForm
              mode="deposit"
              available={wallet.walletUsdc}
              onSubmit={wallet.deposit}
              onDone={() => setView("main")}
            />
          ) : null}

          {wallet.phase === "ready" && view === "withdraw" ? (
            <TransferForm
              mode="withdraw"
              available={wallet.smartUsdc}
              onSubmit={wallet.withdraw}
              onDone={() => setView("main")}
            />
          ) : null}

          <p className="mt-6 text-center text-xs text-mist">
            Demo session. Balances stay in this browser only.
          </p>
        </div>
      </div>
    </div>
  );
}

function Disconnected({ onConnect }: { onConnect: () => void }) {
  return (
    <div className="py-4 text-center">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gold/10 text-gold">
        <WalletIcon />
      </div>
      <h3 className="font-display text-3xl text-paper">Connect your wallet</h3>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-mist">
        Connect a wallet to create a self-custodial smart wallet for instant deposits and withdrawals.
      </p>
      <button
        type="button"
        onClick={onConnect}
        className="mt-8 rounded-full bg-gold px-8 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-ink transition hover:bg-[#f0d48a]"
      >
        Connect wallet
      </button>
    </div>
  );
}

function CreateWallet({
  account,
  onCreate,
  onDisconnect,
}: {
  account: string | null;
  onCreate: () => void;
  onDisconnect: () => void;
}) {
  const features = [
    { label: "No KYC", mark: "鎖" },
    { label: "Instant", mark: "迅" },
    { label: "On-chain", mark: "鏈" },
  ];

  return (
    <div className="py-2">
      <div className="text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gold/10 text-gold">
          <WalletIcon />
        </div>
        <h3 className="font-display text-3xl text-paper">Create smart wallet</h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-mist">
          One-time setup. After creation, deposit and withdraw instantly. Fully non-custodial.
        </p>
        {account ? (
          <p className="mt-3 font-mono text-xs text-gold">{truncateAddress(account)}</p>
        ) : null}
      </div>
      <div className="mt-6 grid grid-cols-3 gap-3">
        {features.map((feature) => (
          <div
            key={feature.label}
            className="rounded-2xl border border-gold/20 bg-ink/50 px-2 py-4 text-center"
          >
            <div className="font-display text-xl text-gold">{feature.mark}</div>
            <div className="mt-2 text-[11px] uppercase tracking-[0.16em] text-mist">
              {feature.label}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={onCreate}
          className="rounded-full bg-gold px-10 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-ink transition hover:bg-[#f0d48a]"
        >
          Create wallet
        </button>
        <button
          type="button"
          onClick={onDisconnect}
          className="text-xs uppercase tracking-[0.16em] text-mist hover:text-paper"
        >
          Disconnect
        </button>
      </div>
    </div>
  );
}

function ReadyWallet({
  account,
  smartWallet,
  walletUsdc,
  smartUsdc,
  copied,
  onCopy,
  onDeposit,
  onWithdraw,
  onDisconnect,
}: {
  account: string | null;
  smartWallet: string | null;
  walletUsdc: number;
  smartUsdc: number;
  copied: boolean;
  onCopy: () => void;
  onDeposit: () => void;
  onWithdraw: () => void;
  onDisconnect: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-2xl border border-gold/20 bg-gradient-to-br from-[#1a1422] to-[#0e0c12] p-5">
        <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-seal/20 blur-3xl" />
        <div className="relative">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/15 text-gold">
                <WalletIcon />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-mist">Smart wallet</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="font-mono text-sm text-paper">
                    {smartWallet ? truncateAddress(smartWallet) : "—"}
                  </span>
                  <button
                    type="button"
                    onClick={onCopy}
                    className="text-xs text-gold"
                  >
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-gold">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              Active
            </span>
          </div>

          <div className="mt-5 rounded-xl border border-gold/15 bg-ink/60 p-4">
            <p className="text-[11px] uppercase tracking-[0.16em] text-mist">USDC</p>
            <p className="mt-1 font-display text-3xl text-paper">{formatUsdc(smartUsdc, 4)}</p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onDeposit}
              className="rounded-xl bg-gold py-3 text-sm font-semibold uppercase tracking-[0.12em] text-ink"
            >
              Add funds
            </button>
            <button
              type="button"
              onClick={onWithdraw}
              className="rounded-xl border border-gold/30 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-paper"
            >
              Withdraw
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gold/15 bg-ink/40 p-4">
        <p className="text-[11px] uppercase tracking-[0.16em] text-mist">Connected wallet</p>
        <p className="mt-2 font-mono text-sm text-paper">
          {account ? truncateAddress(account) : "—"}
        </p>
        <p className="mt-1 text-sm text-mist">{formatUsdc(walletUsdc, 4)} USDC</p>
      </div>

      <a
        href="https://app.debridge.finance/"
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-between rounded-xl border border-gold/15 bg-ink/30 px-4 py-3 transition hover:border-gold/40"
      >
        <span>
          <span className="block text-sm text-paper">Bridge tokens</span>
          <span className="block text-xs text-mist">Cross-chain swap into USDC</span>
        </span>
        <span className="text-xs uppercase tracking-[0.14em] text-gold">Open</span>
      </a>

      <button
        type="button"
        onClick={onDisconnect}
        className="text-xs uppercase tracking-[0.16em] text-mist hover:text-paper"
      >
        Disconnect
      </button>
    </div>
  );
}

function TransferForm({
  mode,
  available,
  onSubmit,
  onDone,
}: {
  mode: "deposit" | "withdraw";
  available: number;
  onSubmit: (amount: number) => string | null;
  onDone: () => void;
}) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const adding = mode === "deposit";

  function submit() {
    const nextError = onSubmit(Number(amount));
    setError(nextError);
    if (!nextError) onDone();
  }

  return (
    <div>
      <div className="text-center">
        <h3 className="font-display text-3xl text-paper">{adding ? "Add funds" : "Withdraw"}</h3>
        <p className="mt-2 text-sm text-mist">
          {adding
            ? "Move USDC from your connected wallet into the smart wallet."
            : "Move USDC from the smart wallet back to your connected wallet."}
        </p>
      </div>

      <label className="mt-6 block text-[11px] uppercase tracking-[0.16em] text-mist">
        Token
        <div className="mt-2 rounded-xl border border-gold/20 bg-ink px-4 py-3 text-sm text-paper">
          USDC
        </div>
      </label>

      <div className="mt-4 flex items-center justify-between text-[11px] uppercase tracking-[0.16em] text-mist">
        <span>Amount</span>
        <span>
          Available <span className="text-gold">{formatUsdc(available, 4)}</span>
        </span>
      </div>
      <div className="relative mt-2">
        <input
          inputMode="decimal"
          value={amount}
          onChange={(event) => {
            setAmount(event.target.value);
            setError(null);
          }}
          placeholder="0.00"
          className="w-full rounded-xl border border-gold/20 bg-ink px-4 py-3 pr-20 text-paper outline-none focus:border-gold"
        />
        <button
          type="button"
          onClick={() => setAmount(String(available))}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-gold/15 px-3 py-1 text-xs font-semibold uppercase text-gold"
        >
          Max
        </button>
      </div>
      {error ? <p className="mt-3 text-sm text-seal">{error}</p> : null}
      {available <= 0 ? (
        <p className="mt-3 text-sm text-mist">No USDC available for this transfer.</p>
      ) : null}
      <button
        type="button"
        onClick={submit}
        disabled={available <= 0}
        className="mt-6 w-full rounded-xl bg-gold py-3 text-sm font-semibold uppercase tracking-[0.14em] text-ink disabled:cursor-not-allowed disabled:opacity-40"
      >
        {adding ? "Add funds" : "Withdraw"}
      </button>
    </div>
  );
}

function WalletIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 10h18" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="16.5" cy="14.5" r="1" fill="currentColor" />
    </svg>
  );
}
