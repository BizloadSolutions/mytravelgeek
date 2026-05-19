import Image from "next/image";

export default function Header() {
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
                src="/images/logo.svg"
                alt="logo"
                width={150}
                height={32}
                className="h-full w-full object-contain"
                style={{ width: "auto", height: "auto" }}
              />
            </a>
          </div>
          <div className="sm:hidden block h-7">
            <a
              href="/"
              className="shrink-0 text-lg font-semibold tracking-tight text-text-color no-underline transition-colors hover:text-[color:var(--primary-600)]"
            >
              <Image
                src="/images/logo-sm.svg"
                alt="logo"
                width={32}
                height={28}
                className="h-full w-full object-contain"
                style={{ width: "auto", height: "auto" }}
              />
            </a>
          </div>
          <div className="flex">
            <a href="#" className="btn btn-primary text-xs sm:text-sm">
              MyTravelGeek for Brands
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
