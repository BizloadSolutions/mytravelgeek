document.addEventListener("DOMContentLoaded", function () {
  const openButtons = document.querySelectorAll("[data-modal-open]");
  const closeButtons = document.querySelectorAll("[data-modal-close]");

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

  openButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      const modalId = button.getAttribute("data-modal-open");
      if (modalId) {
        e.preventDefault();
      }
      const closeBefore = button.getAttribute("data-modal-close-before");
      if (closeBefore) {
        closeModal(closeBefore);
      }
      if (modalId) {
        openModal(modalId);
      }
    });
  });

  closeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const modalId = button.getAttribute("data-modal-close");
      if (modalId) {
        closeModal(modalId);
      }
    });
  });

  const itineraryModal = document.getElementById("custom-itinerary-modal");
  if (itineraryModal) {
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
      mobileNavOpen.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        openMobileNav();
      });
    }

    if (mobileNavClose) {
      mobileNavClose.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeMobileNav();
      });
    }

    mobileNav?.querySelectorAll(".modal_mobile-nav__item").forEach((item) => {
      item.addEventListener("click", () => closeMobileNav());
    });

    const chatPanel = document.getElementById("modal-chat-panel");
    const favoritesPanel = document.getElementById("modal-favorites-panel");
    const mapPanel = document.getElementById("modal-map-panel");
    const venuePanel = document.getElementById("modal-venue-detail-panel");
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
      switchVenueTab("overview");

      mapPanel?.classList.add("is-hidden");
      venuePanel.classList.remove("hidden", "is-hidden");
      venuePanel.classList.add("flex");
      venuePanel.setAttribute("aria-hidden", "false");

      if (isMobileView()) {
        chatPanel?.classList.add("hidden");
        btnShowMap?.classList.add("hidden");
        btnShowMap?.classList.remove("inline-flex");
        btnShowChat?.classList.remove("hidden");
        btnShowChat?.classList.add("inline-flex");
      }

      requestAnimationFrame(() => initVenueGallerySwiper());
    };

    const hideVenueDetail = () => {
      if (!venuePanel) return;
      venuePanel.classList.add("hidden", "is-hidden");
      venuePanel.classList.remove("flex");
      venuePanel.setAttribute("aria-hidden", "true");
      mapPanel?.classList.remove("is-hidden");

      if (isMobileView()) {
        chatPanel?.classList.remove("hidden");
        setMobileFab("chat");
      }
    };

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
        mapPanel?.classList.add("hidden");
        setMobileFab("chat");
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
      if (isMobileView()) {
        chatPanel?.classList.remove("hidden");
        mapPanel?.classList.add("hidden");
        setMobileFab("chat");
      }
    };

    const showMapView = () => {
      hideVenueDetail();
      hideFavoritesPanel();
      if (isMobileView()) {
        chatPanel?.classList.add("hidden");
        mapPanel?.classList.remove("hidden", "is-hidden");
        setMobileFab("map");
      }
    };

    const resetPanels = () => {
      hideVenueDetail();
      hideFavoritesPanel();
      setSidebarActive(sidebarCompose);
      if (isMobileView()) {
        showChatView();
      } else {
        chatPanel?.classList.remove("hidden");
        mapPanel?.classList.remove("hidden", "is-hidden");
        btnShowMap?.classList.add("hidden");
        btnShowMap?.classList.remove("inline-flex");
        btnShowChat?.classList.add("hidden");
        btnShowChat?.classList.remove("inline-flex");
      }
    };

    sidebarCompose?.addEventListener("click", (e) => {
      e.preventDefault();
      showChatView();
      if (!isMobileView()) {
        mapPanel?.classList.remove("hidden", "is-hidden");
      }
    });

    sidebarFavorites?.addEventListener("click", (e) => {
      e.preventDefault();
      showFavoritesPanel();
      if (!isMobileView()) {
        mapPanel?.classList.remove("hidden", "is-hidden");
      }
    });

    favoritesPanel?.querySelectorAll(".favorite-filter-tab").forEach((tab) => {
      tab.addEventListener("click", (e) => {
        e.preventDefault();
        const filterId = tab.dataset.favoriteFilter;
        if (filterId) switchFavoriteFilter(filterId);
      });
    });

    mobileNav
      ?.querySelector('[data-mobile-nav="favorites"]')
      ?.addEventListener("click", (e) => {
        e.preventDefault();
        showFavoritesPanel();
      });

    mobileNav
      ?.querySelector('[data-mobile-nav="compose"]')
      ?.addEventListener("click", (e) => {
        e.preventDefault();
        showChatView();
      });

    itineraryModal.querySelectorAll(".venue-view-website").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        showVenueDetail({
          name: btn.dataset.venueName,
          category: btn.dataset.venueCategory,
          hours: btn.dataset.venueHours,
        });
      });
    });

    venueBack?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      hideVenueDetail();
      if (isMobileView()) {
        chatPanel?.classList.remove("hidden");
        setMobileFab("chat");
      }
    });

    const venueHoursToggle = document.getElementById(
      "modal-venue-hours-toggle",
    );
    const venueHoursList = document.getElementById("modal-venue-hours-list");
    venueHoursToggle?.addEventListener("click", (e) => {
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
      tab.addEventListener("click", (e) => {
        e.preventDefault();
        const tabId = tab.dataset.venueTab;
        if (tabId) switchVenueTab(tabId);
      });
    });

    if (btnShowChat) {
      btnShowChat.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        showChatView();
      });
    }

    if (btnShowMap) {
      btnShowMap.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        showMapView();
      });
    }

    itineraryModal.addEventListener("close", () => {
      resetPanels();
      closeMobileNav();
    });
  }

  document.querySelectorAll(".flight-stops-toggle").forEach((btn) => {
    const panel = btn.nextElementSibling;
    const label = btn.querySelector(".flight-stops-toggle__label");
    const icon = btn.querySelector(".flight-stops-toggle__icon");
    if (!panel?.classList.contains("flight-stops-panel")) return;

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
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
});
