import { ITooltipData } from 'components/ModalTooltip/types';
import { ICard } from 'types/cards';

export default function makeTooltipData({ action, data }: {
  action: () => any,
  data: ITooltipData & Pick<ICard, 'unlockedWithDescription' | 'teaser'>,
}): ITooltipData {
  return {
    // secondaryDescription: splitQreqString(data.unlockedWithDescription),
    secondaryDescription: data.unlockedWithDescription,
    name: data.name,
    description: data.teaser,
    smallButtons: [{
      action,
      label: 'play',
    }],
  };
}