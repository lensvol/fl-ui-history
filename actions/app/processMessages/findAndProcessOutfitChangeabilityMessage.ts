import setCanChangeOutfit from 'actions/outfit/setCanChangeOutfit';
import {
  ApiResultMessageQualityEffect,
  OutfitChangeabilityMessage,
} from 'types/app/messages';

export default function findAndProcessOutfitChangeabilityMessage(messages: ApiResultMessageQualityEffect[]) {
  return (dispatch: Function) => {
    const outfitChangeabilityMessage = messages.find(m => m.type === 'OutfitChangeabilityMessage');
    if (outfitChangeabilityMessage) {
      const { canChangeOutfit } = outfitChangeabilityMessage as OutfitChangeabilityMessage;
      dispatch(setCanChangeOutfit(canChangeOutfit));
    }
  };
}