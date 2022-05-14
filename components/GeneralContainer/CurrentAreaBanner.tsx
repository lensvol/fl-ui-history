import React from 'react';
import { IArea } from 'types/map';
import getImagePath from 'utils/getImagePath';

export default function CurrentAreaBanner({ currentArea }: { currentArea: IArea | undefined }) {
  if (!currentArea?.image) {
    return (
      <div
        key="undefined"
        className="banner banner--lg-up"
      />
    );
  }

  return (
    <div
      key={currentArea.image}
      className="banner banner--lg-up"
      style={{ backgroundImage: `url(${getImagePath({ icon: currentArea.image, type: 'header' })})` }}
    />
  );
}