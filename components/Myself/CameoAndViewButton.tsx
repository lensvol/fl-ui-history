import React from "react";
import Image from "components/Image";

type Props = {
  avatarImage: string;
  viewCameos: () => void;
  canChangeFaceForFree: boolean;
};

export default function CameoAndViewButton({
  avatarImage,
  viewCameos,
  canChangeFaceForFree,
}: Props) {
  return (
    <div className="myself-profile__cameo-and-button">
      <Image
        borderContainerClassName="myself-profile__cameo-border"
        className="myself-profile__cameo"
        icon={avatarImage}
        alt="You"
        type="cameo"
        border="Unspecialised"
      />
      <button
        type="button"
        onClick={viewCameos}
        className="button button--primary u-space-above myself-profile__button--change-face"
      >
        {canChangeFaceForFree ? "Change face" : "View cameos"}
      </button>
    </div>
  );
}
