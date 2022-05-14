import getHeight, {
  FULL_CANDLE_HEIGHT,
  SNUFFED_CANDLE_HEIGHT,
} from 'components/ActionCandles/utils/getHeight';

export default function getContainerTop(actions: number, isExceptional: boolean) {
  // If we have more than 20 actions, we have a full candle
  if (actions > 20) {
    return -FULL_CANDLE_HEIGHT;
  }

  // If we have 0 actions, we're showing a snuffed candle
  if (actions <= 0) {
    return -SNUFFED_CANDLE_HEIGHT;
  }

  // If we are Exceptional, then we are showing either the height of
  // the remaining candle, or the height of the snuffed candle, whichever
  // is taller
  if (isExceptional) {
    return -Math.max(
      getHeight({ actions }),
      SNUFFED_CANDLE_HEIGHT,
    );
  }
  return -getHeight({ actions });
}
