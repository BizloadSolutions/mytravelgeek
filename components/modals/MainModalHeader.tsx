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
