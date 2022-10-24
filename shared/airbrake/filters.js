export function isNetworkError(error) {
  if (!error.type) {
    return false;
  }
  return !!error.type.match("Network( )?Error");
}

export function isGreasemonkeyError(error) {
  return !!(error.message && error.message.match("GM_getValue"));
}

export function isExtensionContextInvalidated(error) {
  return !!(
    error.message && error.message.match("Extension context invalidated")
  );
}

export function isTimeoutOf0ms(error) {
  return !!(error.message && error.message.match(/[Tt]imeout of 0( )*ms/));
}

export function isTooManySetStates(error) {
  return !!(error.message && error.message.match("Minified React error #185"));
}
