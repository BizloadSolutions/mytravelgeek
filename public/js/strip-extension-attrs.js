/**
 * Removes attributes injected by browser extensions (e.g. Bitdefender bis_*)
 * before React hydrates. Uses a MutationObserver because extensions often
 * inject after the first paint.
 */
(function () {
  var PREFIX = "bis_";

  function stripElement(el) {
    if (!el || el.nodeType !== 1) return;
    var attrs = el.attributes;
    for (var i = attrs.length - 1; i >= 0; i--) {
      var name = attrs[i].name;
      if (name.indexOf(PREFIX) === 0) {
        el.removeAttribute(name);
      }
    }
  }

  function stripTree(root) {
    if (!root || root.nodeType !== 1) return;
    stripElement(root);
    if (root.querySelectorAll) {
      var nodes = root.querySelectorAll("*");
      for (var i = 0; i < nodes.length; i++) {
        stripElement(nodes[i]);
      }
    }
  }

  function stripAll() {
    if (document.documentElement) {
      stripTree(document.documentElement);
    }
  }

  stripAll();

  if (typeof MutationObserver !== "undefined" && document.documentElement) {
    var observer = new MutationObserver(function (mutations) {
      for (var i = 0; i < mutations.length; i++) {
        var m = mutations[i];
        if (m.type === "attributes") {
          var name = m.attributeName;
          if (name && name.indexOf(PREFIX) === 0) {
            m.target.removeAttribute(name);
          }
        } else if (m.type === "childList") {
          for (var j = 0; j < m.addedNodes.length; j++) {
            var node = m.addedNodes[j];
            if (node.nodeType === 1) {
              stripTree(node);
            }
          }
        }
      }
    });

    observer.observe(document.documentElement, {
      subtree: true,
      attributes: true,
      childList: true,
    });

    window.addEventListener(
      "load",
      function () {
        stripAll();
        observer.disconnect();
      },
      { once: true }
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", stripAll, { once: true });
  } else {
    stripAll();
  }
})();
