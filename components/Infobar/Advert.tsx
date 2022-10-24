import React from "react";

import Image from "components/Image";
import { Advert as AdvertType } from "services/InfoBarService";

export default function Advert({
  altText,
  image,
  url,
}: Pick<AdvertType, "altText" | "image" | "url">) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      <Image alt={altText} icon={image} type="ad" />
    </a>
  );
}
