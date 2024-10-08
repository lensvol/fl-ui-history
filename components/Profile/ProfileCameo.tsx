import Image from "components/Image";
import { useAppSelector } from "features/app/store";
import React from "react";

export default function ProfileCameo() {
  const avatarImage = useAppSelector(
    (s) => s.profile.profileCharacter?.avatarImage
  );
  const frameImage = useAppSelector(
    (s) => s.profile.profileCharacter?.frameImage
  );

  if (avatarImage === undefined) {
    return null;
  }

  if (frameImage) {
    return (
      <div className="profile__card-and-frame">
        <Image
          className="media__object profile__card-framed"
          icon={avatarImage}
          alt="You"
          type="cameo"
          border={false}
          tooltipPos="bottom"
          defaultCursor
        />
        <Image
          className="profile__frame"
          icon={frameImage}
          alt=""
          type="frame"
          border={false}
          tooltipPos="bottom"
          defaultCursor
        />
      </div>
    );
  }

  return (
    <div className="profile__card-no-frame">
      <Image
        className="media__object profile__card"
        icon={avatarImage}
        alt="You"
        type="cameo"
        border={false}
        tooltipPos="bottom"
        defaultCursor
      />
    </div>
  );
}
