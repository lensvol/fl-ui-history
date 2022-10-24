import { SELECTED_ENHANCEMENT_QUALITY_CHANGED } from "actiontypes/equipment";
import { ActionCreator } from "redux";

export type SelectedEnhancementQualityChanged = {
  type: typeof SELECTED_ENHANCEMENT_QUALITY_CHANGED;
  payload: { qualityId: number };
};

const selectedEnhancementQualityChanged: ActionCreator<
  SelectedEnhancementQualityChanged
> = (qualityId: number) => ({
  type: SELECTED_ENHANCEMENT_QUALITY_CHANGED,
  payload: { qualityId },
});

export default selectedEnhancementQualityChanged;
