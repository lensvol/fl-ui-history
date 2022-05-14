import isWebGLSupported from 'features/startup/isWebGLSupported';
import isDeviceMemoryTooLowForMapping from 'features/startup/isDeviceMemoryTooLowForMapping';

export default function shouldUserBeFunnelledToCompatibilityMap() {
  // Check whether we have a stored preference in local storage
  const storedPreference = window.localStorage.getItem('use-fallback-map');
  if (storedPreference === 'false') {
    return false;
  }
  if (storedPreference === 'true') {
    return true;
  }

  // If nothing is stored, run some diagnostic checks

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