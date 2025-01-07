import React from "react";

type Props = {
  name: string;
};

export default function ItsYou({ name }: Props) {
  return (
    <span>
      It's{" "}
      <a
        href={`/profile/${encodeURIComponent(name)}`}
        rel="noopener noreferrer"
        target="_blank"
      >
        <span dangerouslySetInnerHTML={{ __html: name }} />
      </a>
      !
    </span>
  );
}
