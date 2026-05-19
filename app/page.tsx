"use client";

import { useState, type FormEvent } from "react";
import CustomItineraryModal from "@/components/CustomItineraryModal";

const travelSuggestions = [
  "Greek islands with few tourists",
  "Family road trip to National Parks in Utah",
  "Bachelorette party in Nashville",
];

const featureCards = [
  {
    color: "bg-blue-500",
    title: "Get Inspired",
    description:
      "Discover personalized destinations, unique experiences, and travel ideas tailored to your style.",
  },
  {
    color: "bg-orange-500",
    title: "Smart Price Check",
    description:
      "Compare real-time prices for flights, hotels, activities, and more — all in one place.",
  },
  {
    color: "bg-emerald-500",
    title: "One Smart Chat",
    description:
      "Plan and book your entire journey through a single seamless conversation.",
  },
  {
    color: "bg-violet-500",
    title: "Real-Time Travel Support",
    description:
      "Stay on track with live navigation, instant updates, local recommendations, and travel tips.",
  },
];

const languageBadgesLeft = [
  { label: "Ciao!", color: "#F26537", shadow: "rgba(242,101,55,0.25)" },
  {
    label: "Hola!",
    color: "#F2A437",
    shadow: "rgba(242,164,55,0.25)",
    indent: true,
  },
  {
    label: "Habari",
    color: "#D0F237",
    shadow: "rgba(208,242,55,0.25)",
    indent: true,
  },
  { label: "Привет", color: "#37F26F", shadow: "rgba(55,242,111,0.25)" },
];

const languageBadgesRight = [
  { label: "Hallo", color: "#37D0F2", shadow: "rgba(55,208,242,0.25)" },
  {
    label: "こんにちは",
    color: "#3763F2",
    shadow: "rgba(55,99,242,0.25)",
    indent: true,
  },
  {
    label: "你好",
    color: "#A737F2",
    shadow: "rgba(167,55,242,0.25)",
    indent: true,
  },
  { label: "Bonjour", color: "#F2374A", shadow: "rgba(242,55,74,0.25)" },
];

const askGeekCards = [
  {
    img: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80&auto=format&fit=crop",
    alt: "Seafood by the sea",
    text: "Treat yourself to gourmet seafood by the sea — discover elegant coastal restaurants known for fresh island flavors and unforgettable views.",
    layout: "lead",
    prompt:
      "Gourmet seafood by the sea and coastal restaurants with great views",
  },
  {
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80&auto=format&fit=crop",
    alt: "Tropical beach destination",
    text: "Discover dreamy destinations with clear blue waters and laid-back vibes.",
    layout: "quote",
    prompt: "Dreamy destinations with clear blue waters and laid-back vibes",
  },
  {
    img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80&auto=format&fit=crop",
    alt: "Cliffside coastal view",
    text: "Send me to stunning cliffside escapes around the world.",
    layout: "quote",
    prompt: "Stunning cliffside escapes around the world",
  },
  {
    img: "https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?w=800&q=80&auto=format&fit=crop",
    alt: "Hot air balloon adventure",
    text: "Ready for an adventure above it all? Discover amazing hot air balloon trips perfect for the whole family.",
    layout: "quote",
    prompt: "Hot air balloon trips for the whole family",
  },
];

const partnerLogos = [
  { src: "./images/discovery.svg", alt: "discovery" },
  { src: "./images/papajohns.svg", alt: "papajohns" },
  { src: "./images/disnep.svg", alt: "disnep" },
  { src: "./images/bbcworld.svg", alt: "bbcworld" },
  { src: "./images/google.svg", alt: "google" },
  { src: "./images/tata.svg", alt: "tata" },
];

const SparkleIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.6144 17.7956L11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916 0.821766 9.19319 0.821768 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C0.868537 9.26368 0.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899L19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z"
      fill="url(#sparkle_grad)"
    />
    <defs>
      <linearGradient
        id="sparkle_grad"
        x1="11.9995"
        y1="1.02051"
        x2="11.9995"
        y2="23.0005"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#F26537" />
        <stop offset="1" stopColor="#0F3A5D" />
      </linearGradient>
    </defs>
  </svg>
);

