import { IMyselfState } from "types/myself";
import { IQuality } from "types/qualities";

export default function exchangeTransactionSuccess(
  state: IMyselfState,
  payload: { possessionsChanged: IQuality[] }
) {
  const { possessionsChanged } = payload;
  const { qualities } = state;
  const newQualities = [...qualities];
  possessionsChanged.forEach((updatedQuality) => {
    // Find the quality with this updated quality's ID
    const idx = newQualities.findIndex((_) => _.id === updatedQuality.id);
    // If this is a quality we don't already have, then add it to the qualities array
    if (idx < 0) {
      newQualities.push(updatedQuality);
      return;
    }
    // Otherwise, merge the existing quality with this value
    newQualities[idx] = { ...newQualities[idx], ...updatedQuality };
  });
  return {
    ...state,
    qualities: newQualities,
  };
}
