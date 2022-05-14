import { ITooltipData } from 'components/ModalTooltip/types';
import { IEnhancement } from 'types/qualities';

export default function buildTooltipData({
  image,
  name,
  description,
  enhancements,
  enhancementsDescription,
  useEventId,
}: {
  image: string,
  name: string,
  description: string,
  enhancements?: IEnhancement[] | undefined,
  enhancementsDescription?: string,
  useEventId?: number,
}): ITooltipData {
  return {
    image,
    name,
    description,
    enhancements,
    secondaryDescription: useEventId ? 'Click on this item in your inventory to use it.' : enhancementsDescription,
  };
}