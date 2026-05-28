"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import AssistantMarkdown from "@/components/chat/AssistantMarkdown";
import ChatHelp from "../ChatHelp";
import { sendChatMessage } from "@/lib/chat-api";
import type { ChatMessage } from "@/lib/chat-types";
import { isShowMapVIew } from "../utils/helpers";

const QUICK_PROMPTS = [
  {
    label: "Custom Itinerary",
    text: "Plan a 3-day custom itinerary with morning, afternoon, and evening activities.",
  },
  { label: "Flights", text: "Help me compare flight options for my trip." },
  { label: "Hotels", text: "Suggest hotels for my upcoming trip." },
] as const;

function TypingIndicator() {
  return (
    <div className="flex w-fit gap-1.5 rounded-br-lg rounded-tl-lg rounded-tr-lg bg-[var(--primary-50)] p-3">
      <span className="size-2 animate-bounce rounded-full bg-[var(--main-primary)] [animation-duration:900ms]" />
      <span className="size-2 animate-bounce rounded-full bg-[var(--primary-100)] [animation-delay:150ms] [animation-duration:900ms]" />
      <span className="size-2 animate-bounce rounded-full bg-[var(--primary-100)] [animation-delay:300ms] [animation-duration:900ms]" />
    </div>
  );
}

function AssistantMessage({ content }: { content: string }) {
  return (
    <div className="flex w-fit lg:max-w-[80%] max-w-[90%] flex-col gap-3 rounded-br-lg rounded-tl-lg rounded-tr-lg bg-[var(--primary-50)] p-3">
      <AssistantMarkdown content={content} />
    </div>
  );
}

function UserMessage({ content }: { content: string }) {
  return (
    <div className="flex flex-col items-end justify-center gap-2.5 self-stretch">
      <div className="flex lg:max-w-[80%] max-w-[90%] flex-col gap-[25px] rounded-bl-lg rounded-tl-lg rounded-tr-lg bg-[var(--bg-background-muted)] p-3">
        <p className="m-0 whitespace-pre-wrap text-sm font-normal">{content}</p>
      </div>
    </div>
  );
}

type ChatModalProps = {
  open: boolean;
  initialQuery?: string;
};

export default function ChatModal({ open, initialQuery = "" }: ChatModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sentInitialRef = useRef<string | null>(null);
  const messagesRef = useRef<ChatMessage[]>([]);
  const isLoadingRef = useRef(false);

  const syncMessages = useCallback((next: ChatMessage[]) => {
    messagesRef.current = next;
    setMessages(next);
  }, []);

  const scrollToBottom = useCallback(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  const submitMessage = useCallback(
    async (rawText: string) => {
      const text = rawText.trim();
      if (!text || isLoadingRef.current) return;

      setInput("");

      const userMessage: ChatMessage = { role: "user", content: text };
      const conversation = [...messagesRef.current, userMessage];
      syncMessages(conversation);

      isLoadingRef.current = true;
      setIsLoading(true);

      try {
        const reply = await sendChatMessage(conversation);
        syncMessages([...conversation, { role: "assistant", content: reply }]);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "I couldn't reach the travel chat right now.";

        syncMessages([
          ...conversation,
          {
            role: "assistant",
            content: `${message} Please try again in a moment.`,
          },
        ]);
      } finally {
        isLoadingRef.current = false;
        setIsLoading(false);
      }
    },
    [syncMessages],
  );

  useEffect(() => {
    if (!open) {
      sentInitialRef.current = null;
      return;
    }

    const query = initialQuery.trim();
    if (!query || sentInitialRef.current === query) return;

    sentInitialRef.current = query;
    void submitMessage(query);
  }, [open, initialQuery, submitMessage]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submitMessage(input);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void submitMessage(input);
    }
  };

  return (
    <div
      id="modal-chat-panel"
      className="flex min-h-0 w-full min-w-0 flex-1 shrink-0 flex-col gap-5 self-stretch p-2.5 md:border-r md:border-solid md:border-gray-100"
    >
      <div
        ref={scrollRef}
        className="flex min-h-0 max-h-[calc(100dvh-137px)] flex-1 flex-col gap-3.5 self-stretch overflow-y-auto overscroll-contain"
      >
        <div className="flex w-full lg:max-w-[80%] max-w-[90%] flex-col gap-2.5 rounded-br-lg rounded-tl-lg rounded-tr-lg bg-[var(--primary-50)] p-3 text-sm leading-relaxed">
          <p className="m-0">
            Hi! I&apos;m your personal travel genius — ask me anything about
            trips, stays, food, or local tips.
          </p>
        </div>

        <div className="flex gap-2.5 self-stretch rounded-2xl bg-white p-3 shadow-[0px_2px_5px_0px_rgba(0,0,0,0.2)] mx-3">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt.label}
              type="button"
              disabled={isLoading}
              onClick={() => void submitMessage(prompt.text)}
              className="flex min-w-0 flex-1 flex-col gap-[25px] rounded-lg border border-solid border-black/10 bg-gray-50 px-3 py-2 transition-colors hover:bg-zinc-100 disabled:opacity-50"
            >
              <span className="text-center text-xs font-normal text-[#6B7280]">
                {prompt.label}
              </span>
            </button>
          ))}
        </div>

        {messages.map((message, index) =>
          message.role === "user" ? (
            <UserMessage
              key={`user-${index}-${message.content.slice(0, 24)}`}
              content={message.content}
            />
          ) : (
            <AssistantMessage
              key={`assistant-${index}-${message.content.slice(0, 24)}`}
              content={message.content}
            />
          ),
        )}

        {isLoading && <TypingIndicator />}

        {isShowMapVIew && messages.length > 0 && <ChatHelp />}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex h-[45px] shrink-0 items-center gap-2 self-stretch rounded-[63px] bg-neutral-50 pl-[15px] pr-1"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your question here"
          disabled={isLoading}
          className="min-h-0 min-w-0 flex-1 border-0 bg-transparent text-sm text-zinc-900 outline-none ring-0 placeholder:text-zinc-600 focus:ring-0 disabled:opacity-60"
          aria-label="Chat message"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="flex size-[37px] shrink-0 items-center justify-center rounded-full bg-[#f26537] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Send"
        >
          <svg
            className="size-[18px]"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M9.99995 14L20.9999 3M20.9999 3L2.99995 9.5C2.90421 9.54387 2.82307 9.61431 2.76619 9.70295C2.70931 9.79158 2.67908 9.89468 2.67908 10C2.67908 10.1053 2.70931 10.2084 2.76619 10.2971C2.82307 10.3857 2.90421 10.4561 2.99995 10.5L9.99995 14L13.4999 21C13.5438 21.0957 13.6143 21.1769 13.7029 21.2338C13.7915 21.2906 13.8946 21.3209 13.9999 21.3209C14.1053 21.3209 14.2084 21.2906 14.297 21.2338C14.3856 21.1769 14.4561 21.0957 14.4999 21L20.9999 3Z"
              stroke="white"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </form>
    </div>
  );
}
