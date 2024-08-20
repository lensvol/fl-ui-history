import React, { useMemo } from "react";

import Loading from "components/Loading";
import Image from "components/Image";

import { IQuality } from "types/qualities";

export function SidebarCurrency({ isFetching, scripQuality }: Props) {
  const pluralName = useMemo(() => {
    if (!scripQuality) {
      return "";
    }

    if (scripQuality.id === 125025) {
      return scripQuality.name;
    }

    return scripQuality.name + "s";
  }, [scripQuality]);

  if (!scripQuality) {
    return null;
  }

  if (scripQuality.effectiveLevel <= 0) {
    return null;
  }

  return (
    <li className="item">
      <div
        className="icon icon--circular"
        style={{
          width: "45px",
        }}
      >
        <Image icon={scripQuality.image} type="small-icon" />
      </div>
      <div className="item__desc">
        <span className="item__name">{pluralName}</span>
        <Value isFetching={isFetching} value={scripQuality.effectiveLevel} />
      </div>
    </li>
  );
}

function Value({
  isFetching,
  value,
}: Pick<Props, "isFetching"> & {
  value: number;
}) {
  if (isFetching) {
    return (
      <div>
        {" "}
        <Loading spinner small />
      </div>
    );
  }

  return <div className="item__value">{value.toLocaleString("en-GB")}</div>;
}

type Props = {
  isFetching: boolean;
  scripQuality?: IQuality;
};

export default SidebarCurrency;
