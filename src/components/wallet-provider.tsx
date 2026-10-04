"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { SmartWalletModal } from "@/components/smart-wallet-modal";
import { roundUsdc } from "@/lib/format";

const STORAGE_KEY = "onchain-packs.wallet";
const DEMO_ACCOUNT = "0x4F2C8a91bE17D0c4E6aB22F91d0038c7a1B09E44";
const DEMO_SMART = "0x7cE90b14Aa88D221F0E33c91B004D6e2c8F15A90";
const DEMO_WALLET_USDC = 250;

type Phase = "disconnected" | "connected" | "ready";

type StoredWallet = {
  phase: Phase;
  account: string | null;
  smartWallet: string | null;
  walletUsdc: number;
  smartUsdc: number;
};

type WalletContextValue = StoredWallet & {
  modalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  connect: () => void;
  disconnect: () => void;
  createSmartWallet: () => void;
  deposit: (amount: number) => string | null;
  withdraw: (amount: number) => string | null;
};

const emptyWallet: StoredWallet = {
  phase: "disconnected",
  account: null,
  smartWallet: null,
  walletUsdc: 0,
  smartUsdc: 0,
};

const listeners = new Set<() => void>();
let current = emptyWallet;
let loaded = false;

function isPhase(value: unknown): value is Phase {
  return value === "disconnected" || value === "connected" || value === "ready";
}

function readStorage(): StoredWallet {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyWallet;
    const parsed = JSON.parse(raw) as StoredWallet;
    if (!isPhase(parsed.phase)) return emptyWallet;
    return parsed;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return emptyWallet;
  }
}

function getSnapshot() {
  if (!loaded) {
    loaded = true;
    current = readStorage();
  }
  return current;
}

function getServerSnapshot() {
  return emptyWallet;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function commit(next: StoredWallet) {
  current = next;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  listeners.forEach((listener) => listener());
}

const WalletContext = createContext<WalletContextValue | null>(null);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const wallet = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  const connect = useCallback(() => {
    if (getSnapshot().phase !== "disconnected") return;
    commit({
      phase: "connected",
      account: DEMO_ACCOUNT,
      smartWallet: null,
      walletUsdc: DEMO_WALLET_USDC,
      smartUsdc: 0,
    });
  }, []);

  const disconnect = useCallback(() => {
    commit(emptyWallet);
  }, []);

  const createSmartWallet = useCallback(() => {
    const latest = getSnapshot();
    if (latest.phase !== "connected") return;
    commit({
      ...latest,
      phase: "ready",
      smartWallet: DEMO_SMART,
      smartUsdc: 0,
    });
  }, []);

  const deposit = useCallback((amount: number) => {
    const latest = getSnapshot();
    if (latest.phase !== "ready") return "Create a smart wallet first.";
    if (!Number.isFinite(amount) || amount <= 0) return "Enter an amount.";
    if (amount > latest.walletUsdc) return "Amount exceeds your connected wallet balance.";
    commit({
      ...latest,
      walletUsdc: roundUsdc(latest.walletUsdc - amount),
      smartUsdc: roundUsdc(latest.smartUsdc + amount),
    });
    return null;
  }, []);

  const withdraw = useCallback((amount: number) => {
    const latest = getSnapshot();
    if (latest.phase !== "ready") return "Create a smart wallet first.";
    if (!Number.isFinite(amount) || amount <= 0) return "Enter an amount.";
    if (amount > latest.smartUsdc) return "Amount exceeds the safe withdrawable balance.";
    commit({
      ...latest,
      walletUsdc: roundUsdc(latest.walletUsdc + amount),
      smartUsdc: roundUsdc(latest.smartUsdc - amount),
    });
    return null;
  }, []);

  const value = useMemo<WalletContextValue>(
    () => ({
      ...wallet,
      modalOpen,
      openModal,
      closeModal,
      connect,
      disconnect,
      createSmartWallet,
      deposit,
      withdraw,
    }),
    [
      wallet,
      modalOpen,
      openModal,
      closeModal,
      connect,
      disconnect,
      createSmartWallet,
      deposit,
      withdraw,
    ],
  );

  return (
    <WalletContext.Provider value={value}>
      {children}
      <SmartWalletModal />
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within WalletProvider");
  }
  return context;
}