const SendIcon = () => (
  <svg
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
);

const FeatureIcon = () => (
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
);

const AskIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.6144 17.7956L11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916 0.821766 9.19319 0.821768 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C0.868537 9.26368 0.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899L19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z"
      fill="url(#ask_icon_grad)"
    />
    <defs>
      <linearGradient
        id="ask_icon_grad"
        x1="11.9995"
        y1="1.02051"
        x2="11.9995"
        y2="23.0005"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#F26537" />
        <stop offset="1" stopColor="#0F3A5D" />
      </linearGradient>
    </defs>
  </svg>
);

function LanguageBadge({
  label,
  color,
  shadow,
  indent = false,
  indentDir = "left",
}) {
  return (
    <span
      className={`relative block w-[145px] overflow-hidden rounded-full bg-zinc-900/90 backdrop-blur-sm border${indent ? (indentDir === "right" ? " ms-[70px]" : " me-[70px]") : ""}`}
      style={{ borderColor: color, boxShadow: `0 0 16px ${shadow}` }}
    >
      <span
        className="pointer-events-none absolute left-[-11px] top-[10.5px] h-[21px] w-[21px] rounded-full blur-[20.4px]"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />
      <span className="relative z-[1] flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-sm font-semibold text-white">
        <svg
          width="16"
          height="16"
          viewBox="0 0 18 18"
          fill="none"
          className="shrink-0"
        >
          <path
            d="M7.9608 13.3467L8.619 11.8391C9.20482 10.4975 10.2592 9.42945 11.5744 8.84565L13.3861 8.04143C13.9621 7.78575 13.9621 6.94776 13.3861 6.69208L11.6309 5.91296C10.2819 5.31414 9.20865 4.20661 8.63287 2.81921L7.96612 1.21255C7.7187 0.616324 6.89489 0.616326 6.64747 1.21255L5.9807 2.81919C5.40493 4.20661 4.33165 5.31414 2.98264 5.91296L1.22743 6.69208C0.651402 6.94776 0.651402 7.78575 1.22743 8.04143L3.03922 8.84565C4.35442 9.42945 5.40878 10.4975 5.99456 11.8391L6.6528 13.3467C6.90582 13.9262 7.70775 13.9262 7.9608 13.3467ZM14.551 17.0174L14.7361 16.5932C15.0661 15.8367 15.6605 15.2344 16.4021 14.9049L16.9724 14.6515C17.2809 14.5144 17.2809 14.0662 16.9724 13.9292L16.4341 13.6899C15.6733 13.352 15.0683 12.7274 14.7439 11.9452L14.5539 11.4867C14.4214 11.1672 13.9796 11.1672 13.8471 11.4867L13.657 11.9452C13.3327 12.7274 12.7277 13.352 11.967 13.6899L11.4286 13.9292C11.1202 14.0662 11.1202 14.5144 11.4286 14.6515L11.9989 14.9049C12.7405 15.2344 13.3348 15.8367 13.6648 16.5932L13.85 17.0174C13.9855 17.328 14.4155 17.328 14.551 17.0174Z"
            fill="white"
          />
        </svg>
        {label}
      </span>
    </span>
  );
}

