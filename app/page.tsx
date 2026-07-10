"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import Image from "next/image";
import MainTravelGeekModal from "@/components/modals/MainTravelGeekModal";
import { trackHeroSearchSubmit } from "@/lib/analytics";
import { OPEN_CHAT_EVENT, type OpenChatDetail } from "@/lib/chat-modal";
import TravelSuggestionSparkIcon from "@/components/TravelSuggestionSparkIcon";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { DEFAULT_SILENCE_MS } from "@/components/utils/helpers";
import { MERCOR_REFERRAL_URL } from "@/lib/mercor";

const travelSuggestionData = [
  {
    prompt: "Best things to do in Sydney this weekend",
    icon: "🌆", // i want here icon of activity icon
  },
  {
    prompt: "Road trip from Sydney to the Blue Mountains",
    icon: "🚗",
  },
  {
    prompt: "Flight for Sydney to Brisbane this Monday for 2 adults",
    icon: "✈️",
  },
];

const askGeekCards = [
  {
    img: "https://images.unsplash.com/photo-1598948485421-33a1655d3c18?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Sydney Harbour at dusk",
    text: "Treat yourself to waterfront dining in Sydney — discover harbour-side restaurants with fresh seafood and iconic Opera House views.",
    layout: "lead",
    prompt: "Best waterfront restaurants and seafood in Sydney Harbour",
  },
  {
    img: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&q=80&auto=format&fit=crop",
    alt: "Bondi Beach Sydney",
    text: "Discover Sydney's best beaches — from Bondi to Manly, with laid-back coastal vibes and surf at every turn.",
    layout: "quote",
    prompt: "Best beaches in Sydney from Bondi to Manly",
  },
  {
    img: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&q=80&auto=format&fit=crop",
    alt: "Sydney Opera House",
    text: "See the best of Sydney — harbour cruises, Opera House tours, and hidden gems around Circular Quay.",
    layout: "quote",
    prompt: "Top things to do in Sydney around the harbour",
  },
  {
    img: "https://images.unsplash.com/photo-1566734904496-9309bb1798ae?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Brisbane River",
    text: "Discover the best of Brisbane — from the river to the city's hidden gems. Explore the city's best restaurants, bars, and attractions.",
    layout: "quote",
    prompt: "Best places to visit in Brisbane",
  },
];

const partnerLogos = [
  { src: "images/discovery.svg", alt: "discovery" },
  { src: "images/papajohns.svg", alt: "papajohns" },
  { src: "images/disnep.svg", alt: "disnep" },
  { src: "images/bbcworld.svg", alt: "bbcworld" },
  { src: "images/google.svg", alt: "google" },
  { src: "images/tata.svg", alt: "tata" },
];

