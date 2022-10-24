import CardTimer from "components/Cards/components/CardTimer";
import React from "react";
import { connect } from "react-redux";
import { IAppState } from "types/app";

const mapStateToProps = ({
  cards: { cardsCount, deckSize, isFetching },
  timer: { remainingTime },
}: IAppState) => ({
  cardsCount,
  deckSize,
  isFetching,
  remainingTime,
});

type Props = ReturnType<typeof mapStateToProps>;

export function Timer({
  cardsCount,
  deckSize,
  isFetching,
  remainingTime,
}: Props) {
  // If we don't know what the remaining time is, don't display anything
  if (isFetching || remainingTime === undefined || remainingTime === null) {
    return null;
  }

  // If the deck is full (or we are in an area with no draw limit), then
  // don't display anything
  if (cardsCount >= deckSize) {
    return null;
  }

  // Otherwise, display the component
  return <CardTimer />;
}

Timer.displayName = "Timer";

export default connect(mapStateToProps)(Timer);
