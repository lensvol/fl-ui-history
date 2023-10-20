/* eslint-disable import/prefer-default-export, no-underscore-dangle */
import "react-app-polyfill/ie11";
// react
import React from "react";
import ReactDOM from "react-dom";
// redux
import { Provider } from "react-redux";
import { APP_ROOT_SELECTOR } from "constants/selectors";
import App from "components/App";
import createStaticUpgradeDOM from "features/startup/createStaticUpgradeDOM";
import parseMaintenanceEndTime from "utils/parseMaintenanceEndTime";
import unpackJwt from "utils/unpackJwt";
import ReactModal from "react-modal";
import { FlagsProvider } from "flagged";

import { store } from "features/app/store";

import { bootstrap } from "actions/app";
import createStaticErrorDOM from "features/startup/createStaticErrorDOM";
import getAirbrakeClient from "shared/airbrake/getClient";
// Non-Redux behaviours
import { applyFractionalTileSizeWorkaround, checkOtp } from "features/startup";
// All css styles
import "leaflet/dist/leaflet.css";
import "./assets/styles/main.scss";
import isTimestampStillValid from "features/startup/isTimestampStillValid";
import destructureJwt from "utils/destructureJwt";
import clearAuthenticationTokens from "features/startup/clearAuthenticationTokens";
import logoutUser from "actions/user/logoutUser";
import { FALLBACK_MAP_PREFERRED } from "actiontypes/map";
import { InMaintenance, VersionMismatch } from "services/BaseService";
import createMaintenanceModeDOM from "features/startup/createMaintenanceModeDOM";
import didUserRequestCompatibilityInQueryString from "features/startup/didUserRequestCompatibilityInQueryString";
import shouldUserBeFunnelledToCompatibilityMap from "features/startup/shouldUserBeFunnelledToCompatibilityMap";

// service worker
import { FEATURE_FLAGS } from "features/feature-flags";
import { unregister as unregisterServiceWorker } from "./registerServiceWorker";

// Get our feature flags

// This import is how we set up moment to support formatting durations. Yes, it's weird!
require("moment-duration-format");

runApp();

function runApp() {
  const inMaintenance = process.env.REACT_APP_MAINTENANCE_MODE === "true";
  const maintenanceEndTime = parseMaintenanceEndTime(
    process.env.REACT_APP_MAINTENANCE_END_TIME
  );
  if (inMaintenance && maintenanceEndTime) {
    const ctr = document.querySelector(APP_ROOT_SELECTOR).firstElementChild;
    ctr.removeChild(ctr.firstElementChild);
    ctr.appendChild(createMaintenanceModeDOM(document, maintenanceEndTime));
    return;
  }

  // Look for an OTP in case we are impersonating
  checkOtp(window);

  // Check the query string --- did the user request the compatibility map?
  const compatibilityInQueryString = didUserRequestCompatibilityInQueryString();
  // If the user has asked for compatibility map in the query string, then persist that preference to local storage
  if (compatibilityInQueryString) {
    try {
      window.localStorage.setItem("use-fallback-map", "true");
    } catch (e) {
      // again, no-op is OK
      console.error("Failed to set compatibility preference; continuing");
    }
  }

  const useFallbackMap = shouldUserBeFunnelledToCompatibilityMap();

  // If we meet any of these criteria, dispatch an action to the store so that we know we're funnelling
  if (useFallbackMap) {
    store.dispatch({ type: FALLBACK_MAP_PREFERRED, payload: { value: true } });
  }

  // Look for a stored authentication token; if it looks out of date, then clear it
  if (!isTimestampStillValid(destructureJwt().exp)) {
    clearAuthenticationTokens();
  }

  const { characterId, userId } = unpackJwt(window);

  // If we have a token, retrieve the user's info from the API, and dispatch the
  // actions to build the app state
  if (characterId && userId) {
    const startAt = window.performance.now();
    // Inspect the token for character and user IDs, and if we have both, then
    // start retrieving data before we render the app, and render it no matter what happens

    store
      .dispatch(bootstrap({ fetchSpritesNow: false }))
      .then(() => {
        const duration = window.performance.now() - startAt;
        // eslint-disable-next-line no-console
        console.info(
          `Bootstrapping took ${(Math.round(duration) / 1000).toFixed(2)}s`
        );
        setTimeout(renderApp, 400);
      })
      .catch((error) => {
        if (error instanceof VersionMismatch) {
          console.error("version mismatch found during bootstrap");
          const ctr =
            document.querySelector(APP_ROOT_SELECTOR).firstElementChild;
          ctr.removeChild(ctr.firstElementChild);
          ctr.append(createStaticUpgradeDOM(document));
          return;
        }

        if (error instanceof InMaintenance) {
          const ctr =
            document.querySelector(APP_ROOT_SELECTOR).firstElementChild;
          ctr.removeChild(ctr.firstElementChild);
          ctr.appendChild(createMaintenanceModeDOM(document));
          return;
        }

        // This is nbd, we just have a bad token; log out and render the app
        if (error.response && error.response.status === 401) {
          store.dispatch(logoutUser()); // Log the user out
          renderApp(); // Render the app
          return;
        }

        // Log the error before showing the error page
        console.error(error);

        // This isn't an error we can handle client-side.
        const airbrake = getAirbrakeClient();
        airbrake.notify({
          ...error,
          message: `Bootstrapping failed; original message: '${error.message}'`,
        });

        // Display the error text
        const ctr = document.querySelector(APP_ROOT_SELECTOR).firstElementChild;
        ctr.removeChild(ctr.firstElementChild);
        ctr.appendChild(createStaticErrorDOM(document));
      });
  } else {
    // Render the app immediately
    renderApp();
  }

  // Fix 1px grey borders in Chrome
  applyFractionalTileSizeWorkaround();

  // Render the React app into the DOM
  function renderApp() {
    ReactDOM.render(
      <Provider store={store}>
        <FlagsProvider features={FEATURE_FLAGS}>
          <App />
        </FlagsProvider>
      </Provider>,
      document.querySelector(APP_ROOT_SELECTOR)
    );
  }

  // registerServiceWorker();
  unregisterServiceWorker();

  // Tell react-modal where the app root is
  ReactModal.setAppElement(APP_ROOT_SELECTOR);

  // Find out what the actual height of the window is and set it as a CSS custom variable
  // See https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
  window.addEventListener("resize", setVHCSSVariable);
  setVHCSSVariable();
}

function setVHCSSVariable() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
}
