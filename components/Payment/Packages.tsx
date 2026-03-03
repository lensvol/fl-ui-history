import React from "react";

import Loading from "components/Loading";
import FateOption from "components/Payment/FateOption";

import { NexQuantity } from "types/payment";

export default function Packages({
  isFetching,
  packages,
  onSelect,
  selectedPackage,
}: Props) {
  if (isFetching) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: 24,
        }}
      >
        <Loading spinner />
      </div>
    );
  }

  return (
    <>
      {packages.map((item, i) => {
        const isSelected =
          !!selectedPackage && selectedPackage.currency === item.currency;

        return (
          <FateOption
            key={item.quantity}
            data={item}
            id={i}
            isSelected={isSelected}
            onSelect={onSelect}
          />
        );
      })}
    </>
  );
}

Packages.displayName = "Packages";

type Props = {
  isFetching: boolean;
  onSelect: (selectedPackage: NexQuantity) => void;
  packages: NexQuantity[];
  selectedPackage: any;
};
