"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type AssistantMarkdownProps = {
  content: string;
};

/** GuideGeek-style markdown: scannable bullets, bold key phrases, minimal headings. */
export default function AssistantMarkdown({ content }: AssistantMarkdownProps) {
  return (
    <div className="flex flex-col gap-2.5 self-stretch text-sm leading-relaxed text-zinc-800">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ ...props }) => (
            <h3
              className="mt-3 mb-1.5 text-sm font-semibold text-zinc-950 first:mt-0"
              {...props}
            />
          ),
          h2: ({ ...props }) => (
            <h3
              className="mt-3 mb-1.5 text-sm font-semibold text-zinc-950 first:mt-0"
              {...props}
            />
          ),
          h3: ({ ...props }) => (
            <h3
              className="mt-4 mb-2 text-sm font-bold text-zinc-950 first:mt-0"
              {...props}
            />
          ),
          p: ({ ...props }) => (
            <p className="m-0 mb-2.5 leading-relaxed last:mb-0" {...props} />
          ),
          ul: ({ ...props }) => (
            <ul
              className="m-0 mb-2.5 list-outside list-disc space-y-2 pl-4 last:mb-0"
              {...props}
            />
          ),
          ol: ({ ...props }) => (
            <ol
              className="m-0 mb-2.5 list-outside list-decimal space-y-2 pl-4 last:mb-0"
              {...props}
            />
          ),
          li: ({ ...props }) => (
            <li className="leading-relaxed marker:text-zinc-400" {...props} />
          ),
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
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
