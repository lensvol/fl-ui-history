import { formatEnhancementList } from 'components/Tooltip/util';
import React, {
  useMemo,
} from 'react';
import { IEnhancement } from 'types/qualities';

type Props = {
  enhancements: IEnhancement[] | undefined,
};

export default function EnhancementDescription({ enhancements }: Props) {
  const enhancementDescription: string = useMemo(() => formatEnhancementList(enhancements), [enhancements]);

  if (!enhancements?.length) {
    return null;
  }

  return (
    <strong className="enhancements-description">
      {enhancementDescription}
      .
    </strong>
  );
}
