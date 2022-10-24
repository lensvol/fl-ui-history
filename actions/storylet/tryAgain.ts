import begin from "actions/storylet/begin";

/** ----------------------------------------------------------------------------
 * TRY AGAIN
 -----------------------------------------------------------------------------*/
export default function tryAgain(eventId: number) {
  return (dispatch: Function) => dispatch(begin(eventId));
}
