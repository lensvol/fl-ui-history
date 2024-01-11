import React from "react";
import { connect } from "react-redux";
import moment from "moment";

import getSidebarQualities from "selectors/myself/getSidebarQualities";
import getEchoes from "selectors/myself/getEchoes";
import { IAppState } from "types/app";
import AccessibleMapMenu from "./AccessibleMapMenu";
import AccessibleNavigationTabs from "./AccessibleNavigationTabs";

export function AccessibleSidebar({
  actionBankSize,
  actions,
  currentAreaName,
  echoes,
  name,
  nextActionAt,
  sidebarQualities,
}: Props) {
  const fetching = [
    actionBankSize,
    currentAreaName,
    echoes,
    name,
    nextActionAt,
  ].some((x) => !x);
  if (fetching) {
    return (
      <div className="accessible-sidebar u-visually-hidden">
        Fetching stats.
      </div>
    );
  }

  const formattedNextActionAt = moment(new Date(nextActionAt)).format("hh:mm");
  const formattedEchoes = echoes.toLocaleString("en-GB", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div
      id="accessible-sidebar"
      className="accessible-sidebar u-visually-hidden"
    >
      <h1 className="welcome">
        {`It's ${name}!`} {`Welcome to ${currentAreaName}, delicious friend!`}
      </h1>
      <section className="accessible-map">
        <AccessibleMapMenu />
      </section>
      <section className="site-navigation">
        <AccessibleNavigationTabs />
      </section>
      <section className="player-actions">
        {`Actions: ${actions} of ${actionBankSize}`}{" "}
        <time dateTime={formattedNextActionAt}>
          {`Next actions at ${formattedNextActionAt}`}
        </time>
      </section>
      <section className="player-echoes">
        {`Echoes: ${formattedEchoes}`}
      </section>
      <ul className="sidebar-qualities">
        {sidebarQualities.map((quality) => (
          <li key={quality.id} className={quality.category}>
            {quality.name}: {quality.effectiveLevel.toLocaleString("en-GB")}
          </li>
        ))}
      </ul>
    </div>
  );
}

AccessibleSidebar.displayName = "AccessibleSidebar";

interface Props {
  actions: number;
  actionBankSize: number;
  currentAreaName?: string;
  echoes: number;
  name?: string;
  nextActionAt: any;
  sidebarQualities: any[];
}

const mapStateToProps = (state: IAppState) => {
  const {
    actions: { actions, actionBankSize },
    map: { currentArea },
    myself: {
      character: { name },
    },
    timer: { timeNextActionIsAvailable: nextActionAt },
  } = state;
  return {
    actions,
    actionBankSize,
    currentAreaName: currentArea?.name,
    name,
    nextActionAt,
    echoes: getEchoes(state),
    sidebarQualities: getSidebarQualities(state),
  };
};

export default connect(mapStateToProps)(AccessibleSidebar);
