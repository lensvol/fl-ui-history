import React from "react";

import classnames from "classnames";

import Image from "components/Image";

import { useAppSelector } from "features/app/store";

import { OutfitSlotName } from "types/outfit";

export default function EmptySlot({ isChanging, name }: Props) {
  const image = useAppSelector(
    (state) =>
      state.myself.categories.find(
        (category) => category.name.replace(/ /g, "") === name
      )?.image
  );

  return (
    <div
      className={classnames(
        "equipment__empty-slot",
        isChanging && "equipment-slot--is-changing"
      )}
    >
      {image && (
        <>
          <Image key={image} type="small-icon" icon={image} alt="" />
        </>
      )}
    </div>
  );
}

EmptySlot.displayName = "EmptySlot";

type Props = {
  isChanging: boolean;
  name: OutfitSlotName;
};
