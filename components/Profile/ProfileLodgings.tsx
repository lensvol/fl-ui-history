import Image from "components/Image";
import { useAppSelector } from "features/app/store";
import React from "react";

export default function ProfileLodgings() {
  const currentDomicile = useAppSelector(
    (s) => s.profile.profileCharacter?.currentDomicile
  );

  const tooltipData =
    currentDomicile === undefined
      ? undefined
      : { ...currentDomicile, image: undefined };

  if (currentDomicile === undefined) {
    return null;
  }

  return (
    <Image
      className="media__object profile__card"
      icon={currentDomicile.image}
      alt="You"
      type="lodgings"
      border={false}
      tooltipData={tooltipData}
      tooltipPos="bottom"
      defaultCursor
    />
  );
}
