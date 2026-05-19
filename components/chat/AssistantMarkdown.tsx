"use client";

import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

type AssistantMarkdownProps = {
  content: string;
};

/** Renders assistant Markdown using the same rules as tevel-ai-bot (GFM + quoted highlights). */
export default function AssistantMarkdown({ content }: AssistantMarkdownProps) {
  const processed = content.replace(
    /(^|\s)"([^"]+)"(?=\s|$|[.,!?:;])/g,
    '$1<span class="text-[var(--main-primary)] font-semibold">"$2"</span>',
  );

  return (
    <div className="flex flex-col gap-2 self-stretch text-sm leading-relaxed text-zinc-950">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          h1: ({ ...props }) => (
            <h3
              className="mt-3 mb-1 text-base font-semibold text-zinc-950"
              {...props}
            />
          ),
          h2: ({ ...props }) => (
            <h3
              className="mt-3 mb-1 text-base font-semibold text-zinc-950"
              {...props}
            />
          ),
          h3: ({ ...props }) => (
            <h3
              className="mt-3 mb-1 text-base font-semibold text-zinc-950"
              {...props}
            />
          ),
          h4: ({ ...props }) => (
            <h4
              className="mt-2 mb-1 text-sm font-semibold text-zinc-950"
              {...props}
            />
          ),
          p: ({ ...props }) => (
            <p className="m-0 mb-2 leading-relaxed" {...props} />
          ),
          ul: ({ ...props }) => (
            <ul
              className="m-0 mb-2 list-outside list-disc space-y-1 pl-5"
              {...props}
            />
          ),
          ol: ({ ...props }) => (
            <ol
              className="m-0 mb-2 list-outside list-decimal space-y-1 pl-5"
              {...props}
            />
          ),
          li: ({ ...props }) => <li className="pl-1" {...props} />,
          strong: ({ ...props }) => (
            <strong className="font-semibold text-zinc-950" {...props} />
          ),
          a: ({ ...props }) => (
            <a
              className="font-medium text-[var(--secondary-800)] underline underline-offset-2"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
          blockquote: ({ ...props }) => (
            <blockquote
              className="border-l-2 border-[var(--primary-200)] pl-3 italic text-zinc-600"
              {...props}
            />
          ),
        }}
      >
        {processed}
      </ReactMarkdown>
    </div>
  );
}
