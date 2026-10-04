import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BetBox } from "@/components/bet-box";
import { HitsSection } from "@/components/hits-section";
import { PackArt } from "@/components/pack-art";
import { getPack, packs } from "@/lib/packs";

type PackPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return packs.map((pack) => ({ slug: pack.slug }));
}

export async function generateMetadata({ params }: PackPageProps): Promise<Metadata> {
  const { slug } = await params;
  const pack = getPack(slug);
  return {
    title: pack ? `${pack.name} · Onchain Packs` : "Pack",
  };
}

export default async function PackPage({ params }: PackPageProps) {
  const { slug } = await params;
  const pack = getPack(slug);
  if (!pack) notFound();

  return (
    <main className="flex-1">
      <div className="mx-auto grid max-w-6xl items-start gap-8 px-4 py-10 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex flex-col items-center">
          <PackArt accent={pack.accent} label={pack.name} large />
          <div className="mt-8 flex gap-3">
            {packs.map((item) => (
              <Link
                key={item.slug}
                href={`/packs/${item.slug}`}
                aria-label={item.name}
                aria-current={item.slug === pack.slug ? "page" : undefined}
                className={`w-16 rounded-xl p-1 ${
                  item.slug === pack.slug ? "ring-2 ring-gold" : "opacity-70 hover:opacity-100"
                }`}
              >
                <PackArt accent={item.accent} label="" />
              </Link>
            ))}
          </div>
        </div>
        <BetBox pack={pack} />
      </div>
      <HitsSection pack={pack} />
    </main>
  );
}
