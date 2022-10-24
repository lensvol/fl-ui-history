import { CLEAR_CACHE } from "actiontypes/cards";
import { Dispatch } from "redux";

export type ClearCardsCache = { type: typeof CLEAR_CACHE };

/**
 * Dispatch an action instructing the card reducer to clear
 * its internal state. Use sparingly.
 */
export default function clearCache() {
  return (dispatch: Dispatch) => dispatch({ type: CLEAR_CACHE });
}
