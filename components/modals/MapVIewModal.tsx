import ShowHotelOnMapWithPrice from "../ShowHotelOnMapWithPrice";
import ShowHotelOnMap from "../ShowHotelOnMap";

export default function MapViewModal() {
  const ratingBars = [
    { label: "5 star", count: "100", width: "80%" },
    { label: "4 star", count: "500", width: "49%" },
    { label: "3 star", count: "10", width: "36%" },
    { label: "2 star", count: "20", width: "5%" },
    { label: "1 star", count: "5", width: "11%" },
  ];

  const venueGalleryImages = [
    "/images/banner.png",
    "/images/banner.png",
    "/images/banner.png",
  ];

  const venueSchedule = [
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
    "Monday",
    "Tuesday",
  ];

  const venueReviews = [
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

  return (
    <div
      id="modal-map-column"
      className="modal-map-column relative flex min-h-0 min-w-0 flex-1 flex-col self-stretch max-md:absolute max-md:inset-0 max-md:z-30"
    >
      <div
        id="modal-map-panel"
        className="relative isolate hidden min-h-0 min-w-0 flex-1 flex-col gap-2.5 self-stretch p-2.5 max-md:absolute max-md:inset-0 max-md:z-0 max-md:bg-white max-md:p-0 md:flex md:min-h-[280px] md:min-h-0 md:border-l md:border-solid md:border-gray-100"
      >
        <iframe
          title="Map — New York / Newark area"
          className="h-full w-full rounded-none border-0 md:rounded-xl"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src="https://maps.google.com/maps?q=40.735,-74.05&amp;z=11&amp;hl=en&amp;output=embed"
        ></iframe>

        <div className="absolute left-5 top-5 z-10 hidden md:block">
          <button
            type="button"
            id="modal-map-show-chat"
            className="pointer-events-auto flex h-[37px] w-[34px] items-center justify-center rounded-md bg-white shadow-[0px_2px_5px_0px_rgba(0,0,0,0.2)]"
            aria-label="Show chat"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 4V20M9 10L11 12L9 14M4 6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V18C20 18.5304 19.7893 19.0391 19.4142 19.4142C19.0391 19.7893 18.5304 20 18 20H6C5.46957 20 4.96086 19.7893 4.58579 19.4142C4.21071 19.0391 4 18.5304 4 18V6Z"
                stroke="#374151"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <div className="absolute top-5 right-5 flex flex-col gap-2 z-10">
          <button
            type="button"
            className="pointer-events-auto flex w-[34px] h-[37px] items-center justify-center rounded-md bg-white shadow-[0px_2px_5px_0px_rgba(0,0,0,0.2)]"
            aria-label="Map type"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 8V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H8M4 16V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20H8M16 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V8M16 20H18C18.5304 20 19.0391 19.7893 19.4142 19.4142C19.7893 19.0391 20 18.5304 20 18V16"
                stroke="#374151"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            className="pointer-events-auto flex w-[34px] h-[37px] items-center justify-center rounded-md bg-white shadow-[0px_2px_5px_0px_rgba(0,0,0,0.2)]"
            aria-label="Fullscreen map"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 4H20V6.172C19.9999 6.70239 19.7891 7.21101 19.414 7.586L15 12V19L9 21V12.5L4.52 7.572C4.18545 7.20393 4.00005 6.7244 4 6.227V4Z"
                stroke="#374151"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div className="rounded-md bg-white shadow-[0px_2px_5px_0px_rgba(0,0,0,0.2)]">
            <button
              type="button"
              className="pointer-events-auto flex w-[34px] h-[36px] items-center justify-center  "
              aria-label="Zoom in"
            >
              <i className="ti ti-plus text-lg leading-none text-zinc-800"></i>
            </button>
            <button
              type="button"
              className="pointer-events-auto flex w-[34px] h-[36px] items-center justify-center  "
              aria-label="Zoom out"
            >
              <i className="ti ti-minus text-lg leading-none text-zinc-800"></i>
            </button>
          </div>
        </div>

        <div className="absolute z-[1] bottom-[50%] left-[40%] ">
          <button
            type="button"
            className="pointer-events-auto flex size-[37px] items-center justify-center rounded-full bg-[#0f3a5d] text-white shadow-md hover:opacity-90"
            aria-label="Center map"
          >
            <i className="ti ti-map-pin text-lg leading-none"></i>
          </button>
        </div>

        <ShowHotelOnMapWithPrice />

        <ShowHotelOnMap />
      </div>

      <div
        id="modal-venue-detail-panel"
        className="modal-venue-detail-panel relative isolate hidden min-h-0 min-w-0 flex-col self-stretch overflow-hidden border-solid border-gray-100 bg-white max-md:absolute max-md:inset-0 max-md:z-40 max-md:flex-1 md:absolute md:inset-y-0 md:right-0 md:z-20 md:w-full md:border-l md:shadow-[-4px_0_24px_rgba(0,0,0,0.12)]"
        aria-hidden="true"
      >
        <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto overscroll-contain p-2.5">
          <div className="flex items-center justify-between self-stretch">
            <button
              type="button"
              id="modal-venue-detail-back"
              className="flex size-6 shrink-0 items-center justify-center border-0 bg-transparent p-0 text-zinc-700"
              aria-label="Back"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 6L9 12L15 18"
                  stroke="#374151"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              className="flex size-[30px] shrink-0 items-center justify-center rounded-lg border border-solid border-black/10 bg-white"
              aria-label="Save to favorites"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.9999 8.38145L7.99988 13.3335L2.99988 8.38145C2.67008 8.06053 2.4103 7.67479 2.23691 7.24854C2.06351 6.82229 1.98025 6.36475 1.99237 5.90474C2.00448 5.44473 2.11172 4.99221 2.30731 4.57568C2.50291 4.15914 2.78263 3.78762 3.12887 3.4845C3.4751 3.18139 3.88035 2.95324 4.31908 2.81444C4.75782 2.67563 5.22055 2.62917 5.67812 2.67799C6.1357 2.7268 6.57821 2.86982 6.97779 3.09806C7.37738 3.32629 7.72537 3.63478 7.99988 4.00412C8.27556 3.63747 8.62397 3.33166 9.02328 3.10585C9.42258 2.88004 9.8642 2.73908 10.3205 2.6918C10.7768 2.64451 11.2379 2.69192 11.6751 2.83105C12.1122 2.97017 12.5159 3.19803 12.8609 3.50036C13.2059 3.80269 13.4848 4.17297 13.6802 4.58805C13.8755 5.00312 13.983 5.45404 13.9961 5.91259C14.0091 6.37114 13.9274 6.82745 13.756 7.25295C13.5845 7.67846 13.3271 8.064 12.9999 8.38545"
                  fill="#DC2626"
                />
              </svg>
            </button>
          </div>

          <div className="modal-venue-gallery relative h-[200px] w-full shrink-0 overflow-hidden rounded-xl">
            <div className="swiper modal-venue-gallery__swiper h-full w-full">
              <div className="swiper-wrapper">
                {venueGalleryImages.map((galleryImage, galleryIndex) => (
                  <div key={galleryIndex} className="swiper-slide">
                    <img
                      src={galleryImage}
                      alt=""
                      className="h-full w-full object-cover"
                      width="494"
                      height="256"
                      loading={galleryIndex === 0 ? "eager" : "lazy"}
                    />
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="modal-venue-gallery__prev absolute left-2 top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white shadow-sm transition hover:bg-black/45"
                aria-label="Previous image"
              >
                <i
                  className="ti ti-chevron-left text-base leading-none"
                  aria-hidden="true"
                ></i>
              </button>
              <button
                type="button"
                className="modal-venue-gallery__next absolute right-2 top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white shadow-sm transition hover:bg-black/45"
                aria-label="Next image"
              >
                <i
                  className="ti ti-chevron-right text-base leading-none"
                  aria-hidden="true"
                ></i>
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-5 self-stretch mt-2.5">
            <div className="flex flex-col gap-0.5 self-stretch">
              <div className="flex items-center justify-between gap-2 self-stretch">
                <h2
                  id="modal-venue-detail-title"
                  className="m-0 min-w-0 text-lg font-bold text-zinc-950"
                >
                  The Malt House
                </h2>
                <span className="inline-flex shrink-0 items-center gap-[5px] rounded-[59px] bg-green-600 px-2 py-1">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6.9999 10.3543L3.39957 12.2472L4.08732 8.23797L1.17065 5.39889L5.19565 4.81555L6.99582 1.16797L8.79599 4.81555L12.821 5.39889L9.90432 8.23797L10.5921 12.2472L6.9999 10.3543Z"
                      fill="white"
                    />
                  </svg>
                  <span className="text-xs text-white">4.8</span>
                </span>
              </div>
              <p className="m-0 flex flex-wrap items-center gap-1.5 text-sm font-normal text-zinc-600">
                <span id="modal-venue-detail-category">Bar $$ |</span>
                <span id="modal-venue-detail-hours">Opens at 11:00 AM</span>
              </p>
            </div>

            <div
              className="flex gap-2.5 self-stretch rounded-2xl"
              role="tablist"
              aria-label="Venue sections"
            >
              <button
                type="button"
                className="venue-detail-tab flex flex-1 items-center justify-center rounded-lg bg-[#0f3a5d] px-4 py-2 text-sm font-semibold text-white"
                role="tab"
                aria-selected="true"
                data-venue-tab="overview"
              >
                Overview
              </button>
              <button
                type="button"
                className="venue-detail-tab flex flex-1 items-center justify-center rounded-lg bg-gray-100 px-4 py-2 text-sm font-normal text-gray-700"
                role="tab"
                aria-selected="false"
                data-venue-tab="location"
              >
                Location
              </button>
              <button
                type="button"
                className="venue-detail-tab flex flex-1 items-center justify-center rounded-lg bg-gray-100 px-4 py-2 text-sm font-normal text-gray-700"
                role="tab"
                aria-selected="false"
                data-venue-tab="reviews"
              >
                Reviews
              </button>
            </div>

            <div
              id="venue-tab-overview"
              className="venue-tab-panel flex flex-col gap-4 self-stretch"
              role="tabpanel"
            >
              <p className="m-0 text-sm font-normal text-zinc-950">
                A lively sports bar in the Financial District with great pub
                food and tons of TVs. The pork quesadilla is a crowd favorite,
                and the staff's hospitality makes it a go-to for group events or
                casual nights out.
              </p>

              <div className="flex flex-col gap-3 self-stretch border-b border-solid border-gray-100 pb-2">
                <button
                  type="button"
                  id="modal-venue-hours-toggle"
                  className="flex w-full items-center gap-2 border-0 bg-transparent p-0 text-left"
                  aria-expanded="true"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 7V12L15 15M3 12C3 13.1819 3.23279 14.3522 3.68508 15.4442C4.13738 16.5361 4.80031 17.5282 5.63604 18.364C6.47177 19.1997 7.46392 19.8626 8.55585 20.3149C9.64778 20.7672 10.8181 21 12 21C13.1819 21 14.3522 20.7672 15.4442 20.3149C16.5361 19.8626 17.5282 19.1997 18.364 18.364C19.1997 17.5282 19.8626 16.5361 20.3149 15.4442C20.7672 14.3522 21 13.1819 21 12C21 9.61305 20.0518 7.32387 18.364 5.63604C16.6761 3.94821 14.3869 3 12 3C9.61305 3 7.32387 3.94821 5.63604 5.63604C3.94821 7.32387 3 9.61305 3 12Z"
                      stroke="#F26537"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-sm font-semibold text-red-600">
                    Closed Now
                  </span>
                  <span className="text-sm font-normal text-zinc-600">
                    Opens at 7am
                  </span>
                  <i
                    className="ti ti-chevron-up modal-venue-hours-toggle__icon text-sm leading-none text-zinc-500"
                    aria-hidden="true"
                  ></i>
                </button>
                <div
                  id="modal-venue-hours-list"
                  className="flex flex-col gap-1.5 self-stretch"
                >
                  {venueSchedule.map((day) => (
                    <div
                      key={day}
                      className="flex items-center gap-2 self-stretch"
                    >
                      <span className="text-xs font-normal text-zinc-950 w-full max-w-[100px]">
                        {day}
                      </span>
                      <span className="text-xs font-normal text-zinc-950">
                        11:00 AM - 4:00 AM
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <a
                id="modal-venue-detail-address"
                href="https://www.google.com/maps/search/?api=1&query=118+Nassau+St,+New+York"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 self-stretch border-b border-solid border-gray-100 pb-2 text-sm font-normal text-zinc-600 underline"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 11.0002C9 11.7958 9.31607 12.5589 9.87868 13.1215C10.4413 13.6841 11.2044 14.0002 12 14.0002C12.7956 14.0002 13.5587 13.6841 14.1213 13.1215C14.6839 12.5589 15 11.7958 15 11.0002C15 10.2045 14.6839 9.44149 14.1213 8.87888C13.5587 8.31627 12.7956 8.0002 12 8.0002C11.2044 8.0002 10.4413 8.31627 9.87868 8.87888C9.31607 9.44149 9 10.2045 9 11.0002Z"
                    stroke="#F26537"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M17.657 16.6572L13.414 20.9002C13.039 21.2748 12.5306 21.4853 12.0005 21.4853C11.4704 21.4853 10.962 21.2748 10.587 20.9002L6.343 16.6572C5.22422 15.5384 4.46234 14.1129 4.15369 12.5611C3.84504 11.0092 4.00349 9.40071 4.60901 7.93893C5.21452 6.47714 6.2399 5.22774 7.55548 4.3487C8.87107 3.46967 10.4178 3.00049 12 3.00049C13.5822 3.00049 15.1289 3.46967 16.4445 4.3487C17.7601 5.22774 18.7855 6.47714 19.391 7.93893C19.9965 9.40071 20.155 11.0092 19.8463 12.5611C19.5377 14.1129 18.7758 15.5384 17.657 16.6572Z"
                    stroke="#F26537"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                118 Nassau St, New York
              </a>
              <a
                href="http://instagram.com/nassaubarnyc"
                className="flex items-center gap-2 self-stretch border-b border-solid border-gray-100 pb-2 text-sm font-normal text-zinc-600 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.6 9H20.4M3.6 15H20.4M11.5 3C9.81534 5.69961 8.9222 8.81787 8.9222 12C8.9222 15.1821 9.81534 18.3004 11.5 21M12.5 3C14.1847 5.69961 15.0778 8.81787 15.0778 12C15.0778 15.1821 14.1847 18.3004 12.5 21M3 12C3 13.1819 3.23279 14.3522 3.68508 15.4442C4.13738 16.5361 4.80031 17.5282 5.63604 18.364C6.47177 19.1997 7.46392 19.8626 8.55585 20.3149C9.64778 20.7672 10.8181 21 12 21C13.1819 21 14.3522 20.7672 15.4442 20.3149C16.5361 19.8626 17.5282 19.1997 18.364 18.364C19.1997 17.5282 19.8626 16.5361 20.3149 15.4442C20.7672 14.3522 21 13.1819 21 12C21 9.61305 20.0518 7.32387 18.364 5.63604C16.6761 3.94821 14.3869 3 12 3C9.61305 3 7.32387 3.94821 5.63604 5.63604C3.94821 7.32387 3 9.61305 3 12Z"
                    stroke="#F26537"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                http://instagram.com/nassaubarnyc
              </a>
              <a
                href="tel:+12123492219"
                className="flex items-center gap-2 self-stretch text-sm font-normal text-zinc-600 underline"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 4H9L11 9L8.5 10.5C9.57096 12.6715 11.3285 14.429 13.5 15.5L15 13L20 15V19C20 19.5304 19.7893 20.0391 19.4142 20.4142C19.0391 20.7893 18.5304 21 18 21C14.0993 20.763 10.4202 19.1065 7.65683 16.3432C4.8935 13.5798 3.23705 9.90074 3 6C3 5.46957 3.21071 4.96086 3.58579 4.58579C3.96086 4.21071 4.46957 4 5 4Z"
                    stroke="#F26537"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                +1 212-349-2219
              </a>

              <div className="flex flex-col gap-3.5 self-stretch rounded-2xl bg-[#f5faff] p-3">
                <span className="text-sm font-semibold text-zinc-950">
                  Keep Exploring
                </span>
                <div className="flex flex-col gap-2.5 self-stretch">
                  <button
                    type="button"
                    className="venue-explore-chip rounded-lg bg-white px-3 py-2 text-left text-xs font-normal text-zinc-950"
                    data-explore-prompt="What cocktails are recommended at Nassau Bar in New York?"
                  >
                    What cocktails are recommended at Nassau Bar in New York?
                  </button>
                  <button
                    type="button"
                    className="venue-explore-chip rounded-lg bg-white px-3 py-2 text-left text-xs font-normal text-zinc-950"
                    data-explore-prompt="How would you describe the atmosphere at Nassau Bar?"
                  >
                    How would you describe the atmosphere at Nassau Bar?
                  </button>
                  <button
                    type="button"
                    className="venue-explore-chip rounded-lg bg-white px-3 py-2 text-left text-xs font-normal text-zinc-950"
                    data-explore-prompt="Which bartenders are known for their service at Nassau Bar?"
                  >
                    Which bartenders are known for their service at Nassau Bar?
                  </button>
                </div>
              </div>
            </div>

            <div
              id="venue-tab-location"
              className="venue-tab-panel hidden flex-col gap-2 self-stretch"
              role="tabpanel"
              hidden
            >
              <div className="flex items-center gap-2 self-stretch">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 11.0002C9 11.7958 9.31607 12.5589 9.87868 13.1215C10.4413 13.6841 11.2044 14.0002 12 14.0002C12.7956 14.0002 13.5587 13.6841 14.1213 13.1215C14.6839 12.5589 15 11.7958 15 11.0002C15 10.2045 14.6839 9.44149 14.1213 8.87888C13.5587 8.31627 12.7956 8.0002 12 8.0002C11.2044 8.0002 10.4413 8.31627 9.87868 8.87888C9.31607 9.44149 9 10.2045 9 11.0002Z"
                    stroke="#F26537"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M17.657 16.6572L13.414 20.9002C13.039 21.2748 12.5306 21.4853 12.0005 21.4853C11.4704 21.4853 10.962 21.2748 10.587 20.9002L6.343 16.6572C5.22422 15.5384 4.46234 14.1129 4.15369 12.5611C3.84504 11.0092 4.00349 9.40071 4.60901 7.93893C5.21452 6.47714 6.2399 5.22774 7.55548 4.3487C8.87107 3.46967 10.4178 3.00049 12 3.00049C13.5822 3.00049 15.1289 3.46967 16.4445 4.3487C17.7601 5.22774 18.7855 6.47714 19.391 7.93893C19.9965 9.40071 20.155 11.0092 19.8463 12.5611C19.5377 14.1129 18.7758 15.5384 17.657 16.6572Z"
                    stroke="#F26537"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
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
                  src="https://maps.google.com/maps?q=40.7075,-74.0089&amp;z=15&amp;hl=en&amp;output=embed"
                ></iframe>
                <span
                  className="pointer-events-none absolute left-1/2 top-1/2 flex size-[25px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#0f3a5d] text-white shadow-md"
                  aria-hidden="true"
                >
                  <i className="ti ti-map-pin text-xs leading-none"></i>
                </span>
              </div>
            </div>

            <div
              id="venue-tab-reviews"
              className="venue-tab-panel hidden flex-col gap-4 self-stretch"
              role="tabpanel"
              hidden
            >
              <div className="flex flex-col gap-3.5 self-stretch rounded-2xl bg-[#f5faff] p-3">
                <div className="grid grid-cols-12 items-center justify-between gap-3 self-stretch">
                  <div className="flex flex-col items-center gap-1 lg:col-span-4 col-span-12">
                    <span className="text-[30px] font-extrabold leading-10 text-zinc-950">
                      4.0
                    </span>
                    <div className="flex items-center gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <svg
                          key={`summary-star-filled-${i}`}
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9.99986 14.7918L4.85653 17.496L5.83903 11.7685L1.67236 7.71262L7.42236 6.87929L9.99403 1.66846L12.5657 6.87929L18.3157 7.71262L14.149 11.7685L15.1315 17.496L9.99986 14.7918Z"
                            fill="#EAB308"
                          />
                        </svg>
                      ))}
                      {[0, 1].map((i) => (
                        <svg
                          key={`summary-star-empty-${i}`}
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9.99986 14.7918L4.85653 17.496L5.83903 11.7685L1.67236 7.71262L7.42236 6.87929L9.99403 1.66846L12.5657 6.87929L18.3157 7.71262L14.149 11.7685L15.1315 17.496L9.99986 14.7918Z"
                            fill="#E5E7EB"
                          />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs font-normal text-zinc-600">
                      (100 reviews)
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-[7px] lg:col-span-8 col-span-12">
                    {ratingBars.map((bar) => (
                      <div key={bar.label} className="flex items-center gap-2">
                        <span className="w-9 shrink-0 text-xs font-normal text-zinc-700">
                          {bar.label}
                        </span>
                        <div className="h-[5px] min-w-0 flex-1 overflow-hidden rounded-full bg-gray-200">
                          <div
                            className="h-full rounded-full bg-yellow-500"
                            style={{ width: bar.width }}
                          ></div>
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
                Philly, who seems to create a memorable experience for everyone.
                Reviewers appreciate the extensive drink selection and the
                affordable prices, making it a great spot for both locals and
                visitors alike. While some mention its dive bar appearance, the
                genuine hospitality and vibrant energy make it a must-visit for
                a fun night out.
              </p>

              <div className="flex flex-col gap-3.5 self-stretch">
                <span className="text-base font-bold text-zinc-950">
                  All Reviews
                </span>
                <div className="flex flex-col gap-4 self-stretch">
                  {venueReviews.map((review, index) => (
                    <article
                      key={index}
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
                        <div
                          className="flex shrink-0 items-center gap-1"
                          aria-label="3 out of 5 stars"
                        >
                          {[0, 1, 2].map((i) => (
                            <svg
                              key={`review-${index}-star-filled-${i}`}
                              width="17"
                              height="17"
                              viewBox="0 0 17 17"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M8.06436 11.9285L3.91651 14.1093L4.70885 9.49038L1.34863 6.21954L5.98573 5.5475L8.05965 1.34521L10.1336 5.5475L14.7707 6.21954L11.4105 9.49038L12.2028 14.1093L8.06436 11.9285Z"
                                fill="#EAB308"
                              />
                            </svg>
                          ))}
                          {[0, 1].map((i) => (
                            <svg
                              key={`review-${index}-star-empty-${i}`}
                              width="17"
                              height="17"
                              viewBox="0 0 17 17"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M8.06436 11.9285L3.91651 14.1093L4.70885 9.49038L1.34863 6.21954L5.98573 5.5475L8.05965 1.34521L10.1336 5.5475L14.7707 6.21954L11.4105 9.49038L12.2028 14.1093L8.06436 11.9285Z"
                                fill="#E5E7EB"
                              />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <p className="m-0 text-xs font-normal text-zinc-600">
                        {review.text}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
