export type PackAccent = "sea" | "jade" | "seal";

export type Hit = {
  id: string;
  name: string;
  grade: string;
  grader: string;
  value: number;
  multiplier: string;
};

export type Pack = {
  slug: string;
  name: string;
  tagline: string;
  price: number;
  expectedValue: number;
  buyback: number;
  accent: PackAccent;
  hits: Hit[];
  latest: Hit[];
};

const hitNames = [
  "Foil crest",
  "Captain portrait",
  "Ship log",
  "Island map",
  "Bounty notice",
  "Crew emblem",
  "Storm relic",
  "Throne seal",
];

function makeHits(slug: string, base: number, latest: boolean): Hit[] {
  return hitNames.map((name, index) => {
    const shifted = latest ? (index + 3) % hitNames.length : index;
    const grade = shifted % 3 === 0 ? "10" : "9";
    const value = base * (shifted + 2) * (latest ? 3 : 8);
    return {
      id: `${slug}-${latest ? "latest" : "inside"}-${shifted}`,
      name,
      grade,
      grader: shifted % 2 === 0 ? "PSA" : "BECKETT",
      value,
      multiplier: `+${(shifted + 1) * (latest ? 180 : 240)}%`,
    };
  });
}

export const packs: Pack[] = [
  {
    slug: "east-blue",
    name: "East Blue Pack",
    tagline: "First voyage chase pulls",
    price: 25,
    expectedValue: 28.4,
    buyback: 85,
    accent: "sea",
    hits: makeHits("east-blue", 18, false),
    latest: makeHits("east-blue", 12, true),
  },
  {
    slug: "grand-line",
    name: "Grand Line Pack",
    tagline: "Grand Line chase pulls",
    price: 50,
    expectedValue: 55.03,
    buyback: 88,
    accent: "jade",
    hits: makeHits("grand-line", 40, false),
    latest: makeHits("grand-line", 28, true),
  },
  {
    slug: "new-world",
    name: "New World Pack",
    tagline: "New World chase pulls",
    price: 100,
    expectedValue: 112.2,
    buyback: 93,
    accent: "seal",
    hits: makeHits("new-world", 90, false),
    latest: makeHits("new-world", 70, true),
  },
];

export function getPack(slug: string) {
  return packs.find((pack) => pack.slug === slug);
}
