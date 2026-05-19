document.addEventListener("DOMContentLoaded", function () {
  const body = document.body;

  const lockBody = () => body.classList.add("overflow-hidden");
  const unlockBody = () => {
    if (!document.querySelector("dialog[open]")) {
      body.classList.remove("overflow-hidden");
    }
  };

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
      lockBody();
    }

    if (id === "custom-itinerary-modal" && typeof modal.__resetModalState === "function") {
      modal.__resetModalState();
    }
  };

  const closeModal = (id) => {
    const modal = document.getElementById(id);
    if (!modal || typeof modal.close !== "function") return;

    if (modal.open) {
      modal.close();
    }
    unlockBody();
  };

  document.querySelectorAll("[data-modal-open]").forEach((button) => {
    button.addEventListener("click", function (event) {
      const modalId = button.getAttribute("data-modal-open");
      const closeBefore = button.getAttribute("data-modal-close-before");

      if (modalId) {
        event.preventDefault();
      }
      if (closeBefore) {
        closeModal(closeBefore);
      }
      if (modalId) {
        openModal(modalId);
      }
    });
  });

  document.querySelectorAll("[data-modal-close]").forEach((button) => {
    button.addEventListener("click", function () {
      const modalId = button.getAttribute("data-modal-close");
      if (modalId) closeModal(modalId);
    });
  });

  const itineraryModal = document.getElementById("custom-itinerary-modal");
  if (itineraryModal) {
    const mobileNav = document.getElementById("modal-mobile-nav");
    const mobileNavOpen = document.getElementById("modal-mobile-menu-open");
    const mobileNavClose = document.getElementById("modal-mobile-menu-close");

    const chatPanel = document.getElementById("modal-chat-panel");
    const favoritesPanel = document.getElementById("modal-favorites-panel");
    const mapPanel = document.getElementById("modal-map-panel");
    const venuePanel = document.getElementById("modal-venue-detail-panel");
    const sidebarCompose = document.getElementById("modal-sidebar-compose");
    const sidebarHistory = document.getElementById("modal-sidebar-history");
    const sidebarFavorites = document.getElementById("modal-sidebar-favorites");
    const venueBack = document.getElementById("modal-venue-detail-back");
    const venueTitle = document.getElementById("modal-venue-detail-title");
    const venueCategory = document.getElementById("modal-venue-detail-category");
    const venueHours = document.getElementById("modal-venue-detail-hours");
    const btnShowMap = document.getElementById("modal-switch-to-map");
    const btnShowChat = document.getElementById("modal-switch-to-chat");
    const venueHoursToggle = document.getElementById("modal-venue-hours-toggle");
    const venueHoursList = document.getElementById("modal-venue-hours-list");

    let currentView = "chat";
    let lastVenueData = null;
    let venueGallerySwiper = null;

    const isMobileView = () => window.matchMedia("(max-width: 767px)").matches;

    const setMobileFab = (view) => {
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

    const setSidebarActive = (activeBtn) => {
      [sidebarCompose, sidebarHistory, sidebarFavorites].forEach((btn) => {
        if (!btn) return;
        const isActive = btn === activeBtn;
        btn.classList.toggle("modal_sidebar__btn--active", isActive);
        btn.classList.toggle("modal_sidebar__btn--ghost", !isActive);
        btn.setAttribute("aria-pressed", String(isActive));
      });
    };

    const hideFavoritesPanel = () => {
      if (!favoritesPanel) return;
      favoritesPanel.classList.add("is-hidden", "hidden");
      favoritesPanel.classList.remove("flex");
      favoritesPanel.setAttribute("aria-hidden", "true");
    };

    const hideVenueDetail = () => {
      if (!venuePanel) return;
      venuePanel.classList.add("hidden", "is-hidden");
      venuePanel.classList.remove("flex");
      venuePanel.setAttribute("aria-hidden", "true");
    };

    const initVenueGallerySwiper = () => {
      const swiperEl = venuePanel?.querySelector(".modal-venue-gallery__swiper");
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

    const showChatView = () => {
      currentView = "chat";
      hideVenueDetail();
      hideFavoritesPanel();

      chatPanel?.classList.remove("hidden");
      setSidebarActive(sidebarCompose);

      if (isMobileView()) {
        mapPanel?.classList.add("hidden");
        setMobileFab("chat");
      } else {
        mapPanel?.classList.remove("hidden", "is-hidden");
      }
    };

    const showMapView = () => {
      currentView = "map";
      hideVenueDetail();
      hideFavoritesPanel();
      chatPanel?.classList.remove("hidden");

      if (isMobileView()) {
        chatPanel?.classList.add("hidden");
        mapPanel?.classList.remove("hidden", "is-hidden");
        setMobileFab("map");
      } else {
        mapPanel?.classList.remove("hidden", "is-hidden");
      }
    };

    const showFavoritesPanel = () => {
      currentView = "favorites";
      hideVenueDetail();
      chatPanel?.classList.add("hidden");
      favoritesPanel?.classList.remove("is-hidden", "hidden");
      favoritesPanel?.classList.add("flex");
      favoritesPanel?.setAttribute("aria-hidden", "false");
      setSidebarActive(sidebarFavorites);

      if (isMobileView()) {
        mapPanel?.classList.add("hidden");
        setMobileFab("chat");
      } else {
        mapPanel?.classList.remove("hidden", "is-hidden");
      }
    };

    const showVenueDetail = (data) => {
      currentView = "venue";
      lastVenueData = data || lastVenueData;

      if (venueTitle && lastVenueData?.name) venueTitle.textContent = lastVenueData.name;
      if (venueCategory && lastVenueData?.category) venueCategory.textContent = `${lastVenueData.category} |`;
      if (venueHours && lastVenueData?.hours) venueHours.textContent = lastVenueData.hours;

      hideFavoritesPanel();
      mapPanel?.classList.add("is-hidden");
      venuePanel?.classList.remove("hidden", "is-hidden");
      venuePanel?.classList.add("flex");
      venuePanel?.setAttribute("aria-hidden", "false");

      if (isMobileView()) {
        chatPanel?.classList.add("hidden");
        setMobileFab("chat");
      }

      requestAnimationFrame(initVenueGallerySwiper);
    };

    const resetPanels = () => {
      currentView = "chat";
      lastVenueData = null;
      hideFavoritesPanel();
      hideVenueDetail();
      setSidebarActive(sidebarCompose);
      chatPanel?.classList.remove("hidden");

      if (isMobileView()) {
        mapPanel?.classList.add("hidden");
        setMobileFab("chat");
      } else {
        mapPanel?.classList.remove("hidden", "is-hidden");
        btnShowMap?.classList.add("hidden");
        btnShowMap?.classList.remove("inline-flex");
        btnShowChat?.classList.add("hidden");
        btnShowChat?.classList.remove("inline-flex");
      }
    };

    itineraryModal.__resetModalState = resetPanels;

    const openMobileNav = () => {
      if (!mobileNav || window.matchMedia("(min-width: 768px)").matches) return;
      mobileNav.classList.add("is-open");
      mobileNav.setAttribute("aria-hidden", "false");
      mobileNavOpen?.setAttribute("aria-expanded", "true");
    };

    const closeMobileNav = () => {
      if (!mobileNav) return;
      mobileNav.classList.remove("is-open");
      mobileNav.setAttribute("aria-hidden", "true");
      mobileNavOpen?.setAttribute("aria-expanded", "false");
    };

    mobileNavOpen?.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      openMobileNav();
    });

    mobileNavClose?.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      closeMobileNav();
    });

    mobileNav?.querySelectorAll(".modal_mobile-nav__item").forEach((item) => {
      item.addEventListener("click", function (event) {
        event.preventDefault();
        const navKey = item.getAttribute("data-mobile-nav");
        closeMobileNav();

        if (navKey === "favorites") {
          showFavoritesPanel();
        } else {
          showChatView();
        }
      });
    });

    sidebarCompose?.addEventListener("click", function (event) {
      event.preventDefault();
      showChatView();
    });

    sidebarHistory?.addEventListener("click", function (event) {
      event.preventDefault();
      showChatView();
    });

    sidebarFavorites?.addEventListener("click", function (event) {
      event.preventDefault();
      showFavoritesPanel();
    });

    favoritesPanel?.querySelectorAll(".favorite-filter-tab").forEach((tab) => {
      tab.addEventListener("click", function (event) {
        event.preventDefault();
        const filterId = tab.getAttribute("data-favorite-filter");
        if (!filterId || !favoritesPanel) return;

        favoritesPanel.querySelectorAll(".favorite-filter-tab").forEach((button) => {
          const isActive = button.getAttribute("data-favorite-filter") === filterId;
          button.classList.toggle("bg-[#0f3a5d]", isActive);
          button.classList.toggle("font-semibold", isActive);
          button.classList.toggle("text-white", isActive);
          button.classList.toggle("bg-gray-100", !isActive);
          button.classList.toggle("font-normal", !isActive);
          button.classList.toggle("text-gray-700", !isActive);
          button.setAttribute("aria-selected", String(isActive));
        });

        favoritesPanel.querySelectorAll(".modal-favorite-card").forEach((card) => {
          const category = card.getAttribute("data-favorite-category");
          const show = filterId === "all" || category === filterId;
          card.classList.toggle("hidden", !show);
        });
      });
    });

    itineraryModal.querySelectorAll(".venue-view-website").forEach((btn) => {
      btn.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        showVenueDetail({
          name: btn.getAttribute("data-venue-name"),
          category: btn.getAttribute("data-venue-category"),
          hours: btn.getAttribute("data-venue-hours"),
        });
      });
    });

    venueBack?.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      hideVenueDetail();
      if (isMobileView()) {
        chatPanel?.classList.remove("hidden");
        setMobileFab("chat");
      }
    });

    venueHoursToggle?.addEventListener("click", function (event) {
      event.preventDefault();
      const expanded = venueHoursToggle.getAttribute("aria-expanded") === "true";
      const nextExpanded = !expanded;
      venueHoursToggle.setAttribute("aria-expanded", String(nextExpanded));
      venueHoursList?.classList.toggle("hidden", !nextExpanded);

      const icon = venueHoursToggle.querySelector(".modal-venue-hours-toggle__icon");
      if (icon) {
        icon.classList.toggle("ti-chevron-up", nextExpanded);
        icon.classList.toggle("ti-chevron-down", !nextExpanded);
      }
    });

    venuePanel?.querySelectorAll(".venue-detail-tab").forEach((tab) => {
      tab.addEventListener("click", function (event) {
        event.preventDefault();
        const tabId = tab.getAttribute("data-venue-tab");
        if (!tabId || !venuePanel) return;

        venuePanel.querySelectorAll(".venue-detail-tab").forEach((button) => {
          const isActive = button.getAttribute("data-venue-tab") === tabId;
          button.classList.toggle("bg-[#0f3a5d]", isActive);
          button.classList.toggle("font-semibold", isActive);
          button.classList.toggle("text-white", isActive);
          button.classList.toggle("bg-gray-100", !isActive);
          button.classList.toggle("font-normal", !isActive);
          button.classList.toggle("text-gray-700", !isActive);
          button.setAttribute("aria-selected", String(isActive));
        });

        venuePanel.querySelectorAll(".venue-tab-panel").forEach((panel) => {
          const isActive = panel.id === `venue-tab-${tabId}`;
          panel.classList.toggle("hidden", !isActive);
          panel.toggleAttribute("hidden", !isActive);
          panel.classList.toggle("flex", isActive);
        });
      });
    });

    btnShowChat?.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      showChatView();
    });

    btnShowMap?.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      showMapView();
    });

    itineraryModal.addEventListener("click", function (event) {
      if (event.target === itineraryModal) {
        itineraryModal.close();
      }
    });

    itineraryModal.addEventListener("close", function () {
      resetPanels();
      closeMobileNav();
      unlockBody();
    });

    const syncResponsiveState = () => {
      if (!itineraryModal.open) return;

      if (currentView === "favorites") {
        showFavoritesPanel();
        return;
      }
      if (currentView === "venue") {
        showVenueDetail(lastVenueData);
        return;
      }
      if (currentView === "map") {
        showMapView();
        return;
      }
      showChatView();
    };

    window.addEventListener("resize", syncResponsiveState);

    resetPanels();
  }

  document.querySelectorAll(".flight-stops-toggle").forEach((btn) => {
    const panel = btn.nextElementSibling;
    const label = btn.querySelector(".flight-stops-toggle__label");
    const icon = btn.querySelector(".flight-stops-toggle__icon");

    if (!panel || !panel.classList.contains("flight-stops-panel")) return;

    btn.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();

      const expanded = btn.getAttribute("aria-expanded") === "true";
      const nextExpanded = !expanded;
      btn.setAttribute("aria-expanded", String(nextExpanded));
      panel.classList.toggle("hidden", !nextExpanded);

      if (label) label.textContent = nextExpanded ? "Hide Stops" : "View Stops";
      if (icon) {
        icon.classList.toggle("ti-chevron-down", !nextExpanded);
        icon.classList.toggle("ti-chevron-up", nextExpanded);
      }
    });
  });

  document.querySelectorAll("dialog").forEach((modal) => {
    modal.addEventListener("close", function () {
      unlockBody();
    });
  });
});
