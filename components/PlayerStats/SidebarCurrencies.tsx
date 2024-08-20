import React from "react";
import { connect } from "react-redux";

import SidebarCurrency from "components/PlayerStats/SidebarCurrency";

import getSidebarCurrencies from "selectors/sidebar/getSidebarCurrencies";

import { IAppState } from "types/app";

export function SidebarCurrencies({ isFetching, scripQualities }: Props) {
  return (
    <>
      {scripQualities.map((scripQuality) => (
        <>
          <SidebarCurrency
            isFetching={isFetching}
            scripQuality={scripQuality}
          />
        </>
      ))}
    </>
  );
}

const mapStateToProps = (state: IAppState) => ({
  isFetching: state.myself.isFetching,
  scripQualities: getSidebarCurrencies(state),
});

type Props = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(SidebarCurrencies);
