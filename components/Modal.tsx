import { Fragment } from "react";

export default function Modal() {
  return (
    //    <!-- Custom Itinerary modal -->
    <>
      <dialog id="custom-itinerary-modal" className="modal">
        <div className="modal-box">
          <div className="modal_header">
            <button
              type="button"
              id="modal-mobile-menu-open"
              className="me-2.5 flex shrink-0 items-center justify-center border-0 bg-transparent p-0 md:hidden"
              aria-label="Open menu"
              aria-expanded="false"
              aria-controls="modal-mobile-nav"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
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
                <svg
                  className="modal_header__spark"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.6144 17.7956L11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916 0.821766 9.19319 0.821768 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C0.868537 9.26368 0.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899L19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z"
                    fill="url(#paint0_linear_64_7228)"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_64_7228"
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
              </div>
              <span className="modal_header__title">My Travel Geek AI</span>
            </div>
            <form method="dialog" className="modal_header__close-form">
              <button
                type="submit"
                className="modal_header__close-btn"
                aria-label="Close"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="#374151"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </form>
          </div>

          <div className="modal_body">
            <div className="modal_sidebar hidden md:flex">
              <button
                type="button"
                className="modal_sidebar__btn modal_sidebar__btn--active"
                aria-pressed="true"
                title="Compose"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.66675 4.66667H4.00008C3.64646 4.66667 3.30732 4.80714 3.05727 5.05719C2.80722 5.30724 2.66675 5.64638 2.66675 6V12C2.66675 12.3536 2.80722 12.6928 3.05727 12.9428C3.30732 13.1929 3.64646 13.3333 4.00008 13.3333H10.0001C10.3537 13.3333 10.6928 13.1929 10.9429 12.9428C11.1929 12.6928 11.3334 12.3536 11.3334 12V11.3333M10.6667 3.33333L12.6667 5.33333M13.5901 4.39C13.8526 4.12744 14.0002 3.77132 14.0002 3.4C14.0002 3.02868 13.8526 2.67257 13.5901 2.41C13.3275 2.14744 12.9714 1.99993 12.6001 1.99993C12.2288 1.99993 11.8726 2.14744 11.6101 2.41L6.00008 8V10H8.00008L13.5901 4.39Z"
                    stroke="white"
                    strokeWidth="0.933333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                type="button"
                className="modal_sidebar__btn modal_sidebar__btn--ghost"
                title="History"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.33333 6H10.6667M5.33333 8.66666H9.33333M12 2.66666C12.5304 2.66666 13.0391 2.87738 13.4142 3.25245C13.7893 3.62752 14 4.13623 14 4.66666V10C14 10.5304 13.7893 11.0391 13.4142 11.4142C13.0391 11.7893 12.5304 12 12 12H8.66667L5.33333 14V12H4C3.46957 12 2.96086 11.7893 2.58579 11.4142C2.21071 11.0391 2 10.5304 2 10V4.66666C2 4.13623 2.21071 3.62752 2.58579 3.25245C2.96086 2.87738 3.46957 2.66666 4 2.66666H12Z"
                    stroke="#374151"
                    strokeWidth="0.933333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                type="button"
                className="modal_sidebar__btn modal_sidebar__btn--ghost"
                title="Favorites"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.9999 8.38134L7.99987 13.3333L2.99988 8.38134C2.67008 8.06041 2.4103 7.67468 2.23691 7.24843C2.06351 6.82217 1.98025 6.36464 1.99237 5.90463C2.00448 5.44461 2.11172 4.99209 2.30731 4.57556C2.50291 4.15903 2.78263 3.78751 3.12887 3.48439C3.4751 3.18127 3.88035 2.95313 4.31908 2.81432C4.75782 2.67552 5.22055 2.62906 5.67812 2.67787C6.1357 2.72668 6.57821 2.86971 6.97779 3.09794C7.37738 3.32617 7.72537 3.63467 7.99987 4.004C8.27556 3.63735 8.62397 3.33155 9.02328 3.10574C9.42258 2.87993 9.8642 2.73897 10.3205 2.69168C10.7768 2.6444 11.2379 2.6918 11.6751 2.83093C12.1122 2.97006 12.5159 3.19792 12.8609 3.50025C13.2059 3.80257 13.4848 4.17286 13.6802 4.58793C13.8755 5.003 13.983 5.45393 13.9961 5.91248C14.0091 6.37103 13.9274 6.82733 13.756 7.25284C13.5845 7.67834 13.3271 8.06389 12.9999 8.38534"
                    stroke="#374151"
                    strokeWidth="0.933333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <div className="modal_content relative min-h-0 flex-1">
              <div
                id="modal-chat-panel"
                className="flex min-h-0 w-full min-w-0 flex-1 shrink-0 flex-col gap-5 self-stretch p-2.5 md:border-r md:border-solid md:border-gray-100"
              >
                <div className="flex min-h-0 max-h-[calc(100dvh-137px)] flex-1 flex-col gap-3.5 self-stretch overflow-y-auto overscroll-contain">
                  {[0, 1].map((i) => (
                    <Fragment key={i}>
                      <div className="flex w-full lg:max-w-[80%] max-w-[90%] flex-col gap-[25px] rounded-br-lg rounded-tl-lg rounded-tr-lg bg-[var(--primary-50)] p-3">
                        <div className="flex flex-col gap-2.5 self-stretch">
                          <p className="m-0 text-sm font-normal">
                            Hi! I’m My Travel Geek AI - your own personal Travel
                            Genius. I can help you with:
                          </p>
                          <ul className="m-0 list-disc space-y-1 pl-5 text-sm font-medium">
                            <li>Flights</li>
                            <li>Custom Itineraries</li>
                            <li>Hotels + Vacation Rentals</li>
                            <li>Restaurants + Bars</li>
                            <li>Tours + Excursions</li>
                            <li>Travel Safety</li>
                            <li>Most Direct Routes</li>
                            <li>Local Customs + Slang</li>
                            <li>Visas</li>
                          </ul>
                        </div>
                      </div>
                      <div className="flex gap-2.5 self-stretch rounded-2xl bg-white p-3 shadow-[0px_2px_5px_0px_rgba(0,0,0,0.2)]">
                        <div className="flex min-w-0 flex-1 flex-col gap-[25px] rounded-lg border border-solid border-black/10 bg-gray-50 px-3 py-2">
                          <span className="text-center text-xs font-normal text-[#6B7280]">
                            Custom Itinerary
                          </span>
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col gap-[25px] rounded-lg border border-solid border-black/10 px-3 py-2">
                          <span className="text-center text-xs font-normal">
                            Flights
                          </span>
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col gap-[25px] rounded-lg border border-solid border-black/10 px-3 py-2">
                          <span className="text-center text-xs font-normal">
                            Hotels
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-center gap-2.5 self-stretch">
                        <div className="flex w-full lg:max-w-[80%] max-w-[90%] flex-col gap-[25px] rounded-bl-lg rounded-tl-lg rounded-tr-lg bg-[var(--bg-background-muted)] p-3">
                          <div className="flex flex-col gap-2.5 self-stretch">
                            <p className="text-sm font-normal ">
                              Recommend the best Greek islands to visit that are
                              lesser-known and attract fewer tourists, but are
                              still fairly easy to reach by ferry or short
                              domestic flight.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex w-full lg:max-w-[80%] max-w-[90%] flex-col gap-[25px] rounded-br-lg rounded-tl-lg rounded-tr-lg bg-[var(--primary-50)] p-3">
                        <div className="flex flex-col gap-3.5 self-stretch">
                          <span className="text-sm">
                            Here’s a relaxed yet immersive 3-day itinerary for{" "}
                            <strong>Folegandros</strong>, one of the most
                            elegant and culturally rich islands in the Cyclades.
                            It’s easily reached by ferry from Athens (about
                            3.5–4 hours) or a short domestic flight.
                          </span>
                          <div className="flex flex-col gap-3 self-stretch">
                            <div className="flex flex-col gap-0.5 self-stretch">
                              <span className="text-base font-semibold">
                                Day 1: Discovering Folegandros
                              </span>
                              <span className="text-sm font-normal">
                                Start your trip in the island’s capital, a
                                neoclassical masterpiece
                              </span>
                            </div>
                            <div className="flex flex-col gap-2.5 self-stretch text-sm">
                              <span>
                                Morning: Wander through the marble-paved streets
                                of Ermoupoli, admiring pastel mansions and the
                                grand architecture.
                              </span>
                              <span>
                                Lunch: Stop at a harborside taverna for fresh
                                seafood and local wine.
                              </span>
                              <span>
                                Afternoon: Visit the Apollo Theater and catch
                                golden-hour views over the Aegean.
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-3 self-stretch">
                            <div className="flex flex-col gap-0.5 self-stretch">
                              <span className="text-base font-semibold">
                                Day 2: Villages and Beaches
                              </span>
                              <span className="text-sm font-normal">
                                Explore cliffside villages and hidden coves
                              </span>
                            </div>
                            <div className="flex flex-col gap-2.5 self-stretch text-sm">
                              <span>
                                Morning: Hike the trail to Chora and explore
                                narrow alleys and windmills.
                              </span>
                              <span>
                                Lunch: Picnic-style lunch with Cycladic cheese
                                and olives.
                              </span>
                              <span>
                                Afternoon: Swim at Agali Beach and relax by
                                turquoise water.
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Fragment>
                  ))}
                </div>
                <div className="flex h-[45px] shrink-0 items-center gap-2 self-stretch rounded-[63px] bg-neutral-50 pl-[15px] pr-1">
                  <input
                    type="text"
                    placeholder="Type your question here"
                    className="min-h-0 min-w-0 flex-1 border-0 bg-transparent text-sm text-zinc-900 outline-none ring-0 placeholder:text-zinc-600 focus:ring-0"
                  />
                  <button
                    type="button"
                    className="flex size-[37px] shrink-0 items-center justify-center rounded-full bg-[#f26537] text-white transition hover:opacity-90"
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
                </div>
              </div>

              <div
                id="modal-map-panel"
                className="relative isolate hidden min-h-0 min-w-0 flex-1 flex-col gap-2.5 self-stretch p-2.5 max-md:absolute max-md:inset-0 max-md:z-40 max-md:bg-white max-md:p-0 md:flex md:min-h-[280px] md:min-h-0 md:border-l md:border-solid md:border-gray-100"
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

                <div className="absolute bottom-20 left-[30%] z-[1] hidden md:block">
                  <div className="pointer-events-auto mb-2 flex w-[206px] max-w-[calc(100%-0.5rem)] flex-col gap-2 rounded-2xl bg-white p-2.5 shadow-md">
                    <div className="relative overflow-hidden rounded-lg">
                      <img
                        src="./images/banner.png"
                        alt=""
                        className="h-[124px] w-full aspect-186/124 object-cover"
                        width="206"
                        height="124"
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-black/30 text-white hover:bg-black"
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
                            d="M12.9999 8.38133L7.99988 13.3333L2.99988 8.38133C2.67008 8.06041 2.4103 7.67467 2.23691 7.24842C2.06351 6.82217 1.98025 6.36463 1.99237 5.90462C2.00448 5.44461 2.11172 4.99209 2.30731 4.57555C2.50291 4.15902 2.78263 3.7875 3.12887 3.48438C3.4751 3.18127 3.88035 2.95312 4.31908 2.81432C4.75782 2.67551 5.22055 2.62905 5.67812 2.67786C6.1357 2.72668 6.57821 2.8697 6.97779 3.09793C7.37738 3.32617 7.72537 3.63466 7.99988 4.004C8.27556 3.63734 8.62397 3.33154 9.02328 3.10573C9.42258 2.87992 9.8642 2.73896 10.3205 2.69168C10.7768 2.64439 11.2379 2.69179 11.6751 2.83092C12.1122 2.97005 12.5159 3.19791 12.8609 3.50024C13.2059 3.80256 13.4848 4.17285 13.6802 4.58792C13.8755 5.003 13.983 5.45392 13.9961 5.91247C14.0091 6.37102 13.9274 6.82732 13.756 7.25283C13.5845 7.67833 13.3271 8.06388 12.9999 8.38533"
                            fill="white"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="flex flex-col  gap-0.5 ">
                      <b className="text-sm font-semibold">Oyo Tokyo</b>
                      <p className="text-xs font-normal">Locality</p>
                    </div>
                    <button
                      type="button"
                      className="btn btn-tertiary h-8 w-full py-0"
                    >
                      View More
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="button"
                id="modal-switch-to-map"
                className="btn btn-tertiary fixed md:bottom-6 bottom-20 right-6 z-50 inline-flex w-fit items-center gap-2 md:hidden"
                aria-label="Show map"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M9 11C9 11.7956 9.31607 12.5587 9.87868 13.1213C10.4413 13.6839 11.2043 14 12 14C12.7956 14 13.5587 13.6839 14.1213 13.1213C14.6839 12.5587 15 11.7956 15 11C15 10.2043 14.6839 9.44124 14.1213 8.87863C13.5587 8.31602 12.7956 7.99995 12 7.99995C11.2043 7.99995 10.4413 8.31602 9.87868 8.87863C9.31607 9.44124 9 10.2043 9 11Z"
                    stroke="white"
                    strokeWidth="1.0093"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M17.657 16.657L13.414 20.8999C13.039 21.2746 12.5306 21.485 12.0005 21.485C11.4704 21.485 10.962 21.2746 10.587 20.8999L6.343 16.657C5.22422 15.5381 4.46234 14.1127 4.15369 12.5608C3.84504 11.009 4.00349 9.40047 4.60901 7.93868C5.21452 6.4769 6.2399 5.22749 7.55548 4.34846C8.87107 3.46943 10.4178 3.00024 12 3.00024C13.5822 3.00024 15.1289 3.46943 16.4445 4.34846C17.7601 5.22749 18.7855 6.4769 19.391 7.93868C19.9965 9.40047 20.155 11.009 19.8463 12.5608C19.5377 14.1127 18.7758 15.5381 17.657 16.657Z"
                    stroke="white"
                    strokeWidth="1.0093"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Map
              </button>
              <button
                type="button"
                id="modal-switch-to-chat"
                className="btn btn-tertiary fixed bottom-20 right-6 z-50 hidden w-fit items-center gap-2 md:hidden"
                aria-label="Show chat"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M7.49994 13.5C9.99994 16 13.9999 16 16.4999 13.5M17.802 17.292C17.802 17.292 17.879 17.237 18.002 17.143C19.845 15.718 21.002 13.653 21.002 11.354C21.002 7.06797 16.972 3.58997 12.002 3.58997C7.03195 3.58997 3.00195 7.06797 3.00195 11.354C3.00195 15.642 7.03195 19 12.002 19C12.426 19 13.122 18.972 14.09 18.916C15.352 19.736 17.194 20.409 18.806 20.409C19.305 20.409 19.5399 19.999 19.2199 19.581C18.7339 18.985 18.064 18.03 17.804 17.291L17.802 17.292Z"
                    stroke="white"
                    strokeWidth="1.0093"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Chat
              </button>
            </div>
          </div>

          <div
            id="modal-mobile-nav"
            className="modal_mobile-nav"
            aria-hidden="true"
          >
            <div className="modal_mobile-nav__header">
              <div className="modal_mobile-nav__brand">
                <div className="modal_header__icon" aria-hidden="true">
                  <svg
                    className="modal_header__spark"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.6144 17.7956L11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916 0.821766 9.19319 0.821768 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C0.868537 9.26368 0.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899L19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z"
                      fill="url(#paint0_linear_mobile_nav)"
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear_mobile_nav"
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
                </div>
                <span className="modal_mobile-nav__title">
                  My Travel Geek AI
                </span>
              </div>
              <button
                type="button"
                id="modal-mobile-menu-close"
                className="modal_mobile-nav__close"
                aria-label="Close menu"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="#374151"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <nav
              className="modal_mobile-nav__list"
              aria-label="Modal navigation"
            >
              <button
                type="button"
                className="modal_mobile-nav__item"
                data-mobile-nav="compose"
              >
                <span className="modal_mobile-nav__icon" aria-hidden="true">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.66675 4.66667H4.00008C3.64646 4.66667 3.30732 4.80714 3.05727 5.05719C2.80722 5.30724 2.66675 5.64638 2.66675 6V12C2.66675 12.3536 2.80722 12.6928 3.05727 12.9428C3.30732 13.1929 3.64646 13.3333 4.00008 13.3333H10.0001C10.3537 13.3333 10.6928 13.1929 10.9429 12.9428C11.1929 12.6928 11.3334 12.3536 11.3334 12V11.3333M10.6667 3.33333L12.6667 5.33333M13.5901 4.39C13.8526 4.12744 14.0002 3.77132 14.0002 3.4C14.0002 3.02868 13.8526 2.67257 13.5901 2.41C13.3275 2.14744 12.9714 1.99993 12.6001 1.99993C12.2288 1.99993 11.8726 2.14744 11.6101 2.41L6.00008 8V10H8.00008L13.5901 4.39Z"
                      stroke="#374151"
                      strokeWidth="0.933333"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="modal_mobile-nav__label">New Chat</span>
              </button>
              <button
                type="button"
                className="modal_mobile-nav__item"
                data-mobile-nav="message"
              >
                <span className="modal_mobile-nav__icon" aria-hidden="true">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.33333 6H10.6667M5.33333 8.66666H9.33333M12 2.66666C12.5304 2.66666 13.0391 2.87738 13.4142 3.25245C13.7893 3.62752 14 4.13623 14 4.66666V10C14 10.5304 13.7893 11.0391 13.4142 11.4142C13.0391 11.7893 12.5304 12 12 12H8.66667L5.33333 14V12H4C3.46957 12 2.96086 11.7893 2.58579 11.4142C2.21071 11.0391 2 10.5304 2 10V4.66666C2 4.13623 2.21071 3.62752 2.58579 3.25245C2.96086 2.87738 3.46957 2.66666 4 2.66666H12Z"
                      stroke="#374151"
                      strokeWidth="0.933333"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="modal_mobile-nav__label">Message</span>
              </button>
              <button
                type="button"
                className="modal_mobile-nav__item"
                data-mobile-nav="favorites"
              >
                <span className="modal_mobile-nav__icon" aria-hidden="true">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.9999 8.38134L7.99987 13.3333L2.99988 8.38134C2.67008 8.06041 2.4103 7.67468 2.23691 7.24843C2.06351 6.82217 1.98025 6.36464 1.99237 5.90463C2.00448 5.44461 2.11172 4.99209 2.30731 4.57556C2.50291 4.15903 2.78263 3.78751 3.12887 3.48439C3.4751 3.18127 3.88035 2.95313 4.31908 2.81432C4.75782 2.67552 5.22055 2.62906 5.67812 2.67787C6.1357 2.72668 6.57821 2.86971 6.97779 3.09794C7.37738 3.32617 7.72537 3.63467 7.99987 4.004C8.27556 3.63735 8.62397 3.33155 9.02328 3.10574C9.42258 2.87993 9.8642 2.73897 10.3205 2.69168C10.7768 2.6444 11.2379 2.6918 11.6751 2.83093C12.1122 2.97006 12.5159 3.19792 12.8609 3.50025C13.2059 3.80257 13.4848 4.17286 13.6802 4.58793C13.8755 5.003 13.983 5.45393 13.9961 5.91248C14.0091 6.37103 13.9274 6.82733 13.756 7.25284C13.5845 7.67834 13.3271 8.06389 12.9999 8.38534"
                      stroke="#374151"
                      strokeWidth="0.933333"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="modal_mobile-nav__label">Favorites</span>
              </button>
            </nav>
          </div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button
            type="submit"
            className="modal-backdrop__hit"
            aria-label="Close dialog"
          ></button>
        </form>
      </dialog>
    </>
  );
}
