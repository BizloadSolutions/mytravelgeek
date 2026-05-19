export default function ShowHotelOnMapWithPrice() {
  return (
    <div className="absolute bottom-[400px] left-[30%] z-[1] hidden md:block">
      <div className="pointer-events-auto flex w-[251px] max-w-[calc(100%-0.5rem)] flex-col gap-2 rounded-2xl bg-white p-2.5 shadow-md">
        <div className="flex items-start gap-2.5 border-b border-solid border-gray-100 pb-2">
          <div className="relative size-[72px] shrink-0 overflow-hidden rounded-lg">
            <img
              src="/images/banner.png"
              alt=""
              className="h-full w-full object-cover"
              width="72"
              height="72"
              loading="lazy"
            />
            <button
              type="button"
              className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50"
              aria-label="Save"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M13 8.38145L8 13.3335L3 8.38145C2.6702 8.06053 2.41043 7.67479 2.23703 7.24854C2.06363 6.82229 1.98037 6.36475 1.99249 5.90474C2.00461 5.44473 2.11184 4.99221 2.30744 4.57568C2.50303 4.15914 2.78275 3.78762 3.12899 3.4845C3.47522 3.18139 3.88047 2.95324 4.3192 2.81444C4.75794 2.67563 5.22067 2.62917 5.67824 2.67799C6.13582 2.7268 6.57833 2.86982 6.97791 3.09806C7.3775 3.32629 7.7255 3.63478 8 4.00412C8.27569 3.63747 8.62409 3.33166 9.0234 3.10585C9.42271 2.88004 9.86433 2.73908 10.3206 2.6918C10.7769 2.64451 11.2381 2.69192 11.6752 2.83105C12.1123 2.97017 12.516 3.19803 12.861 3.50036C13.206 3.80269 13.4849 4.17297 13.6803 4.58805C13.8756 5.00312 13.9832 5.45404 13.9962 5.91259C14.0092 6.37114 13.9275 6.82745 13.7561 7.25295C13.5847 7.67846 13.3273 8.064 13 8.38545"
                  stroke="white"
                  strokeWidth="0.933333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="inline-flex w-fit items-center gap-[5px] rounded-[59px] bg-green-600 px-1 py-0.5">
              <i
                className="ti ti-star-filled text-[10px] leading-none text-white"
                aria-hidden="true"
              ></i>
              <span className="text-[11px] font-medium leading-4 text-white">
                4.8
              </span>
            </span>
            <span className="text-xs font-semibold leading-snug text-zinc-950">
              NYC: Central Park Bike Rental
            </span>
            <div className="flex items-center gap-1.5">
              <i
                className="ti ti-clock text-[15px] leading-none text-zinc-600"
                aria-hidden="true"
              ></i>
              <span className="text-xs font-normal text-zinc-600">1 hr</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 self-stretch justify-between">
          <span className="shrink-0 text-sm font-semibold text-zinc-950">
            &#8377;406
          </span>
          <button
            type="button"
            className="venue-view-website flex h-8 w-fit items-center justify-center rounded-[10px] bg-[#f26537] px-[15px] text-sm font-semibold text-white transition hover:opacity-90"
            data-venue-name="NYC: Central Park Bike Rental"
            data-venue-category="Tour"
            data-venue-hours="1 hr"
            data-venue-address="NYC: Central Park Bike Rental, New York"
          >
            View More
          </button>
        </div>
      </div>
    </div>
  );
}
