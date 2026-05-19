import ChatHelp from "../ChatHelp";
import { isShowMapVIew } from "../utils/helpers";
export default function ChatModal() {
  return (
    <div
      id="modal-chat-panel"
      className="flex min-h-0 w-full min-w-0 flex-1 shrink-0 flex-col gap-5 self-stretch p-2.5 md:border-r md:border-solid md:border-gray-100"
    >
      <div className="flex min-h-0 max-h-[calc(100dvh-137px)] flex-1 flex-col gap-3.5 self-stretch overflow-y-auto overscroll-contain">
        <div className="flex w-full lg:max-w-[80%] max-w-[90%] flex-col gap-[25px] rounded-br-lg rounded-tl-lg rounded-tr-lg bg-[var(--primary-50)] p-3">
          <div className="flex flex-col gap-2.5 self-stretch">
            <p className="m-0 text-sm font-normal">
              Hi! I’m My Travel Geek AI - your own personal Travel Genius. I can
              help you with:
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
            <span className="text-center text-xs font-normal">Flights</span>
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-[25px] rounded-lg border border-solid border-black/10 px-3 py-2">
            <span className="text-center text-xs font-normal">Hotels</span>
          </div>
        </div>
        <div className="flex flex-col items-end justify-center gap-2.5 self-stretch">
          <div className="flex w-full lg:max-w-[80%] max-w-[90%] flex-col gap-[25px] rounded-bl-lg rounded-tl-lg rounded-tr-lg bg-[var(--bg-background-muted)] p-3">
            <div className="flex flex-col gap-2.5 self-stretch">
              <p className="text-sm font-normal ">
                Recommend the best Greek islands to visit that are lesser-known
                and attract fewer tourists, but are still fairly easy to reach
                by ferry or short domestic flight.
              </p>
            </div>
          </div>
        </div>

        {/* asdflasdf */}

        <div className="flex w-full lg:max-w-[80%] max-w-[90%] flex-col gap-[25px] rounded-br-lg rounded-tl-lg rounded-tr-lg bg-[var(--primary-50)] p-3">
          <div className="flex flex-col gap-3.5 self-stretch">
            <span className="text-sm">
              Here’s a relaxed yet immersive 3-day itinerary for{" "}
              <strong>Folegandros</strong>, one of the most elegant and
              culturally rich islands in the Cyclades. It’s easily reached by
              ferry from Athens (about 3.5–4 hours) or a short domestic flight.
            </span>
            <div className="flex flex-col gap-3 self-stretch">
              <div className="flex flex-col gap-0.5 self-stretch">
                <span className="text-base font-semibold">
                  Day 1: Discovering Folegandros
                </span>
                <span className="text-sm font-normal">
                  Start your trip in the island’s capital, a neoclassical
                  masterpiece
                </span>
              </div>
              <div className="flex flex-col gap-2.5 self-stretch text-sm">
                <span>
                  Morning: Wander through the marble-paved streets of Ermoupoli,
                  admiring pastel mansions and the grand architecture.
                </span>
                <span>
                  Lunch: Stop at a harborside taverna for fresh seafood and
                  local wine.
                </span>
                <span>
                  Afternoon: Visit the Apollo Theater and catch golden-hour
                  views over the Aegean.
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
                  Morning: Hike the trail to Chora and explore narrow alleys and
                  windmills.
                </span>
                <span>
                  Lunch: Picnic-style lunch with Cycladic cheese and olives.
                </span>
                <span>
                  Afternoon: Swim at Agali Beach and relax by turquoise water.
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-fit gap-1.5 rounded-br-lg rounded-tl-lg rounded-tr-lg bg-[var(--primary-50)] p-3">
          <span className="size-2 rounded-full bg-[var(--main-primary)]"></span>
          <span className="size-2 rounded-full bg-[var(--primary-100)]"></span>
          <span className="size-2 rounded-full bg-[var(--primary-100)]"></span>
          <span className="size-2 rounded-full bg-[var(--primary-100)]"></span>
        </div>

        {isShowMapVIew && <ChatHelp />}

        {/* sadfsadf */}
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
  );
}
