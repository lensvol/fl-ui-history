import { CANDLE_LEFT, CANDLE_RIGHT, CANDLE_SNUFFED } from "../constants";

// Get the image we'll be using for the candle. If we have
// no actions, it's the snuffed candle; otherwise it's either the
// left or right candle
export default function getBackgroundImageUrl({
  actions,
  right,
}: {
  actions: number;
  right?: boolean;
}) {
  if (actions <= 0) {
    return CANDLE_SNUFFED;
  }
  if (right) {
    return CANDLE_RIGHT;
  }
  return CANDLE_LEFT;
}
