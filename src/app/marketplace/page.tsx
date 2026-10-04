import type { Metadata } from "next";
import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = {
  title: "Marketplace · Onchain Packs",
};

export default function MarketplacePage() {
  return (
    <ComingSoon
      title="Marketplace"
      detail="Listings, offers, and trades will live here."
    />
  );
}
