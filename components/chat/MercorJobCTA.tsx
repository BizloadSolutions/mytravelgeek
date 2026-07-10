import { MERCOR_REFERRAL_URL } from "@/lib/mercor";

type MercorJobCTAProps = {
  compact?: boolean;
};

/** Compact pill shown below each assistant message in chat. */
export function MercorJobChatButton() {
  return (
    <a
      href={MERCOR_REFERRAL_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex w-fit max-w-full items-center gap-2 rounded-xl border border-[#7C76FF]/25 bg-gradient-to-r from-[#7C76FF]/10 to-[#6366F1]/10 px-3 py-2 text-xs font-medium text-[#4F46E5] transition hover:from-[#7C76FF]/15 hover:to-[#6366F1]/15 sm:text-sm"
    >
      <img
        src="https://work.mercor.com/icon.svg"
        alt=""
        width={16}
        height={16}
        className="size-4 shrink-0"
        aria-hidden
      />
      <span className="text-left leading-snug">
        Find work from home jobs up to{" "}
        <span className="font-semibold">$100 per hour</span>
      </span>
      <svg
        className="size-3.5 shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </a>
  );
}

export default function MercorJobCTA({ compact = false }: MercorJobCTAProps) {
  return (
    <div
      className={`relative w-full shrink-0 overflow-hidden rounded-2xl bg-[#0B0B0F] ${
        compact ? "p-2.5 sm:p-4" : "p-5 sm:p-6"
      }`}
    >
      <div
        className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-[#7C76FF]/25 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-10 -left-8 size-36 rounded-full bg-[#6366F1]/15 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="flex min-w-0 items-center gap-2.5 sm:items-start sm:gap-3">
          <img
            src="https://work.mercor.com/icon.svg"
            alt=""
            width={40}
            height={40}
            className="size-8 shrink-0 sm:size-10"
            aria-hidden
          />
          <p
            className={`m-0 leading-snug text-zinc-200 ${
              compact ? "text-[11px] sm:text-sm" : "text-sm sm:text-base"
            }`}
          >
            Click here to find a work from home job paying up to{" "}
            <span className="font-semibold text-[#C4C0FF]">$100 per hour</span>
          </p>
        </div>

        <a
          href={MERCOR_REFERRAL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-[#7C76FF] font-semibold text-white shadow-md shadow-[#7C76FF]/25 transition hover:bg-[#8B85FF] ${
            compact
              ? "w-full px-3 py-2 text-[11px] sm:w-auto sm:px-4 sm:py-2 sm:text-xs"
              : "px-5 py-2.5 text-sm"
          }`}
        >
          Find remote jobs
          <svg
            className="size-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </a>
      </div>
    </div>
  );
}
