import React from "react";

import { useAppSelector } from "features/app/store";

export default function ProfileDescription() {
  const profileDescription = useAppSelector(
    (s) => s.profile.profileDescription
  );

  if (!profileDescription) {
    return null;
  }

  return (
    <p className="heading heading--2 profile__description">
      {profileDescription}
    </p>
  );
}
