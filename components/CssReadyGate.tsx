/** Hide page until stylesheets load — prevents first-paint FOUC. */
export function CssReadyStyle() {
  return (
    <style
      id="css-ready-gate"
      dangerouslySetInnerHTML={{
        __html: `
html:not(.css-ready) body {
  visibility: hidden;
}
html.css-ready body {
  visibility: visible;
}
`,
      }}
    />
  );
}

/** Must be placed after all <link rel="stylesheet"> tags in <head>. */
export function CssReadyScript() {
  return (
    <script
      id="css-ready-script"
      dangerouslySetInnerHTML={{
        __html: `
(function () {
  function reveal() {
    document.documentElement.classList.add("css-ready");
  }
  window.addEventListener("load", reveal);
  setTimeout(reveal, 5000);
})();
`,
      }}
    />
  );
}
