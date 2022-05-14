import logo from 'assets/img/FL_logo_white.png';
import React from 'react';
import getImagePath from 'utils/getImagePath';

type Props = {
  characterName: string | undefined,
  currentArea?: { image: string, },
}

export default function Hero({ currentArea, characterName }: Props) {
  const areaImage = currentArea?.image ?? null;
  const backgroundImage = areaImage ? `url(${getImagePath({ icon: areaImage, type: 'header' })})` : '';

  return (
    <div className="banner profile__banner">
      <div
        className="profile__banner-backdrop"
        style={{ backgroundImage }}
      />
      <div className="profile__hero">
        <h1>
          <img
            className="img-responsive u-space-below"
            alt="Fallen London - Home of the Echo Bazaar"
            src={logo}
            style={{ filter: 'drop-shadow(0 0 8px black)' }}
          />
        </h1>
        <h2 className="heading heading--1 profile__heading">
          {!!characterName && characterName}
        </h2>
      </div>
    </div>
  );
}
