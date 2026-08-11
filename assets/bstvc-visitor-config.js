/* Stable visitor-statistics configuration.
   Keep BSTVC_VISITOR_SITE_KEY unchanged across website versions so the
   persistent backend continues aggregating the same site counter. */
window.BSTVC_VISITOR_SITE_KEY = "bstvc-r";
window.BSTVC_VISITOR_ENDPOINT = "https://bstvc-visitor-api.songbi123.workers.dev/stats";

/* English V4 is intentionally isolated as an additive language layer so the
   Chinese homepage can continue to evolve independently. */
(() => {
  const style = document.createElement("link");
  style.rel = "stylesheet";
  style.href = "./assets/bstvc-en-v4.css";
  document.head.appendChild(style);

  const script = document.createElement("script");
  script.src = "./assets/bstvc-en-v4.js";
  script.defer = true;
  document.head.appendChild(script);
})();
