// In-view reveal — adds .is-visible to .in-view (and variants) elements
// once they enter the viewport. Auto-tags common candidates so individual pages
// don't have to. Also handles word-by-word reveal for [data-reveal-words] elements.
(function () {
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Split a heading's text into <span class="reveal-word"> wrappers so each word
  // can animate in independently. Preserves original whitespace.
  function splitWords(el, baseDelay) {
    if (el.dataset.revealSplit === "done") return;
    var text = el.textContent;
    var words = text.split(/(\s+)/); // keep whitespace tokens
    var html = "";
    var idx = 0;
    words.forEach(function (chunk) {
      if (/^\s+$/.test(chunk)) {
        html += chunk;
      } else if (chunk.length === 0) {
        // skip
      } else {
        var delay = (baseDelay + idx * 0.09).toFixed(2);
        html += '<span class="reveal-word" style="animation-delay:' + delay + 's">' + chunk + '</span>';
        idx++;
      }
    });
    el.innerHTML = html;
    el.dataset.revealSplit = "done";
  }

  function autoTag() {
    // Group selectors that should stagger their children
    var staggerSelectors = [
      ".facts-grid",
      ".audience-grid",
      ".sessions-grid",
      ".session-grid",
      ".options-grid",
      ".faq-list",
      ".faq-cats",
      ".pricing-grid",
      ".credentials-list"
    ];
    staggerSelectors.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        if (!el.classList.contains("reveal")) el.classList.add("in-view-stagger");
      });
    });

    // Pull-quotes get the slow fade-only treatment
    document.querySelectorAll(".pullquote").forEach(function (el) {
      if (el.classList.contains("reveal") || el.classList.contains("in-view")) return;
      el.classList.add("in-view-fade");
    });

    // Single-element reveals on common section blocks
    var singleSelectors = [
      "section .slab",
      "section .container > h2",
      "section .container > .eyebrow",
      ".legend-banner",
      ".io-book",
      ".io-book-caption",
      ".photo-frame",
      ".edie-photo",
      "section .container > p"
    ];
    singleSelectors.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        if (el.classList.contains("reveal") || el.classList.contains("in-view") || el.classList.contains("in-view-stagger") || el.classList.contains("in-view-fade") || el.classList.contains("in-view-rise")) return;
        if (el.closest(".hero")) return;
        el.classList.add("in-view");
      });
    });

    // Word-split any element marked with data-reveal-words
    document.querySelectorAll("[data-reveal-words]").forEach(function (el) {
      var base = parseFloat(el.dataset.revealDelay || "0");
      splitWords(el, base);
    });
  }

  function observe() {
    var targets = document.querySelectorAll(".in-view, .in-view-stagger, .in-view-fade, .in-view-rise");
    if (!("IntersectionObserver" in window) || prefersReduced) {
      targets.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    targets.forEach(function (el) { io.observe(el); });
  }

  function init() {
    autoTag();
    observe();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
