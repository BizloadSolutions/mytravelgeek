export default function ChatHelp() {
  const venueDescription =
    "A two-story Irish bar in the Financial District that's equal parts history and hospitality. Downstairs, the Taproom buzzes with energy and perfect pints of Gu";

  const tours = [
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
  const venues = [
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

  return (
    <>
      <div className="flex w-full lg:max-w-[80%] max-w-[90%] flex-col gap-3.5 self-stretch rounded-br-lg rounded-tl-lg rounded-tr-lg bg-[var(--primary-50)] p-3">
        <div className="flex flex-col gap-1">
          <b className="text-base text-[var(--main-primary)]">Folegandros</b>
          <p className="m-0 text-sm font-normal">
            I found the following flights in Economy className for 1 adult from
            JFK to MAD on May 25th:
          </p>
        </div>
        <div className="flex flex-col gap-2.5 self-stretch">
          <article className="flex flex-col self-stretch overflow-hidden rounded-lg bg-white">
            <div className="flex flex-col gap-3.5 px-3.5 py-3">
              <div className="flex items-center gap-2.5 self-stretch">
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <span
                    className="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-400 text-[10px] font-bold text-white"
                    aria-hidden="true"
                  >
                    <img src="/" alt="logo" />
                  </span>
                  <div className="flex min-w-0 flex-col justify-center gap-0.5">
                    <span className="text-sm font-semibold">Spicejet</span>
                    <span className="text-xs font-normal text-zinc-600">
                      25th May 26
                    </span>
                  </div>
                </div>
                <span className="shrink-0 rounded-[59px] border border-solid border-[#fcdacf] bg-[var(--primary-50)] px-3 py-1 text-xs font-medium text-[#f26537]">
                  BEST
                </span>
              </div>
              <div className="flex items-center gap-2.5 self-stretch rounded-xl bg-neutral-50 px-2.5 py-2">
                <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 text-center">
                  <span className="text-sm font-extrabold">4:20 pm</span>
                  <span className="text-xs font-normal text-zinc-600">
                    New York
                  </span>
                </div>
                <div className="relative flex min-w-0 flex-1 flex-col items-center justify-center gap-1.5">
                  <svg
                    width="70"
                    height="12"
                    viewBox="0 0 70 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <line
                      y1="6"
                      x2="70"
                      y2="6"
                      stroke="#E5E7EB"
                      strokeDasharray="3 3"
                    />
                    <path
                      d="M33.8737 1.125H33.2498C33.1871 1.12502 33.1254 1.14076 33.0703 1.17077C33.0153 1.20078 32.9687 1.24412 32.9347 1.29681C32.9007 1.3495 32.8805 1.40986 32.8759 1.47238C32.8713 1.5349 32.8824 1.59758 32.9083 1.65469L34.4191 4.98867L32.1505 5.03906L31.3232 4.03664C31.1655 3.83836 31.0396 3.75 30.7185 3.75H30.2985C30.232 3.74786 30.166 3.76178 30.106 3.79059C30.046 3.81939 29.9939 3.86223 29.954 3.91547C29.8982 3.9907 29.8434 4.1182 29.8968 4.30008L30.3613 5.96414C30.3648 5.97656 30.3691 5.98898 30.3737 6.00117C30.374 6.00233 30.374 6.00353 30.3737 6.00469C30.3689 6.01687 30.3648 6.02931 30.3613 6.04195L29.8963 7.71656C29.8459 7.89492 29.901 8.01961 29.9563 8.09297C29.9935 8.14225 30.0417 8.18214 30.097 8.20941C30.1524 8.23668 30.2134 8.25058 30.2751 8.25H30.7185C30.9583 8.25 31.191 8.14242 31.3279 7.96875L32.1381 6.9832L34.4191 7.01695L32.9087 10.3451C32.8828 10.4022 32.8717 10.4648 32.8762 10.5273C32.8808 10.5899 32.901 10.6502 32.9349 10.7029C32.9688 10.7556 33.0154 10.799 33.0704 10.8291C33.1254 10.8591 33.1871 10.8749 33.2498 10.875H33.8805C33.9685 10.8732 34.0549 10.8517 34.1334 10.8119C34.2119 10.7721 34.2805 10.7152 34.334 10.6453L37.2648 7.08281L38.6188 7.11844C38.718 7.12383 38.9927 7.1257 39.0562 7.1257C40.3513 7.125 41.1248 6.70453 41.1248 6C41.1248 5.77828 41.0362 5.36719 40.4434 5.10563C40.0935 4.95094 39.6266 4.87266 39.0557 4.87266C38.9929 4.87266 38.7189 4.87453 38.6184 4.87992L37.2646 4.91602L34.3265 1.35352C34.2729 1.28394 34.2045 1.22728 34.1261 1.18772C34.0477 1.14817 33.9614 1.12673 33.8737 1.125Z"
                      fill="#D1D5DB"
                    />
                  </svg>
                  <span className="relative z-[1] bg-neutral-50 px-0.5 text-xs font-light text-zinc-600">
                    Non-stop
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 text-center">
                  <span className="text-sm font-extrabold">5:35 am</span>
                  <span className="text-xs font-normal text-zinc-600">
                    Madrid
                  </span>
                </div>
              </div>
              <p className="m-0 text-xs font-normal text-zinc-600">
                British Airways &bull; Economy &bull; Non-stop &bull; 7h 15m
              </p>
            </div>
            <div className="flex items-center gap-2.5 self-stretch bg-[#0f3a5d] px-3.5 py-1.5">
              <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5">
                <p className="text-xs font-normal text-white w-full">
                  Total Price
                </p>
                <p className="text-sm font-extrabold text-white w-full">
                  &#8377;63,027
                </p>
              </div>
              <button
                type="button"
                className="flex h-8 shrink-0 items-center justify-center rounded-[10px] bg-[#f26537] px-[15px] text-sm font-semibold text-white transition hover:opacity-90"
              >
                Reserve Now
              </button>
            </div>
          </article>
          <article className="flex flex-col self-stretch overflow-hidden rounded-lg bg-white">
            <div className="flex flex-col gap-3.5 px-3.5 py-3">
              <div className="flex items-center gap-2.5 self-stretch">
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <span
                    className="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-400 text-[10px] font-bold text-white"
                    aria-hidden="true"
                  >
                    <img src="/" alt="logo" />
                  </span>
                  <div className="flex min-w-0 flex-col justify-center gap-0.5">
                    <span className="text-sm font-semibold">Spicejet</span>
                    <span className="text-xs font-normal text-zinc-600">
                      25th May 26
                    </span>
                  </div>
                </div>
                <span className="shrink-0 rounded-[59px] border border-solid border-green-100 bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
                  CHEAPEST
                </span>
              </div>
              <div className="flex items-center gap-2.5 self-stretch rounded-xl bg-neutral-50 px-2.5 py-2">
                <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 text-center">
                  <span className="text-sm font-extrabold">4:20 pm</span>
                  <span className="text-xs font-normal text-zinc-600">
                    New York
                  </span>
                </div>
                <div className="relative flex min-w-0 flex-1 flex-col items-center justify-center gap-1.5">
                  <svg
                    width="70"
                    height="12"
                    viewBox="0 0 70 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <line
                      y1="6"
                      x2="70"
                      y2="6"
                      stroke="#E5E7EB"
                      strokeDasharray="3 3"
                    />
                    <path
                      d="M33.8737 1.125H33.2498C33.1871 1.12502 33.1254 1.14076 33.0703 1.17077C33.0153 1.20078 32.9687 1.24412 32.9347 1.29681C32.9007 1.3495 32.8805 1.40986 32.8759 1.47238C32.8713 1.5349 32.8824 1.59758 32.9083 1.65469L34.4191 4.98867L32.1505 5.03906L31.3232 4.03664C31.1655 3.83836 31.0396 3.75 30.7185 3.75H30.2985C30.232 3.74786 30.166 3.76178 30.106 3.79059C30.046 3.81939 29.9939 3.86223 29.954 3.91547C29.8982 3.9907 29.8434 4.1182 29.8968 4.30008L30.3613 5.96414C30.3648 5.97656 30.3691 5.98898 30.3737 6.00117C30.374 6.00233 30.374 6.00353 30.3737 6.00469C30.3689 6.01687 30.3648 6.02931 30.3613 6.04195L29.8963 7.71656C29.8459 7.89492 29.901 8.01961 29.9563 8.09297C29.9935 8.14225 30.0417 8.18214 30.097 8.20941C30.1524 8.23668 30.2134 8.25058 30.2751 8.25H30.7185C30.9583 8.25 31.191 8.14242 31.3279 7.96875L32.1381 6.9832L34.4191 7.01695L32.9087 10.3451C32.8828 10.4022 32.8717 10.4648 32.8762 10.5273C32.8808 10.5899 32.901 10.6502 32.9349 10.7029C32.9688 10.7556 33.0154 10.799 33.0704 10.8291C33.1254 10.8591 33.1871 10.8749 33.2498 10.875H33.8805C33.9685 10.8732 34.0549 10.8517 34.1334 10.8119C34.2119 10.7721 34.2805 10.7152 34.334 10.6453L37.2648 7.08281L38.6188 7.11844C38.718 7.12383 38.9927 7.1257 39.0562 7.1257C40.3513 7.125 41.1248 6.70453 41.1248 6C41.1248 5.77828 41.0362 5.36719 40.4434 5.10563C40.0935 4.95094 39.6266 4.87266 39.0557 4.87266C38.9929 4.87266 38.7189 4.87453 38.6184 4.87992L37.2646 4.91602L34.3265 1.35352C34.2729 1.28394 34.2045 1.22728 34.1261 1.18772C34.0477 1.14817 33.9614 1.12673 33.8737 1.125Z"
                      fill="#D1D5DB"
                    />
                  </svg>
                  <span className="relative z-[1] bg-neutral-50 px-0.5 text-xs font-light text-zinc-600">
                    2 stops
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 text-center">
                  <span className="text-sm font-extrabold">5:35 am</span>
                  <span className="text-xs font-normal text-zinc-600">
                    Madrid
                  </span>
                </div>
              </div>
              <p className="m-0 text-xs font-normal text-zinc-600">
                British Airways &bull; Economy &bull; 2 stops &bull; 7h 15m
              </p>
              <button
                type="button"
                className="flight-stops-toggle inline-flex items-center gap-1.5 border-0 bg-transparent p-0 text-xs font-semibold text-[#f26537]"
                aria-expanded="false"
              >
                <span className="flight-stops-toggle__label">View Stops</span>
                <i
                  className="ti ti-chevron-down flight-stops-toggle__icon text-sm leading-none"
                  aria-hidden="true"
                ></i>
              </button>
              <div className="flight-stops-panel hidden flex flex-col gap-2.5 self-stretch">
                {[0, 1].map((stop) => (
                  <div
                    key={stop}
                    className="flex flex-col gap-2.5 self-stretch rounded-xl border border-solid border-gray-200 p-3"
                  >
                    <div className="flex items-center gap-2 self-stretch">
                      <span
                        className="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-400 text-[10px] font-bold text-white"
                        aria-hidden="true"
                      >
                        <img src="/" alt="logo" />
                      </span>
                      <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5">
                        <span className="text-sm font-semibold">
                          Icelandair
                        </span>
                        <span className="text-xs font-normal text-zinc-600">
                          7h Connect in airport
                        </span>
                      </div>
                    </div>
                    <div className="flex items-stretch gap-2.5 self-stretch">
                      <div className="flex flex-col items-center py-0.5">
                        <span className="size-2 shrink-0 rounded-full border border-zinc-300 bg-white"></span>
                        <span className="min-h-8 w-px flex-1 border-l border-dashed border-zinc-300"></span>
                        <span className="size-2 shrink-0 rounded-full border border-zinc-300 bg-white"></span>
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
                        <div className="flex items-center justify-between gap-2 self-stretch">
                          <span className="text-sm font-medium">4:20 pm</span>
                          <span className="text-xs font-normal text-zinc-600">
                            New York
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-2 self-stretch">
                          <span className="text-sm font-medium">5:35 am</span>
                          <span className="text-xs font-normal text-zinc-600">
                            Madrid
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2.5 self-stretch bg-[#0f3a5d] px-3.5 py-1.5">
              <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5">
                <p className="text-xs font-normal text-white  w-full">
                  Total Price
                </p>
                <p className="text-sm font-extrabold text-white  w-full">
                  &#8377;63,027
                </p>
              </div>
              <button
                type="button"
                className="flex h-8 shrink-0 items-center justify-center rounded-[10px] bg-[#f26537] px-[15px] text-sm font-semibold text-white transition hover:opacity-90"
              >
                Reserve Now
              </button>
            </div>
          </article>
        </div>
      </div>

      <div className="flex w-full lg:max-w-[80%] max-w-[90%] flex-col gap-3.5 self-stretch rounded-br-lg rounded-tl-lg rounded-tr-lg bg-[var(--primary-50)] p-3">
        <p className="m-0 text-sm font-normal">
          New York’s bar and restaurant scene is legendary, and these spots each
          bring their own flavor to the city’s energy — from historic Irish pubs
          to sleek Midtown lounges.
        </p>

        <div className="flex flex-col gap-3.5 self-stretch">
          {venues.map((venue) => (
            <article
              key={venue.name}
              className="flex flex-col self-stretch overflow-hidden rounded-lg bg-white"
            >
              <div className="relative h-[152px] w-full shrink-0 overflow-hidden">
                <img
                  src={venue.image}
                  alt=""
                  className="h-full w-full object-cover"
                  width="320"
                  height="152"
                  loading="lazy"
                />
                <span className="absolute left-2 top-2 inline-flex items-center gap-[5px] rounded-[59px] bg-green-600 px-2 py-1">
                  <i
                    className="ti ti-star-filled text-sm leading-none text-white"
                    aria-hidden="true"
                  ></i>
                  <span className="text-xs font-medium text-white">4.8</span>
                </span>
                <button
                  type="button"
                  className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50"
                  aria-label="Save"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
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
                    {venueDescription}...
                    <button
                      type="button"
                      className="border-0 bg-transparent p-0 text-xs font-normal text-[#f26537]"
                    >
                      read more
                    </button>
                  </p>
                </div>
                <button
                  type="button"
                  className="venue-view-website flex h-8 w-full items-center justify-center self-stretch rounded-[10px] border border-solid border-[#f26537] bg-white px-[15px] text-xs font-semibold text-[#f26537] transition hover:bg-[#f26537]/5"
                  data-venue-name={venue.name}
                  data-venue-category={venue.category}
                  data-venue-hours={venue.hours}
                  data-venue-address={`${venue.name}, New York`}
                >
                  View Website
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="flex w-full lg:max-w-[80%] max-w-[90%] flex-col gap-3.5 self-stretch rounded-br-lg rounded-tl-lg rounded-tr-lg bg-[var(--primary-50)] p-3">
        <p className="m-0 text-sm font-normal">
          Here are some great tours and excursions you can enjoy in New York
          City, USA, based on your request for “tours in New York, New York,
          United States.
        </p>

        <div className="flex flex-col gap-2.5 self-stretch">
          {tours.map((tour) => (
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
                      width="80"
                      height="80"
                      loading="lazy"
                    />
                    <button
                      type="button"
                      className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50"
                      aria-label="Save tour"
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
                    <div className="flex items-start justify-between gap-1 self-stretch">
                      <span className="min-w-0 text-sm font-semibold leading-snug text-zinc-950">
                        {tour.title}
                      </span>
                      <span className="inline-flex shrink-0 items-center gap-[5px] rounded-[59px] bg-green-600 px-2 py-1">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M7.00015 10.3543L3.39982 12.2472L4.08757 8.23797L1.1709 5.39889L5.1959 4.81555L6.99606 1.16797L8.79623 4.81555L12.8212 5.39889L9.90456 8.23797L10.5923 12.2472L7.00015 10.3543Z"
                            fill="white"
                          />
                        </svg>
                        <span className="text-xs font-medium text-white">
                          4.8
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 self-stretch">
                      <i
                        className="ti ti-clock text-[15px] leading-none text-zinc-600"
                        aria-hidden="true"
                      ></i>
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
                  Reserve for &#8377;{tour.price}
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="flex w-full lg:max-w-[80%] max-w-[90%] flex-col gap-3.5 self-stretch rounded-br-lg rounded-tl-lg rounded-tr-lg bg-[var(--primary-50)] p-3">
        <p className="m-0 text-sm font-normal">
          I can help you find the most direct driving routes to{" "}
          <span className="text-[var(--main-primary)]">New York</span> for
          October 2, 2024 — but I’ll need to know where you’re starting from
          first. Could you tell me your departure city or region?
        </p>

        <div className="grid grid-cols-2 gap-2.5 self-stretch">
          <button
            type="button"
            className="flex min-w-0 flex-col rounded-lg bg-white text-left transition hover:ring-2 hover:ring-[#f26537]/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f26537]"
          >
            <div className="flex flex-col gap-2.5 p-2">
              <div className="flex flex-col justify-center gap-2.5 self-stretch">
                <img
                  src="/images/banner.png"
                  alt="New York skyline and Statue of Liberty"
                  className="h-[109px] w-full rounded-lg object-cover"
                  width="280"
                  height="109"
                  loading="lazy"
                />
                <span className="text-sm font-semibold text-zinc-950">
                  New York
                </span>
              </div>
            </div>
          </button>
          <button
            type="button"
            className="flex min-w-0 flex-col rounded-lg bg-white text-left transition hover:ring-2 hover:ring-[#f26537]/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f26537]"
          >
            <div className="flex flex-col gap-2.5 p-2">
              <div className="flex flex-col justify-center gap-2.5 self-stretch">
                <img
                  src="/images/banner.png"
                  alt="United States city skyline"
                  className="h-[109px] w-full rounded-lg object-cover"
                  width="280"
                  height="109"
                  loading="lazy"
                />
                <span className="text-sm font-semibold text-zinc-950">
                  United States
                </span>
              </div>
            </div>
          </button>
        </div>
      </div>

      <div className="flex w-full lg:max-w-[80%] max-w-[90%] flex-col gap-3.5 self-stretch rounded-br-lg rounded-tl-lg rounded-tr-lg bg-[var(--primary-50)] p-3">
        <p className="m-0 text-sm font-normal">
          Driving from <span className="text-[var(--main-primary)]">Spain</span>{" "}
          to <span className="text-[var(--main-primary)]">New York</span>
          isn’t possible due to the Atlantic Ocean separating Europe and North
          America. The most direct way to make this journey is by air —
          typically a nonstop flight from major Spanish airports like
        </p>

        <div className="flex flex-col gap-2.5 self-stretch">
          <div className="flex flex-col self-stretch rounded-lg bg-white">
            <div className="flex flex-col gap-2.5 self-stretch p-2">
              <div className="flex items-center gap-2.5 self-stretch">
                <span
                  className="flex size-[30px] shrink-0 items-center justify-center rounded-full bg-gray-100"
                  aria-hidden="true"
                >
                  <i className="ti ti-plane text-[15px] leading-none text-zinc-700"></i>
                </span>
                <span className="min-w-0 text-sm font-normal text-zinc-950">
                  Adolfo Su&aacute;rez Madrid-Barajas Airport or
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col self-stretch rounded-lg bg-white">
            <div className="flex flex-col gap-2.5 self-stretch p-2">
              <div className="flex items-center gap-2.5 self-stretch">
                <span
                  className="flex size-[30px] shrink-0 items-center justify-center rounded-full bg-gray-100"
                  aria-hidden="true"
                >
                  <i className="ti ti-plane text-[15px] leading-none text-zinc-700"></i>
                </span>
                <span className="min-w-0 text-sm font-normal text-zinc-950">
                  Josep Tarradellas Barcelona-El Prat Airport to
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col self-stretch rounded-lg bg-white">
            <div className="flex flex-col gap-2.5 self-stretch p-2">
              <div className="flex items-center gap-2.5 self-stretch">
                <span
                  className="flex size-[30px] shrink-0 items-center justify-center rounded-full bg-gray-100"
                  aria-hidden="true"
                >
                  <i className="ti ti-plane text-[15px] leading-none text-zinc-700"></i>
                </span>
                <span className="min-w-0 text-sm font-normal text-zinc-950">
                  Adolfo Su&aacute;rez Madrid-Barajas Airport
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
