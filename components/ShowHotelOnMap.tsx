export default function ShowHotelOnMap() {
  return (
    <div className="absolute bottom-20 left-[30%] z-[1]">
      <div className="pointer-events-auto mb-2 flex w-[206px] max-w-[calc(100%-0.5rem)] flex-col gap-2 rounded-2xl bg-white p-2.5 shadow-md">
        <div className="relative overflow-hidden rounded-lg">
          <img
            src="/images/banner.png"
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
        <button type="button" className="btn btn-tertiary h-8 w-full py-0">
          View More
        </button>
      </div>
    </div>
  );
}
