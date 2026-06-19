import TravelSuggestionSparkIcon from "../TravelSuggestionSparkIcon";

export default function MainModalHeader({
  closeWithAnimation,
}: {
  closeWithAnimation: () => void;
}) {
  return (
    <div className="modal_header">
      <button
        type="button"
        id="modal-mobile-menu-open"
        className="me-2.5 flex shrink-0 items-center justify-center border-0 bg-transparent p-0 md:hidden"
        aria-label="Open menu"
        aria-expanded="false"
        aria-controls="modal-mobile-nav"
        onClick={closeWithAnimation}
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
          <TravelSuggestionSparkIcon height={24} width={24} theme="dark" />
        </div>
        <span className="modal_header__title">My Travel Geek AI</span>
      </div>
      <form
        method="dialog"
        className="modal_header__close-form"
        onSubmit={(e) => {
          e.preventDefault();
          closeWithAnimation();
        }}
      >
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
  );
}
