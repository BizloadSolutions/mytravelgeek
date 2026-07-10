"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { MERCOR_REFERRAL_URL } from "@/lib/mercor";

const SCROLL_THRESHOLD = 8;

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const desktopLogoSrc = isScrolled
    ? "/images/logo/logo-white.svg"
    : "/images/logo/logo-coloured.svg";

  const mobileLogoSrc = isScrolled
    ? "/images/logo/icon-white.png"
    : "/images/logo/icon-coloured.png";

  return (
    <header
      id="site-header"
      className={`site-header w-full fixed top-0 z-50 transition-[background,box-shadow,backdrop-filter] duration-300 ease-out${isScrolled ? " is-scrolled" : ""}`}
    >
      <div className="container">
        <div className="flex items-center justify-between gap-5 py-[15px]">
          <div className="sm:block hidden sm:h-8 h-6">
            <a
              href="/"
              className="shrink-0 text-lg font-semibold tracking-tight text-text-color no-underline transition-colors hover:text-[color:var(--primary-600)]"
            >
              <Image
                src={desktopLogoSrc}
                alt="My Travel Geek"
                width={150}
                height={32}
                priority
                className="h-full w-full object-contain"
                style={{ width: "200px", height: "auto" }}
              />
            </a>
          </div>
          <div className="sm:hidden block h-7">
            <a
              href="/"
              className="shrink-0 text-lg font-semibold tracking-tight text-text-color no-underline transition-colors hover:text-[color:var(--primary-600)]"
            >
              <Image
                src={mobileLogoSrc}
                alt="My Travel Geek"
                width={32}
                height={32}
                priority
                className="h-7 w-7 object-contain object-left"
              />
            </a>
          </div>
          <a
            href={MERCOR_REFERRAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold leading-none no-underline shadow-md transition sm:gap-2 sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-sm ${
              isScrolled
                ? "bg-[#7C76FF] text-white shadow-black/30 hover:bg-[#8B85FF]"
                : "bg-white text-[#4F46E5] shadow-black/15 ring-1 ring-[#7C76FF]/40 hover:bg-[#F5F3FF]"
            }`}
          >
            <img
              src="https://work.mercor.com/icon.svg"
              alt=""
              width={16}
              height={16}
              className={`size-4 shrink-0 sm:size-[18px] ${
                isScrolled ? "brightness-0 invert" : ""
              }`}
              aria-hidden
            />
            <span className="hidden sm:inline">Find Remote Jobs</span>
            <span className="sm:hidden">Remote Jobs</span>
          </a>
        </div>
      </div>
    </header>
  );
}
