import { EquipmentAction } from 'actions/equipment';
import { SelectedEnhancementQualityChanged } from 'actions/equipment/selectedEnhancementQualityChanged';
import { SELECTED_ENHANCEMENT_QUALITY_CHANGED } from 'actiontypes/equipment';
import { QUALITY_ID_DUMMY_SHOW_ALL_ITEMS } from 'components/Equipment/constants';

export type IEquipmentState = {
  selectedEnhancementQualityId: number,
};

export const INITIAL_STATE:IEquipmentState =  {
  selectedEnhancementQualityId: QUALITY_ID_DUMMY_SHOW_ALL_ITEMS,
};

export default function reducer(state = INITIAL_STATE, action: EquipmentAction) {
  switch (action.type) {
    case SELECTED_ENHANCEMENT_QUALITY_CHANGED:
      return {
        ...state,
        selectedEnhancementQualityId: (action as SelectedEnhancementQualityChanged).payload.qualityId,
      };
    default:
      return state;
  }
}