/* eslint-disable */
// In production, we register a service worker to serve assets from local cache.

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on the "N+1" visit to a page, since previously
// cached resources are updated in the background.

// To learn more about the benefits of this model, read https://goo.gl/KwvDNy.
// This link also includes instructions on opting out of this behavior.

import Config from "configuration";

const SERVICE_WORKER_URL = "/service-worker.js";

export default function registerServiceWorker() {
  if (Config.environment === "local" && process.env.NODE_ENV !== "production") {
    console.warn("Not in production mode");

    return;
  }

  if (!("serviceWorker" in navigator)) {
    console.warn("This browser does not support service workers");

    return;
  }

  // The URL constructor is available in all browsers that support SW.
  const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);

  if (publicUrl.origin !== window.location.origin) {
    console.warn("Server error has disabled Service Worker");

    // Our service worker won't work if PUBLIC_URL is on a different origin
    // from what our page is served on. This might happen if a CDN is used to
    // serve assets; see https://github.com/facebookincubator/create-react-app/issues/2374
    return;
  }

  const isLocalhost = Boolean(
    window.location.hostname === "localhost" ||
    // [::1] is the IPv6 localhost address
    window.location.hostname === "[::1]" ||
    // 127.0.0.1/8 is considered localhost for IPv4
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
  );

  window.addEventListener("load", () =>
    isLocalhost ? checkValidServiceWorker() : registerValidServiceWorker()
  );
}

export function unregisterServiceWorker() {
  if (window.isSecureContext && "serviceWorker" in navigator) {
    console.debug("Removing Service Worker...");

    navigator.serviceWorker.ready.then((registration) =>
      registration.unregister()
    );
  } else {
    console.debug(
      "Cannot remove Service Worker as browser does not support it"
    );
  }
}

function registerValidServiceWorker() {
  console.debug("Registering Service Worker...");

  navigator.serviceWorker
    .register(SERVICE_WORKER_URL)
    .then(initializeUI)
    .catch((error) =>
      console.error("Error during service worker registration: ", error)
    );
}

function checkValidServiceWorker() {
  console.debug("Validating Service Worker before installation...");

  // Check if the service worker can be found. If it can't reload the page.
  fetch(SERVICE_WORKER_URL)
    .then((response) => {
      // Ensure service worker exists, and that we really are getting a JS file.
      if (
        response.status === 404 ||
        (response.headers.get("content-type")?.indexOf("javascript") ?? -1) ===
          -1
      ) {
        console.error("Service Worker not found");

        // No service worker found. Probably a different app. Reload the page.
        navigator.serviceWorker.ready.then((registration) => {
          console.info("Removing existing Service Worker");

          registration.unregister().then(() => window.location.reload());
        });
      } else {
        console.debug("Service Worker validated");

        // Service worker found. Proceed as normal.
        registerValidServiceWorker();
      }
    })
    .catch(() =>
      console.info(
        "No internet connection found. App is running in offline mode."
      )
    );
}

function initializeUI(registration: ServiceWorkerRegistration | null) {
  if (!registration) {
    console.warn("Failed to register Service Worker");

    return;
  }

  console.debug("Service Worker Registered");

  navigator.serviceWorker.ready.then((_registration) => {
    console.debug("Service Worker Ready");
  });

  registration.onupdatefound = () => {
    const installingWorker = registration.installing;

    if (!installingWorker) {
      return;
    }

    installingWorker.onstatechange = () => {
      if (installingWorker.state === "installed") {
        if (navigator.serviceWorker.controller) {
          // At this point, the old content will have been purged and
          // the fresh content will have been added to the cache.
          // It's the perfect time to display a "New content is
          // available; please refresh." message in your web app.
          console.log("New content is available; please refresh.");
        } else {
          // At this point, everything has been precached.
          // It's the perfect time to display a
          // "Content is cached for offline use." message.
          console.log("Content is cached for offline use.");
        }
      }
    };
  };
}
