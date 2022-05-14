import { formatEnhancementList } from 'components/Tooltip/util';
import { IQuality } from 'types/qualities';
import { stripHtml } from './stringFunctions';

export default function createEquipmentQualityAltText({
  description,
  enhancements,
  name,
  secondaryDescription,
}: Partial<IQuality> & { secondaryDescription?: string | undefined }) {
  const altParts = [
    name,
    formatEnhancementList(enhancements),
    description ? stripHtml(description) : undefined,
    secondaryDescription ? stripHtml(secondaryDescription) : undefined,
  ];
  return altParts.filter(s => s).join('; ');
}
