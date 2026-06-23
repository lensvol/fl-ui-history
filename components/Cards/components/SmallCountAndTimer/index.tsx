import React from "react";

import Loading from "components/Loading";
import SmallCardCount from "components/Cards/components/SmallCountAndTimer/SmallCardCount";

import { useAppSelector } from "features/app/store";

export default function SmallCountAndTimer() {
  const isFetching = useAppSelector((state) => state.cards.isFetching);

  if (isFetching) {
    return <Loading spinner small />;
  }

  return (
    <div>
      <SmallCardCount />
    </div>
  );
}

SmallCountAndTimer.displayName = "SmallCountAndTimer";