export default function HomePage() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const searchQueryRef = useRef("");
  const submitSearchRef = useRef<(query: string) => void>(() => {});

  const {
    listening,
    supported: voiceSupported,
    error: voiceError,
    toggle: toggleVoice,
    stop: stopVoice,
  } = useVoiceInput({
    onTranscript: (text) => {
      searchQueryRef.current = text;
      setSearchQuery(text);
    },
    onSilence: () => {
      const text = searchQueryRef.current.trim();
      if (text) submitSearchRef.current(text);
    },
    silenceMs: DEFAULT_SILENCE_MS,
  });

  useEffect(() => {
    searchQueryRef.current = searchQuery;
  }, [searchQuery]);

  const submitSearch = useCallback(
    (query: string) => {
      const text = query.trim();
      if (!text) return;

      stopVoice();
      setSearchQuery(text);
      searchQueryRef.current = text;
      trackHeroSearchSubmit(text);
      setIsOpen(true);
    },
    [stopVoice],
  );

  useEffect(() => {
    submitSearchRef.current = submitSearch;
  }, [submitSearch]);

  // Auto-grow the search field across lines, then let it scroll once it hits
  // the max height (capped via CSS). Works the same on mobile and desktop.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [searchQuery]);

  const handleOpenModal = useCallback((query = "") => {
    if (query) {
      setSearchQuery(query);
      searchQueryRef.current = query;
    }
    setIsOpen(true);
  }, []);

  useEffect(() => {
    const onOpenChat = (event: Event) => {
      const query = (event as CustomEvent<OpenChatDetail>).detail?.query ?? "";
      handleOpenModal(query);
    };
    window.addEventListener(OPEN_CHAT_EVENT, onOpenChat);
    return () => window.removeEventListener(OPEN_CHAT_EVENT, onOpenChat);
  }, [handleOpenModal]);

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitSearch(searchQuery);
  };

  const scrollToHero = useCallback(() => {
    document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <main className="flex-1">
      <section
        id="hero"
        className="banner-section w-full relative scroll-mt-[70px]"
      >
        <div className="w-full min-h-[300px] aspect-[1728/586]">
          <Image
            src="/images/banner.png"
            alt="banner"
            width={1728}
            height={586}
            priority
            className="h-full w-full object-cover"
          />
        </div>
        <div className="container absolute top-0 left-0 right-0 bottom-0 w-full h-full z-10 flex items-center justify-center">
          <div className="flex flex-col sm:w-full w-[90%] max-w-[813px] items-center justify-center lg:gap-7 md:gap-5 gap-2 text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl 2xl:text-7xl font-semibold leading-tight text-white ">
              Your Personal Travel Expert, Anytime
            </h1>
            <p className="text-sm sm:text-base md:text-lg sm:font-medium font-light text-white lg:max-w-[550px] max-w-[400px] text-center mx-auto">
              Build smarter itineraries in minutes with real-time travel, stay,
              and experience updates.
            </p>
          </div>
        </div>
      </section>

      <section className="features-section w-full sm:-mt-10 -mt-5 relative z-10 pb-[clamp(0px,4vw,100px)]">
        <div className="container">
          <div className="w-full max-w-[850px] mx-auto">
            <div className="w-full py-2.5 relative flex">
              <svg
                className="sm:min-w-[68px] min-w-[48px] sm:h-[41px] h-[21px] -mt-2.5 -me-[24px]"
                viewBox="0 0 68 41"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M68 0C29.5 1.5 30 40.4258 0 40.9258H68V0Z"
                  fill="white"
                />
              </svg>

              <form
                className="relative z-20 mx-auto flex min-h-[53px] w-full max-w-[800px] flex-1 items-center gap-2 rounded-[28px] border border-solid border-black/10 bg-[var(--bg-background-muted)] py-1.5 pl-[15px] pr-1.5 shadow-[0_2px_5px_rgba(0,0,0,0.10)]"
                action="#"
                method="get"
                role="search"
                onSubmit={handleFormSubmit}
              >
                <div className="flex min-w-0 flex-1 items-center gap-2.5">
                  <span
                    className="inline-flex size-6 shrink-0 items-center justify-center"
                    aria-hidden="true"
                  >
                    <Image
                      src="/images/logo/icon-coloured.svg"
                      alt="logo"
                      width={24}
                      height={24}
                      className="h-full w-full object-contain"
                      style={{ width: "24px", height: "24px" }}
                    />
                  </span>
                  {/* <!-- <label className="sr-only" for="travel-prompt">Ask me anything about travel</label> --> */}
                  <textarea
                    id="travel-prompt"
                    ref={textareaRef}
                    name="q"
                    rows={1}
                    value={searchQuery}
                    onChange={(e) => {
                      if (listening) stopVoice();
                      searchQueryRef.current = e.target.value;
                      setSearchQuery(e.target.value);
                    }}
                    placeholder={
                      listening
                        ? "Listening… speak now"
                        : "Ask me anything about travel!"
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        e.currentTarget.form?.requestSubmit();
                      }
                    }}
                    enterKeyHint="search"
                    autoComplete="off"
                    className="max-h-[120px] min-h-[24px] min-w-0 flex-1 resize-none overflow-y-auto border-0 bg-transparent py-0 text-sm font-normal leading-6 text-zinc-900 outline-none ring-0 placeholder:text-zinc-600 focus:ring-0"
                  />
                </div>
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
                    aria-label={
                      listening ? "Stop recording" : "Start voice input"
                    }
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
                  className="inline-flex sm:size-[43px] size-[31px] shrink-0 items-center justify-center rounded-full bg-[#f26537] text-white transition-opacity hover:opacity-90"
                  aria-label="Send travel question"
                  aria-haspopup="dialog"
                  aria-controls="custom-itinerary-modal"
                >
                  <svg
                    className="sm:w-[24px] w-[18px] sm:h-[24px] h-[18px]"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
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

              <div
                className="pointer-events-none absolute sm:inset-x-[68px] inset-x-[40px] top-0 z-0 flex justify-center"
                aria-hidden="true"
              >
                <div className="h-10 w-full max-w-[800px] bg-white"></div>
              </div>
              <svg
                className="sm:min-w-[66px] min-w-[48px] sm:h-[41px] h-[21px] -mt-2.5 -ms-[24px]"
                viewBox="0 0 68 41"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 0C38.5 1.5 38 40.4258 68 40.9258H0V0Z"
                  fill="white"
                />
              </svg>
            </div>
          </div>
          {voiceError ? (
            <p className="mx-auto mt-2 max-w-[800px] rounded-lg bg-red-50 px-[15px] py-1.5 text-center text-xs text-red-600">
              {voiceError}
            </p>
          ) : null}

          <div
            className="mt-2.5 md:mb-[clamp(20px,4vw,48px)] flex w-full min-w-0 justify-center overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-0"
            id="travel-suggestions"
            role="group"
            aria-label="Suggested searches"
          >
            <div className="inline-flex max-w-full flex-nowrap items-center gap-x-[15px] py-0.5">
              {travelSuggestionData.map((suggestion, i) => (
                <button
                  key={suggestion.prompt}
                  type="button"
                  className="travel-suggestion-chip inline-flex shrink-0 cursor-pointer items-center gap-[5px] rounded-2xl bg-zinc-100 px-2.5 py-2 text-left text-xs font-normal whitespace-nowrap text-zinc-600 transition-colors hover:bg-zinc-200"
                  data-q={suggestion}
                  onClick={() => handleOpenModal(suggestion.prompt)}
                >
                  <span
                    className="inline-flex size-[18px] shrink-0 items-center justify-center"
                    aria-hidden="true"
                  >
                    <span className="text-sm">{suggestion.icon}</span>
                  </span>
                  <span>{suggestion.prompt as ReactNode}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="md:flex hidden flex-wrap justify-center lg:gap-x-14 gap-x-10 gap-y-3">
            {partnerLogos.map((logo) => (
              <figure key={logo.alt}>
                <img
                  src={`/${logo.src}`}
                  alt={logo.alt}
                  className="w-full h-full object-contain opacity-60"
                />
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="-mt-6 pt-[clamp(20px,5vw,60px)]">
        <div className="container">
          <div className="relative overflow-hidden rounded-[24px] bg-[#0B0B0F] shadow-[0_20px_60px_rgba(99,102,241,0.18)]">
            <div
              className="pointer-events-none absolute -right-20 -top-24 size-80 rounded-full bg-[#7C76FF]/30 blur-[100px]"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -bottom-24 -left-16 size-96 rounded-full bg-[#6366F1]/20 blur-[120px]"
              aria-hidden="true"
            />

            <div className="relative grid grid-cols-1 items-center gap-6 p-5 sm:gap-8 sm:p-8 lg:grid-cols-12 lg:gap-12 lg:p-14">
              <div className="flex flex-col gap-5 sm:gap-6 lg:col-span-7">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <h2 className="text-balance text-xl font-semibold leading-tight text-white sm:text-2xl md:text-3xl xl:text-[2.5rem]">
                      Find work from home jobs that fit your skills
                    </h2>
                    <img
                      src="https://work.mercor.com/icon.svg"
                      alt="Mercor"
                      width={56}
                      height={56}
                      className="size-12 shrink-0 sm:size-12 md:size-14 md:hidden flex"
                    />
                  </div>
                  <p className="max-w-xl text-sm leading-relaxed text-zinc-200 sm:text-base">
                    Discover remote roles with flexible hours, global companies,
                    and opportunities you can do from anywhere — no commute, no
                    office required.
                  </p>
                </div>

                <ul className="md:flex flex-col gap-2 sm:grid sm:grid-cols-3 sm:gap-2.5 hidden">
                  {[
                    "Work from home",
                    "Flexible schedules",
                    "Global hiring",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-sm text-zinc-100 backdrop-blur-sm"
                    >
                      <svg
                        className="size-4 shrink-0 text-[#C4C0FF]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col gap-3">
                  <a
                    href={MERCOR_REFERRAL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-[#7C76FF] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#7C76FF]/30 transition hover:bg-[#8B85FF] hover:shadow-[#7C76FF]/40 sm:w-auto"
                  >
                    Find remote jobs up to $100 per hour
                    <svg
                      className="size-4"
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
                  <p className="md:flex hidden text-sm text-zinc-300">
                    Click to browse work-from-home opportunities on Mercor.
                  </p>
                </div>
              </div>

              <div className="hidden lg:col-span-5 lg:block">
                <div className="relative mx-auto flex w-full max-w-md flex-col items-center gap-6 rounded-2xl border border-[#7C76FF]/30 bg-gradient-to-br from-[#22222e] via-[#18181f] to-[#12121a] p-8 sm:p-10">
                  <div className="flex size-24 items-center justify-center rounded-3xl bg-[#7C76FF]/15 ring-1 ring-[#7C76FF]/35">
                    <img
                      src="https://work.mercor.com/icon.svg"
                      alt=""
                      width={56}
                      height={56}
                      className="size-14"
                      aria-hidden
                    />
                  </div>

                  <div className="flex flex-col items-center gap-2 text-center">
                    <p className="text-lg font-semibold text-white">
                      Remote work, made simple
                    </p>
                    <p className="max-w-[260px] text-sm leading-relaxed text-zinc-200">
                      Get matched to companies hiring for remote and hybrid
                      roles across tech, ops, and more.
                    </p>
                  </div>

                  <div className="grid w-full grid-cols-3 gap-3 border-t border-white/15 pt-6">
                    {[
                      { label: "Location", value: "Anywhere" },
                      { label: "Type", value: "Remote" },
                      { label: "Apply", value: "Online" },
                    ].map((stat) => (
                      <div key={stat.label} className="text-center">
                        <p className="text-sm font-semibold text-[#C4C0FF] sm:text-base">
                          {stat.value}
                        </p>
                        <p className="text-xs text-zinc-300">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-[clamp(20px,5vw,60px)] lg:bg-[linear-gradient(0deg,#F4F4F5_0%,#FFFFFF_100%)]">
        <div className="container">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 sm:gap-14">
            <div className="order-2 sm:order-1 lg:col-span-8 sm:flex">
              <div className="flex w-full flex-col sm:gap-5 gap-2 lg:max-w-[555px] xl:py-[60px] lg:py-[20px]">
                <h2 className="text-balance text-xl sm:text-2xl md:text-3xl xl:text-4xl font-semibold leading-tight ">
                  Travel Smarter. Explore Better.
                </h2>
                <div className="flex flex-col gap-4 text-sm font-normal leading-relaxed text-zinc-600">
                  <p>
                    Welcome to My Travel Geek — your intelligent travel
                    companion built for modern explorers. We believe planning a
                    trip should feel exciting, not overwhelming. That's why we
                    created a platform that simplifies every step of your
                    journey with smart recommendations, real-time travel
                    insights, and personalized experiences.
                  </p>
                  <p>
                    Whether you're planning a quick getaway, a business trip, or
                    a multi-country adventure, My Travel Geek helps you discover
                    the best flights, stays, restaurants, and experiences — all
                    in one place.
                  </p>
                </div>
              </div>
            </div>

            <div className="order-1 sm:order-2 lg:col-span-4">
              <figure className="w-full h-full">
                <img
                  src="/images/vecteezy_young.png"
                  alt="young"
                  className="lg:w-full w-[70%] mx-auto h-full object-contain"
                />
              </figure>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-[clamp(40px,5vw,100px)]">
        <div className="container relative">
          <div
            className="pointer-events-none absolute -left-[12%] bottom-[8%] top-auto z-0 h-[clamp(240px,42vw,440px)] w-[clamp(240px,42vw,440px)] rounded-full bg-[#3B82F6]/35 blur-[80px] sm:-left-[8%] sm:blur-[110px] lg:bottom-auto lg:top-[5%] lg:blur-[130px] opacity-50"
            aria-hidden="true"
          ></div>
          <div
            className="pointer-events-none absolute -right-[12%] top-[5%] z-0 h-[clamp(240px,42vw,440px)] w-[clamp(240px,42vw,440px)] rounded-full bg-[#F97316]/35 blur-[80px] sm:-right-[8%] sm:blur-[110px] lg:blur-[130px] opacity-50"
            aria-hidden="true"
          ></div>

          <div className="relative z-10 mx-auto flex w-full max-w-[1360px] flex-col items-center gap-10 sm:gap-14">
            <div className="flex w-full max-w-[732px] flex-col items-center gap-[15px] text-center">
              <h2 className="text-balance text-xl sm:text-2xl md:text-3xl xl:text-4xl font-semibold">
                Everything You Need for Smarter Travel
              </h2>
              <p className="text-sm">
                Plan, compare, and manage every part of your journey with
                personalized recommendations and real-time travel assistance.
              </p>
            </div>
            <div className="grid w-full grid-cols-1 gap-10 self-stretch sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-5">
              <div className="flex flex-col items-center sm:gap-[30px] gap-[14px] text-center">
                <div className="flex size-[57px] shrink-0 items-center justify-center rounded-[20px] bg-blue-500 text-white">
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 30 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.5 17.5L26.25 3.75M26.25 3.75L3.74997 11.875C3.63029 11.9298 3.52887 12.0179 3.45777 12.1287C3.38667 12.2395 3.34888 12.3684 3.34888 12.5C3.34888 12.6316 3.38667 12.7605 3.45777 12.8713C3.52887 12.9821 3.63029 13.0702 3.74997 13.125L12.5 17.5L16.875 26.25C16.9298 26.3697 17.0179 26.4711 17.1287 26.5422C17.2394 26.6133 17.3683 26.6511 17.5 26.6511C17.6316 26.6511 17.7605 26.6133 17.8713 26.5422C17.9821 26.4711 18.0701 26.3697 18.125 26.25L26.25 3.75Z"
                      stroke="white"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="flex flex-col gap-2.5">
                  <h3 className="text-lg sm:text-xl font-semibold ">
                    Get Inspired
                  </h3>
                  <p className="text-sm font-normal leading-relaxed text-zinc-600">
                    Discover personalized destinations, unique experiences, and
                    travel ideas tailored to your style.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center sm:gap-[30px] gap-[14px] text-center">
                <div className="flex size-[57px] shrink-0 items-center justify-center rounded-[20px] bg-orange-500 text-white">
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 30 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.5 17.5L26.25 3.75M26.25 3.75L3.74997 11.875C3.63029 11.9298 3.52887 12.0179 3.45777 12.1287C3.38667 12.2395 3.34888 12.3684 3.34888 12.5C3.34888 12.6316 3.38667 12.7605 3.45777 12.8713C3.52887 12.9821 3.63029 13.0702 3.74997 13.125L12.5 17.5L16.875 26.25C16.9298 26.3697 17.0179 26.4711 17.1287 26.5422C17.2394 26.6133 17.3683 26.6511 17.5 26.6511C17.6316 26.6511 17.7605 26.6133 17.8713 26.5422C17.9821 26.4711 18.0701 26.3697 18.125 26.25L26.25 3.75Z"
                      stroke="white"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="flex flex-col gap-2.5">
                  <h3 className="text-lg sm:text-xl font-semibold ">
                    Smart Price Check
                  </h3>
                  <p className="text-sm font-normal leading-relaxed text-zinc-600">
                    Compare real-time prices for flights, hotels, activities,
                    and more — all in one place.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center sm:gap-[30px] gap-[14px] text-center">
                <div className="flex size-[57px] shrink-0 items-center justify-center rounded-[20px] bg-emerald-500 text-white">
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 30 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.5 17.5L26.25 3.75M26.25 3.75L3.74997 11.875C3.63029 11.9298 3.52887 12.0179 3.45777 12.1287C3.38667 12.2395 3.34888 12.3684 3.34888 12.5C3.34888 12.6316 3.38667 12.7605 3.45777 12.8713C3.52887 12.9821 3.63029 13.0702 3.74997 13.125L12.5 17.5L16.875 26.25C16.9298 26.3697 17.0179 26.4711 17.1287 26.5422C17.2394 26.6133 17.3683 26.6511 17.5 26.6511C17.6316 26.6511 17.7605 26.6133 17.8713 26.5422C17.9821 26.4711 18.0701 26.3697 18.125 26.25L26.25 3.75Z"
                      stroke="white"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="flex flex-col gap-2.5">
                  <h3 className="text-lg sm:text-xl font-semibold ">
                    One Smart Chat
                  </h3>
                  <p className="text-sm font-normal leading-relaxed text-zinc-600">
                    Plan and book your entire journey through a single seamless
                    conversation.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center sm:gap-[30px] gap-[14px] text-center">
                <div className="flex size-[57px] shrink-0 items-center justify-center rounded-[20px] bg-violet-500 text-white">
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 30 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.5 17.5L26.25 3.75M26.25 3.75L3.74997 11.875C3.63029 11.9298 3.52887 12.0179 3.45777 12.1287C3.38667 12.2395 3.34888 12.3684 3.34888 12.5C3.34888 12.6316 3.38667 12.7605 3.45777 12.8713C3.52887 12.9821 3.63029 13.0702 3.74997 13.125L12.5 17.5L16.875 26.25C16.9298 26.3697 17.0179 26.4711 17.1287 26.5422C17.2394 26.6133 17.3683 26.6511 17.5 26.6511C17.6316 26.6511 17.7605 26.6133 17.8713 26.5422C17.9821 26.4711 18.0701 26.3697 18.125 26.25L26.25 3.75Z"
                      stroke="white"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="flex flex-col gap-2.5">
                  <h3 className="text-lg sm:text-xl font-semibold ">
                    Real-Time Travel Support
                  </h3>
                  <p className="text-sm font-normal leading-relaxed text-zinc-600">
                    Stay on track with live navigation, instant updates, local
                    recommendations, and travel tips.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative">
        <div className="container-fluid">
          <div className="relative overflow-hidden rounded-[30px] lg:min-h-[650px] flex items-center justify-center bg-black bg-chat-in-any bg-cover bg-center px-4 py-[clamp(40px,5vw,100px)] lg:px-[clamp(16px,4vw,100px)]">
            <div className="flex items-center justify-center gap-10">
              <div className="hidden lg:block flex-1">
                <div
                  className="flex flex-col gap-10 items-end"
                  aria-hidden="true"
                >
                  <span className="relative block w-[145px] overflow-hidden rounded-full border border-[#F26537] bg-zinc-900/90 shadow-[0_0_16px_rgba(242,101,55,0.25)] backdrop-blur-sm">
                    <span
                      className="pointer-events-none absolute left-[-11px] top-[10.5px] h-[21px] w-[21px] rounded-full bg-[#F26537] blur-[20.4px]"
                      aria-hidden="true"
                    ></span>
                    <span className="relative z-[1] flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-sm font-semibold text-white">
                      <TravelSuggestionSparkIcon
                        height={18}
                        width={18}
                        theme="light"
                      />
                      Ciao!
                    </span>
                  </span>
                  <span className="relative me-[70px] block w-[145px] overflow-hidden rounded-full border border-[#F2A437] bg-zinc-900/90 shadow-[0_0_16px_rgba(242,164,55,0.25)] backdrop-blur-sm">
                    <span
                      className="pointer-events-none absolute left-[-11px] top-[10.5px] h-[21px] w-[21px] rounded-full bg-[#F2A437] blur-[20.4px]"
                      aria-hidden="true"
                    ></span>
                    <span className="relative z-[1] flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-sm font-semibold text-white">
                      <TravelSuggestionSparkIcon
                        height={18}
                        width={18}
                        theme="light"
                      />
                      Hola!
                    </span>
                  </span>
                  <span className="relative me-[70px] block w-[145px] overflow-hidden rounded-full border border-[#D0F237] bg-zinc-900/90 shadow-[0_0_16px_rgba(208,242,55,0.25)] backdrop-blur-sm">
                    <span
                      className="pointer-events-none absolute left-[-11px] top-[10.5px] h-[21px] w-[21px] rounded-full bg-[#D0F237] blur-[20.4px]"
                      aria-hidden="true"
                    ></span>
                    <span className="relative z-[1] flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-sm font-semibold text-white">
                      <TravelSuggestionSparkIcon
                        height={18}
                        width={18}
                        theme="light"
                      />
                      Habari
                    </span>
                  </span>
                  <span className="relative block w-[145px] overflow-hidden rounded-full border border-[#37F26F] bg-zinc-900/90 shadow-[0_0_16px_rgba(55,242,111,0.25)] backdrop-blur-sm">
                    <span
                      className="pointer-events-none absolute left-[-11px] top-[10.5px] h-[21px] w-[21px] rounded-full bg-[#37F26F] blur-[20.4px]"
                      aria-hidden="true"
                    ></span>
                    <span className="relative z-[1] flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-sm font-semibold text-white">
                      <TravelSuggestionSparkIcon
                        height={18}
                        width={18}
                        theme="light"
                      />
                      Привет
                    </span>
                  </span>
                </div>
              </div>

              <div className="relative z-10 mx-auto flex flex-col items-center gap-8 text-center max-w-[550px]">
                <div className="flex flex-col gap-4">
                  <h2 className="text-xl sm:text-3xl md:text-4xl xl:text-5xl font-semibold text-white">
                    Chat in any language, anytime, anywhere.
                  </h2>
                  <p className="text-pretty text-sm leading-relaxed text-white sm:text-base md:max-w-xl md:mx-auto">
                    Plan, compare, and manage every part of your journey with
                    personalized recommendations and real-time travel
                    assistance.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenModal("")}
                  className="inline-flex h-10 items-center gap-2.5 rounded-full bg-white px-5 text-sm font-semibold text-zinc-800 shadow-sm transition hover:bg-zinc-100"
                >
                  <TravelSuggestionSparkIcon
                    height={24}
                    width={24}
                    theme="dark"
                  />
                  <span className="text-sm font-semibold text-zinc-800">
                    Say Hi!
                  </span>
                </button>
              </div>
              <div className="hidden lg:block flex-1">
                <div className="flex flex-col gap-10" aria-hidden="true">
                  <span className="relative block w-[145px] overflow-hidden rounded-full border border-[#37D0F2] bg-zinc-900/90 shadow-[0_0_16px_rgba(55,208,242,0.25)] backdrop-blur-sm">
                    <span
                      className="pointer-events-none absolute left-[-11px] top-[10.5px] h-[21px] w-[21px] rounded-full bg-[#37D0F2] blur-[20.4px]"
                      aria-hidden="true"
                    ></span>
                    <span className="relative z-[1] flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-sm font-semibold text-white">
                      <TravelSuggestionSparkIcon
                        height={18}
                        width={18}
                        theme="light"
                      />
                      Hallo
                    </span>
                  </span>
                  <span className="relative ms-[70px] block w-[145px] overflow-hidden rounded-full border border-[#3763F2] bg-zinc-900/90 shadow-[0_0_16px_rgba(55,99,242,0.25)] backdrop-blur-sm">
                    <span
                      className="pointer-events-none absolute left-[-11px] top-[10.5px] h-[21px] w-[21px] rounded-full bg-[#3763F2] blur-[20.4px]"
                      aria-hidden="true"
                    ></span>
                    <span className="relative z-[1] flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-sm font-semibold text-white">
                      <TravelSuggestionSparkIcon
                        height={18}
                        width={18}
                        theme="light"
                      />
                      こんにちは
                    </span>
                  </span>
                  <span className="relative ms-[70px] block w-[145px] overflow-hidden rounded-full border border-[#A737F2] bg-zinc-900/90 shadow-[0_0_16px_rgba(167,55,242,0.25)] backdrop-blur-sm">
                    <span
                      className="pointer-events-none absolute left-[-11px] top-[10.5px] h-[21px] w-[21px] rounded-full bg-[#A737F2] blur-[20.4px]"
                      aria-hidden="true"
                    ></span>
                    <span className="relative z-[1] flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-sm font-semibold text-white">
                      <TravelSuggestionSparkIcon
                        height={18}
                        width={18}
                        theme="light"
                      />
                      你好
                    </span>
                  </span>
                  <span className="relative block w-[145px] overflow-hidden rounded-full border border-[#F2374A] bg-zinc-900/90 shadow-[0_0_16px_rgba(242,55,74,0.25)] backdrop-blur-sm">
                    <span
                      className="pointer-events-none absolute left-[-11px] top-[10.5px] h-[21px] w-[21px] rounded-full bg-[#F2374A] blur-[20.4px]"
                      aria-hidden="true"
                    ></span>
                    <span className="relative z-[1] flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-sm font-semibold text-white">
                      <TravelSuggestionSparkIcon
                        height={18}
                        width={18}
                        theme="light"
                      />
                      Bonjour
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-[clamp(40px,5vw,100px)]">
        <div className="container">
          <div className="relative z-10 mx-auto flex w-full max-w-[1360px] flex-col items-center gap-[30px] sm:gap-10 md:gap-14">
            <div className="flex w-full max-w-[732px] flex-col items-center gap-[15px] text-center">
              <h2 className="text-balance text-xl sm:text-2xl md:text-3xl xl:text-4xl font-semibold">
                Ask My Travel Geek
              </h2>
              <p className="text-sm">
                Plan, compare, and manage every part of your journey with
                personalized recommendations and real-time travel assistance.
              </p>
            </div>

            <div className="grid w-full max-w-[1360px] grid-cols-1 justify-center gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {askGeekCards.map((card, i) => {
                const isLead = card.layout === "lead";
                const isQuote = card.layout === "quote";
                const prompt = card.prompt ?? card.text;
                const bodyClass = isLead
                  ? "flex flex-1 flex-col gap-[25px] p-5"
                  : "flex flex-1 flex-col justify-between gap-6 p-5";
                const footerClass = isLead
                  ? "mt-auto flex flex-col gap-2.5"
                  : "flex flex-col gap-2.5";
                return (
                  <article
                    key={card.alt}
                    className="flex min-w-0 flex-col overflow-hidden rounded-[20px] bg-neutral-50 shadow-sm ring-1 ring-black/5"
                  >
                    <img
                      src={card.img}
                      alt={card.alt}
                      width={800}
                      height={217}
                      loading="lazy"
                      decoding="async"
                      className="sm:h-[217px] h-[250px] w-full shrink-0 object-cover"
                    />
                    <div className={bodyClass}>
                      <p className="text-sm font-normal leading-relaxed text-zinc-600">
                        {isQuote ? <>&ldquo;{card.text}&rdquo;</> : card.text}
                      </p>
                      <div className={footerClass}>
                        <button
                          type="button"
                          className="ask-card-prompt inline-flex w-fit cursor-pointer items-center justify-center gap-2.5 rounded-[10px] bg-white px-[15px] py-2.5 text-sm font-semibold text-[#282828] shadow-[0px_6px_10px_0px_rgba(0,0,0,0.1)] transition"
                          data-q={prompt}
                          onClick={() => handleOpenModal(prompt)}
                        >
                          <TravelSuggestionSparkIcon
                            height={18}
                            width={18}
                            theme="dark"
                          />
                          Ask
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-[clamp(48px,6vw,100px)]">
        <div className="container">
          <div className="relative min-h-[min(320px,50vw)] overflow-hidden rounded-[15px] px-6 py-[clamp(48px,6vw,130px)] sm:min-h-[360px] sm:px-10">
            <Image
              src="/images/my-travel.png"
              alt=""
              fill
              priority={false}
              sizes="(max-width: 1280px) 100vw, 1200px"
              className="object-cover object-center"
              aria-hidden
            />
            <div
              className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/15 to-black/45"
              aria-hidden
            />
            <div className="relative z-10 mx-auto max-w-[600px]">
              <div className="mx-auto flex w-full max-w-[732px] flex-col items-center gap-[15px] text-center">
                <h2 className="text-balance text-xl font-semibold text-white drop-shadow-md sm:text-2xl md:text-3xl xl:text-4xl">
                  MyTravelGeek for Brands
                </h2>
                <p className="max-w-[520px] text-sm leading-relaxed text-white drop-shadow-sm sm:text-base">
                  We are the AI backbone of the travel industry. Build and
                  launch your own customized AI agents based on your brand,
                  content, data and partnerships.
                </p>
                <button
                  type="button"
                  onClick={scrollToHero}
                  className="btn btn-secondary mt-1 w-[132px] shadow-md"
                >
                  Learn more
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MainTravelGeekModal
        open={isOpen}
        initialQuery={searchQuery}
        onOpen={() => setIsOpen(true)}
        onClose={() => setIsOpen(false)}
      />
    </main>
  );
}
