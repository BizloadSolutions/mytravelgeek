export default function FavoritesModal() {
  const favorites = [
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

  return (
    <div
      id="modal-favorites-panel"
      className="is-hidden flex min-h-0 w-full min-w-0 max-w-full flex-1 shrink-0 flex-col gap-5 self-stretch border-solid border-gray-100 p-2.5 md:max-w-[435px] md:border-r"
      aria-hidden="true"
    >
      <div className="flex min-h-0 flex-1 flex-col gap-5 self-stretch overflow-hidden">
        <h2 className="m-0 text-lg font-medium text-zinc-950">Favorites</h2>
        <div className="flex min-h-0 flex-1 flex-col gap-3.5 self-stretch overflow-hidden">
          <div
            className="flex shrink-0 gap-2.5 self-stretch"
            role="tablist"
            aria-label="Filter favorites"
          >
            <button
              type="button"
              className="favorite-filter-tab flex min-w-0 flex-1 flex-col rounded-lg bg-[#0f3a5d] px-4 py-2 text-sm font-semibold text-white"
              role="tab"
              aria-selected="true"
              data-favorite-filter="all"
            >
              All
            </button>
            <button
              type="button"
              className="favorite-filter-tab flex min-w-0 flex-1 flex-col rounded-lg bg-gray-100 px-4 py-2 text-sm font-normal text-gray-700"
              role="tab"
              aria-selected="false"
              data-favorite-filter="places"
            >
              Places
            </button>
            <button
              type="button"
              className="favorite-filter-tab flex min-w-0 flex-1 flex-col rounded-lg bg-gray-100 px-4 py-2 text-sm font-normal text-gray-700"
              role="tab"
              aria-selected="false"
              data-favorite-filter="hotels"
            >
              Hotels
            </button>
            <button
              type="button"
              className="favorite-filter-tab flex min-w-0 flex-1 flex-col rounded-lg bg-gray-100 px-4 py-2 text-sm font-normal text-gray-700"
              role="tab"
              aria-selected="false"
              data-favorite-filter="flights"
            >
              Flights
            </button>
          </div>
          <div className="modal-favorites-grid min-h-0 flex-1 overflow-y-auto overscroll-contain">
            {favorites.map((favorite, index) => (
              <article
                key={`${favorite.title}-${index}`}
                className="modal-favorite-card flex min-w-0 flex-col gap-2 rounded-2xl bg-white p-2.5"
                data-favorite-category={favorite.category}
              >
                <div className="relative overflow-hidden rounded-lg">
                  <img
                    src={favorite.image}
                    alt=""
                    className="h-[121px] w-full object-cover"
                    width="201"
                    height="121"
                    loading="lazy"
                  />
                  {favorite.rating && (
                    <span className="absolute left-2 top-2 inline-flex items-center gap-[5px] rounded-[59px] bg-green-600 px-1 py-0.5">
                      <i
                        className="ti ti-star-filled text-[10px] leading-none text-white"
                        aria-hidden="true"
                      ></i>
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
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13 8.38145L8 13.3335L3 8.38145C2.6702 8.06053 2.41043 7.67479 2.23703 7.24854C2.06363 6.82229 1.98037 6.36475 1.99249 5.90474C2.00461 5.44473 2.11184 4.99221 2.30744 4.57568C2.50303 4.15914 2.78275 3.78762 3.12899 3.4845C3.47522 3.18139 3.88047 2.95324 4.3192 2.81444C4.75794 2.67563 5.22067 2.62917 5.67824 2.67799C6.13582 2.7268 6.57833 2.86982 6.97791 3.09806C7.3775 3.32629 7.7255 3.63478 8 4.00412C8.27569 3.63747 8.62409 3.33166 9.0234 3.10585C9.42271 2.88004 9.86433 2.73908 10.3206 2.6918C10.7769 2.64451 11.2381 2.69192 11.6752 2.83105C12.1123 2.97017 12.516 3.19803 12.861 3.50036C13.206 3.80269 13.4849 4.17297 13.6803 4.58805C13.8756 5.00312 13.9832 5.45404 13.9962 5.91259C14.0092 6.37114 13.9275 6.82745 13.7561 7.25295C13.5847 7.67846 13.3273 8.064 13 8.38545"
                        fill="white"
                      />
                    </svg>
                  </button>
                </div>
                <div className="flex flex-col gap-0.5 self-stretch">
                  <span className="text-sm font-semibold text-zinc-950">
                    {favorite.title}
                  </span>
                  <span className="text-xs font-normal text-zinc-600">
                    {favorite.subtitle}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
