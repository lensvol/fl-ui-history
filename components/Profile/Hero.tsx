import React from "react";
import getImagePath from "utils/getImagePath";

type Props = {
  image?: string;
};

export default function Hero({ image }: Props) {
  const areaImage = image ?? null;
  const backgroundImage = areaImage
    ? `url(${getImagePath({ icon: areaImage, type: "header" })})`
    : "";

  return (
    <div className="banner profile__banner">
      <div className="profile__banner-backdrop" style={{ backgroundImage }} />
    </div>
  );
}
