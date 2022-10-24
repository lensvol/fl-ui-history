export const LOCAL_STORAGE = "localStorage";
export const SESSION_STORAGE = "sessionStorage";

type StorageType = "localStorage" | "sessionStorage";

export default function getTokenAndStorage(window: Window): {
  storage: "localStorage" | "sessionStorage";
  token?: string | undefined;
} {
  // Check localStorage first
  let token = safeToken(window.localStorage);
  if (token) {
    return { token, storage: "localStorage" };
  }

  // Then check sessionStorage
  token = safeToken(window.sessionStorage);
  if (token) {
    return { token, storage: "sessionStorage" };
  }

  // If we don't have a token in either storage, see if we can find where the
  // user wants us to store things; if it's valid, return it
  const preferredStorage = window.sessionStorage.getItem("storage");
  if (preferredStorage ?? "" in ["localStorage", "sessionStorage"]) {
    return { storage: preferredStorage as StorageType };
  }

  // Otherwise, return session storage as a last resort
  return { storage: "sessionStorage" };
}

export function safeToken(storageType: Storage) {
  return (storageType.getItem("access_token") ?? "").replace(/"/g, "");
}
