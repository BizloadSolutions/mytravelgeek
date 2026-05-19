"use client";

import { useEffect, useRef, useState } from "react";
import ChatModal from "./ChatModal";
import FavoritesModal from "./FavoritesModal";
import MapViewModal from "./MapVIewModal";
import ChatMapButtons from "../ChatMapButtons";
import MobileMenu from "../MobileMenu";
import MainModalHeader from "./MainModalHeader";
import MailModalSidebar from "./MailModaliSidebar";
import { isShowMapVIew } from "../utils/helpers";

declare global {
  interface Window {
    initCustomItineraryModal?: (modal: HTMLElement) => (() => void) | void;
    initModalDialogs?: () => void;
    openTravelGeekModal?: (id: string) => void;
    closeTravelGeekModal?: (id: string) => void;
  }
}

interface CustomItineraryModalProps {
  open: boolean;
  onClose: () => void;
  onOpen?: () => void;
  initialQuery?: string;
}

const MODAL_TRANSITION_MS = 400;

export default function MainTravelGeekModal({
  open,
  onClose,
  onOpen,
  initialQuery = "",
}: CustomItineraryModalProps) {
  const [isClosing, setIsClosing] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const finishClose = () => {
    const dialog = dialogRef.current;
    if (dialog?.open) dialog.close();
    else onClose();
  };

  const closeWithAnimation = () => {
    const dialog = dialogRef.current;
    if (!dialog?.open) {
      onClose();
      return;
    }
    if (isClosing) return;
    setIsClosing(true);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(finishClose, MODAL_TRANSITION_MS);
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      setIsClosing(false);
      if (!dialog.open) dialog.showModal();
      return;
    }
    if (dialog.open) closeWithAnimation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      setIsClosing(false);
      onClose();
    };
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleOpened = () => {
      onOpen?.();
    };
    dialog.addEventListener("itinerary-modal:opened", handleOpened);
    return () =>
      dialog.removeEventListener("itinerary-modal:opened", handleOpened);
  }, [onOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    let cleanup: (() => void) | undefined;

    const bindModalJs = () => {
      window.initModalDialogs?.();
      if (typeof window.initCustomItineraryModal === "function") {
        const result = window.initCustomItineraryModal(dialog);
        if (typeof result === "function") cleanup = result;
        return true;
      }
      return false;
    };

    if (!bindModalJs()) {
      const intervalId = window.setInterval(() => {
        if (bindModalJs()) window.clearInterval(intervalId);
      }, 50);
      document.dispatchEvent(new CustomEvent("itinerary-modal:mount"));
      return () => {
        window.clearInterval(intervalId);
        cleanup?.();
      };
    }

    document.dispatchEvent(new CustomEvent("itinerary-modal:mount"));
    return () => cleanup?.();
  }, []);

  return (
    <>
      <dialog
        ref={dialogRef}
        id="custom-itinerary-modal"
        className={`modal${isClosing ? " is-closing" : ""}`}
      >
        <div className="modal-box">
          <MainModalHeader closeWithAnimation={closeWithAnimation} />
          <div className="modal_body">
            <MailModalSidebar />
            <div className="modal_content relative min-h-0 flex-1">
              <ChatModal open={open} initialQuery={initialQuery} />
              {isShowMapVIew && <FavoritesModal />}
              {isShowMapVIew && <MapViewModal />}
              {isShowMapVIew && <ChatMapButtons />}
            </div>
          </div>

          <MobileMenu />
        </div>

        <form
          method="dialog"
          className="modal-backdrop"
          onSubmit={(e) => {
            e.preventDefault();
            closeWithAnimation();
          }}
        >
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
