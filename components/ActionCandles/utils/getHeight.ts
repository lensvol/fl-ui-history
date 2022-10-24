export const FULL_CANDLE_HEIGHT = 184;
export const SNUFFED_CANDLE_HEIGHT = 79;

export default function getHeight({ actions }: { actions: number }) {
  // If we have no actions, we're displaying the snuffed candle
  if (actions <= 0) {
    return SNUFFED_CANDLE_HEIGHT;
  }
  // Otherwise, we're showing a candle whose height is proportional to the number
  // of actions remaining on this candle
  // TODO: This is the best I can come up with for emulating the legacy site heights
  return Math.round(20 + (actions * (FULL_CANDLE_HEIGHT - 28)) / 19.0);
}
