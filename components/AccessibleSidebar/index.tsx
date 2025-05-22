import React from "react";

import moment from "moment";

import AccessibleMapMenu from "components/AccessibleSidebar/AccessibleMapMenu";
import AccessibleNavigationTabs from "components/AccessibleSidebar/AccessibleNavigationTabs";
import ItsYou from "components/Infobar/ItsYou";

import { useAppSelector } from "features/app/store";

import getEchoes from "selectors/myself/getEchoes";
import getSidebarQualities from "selectors/myself/getSidebarQualities";

export default function AccessibleSidebar() {
  const actions = useAppSelector((state) => state.actions.actions);
  const actionBankSize = useAppSelector(
    (state) => state.actions.actionBankSize
  );
  const currentAreaName = useAppSelector(
    (state) => state.map.currentArea?.name
  );
  const echoes = useAppSelector((state) => getEchoes(state));
  const name = useAppSelector((state) => state.myself.character.name);
  const nextActionAt = useAppSelector(
    (state) => state.timer.timeNextActionIsAvailable
  );
  const sidebarQualities = useAppSelector((state) =>
    getSidebarQualities(state)
  );

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
        <ItsYou name={name} />{" "}
        {`Welcome to ${currentAreaName}, delicious friend!`}
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
          {`Next action at ${formattedNextActionAt}`}
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
