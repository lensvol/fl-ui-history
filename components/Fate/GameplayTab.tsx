import { FateCard } from "components/Fate/FateCard";
import { AMBITION_RESET, PURCHASE_CONTENT } from "constants/fate";
import React, { useMemo } from "react";
import { connect } from "react-redux";
import getVisibleFateCards from "selectors/fate/getVisibleFateCards";
import { IAppState } from "types/app";
import { IFateCard } from "types/fate";

export function GameplayTab({ active, fateCards, onClick }: Props) {
  const gameplayFateCards = useMemo(
    () =>
      fateCards.filter(
        (c) => c.action !== PURCHASE_CONTENT || c.type === AMBITION_RESET
      ),
    [fateCards]
  );

  return (
    <div role="tabpanel" hidden={!active}>
      <h2 className="heading heading--2">Gameplay</h2>
      <p>Refresh your deck, change your appearance, and more.</p>
      {gameplayFateCards.map((c) => (
        <FateCard key={c.id} data={c} onClick={onClick} />
      ))}
    </div>
  );
}

type OwnProps = {
  active: boolean;
  onClick: (card: IFateCard) => void;
};

const mapStateToProps = (state: IAppState) => ({
  fateCards: getVisibleFateCards(state),
});

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(GameplayTab);
