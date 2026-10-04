const links = ["Provably fair", "X", "Discord", "FAQ"];

export function SiteFooter() {
  return (
    <footer className="px-6 py-10">
      <ul className="flex flex-col gap-2 text-sm text-paper">
        {links.map((label) => (
          <li key={label}>
            <span>{label}</span>
          </li>
        ))}
      </ul>
    </footer>
  );
}
