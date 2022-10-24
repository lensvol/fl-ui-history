import Loading from "components/Loading";
import React from "react";
import { connect } from "react-redux";
import { IAppState } from "types/app";

const mapStateToProps = ({
  cards: { cardsCount, deckSize, isFetching },
}: IAppState) => ({
  cardsCount,
  deckSize,
  isFetching,
});

type Props = ReturnType<typeof mapStateToProps>;

export function Message(props: Props) {
  const { cardsCount, isFetching, deckSize } = props;

  const noDrawLimit = cardsCount > deckSize;
  const noCards = cardsCount === 0;

  if (isFetching) {
    return <Loading spinner small />;
  }

  if (noDrawLimit) {
    return <span>No draw limit.</span>;
  }
  if (noCards) {
    return <span>No cards waiting.</span>;
  }
  if (cardsCount === 1) {
    return <span>1 card waiting!</span>;
  }
  return <span>{`${cardsCount} cards waiting!`}</span>;
}

Message.displayName = "Message";

export default connect(mapStateToProps)(Message);
