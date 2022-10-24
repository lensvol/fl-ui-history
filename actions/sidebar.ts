import { Dispatch } from "redux";
import { SIDEBAR_CLOSE, SIDEBAR_OPEN } from "actiontypes/sidebar";

export type OpenSidebar = { type: typeof SIDEBAR_OPEN };
export type CloseSidebar = { type: typeof SIDEBAR_CLOSE };

export type SidebarAction = OpenSidebar | CloseSidebar;

function setBodyOverflow(val: string) {
  // NOTE: Doing this kind of thing is generally a very bad idea,
  // but the document body — which is outside the React app — is
  // the only place we can reliably get 'overflow: hidden' to
  // work on the app when the responsive sidebar is out.
  document.body.style.overflow = val;
}

export function openSidebar() {
  setBodyOverflow("hidden");
  return (dispatch: Dispatch) => dispatch({ type: SIDEBAR_OPEN });
}

export function closeSidebar() {
  setBodyOverflow("auto");
  return (dispatch: Dispatch) => dispatch({ type: SIDEBAR_CLOSE });
}
