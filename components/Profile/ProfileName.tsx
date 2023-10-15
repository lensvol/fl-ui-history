import { useAppSelector } from "features/app/store";
import React from "react";
import AddToContacts from "./AddToContacts";

export default function ProfileName() {
  const profileName = useAppSelector((s) => s.profile.profileName);

  if (!profileName) {
    return null;
  }

  return (
    <h2 className="heading heading--2 profile__character-name">
      {profileName} <AddToContacts />
    </h2>
  );
}
