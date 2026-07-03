document.addEventListener("DOMContentLoaded", function () {
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
