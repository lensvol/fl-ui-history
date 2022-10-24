import {
  SET_TIMER_NEXT_AVAILABLE,
  SET_TIMER_REMAINING,
} from "actiontypes/timer";

import quantizeToSeconds from "./quantizeToSeconds";

import { INITIAL_STATE } from "./constants";

/**
 * Initial state
 * @type {Object}
 */

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_TIMER_NEXT_AVAILABLE:
      return {
        ...state,
        timeNextActionIsAvailable: action.nextAvailable,
      };

    case SET_TIMER_REMAINING:
      // This gets fired every 300 ms by the Timer component
      return {
        ...state,
        timerStarted: true,
        remainingTime: quantizeToSeconds(action.timeRemaining),
      };

    default:
      return state;
  }
}
