type Props = {
  url: string;
  className?: string;
};

export default function AviasalesMoreLink({ url, className = "" }: Props) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`mt-2 flex w-fit items-center gap-1 rounded-lg bg-[#f26537] px-2 py-1 text-xs font-semibold text-white transition hover:opacity-90 ${className}`}
    >
      <i
        className="ti ti-external-link text-sm leading-none"
        aria-hidden="true"
      />
      View More Options on Aviasales
    </a>
  );
}
