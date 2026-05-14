document.addEventListener("DOMContentLoaded", function () {
  var header = document.getElementById("site-header");
  if (header) {
    var scrollThreshold = 8;
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > scrollThreshold);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  var root = document.getElementById("travel-suggestions");
  if (!root) return;

  root.addEventListener("click", function (e) {
    var btn = e.target.closest(".travel-suggestion-chip");
    if (!btn || !root.contains(btn)) return;

    var input = document.getElementById("travel-prompt");
    if (!input) return;

    var q = btn.getAttribute("data-q");
    if (!q) return;

    input.value = q;
    input.focus();
  });
});
