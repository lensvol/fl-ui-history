import React from "react";

import SidebarCurrency from "components/PlayerStats/SidebarCurrency";

import { useAppSelector } from "features/app/store";

import getSidebarCurrencies from "selectors/sidebar/getSidebarCurrencies";

export default function SidebarCurrencies() {
  const isFetching = useAppSelector((state) => state.myself.isFetching);
  const scripQualities = useAppSelector((state) => getSidebarCurrencies(state));

  return (
    <>
      {scripQualities.map((scripQuality) => (
        <SidebarCurrency
          isFetching={isFetching}
          key={scripQuality.id}
          scripQuality={scripQuality}
        />
      ))}
    </>
  );
}

SidebarCurrencies.displayName = "SidebarCurrencies";
