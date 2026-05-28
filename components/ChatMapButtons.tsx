export default function ChatMapButtons() {
  return (
    <>
      <button
        type="button"
        id="modal-switch-to-map"
        className="btn btn-tertiary fixed bottom-20 right-6 z-50 hidden w-fit items-center gap-2 md:bottom-16"
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
    </>
  );
}
