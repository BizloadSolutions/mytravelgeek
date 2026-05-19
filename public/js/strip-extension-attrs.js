/**
 * Removes attributes injected by browser extensions (e.g. Bitdefender's
 * bis_skin_checked) before React hydrates, preventing hydration mismatches.
 */
(function () {
  var EXTENSION_ATTRS = ["bis_skin_checked", "bis_register"];

  function stripExtensionAttributes() {
    var nodes = document.getElementsByTagName("*");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      for (var j = 0; j < EXTENSION_ATTRS.length; j++) {
        el.removeAttribute(EXTENSION_ATTRS[j]);
      }
    }
  }

  stripExtensionAttributes();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", stripExtensionAttributes, {
      once: true,
    });
  }
})();
