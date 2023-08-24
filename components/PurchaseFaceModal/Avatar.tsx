import React from "react";

import Image from "components/Image";

export default function Avatar({
  avatar,
  onClick,
}: {
  avatar: string;
  onClick: (avatar: string) => void;
}) {
  return (
    <Image
      alt={avatar}
      height={100}
      icon={avatar}
      onClick={() => onClick(avatar)}
      type="cameo"
      className="avatar-list__image"
    />
  );
}
