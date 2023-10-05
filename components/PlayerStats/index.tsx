import { NEW_OUTFIT_BEHAVIOUR } from "features/feature-flags";
import React from "react";
import { connect } from "react-redux";

import Loading from "components/Loading";
import ActionCounter from "components/ActionCounter";
import { IAppState } from "types/app";
import { Feature } from "flagged";
import PlayerEchoes from "./PlayerEchoes";
import PlayerFate from "./PlayerFate";
import PlayerScrip from "./PlayerScrip";
import { useFeature } from "flagged";
import { FEATURE_ENHANCED_EF } from "features/feature-flags";

const mapStateToProps = (state: IAppState) => ({
  actions: state.actions,
});

type Props = ReturnType<typeof mapStateToProps>;

export function PlayerStats({ actions }: Props) {
  const supportsEnhancedEF = useFeature(FEATURE_ENHANCED_EF);

  if (!actions) {
    return <Loading spinner />;
  }

  return (
    <ul className="items items--list">
      <li className="item">
        <ActionCounter supportsEnhancedEF={!!supportsEnhancedEF} />
      </li>
      <PlayerFate />
      <PlayerEchoes />
      <Feature name={NEW_OUTFIT_BEHAVIOUR}>
        <PlayerScrip />
      </Feature>
    </ul>
  );
}

PlayerStats.displayName = "PlayerStats";

export default connect(mapStateToProps)(PlayerStats);
