/**
 * Modal utilities for Travel Geek.
 * Exposes init functions on window so React can bind after the dialog mounts.
 */
(function () {
  const ITINERARY_MODAL_ID = "custom-itinerary-modal";
  const itineraryModalCleanups = new WeakMap();

  const openModal = (id) => {
    const modal = document.getElementById(id);
    if (!modal || typeof modal.showModal !== "function") return;
    document.querySelectorAll("dialog[open]").forEach((openDialog) => {
      if (openDialog.id !== id && typeof openDialog.close === "function") {
        openDialog.close();
      }
    });
    if (!modal.open) {
      modal.showModal();
      document.body.classList.add("overflow-hidden");
    }
    if (id === ITINERARY_MODAL_ID) {
      modal.dispatchEvent(
        new CustomEvent("itinerary-modal:opened", { bubbles: true }),
      );
    }
  };

  const closeModal = (id) => {
    const modal = document.getElementById(id);
    if (!modal || typeof modal.close !== "function") return;
    if (modal.open) {
      modal.close();
    }
    const hasOpenModal = document.querySelector("dialog[open]");
    if (!hasOpenModal) {
      document.body.classList.remove("overflow-hidden");
    }
  };

  let globalDialogsInitialized = false;

  const initModalDialogs = () => {
    if (globalDialogsInitialized) return;
    globalDialogsInitialized = true;

    document.addEventListener("click", (e) => {
      const openBtn = e.target.closest("[data-modal-open]");
      if (openBtn) {
        const modalId = openBtn.getAttribute("data-modal-open");
        if (modalId) {
          e.preventDefault();
          const closeBefore = openBtn.getAttribute("data-modal-close-before");
          if (closeBefore) closeModal(closeBefore);
          openModal(modalId);
        }
        return;
      }

      const closeBtn = e.target.closest("[data-modal-close]");
      if (closeBtn) {
        const modalId = closeBtn.getAttribute("data-modal-close");
        if (modalId) {
          e.preventDefault();
          closeModal(modalId);
        }
      }
    });

    document.querySelectorAll("dialog").forEach((modal) => {
      if (modal.dataset.modalBackdropBound === "true") return;
      modal.dataset.modalBackdropBound = "true";

      modal.addEventListener("click", function (event) {
        const rect = modal.getBoundingClientRect();
        const clickInside =
          event.clientX >= rect.left &&
          event.clientX <= rect.right &&
          event.clientY >= rect.top &&
          event.clientY <= rect.bottom;
        if (!clickInside) {
          modal.close();
        }
      });

      modal.addEventListener("close", function () {
        const hasOpenModal = document.querySelector("dialog[open]");
        if (!hasOpenModal) {
          document.body.classList.remove("overflow-hidden");
        }
      });
    });
  };

  const initFlightStopsToggles = (root) => {
    const cleanups = [];
    root.querySelectorAll(".flight-stops-toggle").forEach((btn) => {
      if (btn.dataset.flightStopsBound === "true") return;
      btn.dataset.flightStopsBound = "true";

      const panel = btn.nextElementSibling;
      const label = btn.querySelector(".flight-stops-toggle__label");
      const icon = btn.querySelector(".flight-stops-toggle__icon");
      if (!panel?.classList.contains("flight-stops-panel")) return;

      const onClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const expanded = btn.getAttribute("aria-expanded") === "true";
        const nextExpanded = !expanded;
        btn.setAttribute("aria-expanded", String(nextExpanded));
        panel.classList.toggle("hidden", !nextExpanded);
        if (label)
          label.textContent = nextExpanded ? "Hide Stops" : "View Stops";
        if (icon) {
          icon.classList.toggle("ti-chevron-down", !nextExpanded);
          icon.classList.toggle("ti-chevron-up", nextExpanded);
        }
      };

      btn.addEventListener("click", onClick);
      cleanups.push(() => {
        btn.removeEventListener("click", onClick);
        delete btn.dataset.flightStopsBound;
      });
    });
    return cleanups;
  };

  /**
   * Bind itinerary modal panel switching, favorites, venue detail, mobile nav, etc.
   * @param {HTMLElement} itineraryModal
   * @returns {() => void} cleanup
   */
  const initCustomItineraryModal = (itineraryModal) => {
    if (!itineraryModal) {
      return () => {};
    }

    itineraryModalCleanups.get(itineraryModal)?.();

    const cleanups = [];

    const mobileNav = document.getElementById("modal-mobile-nav");
    const mobileNavOpen = document.getElementById("modal-mobile-menu-open");
    const mobileNavClose = document.getElementById("modal-mobile-menu-close");

    const openMobileNav = () => {
      if (!mobileNav || window.matchMedia("(min-width: 768px)").matches) return;
      mobileNav.classList.add("is-open");
      mobileNav.setAttribute("aria-hidden", "false");
      if (mobileNavOpen) mobileNavOpen.setAttribute("aria-expanded", "true");
    };

    const closeMobileNav = () => {
      if (!mobileNav) return;
      mobileNav.classList.remove("is-open");
      mobileNav.setAttribute("aria-hidden", "true");
      if (mobileNavOpen) mobileNavOpen.setAttribute("aria-expanded", "false");
    };

    if (mobileNavOpen) {
      const onOpenNav = (e) => {
        e.preventDefault();
        e.stopPropagation();
        openMobileNav();
      };
      mobileNavOpen.addEventListener("click", onOpenNav);
      cleanups.push(() =>
        mobileNavOpen.removeEventListener("click", onOpenNav),
      );
    }

    if (mobileNavClose) {
      const onCloseNav = (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeMobileNav();
      };
      mobileNavClose.addEventListener("click", onCloseNav);
      cleanups.push(() =>
        mobileNavClose.removeEventListener("click", onCloseNav),
      );
    }

    mobileNav?.querySelectorAll(".modal_mobile-nav__item").forEach((item) => {
      const onItemClick = () => closeMobileNav();
      item.addEventListener("click", onItemClick);
      cleanups.push(() => item.removeEventListener("click", onItemClick));
    });

    const chatPanel = document.getElementById("modal-chat-panel");
    const favoritesPanel = document.getElementById("modal-favorites-panel");
    const mapColumn = document.getElementById("modal-map-column");
    const mapPanel = document.getElementById("modal-map-panel");
    const venuePanel = document.getElementById("modal-venue-detail-panel");
    const venueAddressLink = document.getElementById(
      "modal-venue-detail-address",
    );
    const sidebarCompose = document.getElementById("modal-sidebar-compose");
    const sidebarHistory = document.getElementById("modal-sidebar-history");
    const sidebarFavorites = document.getElementById("modal-sidebar-favorites");
    const venueBack = document.getElementById("modal-venue-detail-back");
    const venueTitle = document.getElementById("modal-venue-detail-title");
    const venueCategory = document.getElementById(
      "modal-venue-detail-category",
    );
    const venueHours = document.getElementById("modal-venue-detail-hours");
    const btnShowMap = document.getElementById("modal-switch-to-map");
    const btnShowChat = document.getElementById("modal-switch-to-chat");
    const btnMapShowChat = document.getElementById("modal-map-show-chat");

    const isMobileView = () => window.matchMedia("(max-width: 767px)").matches;

    let venueGallerySwiper = null;

    const initVenueGallerySwiper = () => {
      const swiperEl = venuePanel?.querySelector(
        ".modal-venue-gallery__swiper",
      );
      if (!swiperEl || typeof Swiper === "undefined") return;

      const prevEl = venuePanel.querySelector(".modal-venue-gallery__prev");
      const nextEl = venuePanel.querySelector(".modal-venue-gallery__next");

      if (venueGallerySwiper) {
        venueGallerySwiper.update();
        venueGallerySwiper.slideTo(0, 0);
        return;
      }

      venueGallerySwiper = new Swiper(swiperEl, {
        loop: true,
        speed: 350,
        slidesPerView: 1,
        spaceBetween: 0,
        navigation: {
          nextEl,
          prevEl,
        },
      });
    };

    const switchVenueTab = (tabId) => {
      if (!venuePanel) return;
      venuePanel.querySelectorAll(".venue-detail-tab").forEach((t) => {
        const isActive = t.dataset.venueTab === tabId;
        t.classList.toggle("bg-[#0f3a5d]", isActive);
        t.classList.toggle("font-semibold", isActive);
        t.classList.toggle("text-white", isActive);
        t.classList.toggle("bg-gray-100", !isActive);
        t.classList.toggle("font-normal", !isActive);
        t.classList.toggle("text-gray-700", !isActive);
        t.setAttribute("aria-selected", String(isActive));
      });
      venuePanel.querySelectorAll(".venue-tab-panel").forEach((panel) => {
        const isActive = panel.id === `venue-tab-${tabId}`;
        panel.classList.toggle("hidden", !isActive);
        panel.toggleAttribute("hidden", !isActive);
        if (isActive) {
          panel.classList.add("flex");
        } else {
          panel.classList.remove("flex");
        }
      });
    };

    const showVenueDetail = (data) => {
      if (!venuePanel) return;
      if (venueTitle && data?.name) venueTitle.textContent = data.name;
      if (venueCategory && data?.category)
        venueCategory.textContent = `${data.category} |`;
      if (venueHours && data?.hours) venueHours.textContent = data.hours;
      if (venueAddressLink && data?.address) {
        venueAddressLink.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.address)}`;
      }
      switchVenueTab("overview");

      hideFavoritesPanel();

      if (isMobileView()) {
        chatPanel?.classList.add("hidden");
        mapPanel?.classList.remove("hidden", "is-hidden");
        mapColumn?.classList.remove("hidden");
        btnShowMap?.classList.add("hidden");
        btnShowMap?.classList.remove("inline-flex");
        btnShowChat?.classList.remove("hidden");
        btnShowChat?.classList.add("inline-flex");
      } else {
        mapColumn?.classList.remove("hidden");
        mapPanel?.classList.remove("is-hidden", "hidden");
        mapColumn?.classList.add("is-venue-open");
        itineraryModal.classList.remove("is-chat-full");
        setSplitViewFabs();
      }

      venuePanel.classList.remove("hidden", "is-hidden");
      venuePanel.classList.add("flex", "is-open");
      venuePanel.setAttribute("aria-hidden", "false");

      requestAnimationFrame(() => initVenueGallerySwiper());
    };

    const hideVenueDetail = () => {
      if (!venuePanel) return;
      venuePanel.classList.add("hidden", "is-hidden");
      venuePanel.classList.remove("flex", "is-open");
      venuePanel.setAttribute("aria-hidden", "true");
      mapColumn?.classList.remove("is-venue-open");

      if (isMobileView()) {
        chatPanel?.classList.remove("hidden");
        setMapChatFab("chat");
      }
    };

    const setMapChatFab = (view) => {
      if (!btnShowMap || !btnShowChat) return;
      if (view === "map") {
        btnShowMap.classList.add("hidden");
        btnShowMap.classList.remove("inline-flex");
        btnShowChat.classList.remove("hidden");
        btnShowChat.classList.add("inline-flex");
      } else {
        btnShowChat.classList.add("hidden");
        btnShowChat.classList.remove("inline-flex");
        btnShowMap.classList.remove("hidden");
        btnShowMap.classList.add("inline-flex");
      }
    };

    const setSplitViewFabs = () => {
      if (!btnShowMap || !btnShowChat) return;
      btnShowMap.classList.add("hidden");
      btnShowMap.classList.remove("inline-flex");
      btnShowChat.classList.add("hidden");
      btnShowChat.classList.remove("inline-flex");
    };

    const setSidebarActive = (activeBtn) => {
      [sidebarCompose, sidebarHistory, sidebarFavorites].forEach((btn) => {
        if (!btn) return;
        const isActive = btn === activeBtn;
        btn.classList.toggle("modal_sidebar__btn--active", isActive);
        btn.classList.toggle("modal_sidebar__btn--ghost", !isActive);
        btn.setAttribute("aria-pressed", String(isActive));
        const icon = btn.querySelector("svg path");
        if (icon && isActive) {
          icon.setAttribute("stroke", "white");
        } else if (icon) {
          icon.setAttribute("stroke", "#374151");
        }
      });
    };

    const hideFavoritesPanel = () => {
      favoritesPanel?.classList.add("is-hidden", "hidden");
      favoritesPanel?.classList.remove("flex");
      favoritesPanel?.setAttribute("aria-hidden", "true");
    };

    const showFavoritesPanel = () => {
      hideVenueDetail();
      chatPanel?.classList.add("hidden");
      favoritesPanel?.classList.remove("is-hidden", "hidden");
      favoritesPanel?.classList.add("flex");
      favoritesPanel?.setAttribute("aria-hidden", "false");
      setSidebarActive(sidebarFavorites);
      if (isMobileView()) {
        mapColumn?.classList.add("hidden");
        mapPanel?.classList.add("hidden");
        setMapChatFab("chat");
      } else {
        mapColumn?.classList.remove("hidden");
        mapPanel?.classList.remove("hidden", "is-hidden");
        itineraryModal.classList.remove("is-chat-full");
        setSplitViewFabs();
      }
    };

    const switchFavoriteFilter = (filterId) => {
      if (!favoritesPanel) return;
      favoritesPanel.querySelectorAll(".favorite-filter-tab").forEach((tab) => {
        const isActive = tab.dataset.favoriteFilter === filterId;
        tab.classList.toggle("bg-[#0f3a5d]", isActive);
        tab.classList.toggle("font-semibold", isActive);
        tab.classList.toggle("text-white", isActive);
        tab.classList.toggle("bg-gray-100", !isActive);
        tab.classList.toggle("font-normal", !isActive);
        tab.classList.toggle("text-gray-700", !isActive);
        tab.setAttribute("aria-selected", String(isActive));
      });
      favoritesPanel
        .querySelectorAll(".modal-favorite-card")
        .forEach((card) => {
          const category = card.dataset.favoriteCategory;
          const show = filterId === "all" || category === filterId;
          card.classList.toggle("hidden", !show);
        });
    };

    const showChatView = () => {
      hideVenueDetail();
      hideFavoritesPanel();
      chatPanel?.classList.remove("hidden");
      setSidebarActive(sidebarCompose);
      mapColumn?.classList.add("hidden");
      mapPanel?.classList.add("hidden");
      itineraryModal.classList.add("is-chat-full");
      setMapChatFab("chat");
    };

    const showMapView = () => {
      hideVenueDetail();
      hideFavoritesPanel();
      mapColumn?.classList.remove("hidden");
      mapPanel?.classList.remove("hidden", "is-hidden");
      itineraryModal.classList.remove("is-chat-full");
      if (isMobileView()) {
        chatPanel?.classList.add("hidden");
        setMapChatFab("map");
      } else {
        chatPanel?.classList.remove("hidden");
        setSplitViewFabs();
      }
    };

    const resetPanels = () => {
      hideVenueDetail();
      hideFavoritesPanel();
      setSidebarActive(sidebarCompose);
      itineraryModal.classList.remove("is-chat-full");
      if (isMobileView()) {
        showChatView();
      } else {
        chatPanel?.classList.remove("hidden");
        mapColumn?.classList.remove("hidden");
        mapPanel?.classList.remove("hidden", "is-hidden");
        setSplitViewFabs();
      }
    };

    const addClick = (el, handler) => {
      if (!el) return;
      el.addEventListener("click", handler);
      cleanups.push(() => el.removeEventListener("click", handler));
    };

    addClick(btnMapShowChat, (e) => {
      e.preventDefault();
      e.stopPropagation();
      showChatView();
    });

    addClick(sidebarCompose, (e) => {
      e.preventDefault();
      hideVenueDetail();
      hideFavoritesPanel();
      chatPanel?.classList.remove("hidden");
      setSidebarActive(sidebarCompose);
      if (isMobileView()) {
        showChatView();
      } else {
        mapColumn?.classList.remove("hidden");
        mapPanel?.classList.remove("hidden", "is-hidden");
        itineraryModal.classList.remove("is-chat-full");
        setSplitViewFabs();
      }
    });

    addClick(sidebarFavorites, (e) => {
      e.preventDefault();
      showFavoritesPanel();
    });

    favoritesPanel?.querySelectorAll(".favorite-filter-tab").forEach((tab) => {
      const onTab = (e) => {
        e.preventDefault();
        const filterId = tab.dataset.favoriteFilter;
        if (filterId) switchFavoriteFilter(filterId);
      };
      tab.addEventListener("click", onTab);
      cleanups.push(() => tab.removeEventListener("click", onTab));
    });

    const mobileFavorites = mobileNav?.querySelector(
      '[data-mobile-nav="favorites"]',
    );
    addClick(mobileFavorites, (e) => {
      e.preventDefault();
      showFavoritesPanel();
    });

    const mobileCompose = mobileNav?.querySelector(
      '[data-mobile-nav="compose"]',
    );
    addClick(mobileCompose, (e) => {
      e.preventDefault();
      showChatView();
    });

    const onVenueViewClick = (e) => {
      const btn = e.target.closest(".venue-view-website");
      if (!btn || !itineraryModal.contains(btn)) return;
      e.preventDefault();
      e.stopPropagation();
      showVenueDetail({
        name: btn.dataset.venueName,
        category: btn.dataset.venueCategory,
        hours: btn.dataset.venueHours,
        address: btn.dataset.venueAddress,
      });
    };
    itineraryModal.addEventListener("click", onVenueViewClick);
    cleanups.push(() =>
      itineraryModal.removeEventListener("click", onVenueViewClick),
    );

    const onExploreChipClick = (e) => {
      const chip = e.target.closest(".venue-explore-chip");
      if (!chip || !venuePanel?.contains(chip)) return;
      e.preventDefault();
      const prompt = chip.dataset.explorePrompt;
      const input = document.getElementById("travel-prompt");
      if (input && prompt) {
        input.value = prompt;
        input.focus();
        input.dispatchEvent(new Event("input", { bubbles: true }));
      }
      hideVenueDetail();
      if (isMobileView()) {
        showChatView();
      }
    };
    itineraryModal.addEventListener("click", onExploreChipClick);
    cleanups.push(() =>
      itineraryModal.removeEventListener("click", onExploreChipClick),
    );

    addClick(venueBack, (e) => {
      e.preventDefault();
      e.stopPropagation();
      hideVenueDetail();
      if (isMobileView()) {
        chatPanel?.classList.remove("hidden");
        setMapChatFab("chat");
      }
    });

    const venueHoursToggle = document.getElementById(
      "modal-venue-hours-toggle",
    );
    const venueHoursList = document.getElementById("modal-venue-hours-list");
    addClick(venueHoursToggle, (e) => {
      e.preventDefault();
      const expanded =
        venueHoursToggle.getAttribute("aria-expanded") === "true";
      const nextExpanded = !expanded;
      venueHoursToggle.setAttribute("aria-expanded", String(nextExpanded));
      venueHoursList?.classList.toggle("hidden", !nextExpanded);
      const icon = venueHoursToggle.querySelector(
        ".modal-venue-hours-toggle__icon",
      );
      if (icon) {
        icon.classList.toggle("ti-chevron-up", nextExpanded);
        icon.classList.toggle("ti-chevron-down", !nextExpanded);
      }
    });

    venuePanel?.querySelectorAll(".venue-detail-tab").forEach((tab) => {
      const onTab = (e) => {
        e.preventDefault();
        const tabId = tab.dataset.venueTab;
        if (tabId) switchVenueTab(tabId);
      };
      tab.addEventListener("click", onTab);
      cleanups.push(() => tab.removeEventListener("click", onTab));
    });

    addClick(btnShowChat, (e) => {
      e.preventDefault();
      e.stopPropagation();
      showChatView();
    });

    addClick(btnShowMap, (e) => {
      e.preventDefault();
      e.stopPropagation();
      showMapView();
    });

    const onModalClose = () => {
      resetPanels();
      closeMobileNav();
    };
    itineraryModal.addEventListener("close", onModalClose);
    cleanups.push(() =>
      itineraryModal.removeEventListener("close", onModalClose),
    );

    cleanups.push(...initFlightStopsToggles(itineraryModal));

    if (itineraryModal.dataset.modalBackdropBound !== "true") {
      itineraryModal.dataset.modalBackdropBound = "true";
      const onBackdropClick = function (event) {
        const rect = itineraryModal.getBoundingClientRect();
        const clickInside =
          event.clientX >= rect.left &&
          event.clientX <= rect.right &&
          event.clientY >= rect.top &&
          event.clientY <= rect.bottom;
        if (!clickInside) {
          itineraryModal.close();
        }
      };
      itineraryModal.addEventListener("click", onBackdropClick);
      cleanups.push(() =>
        itineraryModal.removeEventListener("click", onBackdropClick),
      );
    }

    const cleanup = () => {
      cleanups.forEach((fn) => fn());
      if (venueGallerySwiper) {
        venueGallerySwiper.destroy(true, true);
        venueGallerySwiper = null;
      }
    };

    itineraryModalCleanups.set(itineraryModal, cleanup);
    return cleanup;
  };

  const tryInitItineraryModal = () => {
    const el = document.getElementById(ITINERARY_MODAL_ID);
    if (el) initCustomItineraryModal(el);
  };

  window.initModalDialogs = initModalDialogs;
  window.initCustomItineraryModal = initCustomItineraryModal;
  window.openTravelGeekModal = openModal;
  window.closeTravelGeekModal = closeModal;

  const boot = () => {
    initModalDialogs();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  document.addEventListener("itinerary-modal:mount", tryInitItineraryModal);
})();
