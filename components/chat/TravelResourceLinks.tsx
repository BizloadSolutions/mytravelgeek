import type { TravelLink } from "@/lib/all-types";

type Props = {
  links: TravelLink[];
  className?: string;
};

export default function TravelResourceLinks({ links, className = "" }: Props) {
  if (!links.length) return null;

  return (
    <div className={`flex flex-row flex-wrap gap-1.5 ${className}`}>
      {links.map((link) => (
        <a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-[#f26537] px-2 py-1 text-xs font-semibold text-white transition hover:opacity-90"
        >
          <i
            className="ti ti-external-link text-sm leading-none"
            aria-hidden="true"
          />
          {link.label}
        </a>
      ))}
    </div>
  );
}
