import React from "react";
import classnames from "classnames";
import { ImageProps } from "components/Image/props";

import ImageComponent from "./ImageComponent";

export default function ImageContainer(props: ImageProps) {
  const { border, borderContainerClassName } = props;

  if (!border) {
    return <ImageComponent {...props} />;
  }

  return (
    <div
      className={classnames(borderContainerClassName)}
      style={{
        backgroundImage: `url(https://images.fallenlondon.com/cards/Card-${border}.png)`,
        backgroundSize: "cover",
      }}
    >
      <ImageComponent {...props} />
    </div>
  );
}

ImageContainer.displayName = "ImageContainer";
