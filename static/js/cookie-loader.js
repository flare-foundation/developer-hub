// Wait for the page to be fully loaded and interactive
document.addEventListener("DOMContentLoaded", function () {
  // Check if we already have consent to avoid showing the banner unnecessarily
  if (document.cookie.indexOf("cookieyes-consent") !== -1) {
    // If we already have consent, load the CookieYes script immediately
    loadCookieScript();
    return;
  }

  // If we don't have consent yet, delay loading the cookie banner
  // This ensures it doesn't compete with critical content
  setTimeout(function () {
    loadCookieScript();
  }, 2000); // 2-second delay to improve LCP
});

// Function to load the CookieYes script
function loadCookieScript() {
  const script = document.createElement("script");
  script.defer = true;
  script.id = "cookieyes";
  script.src =
    "https://cdn-cookieyes.com/client_data/dedcd40fe7e8316d7512b294/script.js";

  document.body.appendChild(script);
}
