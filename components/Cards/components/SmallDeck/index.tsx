import React from 'react';
import classnames from 'classnames';
import {
  connect,
  useDispatch,
} from 'react-redux';
import { IAppState } from 'types/app';
import {
  useDrawCards,
  useHandFull,
  useNoCards,
  useOnClickDeck,
} from 'components/Cards/hooks';

const mapStateToProps = ({
  cards: {
    cardsCount,
    displayCards,
    handSize,
    isFetching,
  },
  fate: { data: fateData },
}: IAppState) => ({
  cardsCount,
  displayCards,
  fateData,
  handSize,
  isFetching,
});

type OwnProps = {
  onOpenDeckRefreshModal: () => void,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

function SmallDeckContainer(props: Props) {
  const {
    cardsCount,
    displayCards,
    isFetching,
    handSize,
    onOpenDeckRefreshModal,
  } = props;

  const dispatch = useDispatch();

  const drawCards = useDrawCards(dispatch);

  const handFull = useHandFull(displayCards, handSize);

  const noCards = useNoCards(cardsCount, isFetching);

  const onClick = useOnClickDeck({
    drawCards,
    isFetching,
    noCards,
    handFull,
    topUpCards: onOpenDeckRefreshModal,
  });

  return (
    <div className="media__body">
      <button
        type="button"
        className={classnames(
          'deck deck--small-media',
          handFull && !noCards && 'deck--full',
          noCards && 'deck--empty',
          isFetching && 'deck--fetching',
        )}
        disabled={handFull}
        onClick={onClick}
      />
    </div>
  );
}

SmallDeckContainer.displayName = 'SmallDeckContainer';

export default connect(mapStateToProps)(SmallDeckContainer);
