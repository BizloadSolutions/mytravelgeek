"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

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
      className="site-header w-full fixed top-0 z-50 transition-[background,box-shadow,backdrop-filter] duration-300 ease-out"
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
          <div className="flex">
            <a href="#" className="btn btn-primary">
              MyTravelGeek for Brands
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
