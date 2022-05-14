import { getFormattedReleaseDate } from 'components/Fate/utils';
import TippyWrapper from 'components/TippyWrapper';
import { RESET_STORY } from 'constants/fate';
import React, {
  Fragment,
  useCallback,
  useMemo,
} from 'react';
import classnames from 'classnames';
import Image from 'components/Image';
import { connect } from 'react-redux';
import { IFateCard } from 'types/fate';
import MediaSmDown from 'components/Responsive/MediaSmDown';
import MediaMdUp from 'components/Responsive/MediaMdUp';
import FateCardTitleAndByline from './FateCardTitleAndByline';

type Props = {
  data: IFateCard,
  onClick: (data: IFateCard) => void,
  story?: boolean,
};

export function FateCard({
  data,
  onClick,
  story,
}: Props) {
  const {
    description,
    shortDescription,
  } = data;

  const handleClick = useCallback(() => {
    onClick(data);
  }, [data, onClick]);

  return (
    <Fragment>
      <div
        className={classnames(
          'media storylet fate-card',
          story && 'fate-card--story',
        )}
      >
        <div
          className={classnames(
            'storylet__bordered-container fate-card__bordered-container',
            story && 'fate-card__bordered-container--story',
          )}
        >
          <div
            className={classnames(
              'fate-card__left',
              story && 'fate-card__left--story',
            )}
          >
            <div
              className={classnames(
                'media__object icon icon--fate',
                'fate-card__image-container',
              )}
            >
              <FateCardImage {...data} />
            </div>
            {story && (
              <MediaSmDown>
                <FateCardTitleAndByline {...data} story={story} />
              </MediaSmDown>
            )}
          </div>

          <div
            className={classnames(
              'media__body fate-card__body',
              story && 'fate-card__body--story',
            )}
          >
            {!!story && <FateCardFanFavouriteIcon {...data} />}

            {story ? (
              <MediaMdUp>
                <FateCardTitleAndByline {...data} story={story} />
              </MediaMdUp>
            ) : (
              <FateCardTitleAndByline {...data} story={story} />
            )}

            <p dangerouslySetInnerHTML={{ __html: shortDescription || description }} />

            <div className="buttons">
              <button
                className={classnames(
                  'button button--secondary',
                  !(story || data.canAfford) && 'button--disabled',
                )}
                disabled={!(story || data.canAfford)}
                onClick={handleClick}
                type="button"
              >
                {story ? (
                  <span>Learn more</span>
                ) : (
                  <span>
                    {data.type === RESET_STORY ? 'Reset' : 'Purchase'}
                    {' '}
                    (
                    {data.price}
                    {' '}
                    Fate)
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

FateCard.displayName = 'FateCard';

export default connect()(FateCard);

export function FateCardFanFavouriteIcon({ fanFavourite }: Pick<IFateCard, 'fanFavourite'>) {
  if (!fanFavourite) {
    return null;
  }

  return (
    <TippyWrapper
      tooltipData={{
        description: 'This story is a fan favourite!',
      }}
    >
      <button
        className="button--link fan-favourite"
        tabIndex={0}
        type="button"
      >
        <span
          className="fl-ico fl-ico-2x fl-ico-star fan-favourite__icon"
        />
      </button>
    </TippyWrapper>
  );
}

export function FateCardImage(data: Pick<IFateCard, 'border' | 'image' | 'name'>) {
  const {
    border,
    image,
    name,
  } = data;
  return (
    <Image
      borderContainerClassName="fate-card__border"
      className="media__object fate-card__image"
      icon={image}
      alt={name}
      type="icon"
      border={border?.toLowerCase()}
    />
  );
}

export function FateCardReleaseDate({ releaseDate, season }: Pick<IFateCard, 'releaseDate' | 'season'>) {
  const formattedReleaseDate = useMemo(() => getFormattedReleaseDate({ releaseDate }), [releaseDate]);

  if (!releaseDate) {
    return null;
  }

  return (
    <p className="fate-card__release-date">
      {formattedReleaseDate}
      {season && (
        <span
          style={{ fontSize: '95%' }}
        >
          {' '}
          (a part of the Season of
          {' '}
          {season}
          )
        </span>
      )}
    </p>
  );
}