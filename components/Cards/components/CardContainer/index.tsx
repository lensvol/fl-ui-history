import React, {
  useCallback,
  useMemo,
} from 'react';
import {
  connect,
  useDispatch,
} from 'react-redux';

import {
  discard,
  shouldFetch,
} from 'actions/cards';
import { begin } from 'actions/storylet';
import { IAppState } from 'types/app';
import { ICard } from 'types/cards';

import Card from './Card';
import DiscardButton from './DiscardButton';

type OwnProps = {
  data: ICard,
};

const mapStateToProps = ({
  cards: { isFetching },
  storylet: { isChoosing },
}: IAppState) => ({
  disabled: isChoosing || isFetching,
});

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

function CardContainer(props: Props) {
  const {
    data,
    disabled,
  } = props;

  const dispatch = useDispatch();

  const {
    eventId,
    isAutofire,
    stickiness,
  } = data;

  const discardCard = useCallback(() => {
    // If we are already doing some API work, then don't do anything
    if (disabled) {
      return;
    }
    dispatch(discard(eventId));
  }, [
    disabled,
    dispatch,
    eventId,
  ]);

  const playCard = useCallback(() => {
    // If we are already doing some API work, then don't do anything
    if (disabled) {
      return;
    }
    if (isAutofire) {
      dispatch(shouldFetch());
    }
    dispatch(begin(eventId));
  }, [
    disabled,
    dispatch,
    eventId,
    isAutofire,
  ]);

  const isUndiscardable = useMemo(() => stickiness === 'Sticky', [stickiness]);

  return (
    <div
      className="hand__card-container"
      data-event-id={eventId}
    >
      <Card
        {...props}
        onClick={playCard}
      />
      <DiscardButton
        {...props}
        onClick={discardCard}
        undiscardable={isUndiscardable}
      />
    </div>
  );
}

CardContainer.displayName = 'CardContainer';

export default connect(mapStateToProps)(CardContainer);