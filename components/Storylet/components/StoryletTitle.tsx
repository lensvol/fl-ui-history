import React from "react";

interface Props {
  level?: number | undefined;
  name: string;
}

export default function StoryletTitle({ level = 3, name }: Props) {
  return (
    <h2
      className={`media__heading heading heading--${level} storylet__heading`}
      dangerouslySetInnerHTML={{ __html: name }}
    />
  );
}
