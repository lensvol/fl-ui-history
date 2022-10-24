import { START_SCROLLING, STOP_SCROLLING } from "actiontypes/scrollToComponent";

import baseScrollToComponent from "react-scroll-to-component";

const MAX_DURATION = 500;
const PIXELS_PER_SECOND = 1000;

export default function scrollToComponent(el, options = {}, dispatch) {
  // If we have been passed something falsy, return safely
  if (!el) {
    return;
  }
  const distance = Math.abs(el.getBoundingClientRect().top);
  const duration = Math.min(
    (distance * 1000) / PIXELS_PER_SECOND,
    MAX_DURATION
  );

  // If we've been given a dispatch function, then dispatch actions
  if (dispatch) {
    dispatch({ type: START_SCROLLING });
    setTimeout(() => dispatch({ type: STOP_SCROLLING }), duration);
  }

  // Perform the scroll
  baseScrollToComponent(el, {
    ...options,
    duration,
  });
}
