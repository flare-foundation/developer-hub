(function () {
  const COOKIEYES_ID = "cookieyes";
  const COOKIEYES_SRC =
    "https://cdn-cookieyes.com/client_data/dedcd40fe7e8316d7512b294/script.js";
  const FALLBACK_DELAY_MS = 2000;

  function hasCookie(name) {
    const cookies = document.cookie ? document.cookie.split(";") : [];
    const prefix = `${encodeURIComponent(name)}=`;

    for (const c of cookies) {
      const trimmed = c.trim();
      if (trimmed.startsWith(prefix)) return true;
    }
    return false;
  }

  function alreadyInjected() {
    return (
      document.getElementById(COOKIEYES_ID) != null ||
      Array.from(document.scripts).some((s) => s.src === COOKIEYES_SRC)
    );
  }

  function loadCookieScript() {
    if (alreadyInjected()) return;

    const script = document.createElement("script");
    script.id = COOKIEYES_ID;
    script.src = COOKIEYES_SRC;
    script.async = true;

    (document.head || document.documentElement).appendChild(script);
  }

  function scheduleLoad() {
    if (hasCookie("cookieyes-consent")) {
      loadCookieScript();
      return;
    }

    // Minimize impact on LCP/INP
    if (typeof window.requestIdleCallback === "function") {
      window.requestIdleCallback(() => loadCookieScript(), {
        timeout: FALLBACK_DELAY_MS,
      });
    } else {
      window.setTimeout(loadCookieScript, FALLBACK_DELAY_MS);
    }
  }

  // Handle all states safely
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scheduleLoad, { once: true });
  } else {
    scheduleLoad();
  }
})();
