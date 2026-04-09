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

export function isBrowserPluginError(error) {
  if (!error.backtrace) {
    return false;
  }

  if (!error.backtrace.length) {
    return false;
  }

  if (!error.backtrace[0].file) {
    return false;
  }

  return !!error.backtrace[0].file.match(/(moz|chrome)-extension:\/\//);
}
