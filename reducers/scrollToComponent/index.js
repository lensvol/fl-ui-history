import { START_SCROLLING, STOP_SCROLLING } from "actiontypes/scrollToComponent";

const INITIAL_STATE = {
  scrolling: false,
};

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case START_SCROLLING:
      return { scrolling: true };
    case STOP_SCROLLING:
      return { scrolling: false };
    default:
      return state;
  }
}
