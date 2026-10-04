import type { PackAccent } from "@/lib/packs";

const tones: Record<PackAccent, string> = {
  sea: "from-[#16384c] via-[#2f759c] to-[#0d2433]",
  jade: "from-[#14382c] via-[#2f8a62] to-[#0c241b]",
  seal: "from-[#4a1c24] via-[#a33b42] to-[#240d12]",
};

export function PackArt({
  accent,
  label,
  large = false,
}: {
  accent: PackAccent;
  label: string;
  large?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[1.4rem] border border-white/10 bg-gradient-to-b shadow-2xl shadow-black/40 ${tones[accent]} ${
        large ? "aspect-[3/4] w-full max-w-sm" : "aspect-[3/4] w-full"
      }`}
    >
      <div className="absolute inset-x-6 top-6 h-10 rounded-full border border-white/15 bg-black/20" />
      <div className="absolute inset-6 top-20 flex items-center justify-center rounded-2xl border border-white/15 bg-black/25">
        <div className="flex h-24 w-24 items-center justify-center rounded-full border border-gold/50">
          <div className="h-10 w-10 rotate-45 border border-gold/80" />
        </div>
      </div>
      <p className="absolute inset-x-0 bottom-5 text-center text-[11px] uppercase tracking-[0.22em] text-paper/80">
        {label}
      </p>
    </div>
  );
}
