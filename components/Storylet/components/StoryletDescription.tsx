import { UI_INTEGRATION_REGEX } from "features/content-behaviour-integration/constants";
import React from "react";

export interface Props {
  text: string;
}

export default function StoryletDescription({ text }: Props) {
  // Make sure we remove UI triggers from the printable text
  return (
    <div
      className="storylet__description-container"
      dangerouslySetInnerHTML={{
        __html: text.replace(UI_INTEGRATION_REGEX, "").trim(),
      }}
    />
  );
}
