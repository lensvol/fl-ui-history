import { MD } from "components/Responsive/breakpoints";

import isDeviceMemoryTooLowForMapping from "features/startup/isDeviceMemoryTooLowForMapping";
import isWebGLSupported from "features/startup/isWebGLSupported";

export default function shouldUserBeFunnelledToCompatibilityMap() {
  // Check whether we have a stored preference in local storage
  const storedPreference = window.localStorage.getItem("use-fallback-map");

  if (storedPreference === "false") {
    return false;
  }

  if (storedPreference === "true") {
    return true;
  }

  // If nothing is stored, run some diagnostic checks

  // Mobile device? Compatibility map
  const isMobile =
    window.matchMedia("(hover: none)").matches ||
    window.matchMedia(`(max-width: ${MD - 1}px)`).matches;

  if (isMobile) {
    return isMobile;
  }

  // No WebGL support? Compatibility map
  const lacksWebGLSupport = !isWebGLSupported();

  if (lacksWebGLSupport) {
    console.info(`Bootstrapping: No WebGL support detected`);
  } else {
    console.info(`Bootstrapping: WebGL looks OK`);
  }

  if (lacksWebGLSupport) {
    return true;
  }

  // Low memory (<= 2GB)? Compatibility map
  const isDeviceMemoryTooLow = isDeviceMemoryTooLowForMapping();

  if (isDeviceMemoryTooLow) {
    return true;
  }
}
