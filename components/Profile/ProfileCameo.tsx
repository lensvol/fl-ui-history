import Image from "components/Image";
import { useAppSelector } from "features/app/store";
import React from "react";

export default function ProfileCameo() {
  const avatarImage = useAppSelector(
    (s) => s.profile.profileCharacter?.avatarImage
  );

  if (avatarImage === undefined) {
    return null;
  }

  return (
    <Image
      className="media__object profile__card"
      icon={avatarImage}
      alt="You"
      type="cameo"
      border={false}
      tooltipPos="bottom"
      defaultCursor
    />
  );
}
