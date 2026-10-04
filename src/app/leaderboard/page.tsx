import type { Metadata } from "next";
import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = {
  title: "Leaderboard · Onchain Packs",
};

export default function LeaderboardPage() {
  return (
    <ComingSoon
      title="Leaderboard"
      detail="Ranks for the biggest pulls will live here."
    />
  );
}