export default function HomePage() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleOpenModal = (query = "") => {
    if (query) setSearchQuery(query);
    setIsOpen(true);
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleOpenModal(searchQuery);
  };

  return (
    <main className="flex-1">
      {/* Banner Section */}
      <section className="banner-section w-full relative">
        <div className="w-full min-h-[300px] aspect-[1728/586]">
          <img
            src="/images/banner.png"
            alt="banner"
            width={1728}
            height={586}
            fetchPriority="high"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="container absolute top-0 left-0 right-0 bottom-0 w-full h-full z-10 flex items-center justify-center">
          <div className="flex flex-col sm:w-full w-[90%] max-w-[813px] items-center justify-center lg:gap-7 md:gap-5 gap-2 text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl 2xl:text-7xl font-semibold leading-tight text-white">
              Your Personal Travel Expert, Anytime
            </h1>
            <p className="text-sm sm:text-base md:text-lg sm:font-medium font-light text-white lg:max-w-[550px] max-w-[400px] text-center mx-auto">
              Build smarter itineraries in minutes with real-time travel, stay,
              and experience updates.
            </p>
          </div>
        </div>
      </section>

      {/* Features / Search Section */}
      <section className="features-section w-full sm:-mt-10 -mt-5 relative z-10 pb-[clamp(0px,4vw,100px)]">
        <div className="container">
          <div className="w-full max-w-[850px] mx-auto">
            <div className="w-full py-2.5 relative flex">
              {/* Left curved corner */}
              <svg
                className="sm:min-w-[68px] min-w-[48px] sm:h-[41px] h-[21px] -mt-2.5 -me-[24px]"
                viewBox="0 0 68 41"
                fill="none"
              >
                <path
                  d="M68 0C29.5 1.5 30 40.4258 0 40.9258H68V0Z"
                  fill="white"
                />
              </svg>

              <form
                className="relative z-20 mx-auto flex min-h-[53px] w-full max-w-[800px] flex-1 items-center gap-2 rounded-[60px] border border-solid border-black/10 bg-[var(--bg-background-muted,#f4f4f5)] py-1.5 pl-[15px] pr-1.5 shadow-[0_2px_5px_rgba(0,0,0,0.10)]"
                onSubmit={handleFormSubmit}
                role="search"
              >
                <div className="flex min-w-0 flex-1 items-center gap-2.5">
                  <span
                    className="inline-flex size-6 shrink-0"
                    aria-hidden="true"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M10.6144 17.7956L11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916 0.821766 9.19319 0.821768 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C0.868537 9.26368 0.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899L19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z"
                        fill="url(#search_sparkle)"
                      />
                      <defs>
                        <linearGradient
                          id="search_sparkle"
                          x1="11.9995"
                          y1="1.02051"
                          x2="11.9995"
                          y2="23.0005"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#F26537" />
                          <stop offset="1" stopColor="#0F3A5D" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </span>
                  <input
                    id="travel-prompt"
                    type="text"
                    name="q"
                    inputMode="search"
                    autoComplete="off"
                    placeholder="Ask me anything about travel!"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="min-h-[38px] min-w-0 flex-1 border-0 bg-transparent text-sm font-normal text-zinc-900 outline-none ring-0 placeholder:text-zinc-600 focus:ring-0"
                  />
                </div>
                <button
                  type="submit"
                  onClick={() => handleOpenModal(searchQuery)}
                  className="inline-flex sm:size-[43px] size-[31px] shrink-0 items-center justify-center rounded-full bg-[#f26537] text-white transition-opacity hover:opacity-90"
                  aria-label="Open custom itinerary"
                >
                  <SendIcon />
                </button>
              </form>

              {/* White fill for curved corners */}
              <div
                className="pointer-events-none absolute sm:inset-x-[68px] inset-x-[40px] top-0 z-0 flex justify-center"
                aria-hidden="true"
              >
                <div className="h-10 w-full max-w-[800px] bg-white" />
              </div>

              {/* Right curved corner */}
              <svg
                className="sm:min-w-[66px] min-w-[48px] sm:h-[41px] h-[21px] -mt-2.5 -ms-[24px]"
                viewBox="0 0 68 41"
                fill="none"
              >
                <path
                  d="M0 0C38.5 1.5 38 40.4258 68 40.9258H0V0Z"
                  fill="white"
                />
              </svg>
            </div>
          </div>

          {/* Suggestion Chips */}
          <div
            className="mt-2.5 md:mb-[clamp(20px,4vw,48px)] flex w-full min-w-0 justify-center overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-0"
            id="travel-suggestions"
            role="group"
            aria-label="Suggested searches"
          >
            <div className="inline-flex max-w-full flex-nowrap items-center gap-x-[15px] py-0.5">
              {travelSuggestions.map((suggestion, i) => (
                <button
                  key={i}
                  type="button"
                  className="inline-flex shrink-0 cursor-pointer items-center gap-[5px] rounded-2xl bg-zinc-100 px-2.5 py-2 text-left text-xs font-normal whitespace-nowrap text-zinc-600 transition-colors hover:bg-zinc-200"
                  onClick={() => handleOpenModal(suggestion)}
                >
                  <span
                    className="size-[18px] shrink-0 inline-flex items-center justify-center"
                    aria-hidden="true"
                  >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path
                        d="M7.9608 13.3467L8.619 11.8391C9.20482 10.4975 10.2592 9.42945 11.5744 8.84565L13.3861 8.04143C13.9621 7.78575 13.9621 6.94776 13.3861 6.69208L11.6309 5.91296C10.2819 5.31414 9.20865 4.20661 8.63287 2.81921L7.96612 1.21255C7.7187 0.616324 6.89489 0.616326 6.64747 1.21255L5.9807 2.81919C5.40493 4.20661 4.33165 5.31414 2.98264 5.91296L1.22743 6.69208C0.651402 6.94776 0.651402 7.78575 1.22743 8.04143L3.03922 8.84565C4.35442 9.42945 5.40878 10.4975 5.99456 11.8391L6.6528 13.3467C6.90582 13.9262 7.70775 13.9262 7.9608 13.3467ZM14.551 17.0174L14.7361 16.5932C15.0661 15.8367 15.6605 15.2344 16.4021 14.9049L16.9724 14.6515C17.2809 14.5144 17.2809 14.0662 16.9724 13.9292L16.4341 13.6899C15.6733 13.352 15.0683 12.7274 14.7439 11.9452L14.5539 11.4867C14.4214 11.1672 13.9796 11.1672 13.8471 11.4867L13.657 11.9452C13.3327 12.7274 12.7277 13.352 11.967 13.6899L11.4286 13.9292C11.1202 14.0662 11.1202 14.5144 11.4286 14.6515L11.9989 14.9049C12.7405 15.2344 13.3348 15.8367 13.6648 16.5932L13.85 17.0174C13.9855 17.328 14.4155 17.328 14.551 17.0174Z"
                        fill="#0F3A5D"
                      />
                    </svg>
                  </span>
                  <span>{suggestion}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Partner Logos */}
          <div className="md:flex hidden flex-wrap justify-center lg:gap-x-14 gap-x-10 gap-y-3">
            {partnerLogos.map((logo) => (
              <figure key={logo.alt}>
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="w-full h-full object-contain opacity-60"
                />
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Travel Smarter Section */}
      <section className="pt-[clamp(20px,5vw,60px)] lg:bg-[linear-gradient(0deg,#F4F4F5_0%,#FFFFFF_100%)]">
        <div className="container">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 sm:gap-14">
            <div className="order-2 sm:order-1 lg:col-span-8 sm:flex">
              <div className="flex w-full flex-col sm:gap-5 gap-2 lg:max-w-[555px] xl:py-[60px] lg:py-[20px]">
                <h2 className="text-balance text-xl sm:text-2xl md:text-3xl xl:text-4xl font-semibold leading-tight">
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

      {/* Everything You Need Section */}
      <section className="relative overflow-hidden py-[clamp(40px,5vw,100px)]">
        <div className="container relative">
          {/* Blur decorations */}
          <div
            className="pointer-events-none absolute -left-[12%] bottom-[8%] top-auto z-0 h-[clamp(240px,42vw,440px)] w-[clamp(240px,42vw,440px)] rounded-full bg-blue-500/35 blur-[80px] sm:-left-[8%] sm:blur-[110px] lg:bottom-auto lg:top-[5%] lg:blur-[130px] opacity-50"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -right-[12%] top-[5%] z-0 h-[clamp(240px,42vw,440px)] w-[clamp(240px,42vw,440px)] rounded-full bg-orange-500/35 blur-[80px] sm:-right-[8%] sm:blur-[110px] lg:blur-[130px] opacity-50"
            aria-hidden="true"
          />

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
              {featureCards.map((card) => (
                <div
                  key={card.title}
                  className="flex flex-col items-center sm:gap-[30px] gap-[14px] text-center"
                >
                  <div
                    className={`flex size-[57px] shrink-0 items-center justify-center rounded-[20px] ${card.color} text-white`}
                  >
                    <FeatureIcon />
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <h3 className="text-lg sm:text-xl font-semibold">
                      {card.title}
                    </h3>
                    <p className="text-sm font-normal leading-relaxed text-zinc-600">
                      {card.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Chat in Any Language Section */}
      <section className="relative">
        <div className="container-fluid">
          <div className="relative overflow-hidden rounded-[30px] lg:min-h-[650px] flex items-center justify-center bg-black bg-[url('/images/chat-in-any.png')] bg-cover bg-center px-4 py-[clamp(40px,5vw,100px)] lg:px-[clamp(16px,4vw,100px)]">
            <div className="flex items-center justify-center gap-10">
              {/* Left badges */}
              <div className="hidden lg:block flex-1" aria-hidden="true">
                <div className="flex flex-col gap-10 items-end">
                  {languageBadgesLeft.map((b) => (
                    <LanguageBadge key={b.label} {...b} indentDir="left" />
                  ))}
                </div>
              </div>

              {/* Center content */}
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
                  <SparkleIcon />
                  Say Hi!
                </button>
              </div>

              {/* Right badges */}
              <div className="hidden lg:block flex-1" aria-hidden="true">
                <div className="flex flex-col gap-10">
                  {languageBadgesRight.map((b) => (
                    <LanguageBadge key={b.label} {...b} indentDir="right" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ask My Travel Geek Section */}
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
              {askGeekCards.map((card) => {
                const isLead = card.layout === "lead";
                const isQuote = card.layout === "quote";
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
                    <div
                      className={`flex flex-1 flex-col gap-[25px] p-5 ${!isLead ? "justify-between gap-6" : ""}`}
                    >
                      <p className="text-sm font-normal leading-relaxed text-zinc-600">
                        {isQuote ? <>&ldquo;{card.text}&rdquo;</> : card.text}
                      </p>
                      <div
                        className={`flex flex-col gap-2.5 ${isLead ? "mt-auto" : ""}`}
                      >
                        <button
                          type="button"
                          className="inline-flex w-fit cursor-pointer items-center justify-center gap-2.5 rounded-[10px] bg-white px-[15px] py-2.5 text-sm font-semibold text-[#282828] shadow-[0px_6px_10px_0px_rgba(0,0,0,0.1)] transition hover:shadow-md"
                          onClick={() => handleOpenModal(card.prompt)}
                        >
                          <AskIcon />
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

      {/* MyTravelGeek for Brands Section */}
      <section>
        <div className="container">
          <div
            className="rounded-[15px] px-4 py-[clamp(40px,5vw,130px)] bg-cover bg-center"
            style={{ backgroundImage: "url('/images/my-travel.png')" }}
          >
            <div className="max-w-[600px] mx-auto">
              <div className="flex w-full max-w-[732px] flex-col items-center gap-[15px] text-center">
                <h2 className="text-balance text-xl sm:text-2xl md:text-3xl xl:text-4xl font-semibold text-white">
                  MyTravelGeek for Brands
                </h2>
                <p className="text-sm text-white">
                  We are the AI backbone of the travel industry. Build and
                  launch your own customized AI agents based on your brand,
                  content, data and partnerships.
                </p>
                <button className="btn btn-secondary w-[132px]">
                  Learn more
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Itinerary Modal */}
      <CustomItineraryModal open={isOpen} onClose={() => setIsOpen(false)} />
    </main>
  );
}
