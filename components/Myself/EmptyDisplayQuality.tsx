import React from "react";

import classnames from "classnames";

type Props = {
  isChanging: boolean;
  onClick: () => void;
};

export default function EmptyDisplayQuality({ isChanging, onClick }: Props) {
  return (
    <button
      className={classnames(
        "button--link icon display-quality display-quality--empty",
        isChanging && "display-quality--is-changing"
      )}
      onClick={onClick}
      style={{
        height: 40,
        width: 40,
      }}
      type="button"
    />
  );
}

EmptyDisplayQuality.displayName = "EmptyDisplayQuality";
