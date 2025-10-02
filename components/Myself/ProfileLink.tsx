/* eslint-disable react/jsx-no-target-blank */
import React from "react";

import { useAppSelector } from "features/app/store";

export default function ProfileLink() {
  const name = useAppSelector((state) => state.myself.character.name);

  return (
    <a
      href={`/profile/${encodeURIComponent(name)}`}
      target="_blank"
      className="button button--primary button--no-margin"
      rel="opener"
    >
      View profile
    </a>
  );
}

ProfileLink.displayName = "ProfileLink";
