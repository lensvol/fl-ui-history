import React from 'react';
import classnames from 'classnames';

import { ITooltipData } from 'components/ModalTooltip/types';
import Image from 'components/Image';
import MediaMdUp from 'components/Responsive/MediaMdUp';
import { IQuality } from 'types/qualities';

type Props = IQuality & {
  isChanging: boolean,
  onClick: () => any,
  tooltipData: ITooltipData,
};

export default function DisplayQualityMdUp({
  effectiveLevel,
  isChanging,
  image,
  name,
  nameAndLevel,
  nature,
  onClick,
  tooltipData,
}: Props) {
  return (
    <MediaMdUp>
      <div className={classnames(
        'display-quality__image-and-name',
        isChanging && 'display-quality--is-changing',
      )}
      >
        <div
          className={classnames(
            'icon',
            nature === 'Status' && 'icon--circular',
            'display-quality__image',
          )}
        >
          <Image
            icon={image}
            alt={name}
            type="small-icon"
            onClick={onClick}
            tooltipData={tooltipData}
          />
          <span className="icon__value">{effectiveLevel}</span>
        </div>
        <div>
          <span className="js-item-name item__name">
            {nameAndLevel}
          </span>
        </div>
      </div>
    </MediaMdUp>
  );
}
