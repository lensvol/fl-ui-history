/**
 * Remove any `access_token` items from local storage and session storage
 */
export default function clearAuthenticationTokens() {
  [
    // Explicitly remove access token from storage
    'access_token',
    // Remove preferences, too --- prevent us from looking in the wrong place
    'storage',
  ].forEach((key) => {
    window.localStorage.removeItem(key);
    window.sessionStorage.removeItem(key);
  });
}
