import React from "react";

import classnames from "classnames";

import TippyWrapper from "components/TippyWrapper";

import { useAppSelector } from "features/app/store";

export default function ProfileDescription() {
  const profileDescription = useAppSelector(
    (s) => s.profile.profileDescription
  );
  const isLoggedInUsersProfile = useAppSelector(
    (s) => s.profile.isLoggedInUsersProfile
  );
  const area = useAppSelector((s) => s.profile.currentArea?.name);

  if (!profileDescription) {
    return null;
  }

  return (
    <div className="profile__description-wrapper">
      <TippyWrapper
        tooltipData={
          isLoggedInUsersProfile
            ? {
                description:
                  "Change this through the storylet &#8216;Attend to Matters of Identity&#8217;, in your Lodgings.",
              }
            : undefined
        }
      >
        <span className="heading heading--2 profile__description">
          {profileDescription}
        </span>
      </TippyWrapper>
      <TippyWrapper
        tooltipData={{
          description: "Currently in: <b>" + area + "</b>.",
        }}
      >
        <span
          className={classnames(
            "fa",
            "fa-compass",
            "profile__description-location"
          )}
        ></span>
      </TippyWrapper>
    </div>
  );
}
