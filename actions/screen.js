import { ENTER_FULL_SCREEN, EXIT_FULL_SCREEN } from "actiontypes/screen";

// Trigger warning: Browser Wars flashback
const rfs = (el) =>
  el.requestFullscreen ||
  el.webkitRequestFullscreen ||
  el.mozRequestFullScreen ||
  el.msRequestFullscreen;

const efs =
  document.exitFullscreen ||
  document.webkitExitFullscreen ||
  document.mozCancelFullScreen ||
  document.msExitFullscreen;

export const enterFullScreen = () => (dispatch) => {
  const el = document.documentElement;
  rfs(el) && rfs(el).call(el);
  dispatch({ type: ENTER_FULL_SCREEN });
};
export const exitFullScreen = () => (dispatch) => {
  efs.call(document);
  dispatch({ type: EXIT_FULL_SCREEN });
};
