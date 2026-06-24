"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import AssistantMarkdown from "@/components/chat/AssistantMarkdown";
import FlightsOptionInSideChat from "@/components/flights/FlightsOptionInSideChat";
import TravelResourceLinks from "@/components/chat/TravelResourceLinks";
import ChatHelp from "../ChatHelp";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { api, getApiErrorMessage } from "@/lib/api-client";
import type {
  ChatMessage,
  ChatResponse,
  FlightSearchFallback,
  TravelLink,
} from "@/lib/all-types";
import { isShowMapVIew } from "../utils/helpers";
import TravelSuggestionSparkIcon from "../TravelSuggestionSparkIcon";

const QUICK_PROMPTS = [
  {
    label: "Custom Itinerary",
    text: "Plan a 3-day custom itinerary with morning, afternoon, and evening activities.",
  },
  {
    label: "Find a Flights for Dubai",
    text: "Find flights from Delhi to Dubai in June 2026 for 2 adults.",
  },
  { label: "Book a Hotels", text: "Suggest hotels for my upcoming trip." },
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

function AssistantMessage({
  content,
  flightFallback,
  travelLinks,
}: {
  content: string;
  flightFallback?: FlightSearchFallback;
  travelLinks?: TravelLink[];
}) {
  const links =
    travelLinks ??
    (flightFallback
      ? [
          {
            id: "aviasales",
            label: "Search flights on Aviasales",
            url: flightFallback.searchUrl,
          },
        ]
      : undefined);

  return (
    <div className="flex w-fit lg:max-w-[80%] max-w-[90%] flex-col gap-3 rounded-br-lg rounded-tl-lg rounded-tr-lg bg-[var(--primary-50)] p-3">
      <AssistantMarkdown content={content} />
      {links?.length ? <TravelResourceLinks links={links} /> : null}
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesRef = useRef<ChatMessage[]>([]);
  const sentInitialRef = useRef<string | null>(null);
  const isSendingRef = useRef(false);
  const inputRef = useRef("");
  const sendMessageRef = useRef<(text: string) => Promise<void>>(
    async () => {},
  );

  const {
    listening,
    supported: voiceSupported,
    error: voiceError,
    toggle: toggleVoice,
    stop: stopVoice,
  } = useVoiceInput({
    onTranscript: (text) => {
      inputRef.current = text;
      setInput(text);
    },
    onSilence: () => {
      const text = inputRef.current.trim();
      if (text) void sendMessageRef.current(text);
    },
    silenceMs: 2000,
  });

  useEffect(() => {
    inputRef.current = input;
  }, [input]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  // Auto-grow the input as the user types across multiple lines, then let it
  // scroll once it reaches the max height (capped via CSS max-height).
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [input]);

  const sendMessage = useCallback(
    async (rawText: string) => {
      const text = rawText.trim();
      if (!text || isSendingRef.current) return;

      stopVoice();
      setInput("");
      inputRef.current = "";
      isSendingRef.current = true;
      setIsLoading(true);

      const userMessage: ChatMessage = { role: "user", content: text };
      const conversation = [...messagesRef.current, userMessage];
      messagesRef.current = conversation;
      setMessages(conversation);

      try {
        const { data } = await api.post<ChatResponse>("/chat", {
          messages: conversation.map(({ role, content }) => ({
            role,
            content,
          })),
        });

        console.log("data -------------------------------->", data);

        const nextMessages: ChatMessage[] = [
          ...conversation,
          {
            role: "assistant",
            content: data.reply,
            ...(data.flights ? { flights: data.flights } : {}),
            ...(data.flightFallback
              ? { flightFallback: data.flightFallback }
              : {}),
            ...(data.travelLinks?.length
              ? { travelLinks: data.travelLinks }
              : {}),
          },
        ];
        messagesRef.current = nextMessages;
        setMessages(nextMessages);
      } catch (error) {
        const message = getApiErrorMessage(
          error,
          "I couldn't reach the travel chat right now.",
        );

        const nextMessages: ChatMessage[] = [
          ...conversation,
          {
            role: "assistant",
            content: `${message} Please try again in a moment.`,
          },
        ];
        messagesRef.current = nextMessages;
        setMessages(nextMessages);
      } finally {
        isSendingRef.current = false;
        setIsLoading(false);
      }
    },
    [stopVoice],
  );

  useEffect(() => {
    sendMessageRef.current = sendMessage;
  }, [sendMessage]);

  useEffect(() => {
    if (!open) {
      sentInitialRef.current = null;
      return;
    }

    const query = initialQuery.trim();
    if (!query || sentInitialRef.current === query) return;

    sentInitialRef.current = query;
    sendMessage(query);
  }, [open, initialQuery, sendMessage]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await sendMessage(input);
  }

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

        <div className="flex flex-row flex-wrap gap-1.5 self-stretch">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt.label}
              type="button"
              disabled={isLoading}
              onClick={() => sendMessage(prompt.text)}
              className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-[#f26537] px-2 py-1 text-xs font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <TravelSuggestionSparkIcon height={18} width={18} theme="light" />
              {prompt.label}
            </button>
          ))}
        </div>

        {messages.map((message, index) =>
          message.role === "user" ? (
            <UserMessage
              key={`user-${index}-${message.content.slice(0, 24)}`}
              content={message.content}
            />
          ) : message.flights ? (
            <div
              key={`assistant-flights-${index}`}
              className="flex w-full lg:max-w-[80%] max-w-[90%] flex-col gap-2"
            >
              <FlightsOptionInSideChat {...message.flights} />
              {message.travelLinks?.length ? (
                <TravelResourceLinks
                  links={message.travelLinks}
                  className="px-1"
                />
              ) : null}
            </div>
          ) : (
            <AssistantMessage
              key={`assistant-${index}-${message.content.slice(0, 24)}`}
              content={message.content}
              flightFallback={message.flightFallback}
              travelLinks={message.travelLinks}
            />
          ),
        )}

        {isLoading && <TypingIndicator />}

        {isShowMapVIew && messages.length > 0 && <ChatHelp />}
      </div>

      <div className="flex shrink-0 flex-col gap-1.5 self-stretch">
        {voiceError ? (
          <p className="m-0 rounded-lg bg-red-50 px-[15px] py-1.5 text-xs text-red-600">
            {voiceError}
          </p>
        ) : null}

        <form
          onSubmit={handleSubmit}
          className="flex min-h-[45px] shrink-0 items-end gap-2 self-stretch rounded-[24px] bg-neutral-50 py-1 pl-[15px] pr-1"
        >
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => {
              if (listening) stopVoice();
              inputRef.current = e.target.value;
              setInput(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void sendMessage(input);
              }
            }}
            placeholder={
              listening ? "Listening… speak now" : "Type your question here"
            }
            disabled={isLoading}
            className="max-h-[120px] min-h-[28px] min-w-0 flex-1 resize-none overflow-y-auto border-0 bg-transparent py-[3px] text-sm leading-[22px] text-zinc-900 outline-none ring-0 placeholder:text-zinc-600 focus:ring-0 disabled:opacity-60"
            aria-label="Chat message"
          />
          {voiceSupported ? (
            <button
              type="button"
              onClick={toggleVoice}
              disabled={isLoading}
              className={`flex sm:size-[37px] size-[28px] shrink-0 items-center justify-center rounded-full transition disabled:cursor-not-allowed disabled:opacity-50 ${
                listening
                  ? "animate-pulse bg-red-500 text-white"
                  : "bg-white text-[#f26537] ring-1 ring-black/10 hover:bg-zinc-50"
              }`}
              aria-label={listening ? "Stop recording" : "Start voice input"}
              aria-pressed={listening}
              title={listening ? "Stop recording" : "Start voice input"}
            >
              {listening ? (
                <svg
                  className="sm:size-[16px] size-[13px]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
              ) : (
                <svg
                  className="sm:size-[18px] size-[14px]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 1.75a3.25 3.25 0 0 0-3.25 3.25v6a3.25 3.25 0 0 0 6.5 0v-6A3.25 3.25 0 0 0 12 1.75Z" />
                  <path d="M5 11a7 7 0 0 0 14 0M12 18v4" />
                </svg>
              )}
            </button>
          ) : null}
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
    </div>
  );
}
