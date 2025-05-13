import React from "react";

import classnames from "classnames";

type Props = {
  classNames?: string;
};

export default function LockedSlotIcon(props: Props) {
  return (
    <img
      alt="Locked"
      src="/img/icons/ico_slot_locked.png"
      className={classnames(props.classNames)}
    />
  );
}
