"use client";

import React, { useState, useRef, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type SidebarView = "compose" | "history" | "favorites";
type FavoriteFilter = "all" | "places" | "hotels" | "flights";
type VenueTab = "overview" | "location" | "reviews";

interface Venue {
  name: string;
  category: string;
  hours: string;
  image: string;
}

interface Tour {
  title: string;
  duration: string;
  description: string;
  price: string;
  image: string;
}

interface Favorite {
  title: string;
  subtitle: string;
  category: FavoriteFilter | "hotels" | "places" | "flights";
  rating: boolean;
  image: string;
}

interface Review {
  author: string;
  time: string;
  text: string;
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const VENUES: Venue[] = [
  {
    name: "The Dead Rabbit",
    category: "Bar $$",
    hours: "Opens at 11:00 AM",
    image: "/images/banner.png",
  },
  {
    name: "The Malt House",
    category: "American Restaurant $$",
    hours: "Opens at 11:00 AM",
    image: "/images/banner.png",
  },
];

const VENUE_DESCRIPTION =
  "A two-story Irish bar in the Financial District that's equal parts history and hospitality. Downstairs, the Taproom buzzes with energy and perfect pints of Gu";

const TOURS: Tour[] = [
  {
    title: "NYC: Central Park Bike Rental",
    duration: "1 hr",
    description:
      "Cycle through Central Park with a bike rental just steps away. Enjoy a helmet, lock, map, and flexible options to explore NYC your way.",
    price: "406",
    image: "/images/banner.png",
  },
  {
    title: "NYC: Intrepid Museum Entry Ticket",
    duration: "1 hr",
    description:
      "Cycle through Central Park with a bike rental just steps away. Enjoy a helmet, lock, map, and flexible options to explore NYC your way.",
    price: "406",
    image: "/images/banner.png",
  },
];

const FAVORITES: Favorite[] = [
  {
    title: "The Whitby Hotel",
    subtitle: "Bar $$ | Opens at 11:00 AM",
    category: "hotels",
    rating: true,
    image: "/images/banner.png",
  },
  {
    title: "The Whitby Hotel",
    subtitle: "Bar $$ | Opens at 11:00 AM",
    category: "hotels",
    rating: true,
    image: "/images/banner.png",
  },
  {
    title: "The Whitby Hotel",
    subtitle: "Bar $$ | Opens at 11:00 AM",
    category: "places",
    rating: true,
    image: "/images/banner.png",
  },
  {
    title: "North Korea",
    subtitle: "Country",
    category: "places",
    rating: true,
    image: "/images/banner.png",
  },
  {
    title: "North Korea",
    subtitle: "Country",
    category: "places",
    rating: true,
    image: "/images/banner.png",
  },
  {
    title: "New York",
    subtitle: "Country",
    category: "places",
    rating: true,
    image: "/images/banner.png",
  },
];

const VENUE_SCHEDULE = [
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
];

const RATING_BARS = [
  { label: "5 star", count: "100", width: "80%" },
  { label: "4 star", count: "500", width: "49%" },
  { label: "3 star", count: "10", width: "36%" },
  { label: "2 star", count: "20", width: "5%" },
  { label: "1 star", count: "5", width: "11%" },
];

const VENUE_REVIEWS: Review[] = [
  {
    author: "Anonymous User",
    time: "4 months ago",
    text: "wow, what can I say!? One of the best bars in New York visiting from Nashville! Met Philly and within five minutes felt like I had known her forever. The best customer service I've ever had in a bar. 5 STARS",
  },
  {
    author: "Michael Bruno",
    time: "4 months ago",
    text: "Stopped in for a drink after walking Brooklyn Bridge and I would recommend everyone else to do the same.",
  },
  {
    author: "Anonymous User",
    time: "4 months ago",
    text: "wow, what can I say!? One of the best bars in New York visiting from Nashville! Met Philly and within five minutes felt like I had known her forever and she's already invited to my wedding so special. The best customer service I've ever had in a bar. 5 STARS",
  },
];

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const SparkIcon = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.6144 17.7956L11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916 0.821766 9.19319 0.821768 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C0.868537 9.26368 0.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899L19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z"
      fill="url(#spark_gradient)"
    />
    <defs>
      <linearGradient
        id="spark_gradient"
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

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M18 6L6 18M6 6L18 18"
      stroke="#374151"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const HeartIcon = ({
  filled = false,
  white = false,
}: {
  filled?: boolean;
  white?: boolean;
}) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M13 8.38145L8 13.3335L3 8.38145C2.6702 8.06053 2.41043 7.67479 2.23703 7.24854C2.06363 6.82229 1.98037 6.36475 1.99249 5.90474C2.00461 5.44473 2.11184 4.99221 2.30744 4.57568C2.50303 4.15914 2.78275 3.78762 3.12899 3.4845C3.47522 3.18139 3.88047 2.95324 4.3192 2.81444C4.75794 2.67563 5.22067 2.62917 5.67824 2.67799C6.13582 2.7268 6.57833 2.86982 6.97791 3.09806C7.3775 3.32629 7.7255 3.63478 8 4.00412C8.27569 3.63747 8.62409 3.33166 9.0234 3.10585C9.42271 2.88004 9.86433 2.73908 10.3206 2.6918C10.7769 2.64451 11.2381 2.69192 11.6752 2.83105C12.1123 2.97017 12.516 3.19803 12.861 3.50036C13.206 3.80269 13.4849 4.17297 13.6803 4.58805C13.8756 5.00312 13.9832 5.45404 13.9962 5.91259C14.0092 6.37114 13.9275 6.82745 13.756 7.25295C13.5847 7.67846 13.3273 8.064 13 8.38545"
      stroke={white ? "white" : filled ? "none" : "#374151"}
      fill={filled ? (white ? "white" : "#DC2626") : "none"}
      strokeWidth="0.933333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const StarFilledIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
    <path
      d="M7.00015 10.3543L3.39982 12.2472L4.08757 8.23797L1.1709 5.39889L5.1959 4.81555L6.99606 1.16797L8.79623 4.81555L12.8212 5.39889L9.90456 8.23797L10.5923 12.2472L7.00015 10.3543Z"
      fill="white"
    />
  </svg>
);

const PlaneIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M33.8737 1.125H33.2498C33.1871 1.12502 33.1254 1.14076 33.0703 1.17077C33.0153 1.20078 32.9687 1.24412 32.9347 1.29681C32.9007 1.3495 32.8805 1.40986 32.8759 1.47238C32.8713 1.5349 32.8824 1.59758 32.9083 1.65469L34.4191 4.98867L32.1505 5.03906L31.3232 4.03664C31.1655 3.83836 31.0396 3.75 30.7185 3.75H30.2985C30.232 3.74786 30.166 3.76178 30.106 3.79059C30.046 3.81939 29.9939 3.86223 29.954 3.91547C29.8982 3.9907 29.8434 4.1182 29.8968 4.30008L30.3613 5.96414C30.3648 5.97656 30.3691 5.98898 30.3737 6.00117C30.374 6.00233 30.374 6.00353 30.3737 6.00469C30.3689 6.01687 30.3648 6.02931 30.3613 6.04195L29.8963 7.71656C29.8459 7.89492 29.901 8.01961 29.9563 8.09297C29.9935 8.14225 30.0417 8.18214 30.097 8.20941C30.1524 8.23668 30.2134 8.25058 30.2751 8.25H30.7185C30.9583 8.25 31.191 8.14242 31.3279 7.96875L32.1381 6.9832L34.4191 7.01695L32.9087 10.3451C32.8828 10.4022 32.8717 10.4648 32.8762 10.5273C32.8808 10.5899 32.901 10.6502 32.9349 10.7029C32.9688 10.7556 33.0154 10.799 33.0704 10.8291C33.1254 10.8591 33.1871 10.8749 33.2498 10.875H33.8805C33.9685 10.8732 34.0549 10.8517 34.1334 10.8119C34.2119 10.7721 34.2805 10.7152 34.334 10.6453L37.2648 7.08281L38.6188 7.11844C38.718 7.12383 38.9927 7.1257 39.0562 7.1257C40.3513 7.125 41.1248 6.70453 41.1248 6C41.1248 5.77828 41.0362 5.36719 40.4434 5.10563C40.0935 4.95094 39.6266 4.87266 39.0557 4.87266C38.9929 4.87266 38.7189 4.87453 38.6184 4.87992L37.2646 4.91602L34.3265 1.35352C34.2729 1.28394 34.2045 1.22728 34.1261 1.18772C34.0477 1.14817 33.9614 1.12673 33.8737 1.125Z"
      fill="#D1D5DB"
    />
  </svg>
);

