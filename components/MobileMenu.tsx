import TravelSuggestionSparkIcon from "./TravelSuggestionSparkIcon";

export default function MobileMenu() {
  return (
    <div id="modal-mobile-nav" className="modal_mobile-nav" aria-hidden="true">
      <div className="modal_mobile-nav__header">
        <div className="modal_mobile-nav__brand">
          <div className="modal_header__icon" aria-hidden="true">
            <TravelSuggestionSparkIcon height={24} width={24} theme="dark" />
          </div>
          <span className="modal_mobile-nav__title">My Travel Geek AI</span>
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
      <nav className="modal_mobile-nav__list" aria-label="Modal navigation">
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
  );
}
