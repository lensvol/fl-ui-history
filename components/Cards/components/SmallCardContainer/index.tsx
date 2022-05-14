import {
  discard as discardCard,
  shouldFetch,
} from 'actions/cards';

import { begin } from 'actions/storylet';
import classnames from 'classnames';

import Buttonlet from 'components/Buttonlet';

import makeTooltipData from 'components/Cards/utils/makeTooltipData';
import Loading from 'components/Loading';
import useIsMounted from 'hooks/useIsMounted';

import React, {
  useCallback,
  useState,
} from 'react';
import {
  connect,
  useDispatch,
} from 'react-redux';
import { IAppState } from 'types/app';
import { ICard } from 'types/cards';
import SmallCard from './SmallCard';

function SmallCardContainer(props: Props) {
  const {
    data,
    isChoosing,
    isFetching,
  } = props;

  const {
    eventId,
    isAutofire,
    name,
    stickiness,
    teaser,
  } = data;

  const { ...tooltipData } = data;

  const dispatch = useDispatch();
  const isMounted = useIsMounted();

  const [isWorking, setIsWorking] = useState(false);

  const discard = useCallback(() => {
    dispatch(discardCard(eventId));
  }, [
    dispatch,
    eventId,
  ]);

  const play = useCallback(async () => {
    setIsWorking(true);

    if (isAutofire) {
      dispatch(shouldFetch());
    }

    await dispatch(begin(eventId));

    if (isMounted.current) {
      setIsWorking(false);
    }
  }, [
    dispatch,
    eventId,
    isAutofire,
    isMounted,
  ]);

  const lockedByOtherCard = isChoosing && !isWorking;

  return (
    <div
      className={classnames(
        'branch',
        'small-card-container',
        isFetching && 'card--fetching',
        lockedByOtherCard && 'storylet--semi-transparent',
      )}
      data-event-id={eventId}
    >
      <div className="media__left small-card__left">
        <SmallCard
          cardData={data}
          tooltipData={makeTooltipData({ data: tooltipData, action: play })}
        />
      </div>
      <div className="media__body small-card__body">
        <div className="small-card__title-and-buttonlet">
          {stickiness !== 'Sticky' && (
            <div className="branch__plan-buttonlet">
              <Buttonlet
                type="delete"
                onClick={discard}
                disabled={isFetching}
              />
            </div>
          )}
          <h2
            className="media__heading heading heading--3"
            dangerouslySetInnerHTML={{ __html: name }}
          />
        </div>
        <div className="small-card__teaser" dangerouslySetInnerHTML={{ __html: teaser }} />
        <div className="buttons">
          <button
            className={classnames(
              'button button--primary button--margin',
              lockedByOtherCard && 'button--disabled',
            )}
            onClick={play}
            type="button"
          >
            {isWorking ? <Loading spinner small /> : 'Play'}
          </button>
        </div>
      </div>
    </div>
  );
}

type OwnProps = {
  data: ICard,
};

const mapStateToProps = ({
  cards: { isFetching },
  storylet: { isChoosing },
}: IAppState) => ({
  isChoosing,
  isFetching,
});

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(SmallCardContainer);