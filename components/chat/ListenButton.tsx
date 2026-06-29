"use client";

type ListenButtonProps = {
  active: boolean;
  onClick: () => void;
  className?: string;
};

export default function ListenButton({
  active,
  onClick,
  className = "",
}: ListenButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex size-7 shrink-0 items-center justify-center rounded-full transition hover:bg-black/5 ${active ? "bg-[#f26537]/10 text-[#f26537]" : "text-zinc-500"} ${className}`}
      aria-label={active ? "Stop audio" : "Listen to response"}
      aria-pressed={active}
      title={active ? "Stop audio" : "Listen (natural female voice)"}
    >
      {active ? (
        <svg
          className="size-3.5"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <rect x="6" y="6" width="12" height="12" rx="1.5" />
        </svg>
      ) : (
        <svg
          className="size-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M11 5 6 9H3v6h3l5 4V5Z" />
          <path d="M15.5 8.5a5 5 0 0 1 0 7" />
          <path d="M18 6a8.5 8.5 0 0 1 0 12" />
        </svg>
      )}
    </button>
  );
}