const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M9.99995 14L20.9999 3M20.9999 3L2.99995 9.5C2.90421 9.54387 2.82307 9.61431 2.76619 9.70295C2.70931 9.79158 2.67908 9.89468 2.67908 10C2.67908 10.1053 2.70931 10.2084 2.76619 10.2971C2.82307 10.3857 2.90421 10.4561 2.99995 10.5L9.99995 14L13.4999 21C13.5438 21.0957 13.6143 21.1769 13.7029 21.2338C13.7915 21.2906 13.8946 21.3209 13.9999 21.3209C14.1053 21.3209 14.2084 21.2906 14.297 21.2338C14.3856 21.1769 14.4561 21.0957 14.4999 21L20.9999 3Z"
      stroke="white"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const BackIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M15 6L9 12L15 18"
      stroke="#374151"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MapPinIcon = ({ orange = false }: { orange?: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M9 11.0002C9 11.7958 9.31607 12.5589 9.87868 13.1215C10.4413 13.6841 11.2044 14.0002 12 14.0002C12.7956 14.0002 13.5587 13.6841 14.1213 13.1215C14.6839 12.5589 15 11.7958 15 11.0002C15 10.2045 14.6839 9.44149 14.1213 8.87888C13.5587 8.31627 12.7956 8.0002 12 8.0002C11.2044 8.0002 10.4413 8.31627 9.87868 8.87888C9.31607 9.44149 9 10.2045 9 11.0002Z"
      stroke={orange ? "#F26537" : "#374151"}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17.657 16.6572L13.414 20.9002C13.039 21.2748 12.5306 21.4853 12.0005 21.4853C11.4704 21.4853 10.962 21.2748 10.587 20.9002L6.343 16.6572C5.22422 15.5384 4.46234 14.1129 4.15369 12.5611C3.84504 11.0092 4.00349 9.40071 4.60901 7.93893C5.21452 6.47714 6.2399 5.22774 7.55548 4.3487C8.87107 3.46967 10.4178 3.00049 12 3.00049C13.5822 3.00049 15.1289 3.46967 16.4445 4.3487C17.7601 5.22774 18.7855 6.47714 19.391 7.93893C19.9965 9.40071 20.155 11.0092 19.8463 12.5611C19.5377 14.1129 18.7758 15.5384 17.657 16.6572Z"
      stroke={orange ? "#F26537" : "#374151"}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ClockIcon = ({ orange = false }: { orange?: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 7V12L15 15M3 12C3 13.1819 3.23279 14.3522 3.68508 15.4442C4.13738 16.5361 4.80031 17.5282 5.63604 18.364C6.47177 19.1997 7.46392 19.8626 8.55585 20.3149C9.64778 20.7672 10.8181 21 12 21C13.1819 21 14.3522 20.7672 15.4442 20.3149C16.5361 19.8626 17.5282 19.1997 18.364 18.364C19.1997 17.5282 19.8626 16.5361 20.3149 15.4442C20.7672 14.3522 21 13.1819 21 12C21 9.61305 20.0518 7.32387 18.364 5.63604C16.6761 3.94821 14.3869 3 12 3C9.61305 3 7.32387 3.94821 5.63604 5.63604C3.94821 7.32387 3 9.61305 3 12Z"
      stroke={orange ? "#F26537" : "#374151"}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const GlobeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M3.6 9H20.4M3.6 15H20.4M11.5 3C9.81534 5.69961 8.9222 8.81787 8.9222 12C8.9222 15.1821 9.81534 18.3004 11.5 21M12.5 3C14.1847 5.69961 15.0778 8.81787 15.0778 12C15.0778 15.1821 14.1847 18.3004 12.5 21M3 12C3 13.1819 3.23279 14.3522 3.68508 15.4442C4.13738 16.5361 4.80031 17.5282 5.63604 18.364C6.47177 19.1997 7.46392 19.8626 8.55585 20.3149C9.64778 20.7672 10.8181 21 12 21C13.1819 21 14.3522 20.7672 15.4442 20.3149C16.5361 19.8626 17.5282 19.1997 18.364 18.364C19.1997 17.5282 19.8626 16.5361 20.3149 15.4442C20.7672 14.3522 21 13.1819 21 12C21 9.61305 20.0518 7.32387 18.364 5.63604C16.6761 3.94821 14.3869 3 12 3C9.61305 3 7.32387 3.94821 5.63604 5.63604C3.94821 7.32387 3 9.61305 3 12Z"
      stroke="#F26537"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PhoneIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M5 4H9L11 9L8.5 10.5C9.57096 12.6715 11.3285 14.429 13.5 15.5L15 13L20 15V19C20 19.5304 19.7893 20.0391 19.4142 20.4142C19.0391 20.7893 18.5304 21 18 21C14.0993 20.763 10.4202 19.1065 7.65683 16.3432C4.8935 13.5798 3.23705 9.90074 3 6C3 5.46957 3.21071 4.96086 3.58579 4.58579C3.96086 4.21071 4.46957 4 5 4Z"
      stroke="#F26537"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ─── Sub-components ───────────────────────────────────────────────────────────

const FlightRouteArrow = () => (
  <svg width="70" height="12" viewBox="0 0 70 12" fill="none">
    <line y1="6" x2="70" y2="6" stroke="#E5E7EB" strokeDasharray="3 3" />
    <path
      d="M33.8737 1.125H33.2498C33.1871 1.12502 33.1254 1.14076 33.0703 1.17077C33.0153 1.20078 32.9687 1.24412 32.9347 1.29681C32.9007 1.3495 32.8805 1.40986 32.8759 1.47238C32.8713 1.5349 32.8824 1.59758 32.9083 1.65469L34.4191 4.98867L32.1505 5.03906L31.3232 4.03664C31.1655 3.83836 31.0396 3.75 30.7185 3.75H30.2985C30.232 3.74786 30.166 3.76178 30.106 3.79059C30.046 3.81939 29.9939 3.86223 29.954 3.91547C29.8982 3.9907 29.8434 4.1182 29.8968 4.30008L30.3613 5.96414C30.3648 5.97656 30.3691 5.98898 30.3737 6.00117C30.374 6.00233 30.374 6.00353 30.3737 6.00469C30.3689 6.01687 30.3648 6.02931 30.3613 6.04195L29.8963 7.71656C29.8459 7.89492 29.901 8.01961 29.9563 8.09297C29.9935 8.14225 30.0417 8.18214 30.097 8.20941C30.1524 8.23668 30.2134 8.25058 30.2751 8.25H30.7185C30.9583 8.25 31.191 8.14242 31.3279 7.96875L32.1381 6.9832L34.4191 7.01695L32.9087 10.3451C32.8828 10.4022 32.8717 10.4648 32.8762 10.5273C32.8808 10.5899 32.901 10.6502 32.9349 10.7029C32.9688 10.7556 33.0154 10.799 33.0704 10.8291C33.1254 10.8591 33.1871 10.8749 33.2498 10.875H33.8805C33.9685 10.8732 34.0549 10.8517 34.1334 10.8119C34.2119 10.7721 34.2805 10.7152 34.334 10.6453L37.2648 7.08281L38.6188 7.11844C38.718 7.12383 38.9927 7.1257 39.0562 7.1257C40.3513 7.125 41.1248 6.70453 41.1248 6C41.1248 5.77828 41.0362 5.36719 40.4434 5.10563C40.0935 4.95094 39.6266 4.87266 39.0557 4.87266C38.9929 4.87266 38.7189 4.87453 38.6184 4.87992L37.2646 4.91602L34.3265 1.35352C34.2729 1.28394 34.2045 1.22728 34.1261 1.18772C34.0477 1.14817 33.9614 1.12673 33.8737 1.125Z"
      fill="#D1D5DB"
    />
  </svg>
);

const StarRating = ({ count, size = 17 }: { count: number; size?: number }) => (
  <div
    className="flex items-center gap-1"
    aria-label={`${count} out of 5 stars`}
  >
    {Array.from({ length: 5 }, (_, i) => (
      <svg key={i} width={size} height={size} viewBox="0 0 17 17" fill="none">
        <path
          d="M8.06436 11.9285L3.91651 14.1093L4.70885 9.49038L1.34863 6.21954L5.98573 5.5475L8.05965 1.34521L10.1336 5.5475L14.7707 6.21954L11.4105 9.49038L12.2028 14.1093L8.06436 11.9285Z"
          fill={i < count ? "#EAB308" : "#E5E7EB"}
        />
      </svg>
    ))}
  </div>
);

// ─── Flight Card ──────────────────────────────────────────────────────────────

interface FlightCardProps {
  badge: { label: string; className: string };
  stops: string;
  stopsDetail?: {
    airline: string;
    layover: string;
    fromTime: string;
    fromCity: string;
    toTime: string;
    toCity: string;
  }[];
}

const FlightCard = ({ badge, stops, stopsDetail }: FlightCardProps) => {
  const [showStops, setShowStops] = useState(false);

  return (
    <article className="flex flex-col self-stretch overflow-hidden rounded-lg bg-white">
      <div className="flex flex-col gap-3.5 px-3.5 py-3">
        <div className="flex items-center gap-2.5 self-stretch">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-400 text-[10px] font-bold text-white">
              <img src="/" alt="Spicejet logo" className="rounded-full" />
            </span>
            <div className="flex min-w-0 flex-col justify-center gap-0.5">
              <span className="text-sm font-semibold">Spicejet</span>
              <span className="text-xs font-normal text-zinc-600">
                25th May 26
              </span>
            </div>
          </div>
          <span
            className={`shrink-0 rounded-[59px] border border-solid px-3 py-1 text-xs font-medium ${badge.className}`}
          >
            {badge.label}
          </span>
        </div>
        <div className="flex items-center gap-2.5 self-stretch rounded-xl bg-neutral-50 px-2.5 py-2">
          <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 text-center">
            <span className="text-sm font-extrabold">4:20 pm</span>
            <span className="text-xs font-normal text-zinc-600">New York</span>
          </div>
          <div className="relative flex min-w-0 flex-1 flex-col items-center justify-center gap-1.5">
            <FlightRouteArrow />
            <span className="relative z-[1] bg-neutral-50 px-0.5 text-xs font-light text-zinc-600">
              {stops}
            </span>
          </div>
          <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 text-center">
            <span className="text-sm font-extrabold">5:35 am</span>
            <span className="text-xs font-normal text-zinc-600">Madrid</span>
          </div>
        </div>
        <p className="m-0 text-xs font-normal text-zinc-600">
          British Airways • Economy • {stops} • 7h 15m
        </p>
        {stopsDetail && (
          <>
            <button
              type="button"
              onClick={() => setShowStops(!showStops)}
              className="inline-flex items-center gap-1.5 border-0 bg-transparent p-0 text-xs font-semibold text-[#f26537]"
              aria-expanded={showStops}
            >
              <span>{showStops ? "Hide Stops" : "View Stops"}</span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                className={`transition-transform ${showStops ? "rotate-180" : ""}`}
              >
                <path
                  d="M6 9L12 15L18 9"
                  stroke="#f26537"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {showStops && (
              <div className="flex flex-col gap-2.5 self-stretch">
                {stopsDetail.map((stop, i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-2.5 self-stretch rounded-xl border border-solid border-gray-200 p-3"
                  >
                    <div className="flex items-center gap-2 self-stretch">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-400">
                        <img src="/" alt="logo" className="rounded-full" />
                      </span>
                      <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5">
                        <span className="text-sm font-semibold">
                          {stop.airline}
                        </span>
                        <span className="text-xs font-normal text-zinc-600">
                          {stop.layover}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-stretch gap-2.5 self-stretch">
                      <div className="flex flex-col items-center py-0.5">
                        <span className="size-2 shrink-0 rounded-full border border-zinc-300 bg-white" />
                        <span className="min-h-8 w-px flex-1 border-l border-dashed border-zinc-300" />
                        <span className="size-2 shrink-0 rounded-full border border-zinc-300 bg-white" />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-medium">
                            {stop.fromTime}
                          </span>
                          <span className="text-xs font-normal text-zinc-600">
                            {stop.fromCity}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-medium">
                            {stop.toTime}
                          </span>
                          <span className="text-xs font-normal text-zinc-600">
                            {stop.toCity}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <div className="flex items-center gap-2.5 self-stretch bg-[#0f3a5d] px-3.5 py-1.5">
        <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5">
          <p className="w-full text-xs font-normal text-white">Total Price</p>
          <p className="w-full text-sm font-extrabold text-white">₹63,027</p>
        </div>
        <button
          type="button"
          className="flex h-8 shrink-0 items-center justify-center rounded-[10px] bg-[#f26537] px-[15px] text-sm font-semibold text-white transition hover:opacity-90"
        >
          Reserve Now
        </button>
      </div>
    </article>
  );
};

// ─── Venue Detail Panel ───────────────────────────────────────────────────────

interface VenueDetailPanelProps {
  onBack: () => void;
}

const VenueDetailPanel = ({ onBack }: VenueDetailPanelProps) => {
  const [activeTab, setActiveTab] = useState<VenueTab>("overview");
  const [hoursOpen, setHoursOpen] = useState(true);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const galleryImages = [
    "/images/banner.png",
    "/images/banner.png",
    "/images/banner.png",
  ];

  return (
    <div className="relative isolate flex min-h-0 min-w-0 flex-1 flex-col self-stretch overflow-hidden border-l border-solid border-gray-100">
      <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto overscroll-contain p-2.5">
        {/* Header */}
        <div className="flex items-center justify-between self-stretch">
          <button
            onClick={onBack}
            className="flex size-6 shrink-0 items-center justify-center border-0 bg-transparent p-0 text-zinc-700"
            aria-label="Back"
          >
            <BackIcon />
          </button>
          <button
            className="flex size-[30px] shrink-0 items-center justify-center rounded-lg border border-solid border-black/10 bg-white"
            aria-label="Save to favorites"
          >
            <HeartIcon filled />
          </button>
        </div>

        {/* Gallery */}
        <div className="relative h-[200px] w-full shrink-0 overflow-hidden rounded-xl">
          <img
            src={galleryImages[galleryIndex]}
            alt=""
            className="h-full w-full object-cover"
          />
          <button
            onClick={() =>
              setGalleryIndex(
                (i) => (i - 1 + galleryImages.length) % galleryImages.length,
              )
            }
            className="absolute left-2 top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/45"
            aria-label="Previous image"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 6L9 12L15 18"
                stroke="white"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            onClick={() =>
              setGalleryIndex((i) => (i + 1) % galleryImages.length)
            }
            className="absolute right-2 top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/45"
            aria-label="Next image"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 6L15 12L9 18"
                stroke="white"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="mt-2.5 flex flex-col gap-5 self-stretch">
          {/* Title */}
          <div className="flex flex-col gap-0.5 self-stretch">
            <div className="flex items-center justify-between gap-2">
              <h2 className="m-0 min-w-0 text-lg font-bold text-zinc-950">
                The Malt House
              </h2>
              <span className="inline-flex shrink-0 items-center gap-[5px] rounded-[59px] bg-green-600 px-2 py-1">
                <StarFilledIcon />
                <span className="text-xs text-white">4.8</span>
              </span>
            </div>
            <p className="m-0 flex flex-wrap items-center gap-1.5 text-sm font-normal text-zinc-600">
              <span>Bar $$ |</span>
              <span>Opens at 11:00 AM</span>
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2.5 self-stretch rounded-2xl" role="tablist">
            {(["overview", "location", "reviews"] as VenueTab[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`flex flex-1 items-center justify-center rounded-lg px-4 py-2 text-sm capitalize ${
                  activeTab === tab
                    ? "bg-[#0f3a5d] font-semibold text-white"
                    : "bg-gray-100 font-normal text-gray-700"
                }`}
                role="tab"
                aria-selected={activeTab === tab}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="flex flex-col gap-4 self-stretch">
              <p className="m-0 text-sm font-normal text-zinc-950">
                A lively sports bar in the Financial District with great pub
                food and tons of TVs. The pork quesadilla is a crowd favorite,
                and the staff's hospitality makes it a go-to for group events or
                casual nights out.
              </p>
              <div className="flex flex-col gap-3 self-stretch border-b border-solid border-gray-100 pb-2">
                <button
                  onClick={() => setHoursOpen(!hoursOpen)}
                  className="flex w-full items-center gap-2 border-0 bg-transparent p-0 text-left"
                  aria-expanded={hoursOpen}
                >
                  <ClockIcon orange />
                  <span className="text-sm font-semibold text-red-600">
                    Closed Now
                  </span>
                  <span className="text-sm font-normal text-zinc-600">
                    Opens at 7am
                  </span>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    className={`ml-auto transition-transform ${hoursOpen ? "" : "rotate-180"}`}
                  >
                    <path
                      d="M18 15L12 9L6 15"
                      stroke="#6B7280"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                {hoursOpen && (
                  <div className="flex flex-col gap-1.5 self-stretch">
                    {VENUE_SCHEDULE.map((day) => (
                      <div
                        key={day}
                        className="flex items-center gap-2 self-stretch"
                      >
                        <span className="w-full max-w-[100px] text-xs font-normal text-zinc-950">
                          {day}
                        </span>
                        <span className="text-xs font-normal text-zinc-950">
                          11:00 AM - 4:00 AM
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <a
                href="#"
                className="flex items-center gap-2 self-stretch border-b border-solid border-gray-100 pb-2 text-sm font-normal text-zinc-600 underline"
              >
                <MapPinIcon orange />
                118 Nassau St, New York
              </a>
              <a
                href="http://instagram.com/nassaubarnyc"
                className="flex items-center gap-2 self-stretch border-b border-solid border-gray-100 pb-2 text-sm font-normal text-zinc-600 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GlobeIcon />
                http://instagram.com/nassaubarnyc
              </a>
              <a
                href="tel:+12123492219"
                className="flex items-center gap-2 self-stretch text-sm font-normal text-zinc-600 underline"
              >
                <PhoneIcon />
                +1 212-349-2219
              </a>
              <div className="flex flex-col gap-3.5 self-stretch rounded-2xl bg-[#f5faff] p-3">
                <span className="text-sm font-semibold text-zinc-950">
                  Keep Exploring
                </span>
                <div className="flex flex-col gap-2.5 self-stretch">
                  {[
                    "What cocktails are recommended at Nassau Bar in New York?",
                    "How would you describe the atmosphere at Nassau Bar?",
                    "Which bartenders are known for their service at Nassau Bar?",
                  ].map((q) => (
                    <button
                      key={q}
                      type="button"
                      className="rounded-lg bg-white px-3 py-2 text-left text-xs font-normal text-zinc-950 hover:bg-gray-50"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Location Tab */}
          {activeTab === "location" && (
            <div className="flex flex-col gap-2 self-stretch">
              <div className="flex items-center gap-2 self-stretch">
                <MapPinIcon orange />
                <span className="text-sm font-normal text-zinc-950">
                  118 Nassau St, New York
                </span>
              </div>
              <div className="relative h-64 w-full shrink-0 overflow-hidden rounded-xl">
                <iframe
                  title="The Malt House location"
                  className="h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://maps.google.com/maps?q=40.7075,-74.0089&z=15&hl=en&output=embed"
                />
                <span className="pointer-events-none absolute left-1/2 top-1/2 flex size-[25px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#0f3a5d] text-white shadow-md">
                  📍
                </span>
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === "reviews" && (
            <div className="flex flex-col gap-4 self-stretch">
              <div className="flex flex-col gap-3.5 self-stretch rounded-2xl bg-[#f5faff] p-3">
                <div className="grid grid-cols-12 items-center justify-between gap-3 self-stretch">
                  <div className="col-span-12 flex flex-col items-center gap-1 lg:col-span-4">
                    <span className="text-[30px] font-extrabold leading-10 text-zinc-950">
                      4.0
                    </span>
                    <div className="flex items-center gap-1.5">
                      {Array.from({ length: 5 }, (_, i) => (
                        <svg
                          key={i}
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                        >
                          <path
                            d="M9.99986 14.7918L4.85653 17.496L5.83903 11.7685L1.67236 7.71262L7.42236 6.87929L9.99403 1.66846L12.5657 6.87929L18.3157 7.71262L14.149 11.7685L15.1315 17.496L9.99986 14.7918Z"
                            fill={i < 3 ? "#EAB308" : "#E5E7EB"}
                          />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs font-normal text-zinc-600">
                      (100 reviews)
                    </span>
                  </div>
                  <div className="col-span-12 flex min-w-0 flex-1 flex-col gap-[7px] lg:col-span-8">
                    {RATING_BARS.map((bar) => (
                      <div key={bar.label} className="flex items-center gap-2">
                        <span className="w-9 shrink-0 text-xs font-normal text-zinc-700">
                          {bar.label}
                        </span>
                        <div className="h-[5px] min-w-0 flex-1 overflow-hidden rounded-full bg-gray-200">
                          <div
                            className="h-full rounded-full bg-yellow-500"
                            style={{ width: bar.width }}
                          />
                        </div>
                        <span className="w-8 shrink-0 text-right text-xs font-normal text-zinc-700">
                          {bar.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <p className="m-0 text-sm font-normal text-zinc-950">
                Users tend to rave about the warm and inviting atmosphere, often
                highlighting the exceptional service provided by the bartender,
                Philly. Reviewers appreciate the extensive drink selection and
                affordable prices.
              </p>
              <div className="flex flex-col gap-3.5 self-stretch">
                <span className="text-base font-bold text-zinc-950">
                  All Reviews
                </span>
                <div className="flex flex-col gap-4 self-stretch">
                  {VENUE_REVIEWS.map((review, i) => (
                    <article
                      key={i}
                      className="flex flex-col gap-2 border-b border-solid border-gray-100 pb-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex min-w-0 flex-col gap-1">
                          <span className="text-sm font-semibold text-zinc-950">
                            {review.author}
                          </span>
                          <span className="text-xs font-normal text-zinc-600">
                            {review.time}
                          </span>
                        </div>
                        <StarRating count={3} />
                      </div>
                      <p className="m-0 text-xs font-normal text-zinc-600">
                        {review.text}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Favorites Panel ──────────────────────────────────────────────────────────

const FavoritesPanel = () => {
  const [filter, setFilter] = useState<FavoriteFilter>("all");
  const filtered = FAVORITES.filter(
    (f) => filter === "all" || f.category === filter,
  );

  return (
    <div className="flex min-h-0 w-full min-w-0 max-w-full flex-1 shrink-0 flex-col gap-5 self-stretch border-r border-solid border-gray-100 p-2.5 md:max-w-[435px]">
      <div className="flex min-h-0 flex-1 flex-col gap-5 self-stretch overflow-hidden">
        <h2 className="m-0 text-lg font-medium text-zinc-950">Favorites</h2>
        <div className="flex min-h-0 flex-1 flex-col gap-3.5 self-stretch overflow-hidden">
          <div
            className="flex shrink-0 gap-2.5 self-stretch"
            role="tablist"
            aria-label="Filter favorites"
          >
            {(["all", "places", "hotels", "flights"] as FavoriteFilter[]).map(
              (f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={`flex min-w-0 flex-1 flex-col rounded-lg px-4 py-2 text-sm capitalize ${
                    filter === f
                      ? "bg-[#0f3a5d] font-semibold text-white"
                      : "bg-gray-100 font-normal text-gray-700"
                  }`}
                  role="tab"
                  aria-selected={filter === f}
                >
                  {f}
                </button>
              ),
            )}
          </div>
          <div className="grid min-h-0 grid-cols-2 gap-2.5 flex-1 overflow-y-auto overscroll-contain content-start">
            {filtered.map((fav, i) => (
              <article
                key={i}
                className="flex min-w-0 flex-col gap-2 rounded-2xl bg-white p-2.5"
              >
                <div className="relative overflow-hidden rounded-lg">
                  <img
                    src={fav.image}
                    alt=""
                    className="h-[121px] w-full object-cover"
                    width={201}
                    height={121}
                  />
                  {fav.rating && (
                    <span className="absolute left-2 top-2 inline-flex items-center gap-[5px] rounded-[59px] bg-green-600 px-1 py-0.5">
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 14 14"
                        fill="none"
                      >
                        <path
                          d="M7 10.35L3.4 12.25L4.09 8.24L1.17 5.4L5.2 4.82L7 1.17L8.8 4.82L12.82 5.4L9.9 8.24L10.59 12.25L7 10.35Z"
                          fill="white"
                        />
                      </svg>
                      <span className="text-[11px] font-medium leading-4 text-white">
                        4.8
                      </span>
                    </span>
                  )}
                  <button
                    type="button"
                    className="absolute right-2 top-2 flex size-[30px] items-center justify-center rounded-full bg-[#0f3a5d]/30 text-white hover:bg-[#0f3a5d]"
                    aria-label="Remove from favorites"
                  >
                    <HeartIcon filled white />
                  </button>
                </div>
                <div className="flex flex-col gap-0.5 self-stretch">
                  <span className="text-sm font-semibold text-zinc-950">
                    {fav.title}
                  </span>
                  <span className="text-xs font-normal text-zinc-600">
                    {fav.subtitle}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Chat Panel ───────────────────────────────────────────────────────────────

interface ChatPanelProps {
  onViewVenue: (venue: Venue) => void;
}

const ChatPanel = ({ onViewVenue }: ChatPanelProps) => {
  const [message, setMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  return (
    <div className="flex min-h-0 w-full min-w-0 flex-1 shrink-0 flex-col gap-5 self-stretch p-2.5 md:border-r md:border-solid md:border-gray-100">
      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex min-h-0 max-h-[calc(100dvh-137px)] flex-1 flex-col gap-3.5 self-stretch overflow-y-auto overscroll-contain"
      >
        {/* Welcome message */}
        <div className="flex w-full max-w-[90%] flex-col gap-[25px] rounded-br-lg rounded-tl-lg rounded-tr-lg bg-[#fef3ef] p-3 lg:max-w-[80%]">
          <div className="flex flex-col gap-2.5 self-stretch">
            <p className="m-0 text-sm font-normal">
              Hi! I'm My Travel Geek AI - your own personal Travel Genius. I can
              help you with:
            </p>
            <ul className="m-0 list-disc space-y-1 pl-5 text-sm font-medium">
              {[
                "Flights",
                "Custom Itineraries",
                "Hotels + Vacation Rentals",
                "Restaurants + Bars",
                "Tours + Excursions",
                "Travel Safety",
                "Most Direct Routes",
                "Local Customs + Slang",
                "Visas",
              ].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2.5 self-stretch rounded-2xl bg-white p-3 shadow-[0px_2px_5px_0px_rgba(0,0,0,0.2)]">
          {["Custom Itinerary", "Flights", "Hotels"].map((tab, i) => (
            <div
              key={tab}
              className={`flex min-w-0 flex-1 flex-col gap-[25px] rounded-lg border border-solid border-black/10 px-3 py-2 ${i === 0 ? "bg-gray-50" : ""}`}
            >
              <span
                className={`text-center text-xs font-normal ${i === 0 ? "text-[#6B7280]" : ""}`}
              >
                {tab}
              </span>
            </div>
          ))}
        </div>

        {/* User message */}
        <div className="flex flex-col items-end justify-center gap-2.5 self-stretch">
          <div className="flex w-full max-w-[90%] flex-col gap-[25px] rounded-bl-lg rounded-tl-lg rounded-tr-lg bg-gray-100 p-3 lg:max-w-[80%]">
            <p className="text-sm font-normal">
              Recommend the best Greek islands to visit that are lesser-known
              and attract fewer tourists, but are still fairly easy to reach by
              ferry or short domestic flight.
            </p>
          </div>
        </div>

        {/* AI itinerary response */}
        <div className="flex w-full max-w-[90%] flex-col gap-[25px] rounded-br-lg rounded-tl-lg rounded-tr-lg bg-[#fef3ef] p-3 lg:max-w-[80%]">
          <div className="flex flex-col gap-3.5 self-stretch">
            <span className="text-sm">
              Here's a relaxed yet immersive 3-day itinerary for{" "}
              <strong>Folegandros</strong>, one of the most elegant and
              culturally rich islands in the Cyclades. It's easily reached by
              ferry from Athens (about 3.5–4 hours) or a short domestic flight.
            </span>
            {[
              {
                day: "Day 1: Discovering Folegandros",
                sub: "Start your trip in the island's capital, a neoclassical masterpiece",
                items: [
                  "Morning: Wander through the marble-paved streets of Ermoupoli, admiring pastel mansions and the grand architecture.",
                  "Lunch: Stop at a harborside taverna for fresh seafood and local wine.",
                  "Afternoon: Visit the Apollo Theater and catch golden-hour views over the Aegean.",
                ],
              },
              {
                day: "Day 2: Villages and Beaches",
                sub: "Explore cliffside villages and hidden coves",
                items: [
                  "Morning: Hike the trail to Chora and explore narrow alleys and windmills.",
                  "Lunch: Picnic-style lunch with Cycladic cheese and olives.",
                  "Afternoon: Swim at Agali Beach and relax by turquoise water.",
                ],
              },
            ].map((section) => (
              <div
                key={section.day}
                className="flex flex-col gap-3 self-stretch"
              >
                <div className="flex flex-col gap-0.5 self-stretch">
                  <span className="text-base font-semibold">{section.day}</span>
                  <span className="text-sm font-normal">{section.sub}</span>
                </div>
                <div className="flex flex-col gap-2.5 self-stretch text-sm">
                  {section.items.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Typing indicator */}
        <div className="flex w-fit gap-1.5 rounded-br-lg rounded-tl-lg rounded-tr-lg bg-[#fef3ef] p-3">
          {[true, false, false, false].map((active, i) => (
            <span
              key={i}
              className={`size-2 rounded-full ${active ? "bg-[#f26537]" : "bg-[#fcdacf]"}`}
            />
          ))}
        </div>

        {/* Flights response */}
        <div className="flex w-full max-w-[90%] flex-col gap-3.5 self-stretch rounded-br-lg rounded-tl-lg rounded-tr-lg bg-[#fef3ef] p-3 lg:max-w-[80%]">
          <div className="flex flex-col gap-1">
            <b className="text-base text-[#f26537]">Folegandros</b>
            <p className="m-0 text-sm font-normal">
              I found the following flights in Economy class for 1 adult from
              JFK to MAD on May 25th:
            </p>
          </div>
          <div className="flex flex-col gap-2.5 self-stretch">
            <FlightCard
              badge={{
                label: "BEST",
                className: "border-[#fcdacf] bg-[#fef3ef] text-[#f26537]",
              }}
              stops="Non-stop"
            />
            <FlightCard
              badge={{
                label: "CHEAPEST",
                className: "border-green-100 bg-green-50 text-green-600",
              }}
              stops="2 stops"
              stopsDetail={[
                {
                  airline: "Icelandair",
                  layover: "7h Connect in airport",
                  fromTime: "4:20 pm",
                  fromCity: "New York",
                  toTime: "5:35 am",
                  toCity: "Madrid",
                },
                {
                  airline: "Icelandair",
                  layover: "7h Connect in airport",
                  fromTime: "4:20 pm",
                  fromCity: "New York",
                  toTime: "5:35 am",
                  toCity: "Madrid",
                },
              ]}
            />
          </div>
        </div>

        {/* Venues response */}
        <div className="flex w-full max-w-[90%] flex-col gap-3.5 self-stretch rounded-br-lg rounded-tl-lg rounded-tr-lg bg-[#fef3ef] p-3 lg:max-w-[80%]">
          <p className="m-0 text-sm font-normal">
            New York's bar and restaurant scene is legendary, and these spots
            each bring their own flavor to the city's energy — from historic
            Irish pubs to sleek Midtown lounges.
          </p>
          <div className="flex flex-col gap-3.5 self-stretch">
            {VENUES.map((venue) => (
              <article
                key={venue.name}
                className="flex flex-col self-stretch overflow-hidden rounded-lg bg-white"
              >
                <div className="relative h-[152px] w-full shrink-0 overflow-hidden">
                  <img
                    src={venue.image}
                    alt=""
                    className="h-full w-full object-cover"
                    width={320}
                    height={152}
                  />
                  <span className="absolute left-2 top-2 inline-flex items-center gap-[5px] rounded-[59px] bg-green-600 px-2 py-1">
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M7 10.35L3.4 12.25L4.09 8.24L1.17 5.4L5.2 4.82L7 1.17L8.8 4.82L12.82 5.4L9.9 8.24L10.59 12.25L7 10.35Z"
                        fill="white"
                      />
                    </svg>
                    <span className="text-xs font-medium text-white">4.8</span>
                  </span>
                  <button
                    className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50"
                    aria-label="Save"
                  >
                    <HeartIcon white />
                  </button>
                </div>
                <div className="flex flex-col gap-2.5 self-stretch p-3">
                  <div className="flex flex-col gap-3 self-stretch">
                    <div className="flex flex-col gap-1 self-stretch">
                      <div className="flex items-center justify-between gap-2 self-stretch">
                        <span className="min-w-0 text-sm font-semibold text-zinc-950">
                          {venue.name}
                        </span>
                        <span className="shrink-0 rounded-[59px] border border-solid border-red-100 bg-red-50 px-3 py-1 text-xs font-medium text-red-600">
                          CLOSED NOW
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 self-stretch text-xs font-normal text-zinc-600">
                        <span>{venue.category} |</span>
                        <span>{venue.hours}</span>
                      </div>
                    </div>
                    <p className="m-0 text-xs font-normal text-zinc-600">
                      {VENUE_DESCRIPTION}...
                      <button
                        type="button"
                        className="border-0 bg-transparent p-0 text-xs font-normal text-[#f26537]"
                      >
                        {" "}
                        read more
                      </button>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onViewVenue(venue)}
                    className="flex h-8 w-full items-center justify-center self-stretch rounded-[10px] border border-solid border-[#f26537] bg-white px-[15px] text-xs font-semibold text-[#f26537] transition hover:bg-[#f26537]/5"
                  >
                    View Website
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Tours */}
        <div className="flex w-full max-w-[90%] flex-col gap-3.5 self-stretch rounded-br-lg rounded-tl-lg rounded-tr-lg bg-[#fef3ef] p-3 lg:max-w-[80%]">
          <p className="m-0 text-sm font-normal">
            Here are some great tours and excursions you can enjoy in New York
            City, USA, based on your request for "tours in New York, New York,
            United States.
          </p>
          <div className="flex flex-col gap-2.5 self-stretch">
            {TOURS.map((tour) => (
              <article
                key={tour.title}
                className="flex flex-col self-stretch overflow-hidden rounded-lg bg-white"
              >
                <div className="flex flex-col gap-2.5 self-stretch p-3">
                  <div className="flex items-start gap-2.5 self-stretch">
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-lg">
                      <img
                        src={tour.image}
                        alt=""
                        className="h-full w-full object-cover"
                        width={80}
                        height={80}
                      />
                      <button
                        className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50"
                        aria-label="Save tour"
                      >
                        <HeartIcon white />
                      </button>
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <div className="flex items-start justify-between gap-1 self-stretch">
                        <span className="min-w-0 text-sm font-semibold leading-snug text-zinc-950">
                          {tour.title}
                        </span>
                        <span className="inline-flex shrink-0 items-center gap-[5px] rounded-[59px] bg-green-600 px-2 py-1">
                          <StarFilledIcon />
                          <span className="text-xs font-medium text-white">
                            4.8
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 self-stretch">
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M12 7V12L15 15M3 12C3 13.18 3.23 14.35 3.69 15.44C4.14 16.54 4.8 17.53 5.64 18.36C6.47 19.2 7.46 19.86 8.56 20.31C9.65 20.77 10.82 21 12 21C13.18 21 14.35 20.77 15.44 20.31C16.54 19.86 17.53 19.2 18.36 18.36C19.2 17.53 19.86 16.54 20.31 15.44C20.77 14.35 21 13.18 21 12C21 9.61 20.05 7.32 18.36 5.64C16.68 3.95 14.39 3 12 3C9.61 3 7.32 3.95 5.64 5.64C3.95 7.32 3 9.61 3 12Z"
                            stroke="#6B7280"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span className="text-xs font-normal text-zinc-600">
                          {tour.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="m-0 text-xs font-normal text-zinc-950">
                    {tour.description}
                  </p>
                  <button
                    type="button"
                    className="flex h-8 w-full items-center justify-center self-stretch rounded-[10px] border border-solid border-[#f26537] bg-white px-[15px] text-sm font-medium text-[#f26537] transition hover:bg-[#f26537]/5"
                  >
                    Reserve for ₹{tour.price}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Route question */}
        <div className="flex w-full max-w-[90%] flex-col gap-3.5 self-stretch rounded-br-lg rounded-tl-lg rounded-tr-lg bg-[#fef3ef] p-3 lg:max-w-[80%]">
          <p className="m-0 text-sm font-normal">
            I can help you find the most direct driving routes to{" "}
            <span className="text-[#f26537]">New York</span> for October 2, 2024
            — but I'll need to know where you're starting from first. Could you
            tell me your departure city or region?
          </p>
          <div className="grid grid-cols-2 gap-2.5 self-stretch">
            {["New York", "United States"].map((place) => (
              <button
                key={place}
                type="button"
                className="flex min-w-0 flex-col rounded-lg bg-white text-left transition hover:ring-2 hover:ring-[#f26537]/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f26537]"
              >
                <div className="flex flex-col gap-2.5 p-2">
                  <img
                    src="/images/banner.png"
                    alt={place}
                    className="h-[109px] w-full rounded-lg object-cover"
                    width={280}
                    height={109}
                  />
                  <span className="text-sm font-semibold text-zinc-950">
                    {place}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Route answer */}
        <div className="flex w-full max-w-[90%] flex-col gap-3.5 self-stretch rounded-br-lg rounded-tl-lg rounded-tr-lg bg-[#fef3ef] p-3 lg:max-w-[80%]">
          <p className="m-0 text-sm font-normal">
            Driving from <span className="text-[#f26537]">Spain</span> to{" "}
            <span className="text-[#f26537]">New York</span> isn't possible due
            to the Atlantic Ocean separating Europe and North America. The most
            direct way to make this journey is by air — typically a nonstop
            flight from major Spanish airports like
          </p>
          <div className="flex flex-col gap-2.5 self-stretch">
            {[
              "Adolfo Suárez Madrid-Barajas Airport or",
              "Josep Tarradellas Barcelona-El Prat Airport to",
              "Adolfo Suárez Madrid-Barajas Airport",
            ].map((airport) => (
              <div
                key={airport}
                className="flex flex-col self-stretch rounded-lg bg-white"
              >
                <div className="flex flex-col gap-2.5 self-stretch p-2">
                  <div className="flex items-center gap-2.5 self-stretch">
                    <span className="flex size-[30px] shrink-0 items-center justify-center rounded-full bg-gray-100">
                      ✈️
                    </span>
                    <span className="min-w-0 text-sm font-normal text-zinc-950">
                      {airport}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="flex h-[45px] shrink-0 items-center gap-2 self-stretch rounded-[63px] bg-neutral-50 pl-[15px] pr-1">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your question here"
          className="min-h-0 min-w-0 flex-1 border-0 bg-transparent text-sm text-zinc-900 outline-none ring-0 placeholder:text-zinc-600 focus:ring-0"
        />
        <button
          type="button"
          className="flex size-[37px] shrink-0 items-center justify-center rounded-full bg-[#f26537] text-white transition hover:opacity-90"
          aria-label="Send"
        >
          <SendIcon />
        </button>
      </div>
    </div>
  );
};

// ─── Map Panel ────────────────────────────────────────────────────────────────

const MapPanel = () => (
  <div className="relative isolate hidden min-h-0 min-w-0 flex-1 flex-col gap-2.5 self-stretch p-2.5 md:flex md:min-h-[280px]">
    <iframe
      title="Map — New York / Newark area"
      className="h-full w-full rounded-xl border-0"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      src="https://maps.google.com/maps?q=40.735,-74.05&z=11&hl=en&output=embed"
    />

    {/* Map controls */}
    <div className="absolute left-5 top-5 z-10">
      <button
        className="flex h-[37px] w-[34px] items-center justify-center rounded-md bg-white shadow-[0px_2px_5px_0px_rgba(0,0,0,0.2)]"
        aria-label="Show chat"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M15 4V20M9 10L11 12L9 14M4 6C4 5.47 4.21 4.96 4.59 4.59C4.96 4.21 5.47 4 6 4H18C18.53 4 19.04 4.21 19.41 4.59C19.79 4.96 20 5.47 20 6V18C20 18.53 19.79 19.04 19.41 19.41C19.04 19.79 18.53 20 18 20H6C5.47 20 4.96 19.79 4.59 19.41C4.21 19.04 4 18.53 4 18V6Z"
            stroke="#374151"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
    <div className="absolute right-5 top-5 z-10 flex flex-col gap-2">
      <button
        className="flex h-[37px] w-[34px] items-center justify-center rounded-md bg-white shadow-[0px_2px_5px_0px_rgba(0,0,0,0.2)]"
        aria-label="Map type"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M4 8V6C4 5.47 4.21 4.96 4.59 4.59C4.96 4.21 5.47 4 6 4H8M4 16V18C4 18.53 4.21 19.04 4.59 19.41C4.96 19.79 5.47 20 6 20H8M16 4H18C18.53 4 19.04 4.21 19.41 4.59C19.79 4.96 20 5.47 20 6V8M16 20H18C18.53 20 19.04 19.79 19.41 19.41C19.79 19.04 20 18.53 20 18V16"
            stroke="#374151"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div className="rounded-md bg-white shadow-[0px_2px_5px_0px_rgba(0,0,0,0.2)]">
        <button
          className="flex h-[36px] w-[34px] items-center justify-center"
          aria-label="Zoom in"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 5V19M5 12H19"
              stroke="#374151"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <button
          className="flex h-[36px] w-[34px] items-center justify-center"
          aria-label="Zoom out"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 12H19"
              stroke="#374151"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>

    {/* Map popup card */}
    <div className="absolute bottom-[50%] left-[40%] z-[1]">
      <button
        className="pointer-events-auto flex size-[37px] items-center justify-center rounded-full bg-[#0f3a5d] text-white shadow-md hover:opacity-90"
        aria-label="Center map"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M9 11C9 11.8 9.32 12.56 9.88 13.12C10.44 13.68 11.2 14 12 14C12.8 14 13.56 13.68 14.12 13.12C14.68 12.56 15 11.8 15 11C15 10.2 14.68 9.44 14.12 8.88C13.56 8.32 12.8 8 12 8C11.2 8 10.44 8.32 9.88 8.88C9.32 9.44 9 10.2 9 11Z"
            stroke="white"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17.66 16.66L13.41 20.9C13.04 21.27 12.53 21.49 12 21.49C11.47 21.49 10.96 21.27 10.59 20.9L6.34 16.66C5.22 15.54 4.46 14.11 4.15 12.56C3.85 11.01 4 9.4 4.61 7.94C5.21 6.48 6.24 5.23 7.56 4.35C8.87 3.47 10.42 3 12 3C13.58 3 15.13 3.47 16.44 4.35C17.76 5.23 18.79 6.48 19.39 7.94C19.99 9.4 20.16 11.01 19.85 12.56C19.54 14.11 18.78 15.54 17.66 16.66Z"
            stroke="white"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>

    <div className="absolute bottom-20 left-[30%] z-[1]">
      <div className="pointer-events-auto mb-2 flex w-[206px] flex-col gap-2 rounded-2xl bg-white p-2.5 shadow-md">
        <div className="relative overflow-hidden rounded-lg">
          <img
            src="/images/banner.png"
            alt=""
            className="aspect-[186/124] h-[124px] w-full object-cover"
            width={206}
            height={124}
          />
          <button
            className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-black/30 text-white hover:bg-black"
            aria-label="Save"
          >
            <HeartIcon filled white />
          </button>
        </div>
        <div className="flex flex-col gap-0.5">
          <b className="text-sm font-semibold">Oyo Tokyo</b>
          <p className="text-xs font-normal">Locality</p>
        </div>
        <button
          type="button"
          className="flex h-8 w-full items-center justify-center rounded-[10px] border border-solid border-[#f26537] bg-white px-[15px] text-sm font-medium text-[#f26537] hover:bg-[#f26537]/5"
        >
          View More
        </button>
      </div>
    </div>
  </div>
);

// ─── Main Modal Component ─────────────────────────────────────────────────────

interface CustomItineraryModalProps {
  open: boolean;
  onClose: () => void;
}

const MODAL_TRANSITION_MS = 400;

const CustomItineraryModal = ({ open, onClose }: CustomItineraryModalProps) => {
  const [sidebarView, setSidebarView] = useState<SidebarView>("compose");
  const [showVenueDetail, setShowVenueDetail] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mobileView, setMobileView] = useState<"chat" | "map">("chat");
  const [isClosing, setIsClosing] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const finishClose = () => {
    const dialog = dialogRef.current;
    if (dialog?.open) dialog.close();
    else onClose();
  };

  const closeWithAnimation = () => {
    const dialog = dialogRef.current;
    if (!dialog?.open) {
      onClose();
      return;
    }
    if (isClosing) return;
    setIsClosing(true);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(finishClose, MODAL_TRANSITION_MS);
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      setIsClosing(false);
      if (!dialog.open) dialog.showModal();
      return;
    }

    if (dialog.open) closeWithAnimation();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only react to `open` toggles
  }, [open]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      setIsClosing(false);
      setMobileNavOpen(false);
      onClose();
    };
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      id="custom-itinerary-modal"
      className={`modal${isClosing ? " is-closing" : ""}`}
    >
      <div className="modal-box">
        {/* Header */}
        <div className="modal_header">
          <button
            type="button"
            id="modal-mobile-menu-open"
            onClick={() => setMobileNavOpen(true)}
            className="me-2.5 flex shrink-0 items-center justify-center border-0 bg-transparent p-0 md:hidden"
            aria-label="Open menu"
            aria-expanded={mobileNavOpen}
            aria-controls="modal-mobile-nav"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 6H20M4 12H20M4 18H16"
                stroke="#374151"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div className="modal_header__brand">
            <div className="modal_header__icon" aria-hidden="true">
              <SparkIcon className="modal_header__spark h-6 w-6" />
            </div>
            <span className="modal_header__title">My Travel Geek AI</span>
          </div>
          <button
            type="button"
            onClick={closeWithAnimation}
            className="modal_header__close-btn"
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Body */}
        <div className="modal_body">
          {/* Sidebar */}
          <div className="modal_sidebar hidden md:flex">
            {(
              [
                {
                  key: "compose" as SidebarView,
                  label: "Compose",
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M4.67 4.67H4C3.65 4.67 3.31 4.81 3.06 5.06C2.81 5.31 2.67 5.65 2.67 6V12C2.67 12.35 2.81 12.69 3.06 12.94C3.31 13.19 3.65 13.33 4 13.33H10C10.35 13.33 10.69 13.19 10.94 12.94C11.19 12.69 11.33 12.35 11.33 12V11.33M10.67 3.33L12.67 5.33M13.59 4.39C13.85 4.13 14 3.77 14 3.4C14 3.03 13.85 2.67 13.59 2.41C13.33 2.15 12.97 2 12.6 2C12.23 2 11.87 2.15 11.61 2.41L6 8V10H8L13.59 4.39Z"
                        stroke="white"
                        strokeWidth="0.93"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ),
                },
                {
                  key: "history" as SidebarView,
                  label: "History",
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M5.33 6H10.67M5.33 8.67H9.33M12 2.67C12.53 2.67 13.04 2.88 13.41 3.25C13.79 3.63 14 4.14 14 4.67V10C14 10.53 13.79 11.04 13.41 11.41C13.04 11.79 12.53 12 12 12H8.67L5.33 14V12H4C3.47 12 2.96 11.79 2.59 11.41C2.21 11.04 2 10.53 2 10V4.67C2 4.14 2.21 3.63 2.59 3.25C2.96 2.88 3.47 2.67 4 2.67H12Z"
                        stroke="#374151"
                        strokeWidth="0.93"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ),
                },
                {
                  key: "favorites" as SidebarView,
                  label: "Favorites",
                  icon: <HeartIcon />,
                },
              ] as { key: SidebarView; label: string; icon: React.ReactNode }[]
            ).map(({ key, label, icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setSidebarView(key)}
                title={label}
                aria-pressed={sidebarView === key}
                className={`modal_sidebar__btn ${sidebarView === key ? "modal_sidebar__btn--active" : "modal_sidebar__btn--ghost"}`}
              >
                {icon}
              </button>
            ))}
          </div>

          {/* Content area */}
          <div className="modal_content relative min-h-0 flex-1">
            {sidebarView === "favorites" ? (
              <FavoritesPanel />
            ) : (
              <ChatPanel onViewVenue={() => setShowVenueDetail(true)} />
            )}

            {/* Map */}
            <MapPanel />

            {/* Venue detail overlay */}
            {showVenueDetail && (
              <div className="absolute inset-0 z-40 flex bg-white md:relative md:inset-auto md:z-auto">
                <VenueDetailPanel onBack={() => setShowVenueDetail(false)} />
              </div>
            )}
          </div>
        </div>

        {/* Mobile bottom nav */}
        <div className="flex shrink-0 items-center justify-between border-t border-solid border-gray-100 px-4 py-2 md:hidden">
          <button
            type="button"
            onClick={() => setMobileView("chat")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium ${mobileView === "chat" ? "bg-[#f26537] text-white" : "text-zinc-600"}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M7.5 13.5C9.99 16 14 16 16.5 13.5M17.8 17.29C19.84 15.72 21 13.65 21 11.35C21 7.07 16.97 3.59 12 3.59C7.03 3.59 3 7.07 3 11.35C3 15.64 7.03 19 12 19C12.43 19 13.12 18.97 14.09 18.92C15.35 19.74 17.19 20.41 18.81 20.41C19.31 20.41 19.54 20 19.22 19.58C18.73 18.99 18.06 18.03 17.8 17.29Z"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Chat
          </button>
          <button
            type="button"
            onClick={() => setMobileView("map")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium ${mobileView === "map" ? "bg-[#f26537] text-white" : "text-zinc-600"}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 11C9 11.8 9.32 12.56 9.88 13.12C10.44 13.68 11.2 14 12 14C12.8 14 13.56 13.68 14.12 13.12C14.68 12.56 15 11.8 15 11C15 10.2 14.68 9.44 14.12 8.88C13.56 8.32 12.8 8 12 8C11.2 8 10.44 8.32 9.88 8.88C9.32 9.44 9 10.2 9 11Z"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17.66 16.66L13.41 20.9C13.04 21.27 12.53 21.49 12 21.49C11.47 21.49 10.96 21.27 10.59 20.9L6.34 16.66C5.22 15.54 4.46 14.11 4.15 12.56C3.85 11.01 4 9.4 4.61 7.94C5.21 6.48 6.24 5.23 7.56 4.35C8.87 3.47 10.42 3 12 3C13.58 3 15.13 3.47 16.44 4.35C17.76 5.23 18.79 6.48 19.39 7.94C19.99 9.4 20.16 11.01 19.85 12.56C19.54 14.11 18.78 15.54 17.66 16.66Z"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Map
          </button>
        </div>

        {/* Mobile nav drawer — slides in from left (reference) */}
        <div
          id="modal-mobile-nav"
          className={`modal_mobile-nav${mobileNavOpen ? " is-open" : ""}`}
          aria-hidden={!mobileNavOpen}
        >
          <div className="modal_mobile-nav__header">
            <div className="modal_mobile-nav__brand">
              <div className="modal_header__icon" aria-hidden="true">
                <SparkIcon className="modal_header__spark h-6 w-6" />
              </div>
              <span className="modal_mobile-nav__title">My Travel Geek AI</span>
            </div>
            <button
              type="button"
              id="modal-mobile-menu-close"
              onClick={() => setMobileNavOpen(false)}
              className="modal_mobile-nav__close"
              aria-label="Close menu"
            >
              <CloseIcon />
            </button>
          </div>
          <nav className="modal_mobile-nav__list" aria-label="Modal navigation">
            {[
              { key: "compose", label: "New Chat" },
              { key: "history", label: "Message" },
              { key: "favorites", label: "Favorites" },
            ].map(({ key, label }) => (
              <button
                key={key}
                type="button"
                className="modal_mobile-nav__item"
                onClick={() => {
                  setSidebarView(key as SidebarView);
                  setMobileNavOpen(false);
                }}
              >
                <span className="modal_mobile-nav__label">{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      <form
        method="dialog"
        className="modal-backdrop"
        onSubmit={(e) => {
          e.preventDefault();
          closeWithAnimation();
        }}
      >
        <button
          type="submit"
          className="modal-backdrop__hit"
          aria-label="Close dialog"
        />
      </form>
    </dialog>
  );
};

export default CustomItineraryModal;
