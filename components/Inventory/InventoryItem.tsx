import React, {
  useCallback,
  useMemo,
} from 'react';
import {
  connect,
  useDispatch,
} from 'react-redux';
import {
  RouteComponentProps,
  withRouter,
} from 'react-router-dom';

import classnames from 'classnames';
import Image from 'components/Image';

import { normalize } from 'utils/stringFunctions';
import {
  useQuality as beginItemUseEvent,
} from 'actions/storylet';

import PossessionsContext from 'components/Possessions/PossessionsContext';
import { IAppState } from 'types/app';
import { IQuality } from 'types/qualities';
import { ITooltipData } from 'components/ModalTooltip/types';
import { createEquipmentQualityAltText } from 'utils';

interface OwnProps {
  data: IQuality,
  // dispatch: Function,
  overrideLevels?: boolean,
  profile?: boolean,
}

interface StateProps {
  currentlyInStorylet: boolean,
  itemsUsableHere: boolean,
  isRequestingItemUse: boolean,
}

type Props = OwnProps & StateProps & RouteComponentProps;

function InventoryItem({
  // dispatch,
  history,
  data,
  isRequestingItemUse,
  itemsUsableHere,
  profile,
  currentlyInStorylet,
  overrideLevels,
}: Props) {
  const {
    availableAt,
    description,
    id,
    image,
    level,
    name,
    useEventId,
  } = data;

  const dispatch = useDispatch();

  const hasUseEventId = useMemo(() => !!useEventId, [useEventId]);

  const isCurrentlyUsable = useMemo(() => !!useEventId && itemsUsableHere && !profile && !currentlyInStorylet,
    [
      currentlyInStorylet,
      itemsUsableHere,
      profile,
      useEventId,
    ]);


  const isUsableButBlocked = useMemo(() => (
    hasUseEventId
    && !profile
    && (currentlyInStorylet || !itemsUsableHere)
  ), [
    currentlyInStorylet,
    hasUseEventId,
    itemsUsableHere,
    profile,
  ]);

  const defaultCursor = useMemo(() => isRequestingItemUse || !useEventId || !isCurrentlyUsable, [
    isCurrentlyUsable,
    isRequestingItemUse,
    useEventId,
  ]);

  const handleClick = useCallback(async (_?: any) => {
    if (isCurrentlyUsable) {
      beginItemUseEvent(id, history)(dispatch);
    }
  }, [
    dispatch,
    history,
    id,
    isCurrentlyUsable,
  ]);

  const secondaryDescription = useMemo(() => makeSecondaryDescription({ currentlyInStorylet, data }), [
    currentlyInStorylet,
    data,
  ]);

  const tooltipData = useMemo(() => {
    let ttData: ITooltipData = {
      ...data,
      secondaryDescription,
      description: `<p>${description}</p>`
        + `${(data.availableAt ? `<p class="tooltip__available-at">${availableAt}</p>` : '')}`,
      level: overrideLevels ? undefined : level,
      smallButtons: [],
    };

    if (hasUseEventId && !currentlyInStorylet) {
      ttData = {
        ...ttData,
        smallButtons: [{
          label: 'Use',
          action: handleClick,
        }],
      };
    }
    return ttData;
  }, [
    availableAt,
    currentlyInStorylet,
    data,
    description,
    handleClick,
    hasUseEventId,
    level,
    overrideLevels,
    secondaryDescription,
  ]);

  const quantity = useMemo(() => {
    if (overrideLevels) {
      return null;
    }
    return <span className="js-item-value icon__value">{level}</span>;
  }, [
    level,
    overrideLevels,
  ]);

  const altText = useMemo(
    () => createEquipmentQualityAltText({
      description,
      secondaryDescription,
      name: overrideLevels ? name : `${name} × ${level}`,
    }),
    [
      description,
      level,
      name,
      overrideLevels,
      secondaryDescription,
    ],
  );

  return (
    <PossessionsContext.Consumer>
      {({ filterString }) => {
        if (normalize(name).indexOf(normalize(filterString)) < 0) {
          return null;
        }
        return (
          <li
            className={classnames(
              'item',
              isUsableButBlocked && 'items--blocked',
            )}
          >
            <div
              className={classnames(
                'icon icon--inventory icon--emphasize',
                isCurrentlyUsable && 'icon--usable',
                isRequestingItemUse && 'icon--is-loading',
              )}
              data-quality-id={id}
            >
              <Image
                icon={image}
                alt={altText}
                type="small-icon"
                tooltipData={tooltipData}
                onClick={handleClick}
                defaultCursor={defaultCursor}
              />
              {quantity}
            </div>
          </li>
        );
      }}
    </PossessionsContext.Consumer>
  );
}

function makeSecondaryDescription({
  currentlyInStorylet,
  data: { useEventId },
}: Pick<Props, 'currentlyInStorylet' | 'data'>): string | undefined {
  const hasUseEventId = !!useEventId;
  if (hasUseEventId) {
    if (currentlyInStorylet) {
      return '<span class=\'item-use-warning\'>'
        + 'You\'re in a storylet at the moment - you must finish it before you can use this item.'
        + '</span>';
    }
    return 'Click on this item in your inventory to use it.';
  }
  return undefined;
}

const mapStateToProps = ({
  map: { setting },
  myself: { isRequestingItemUse },
}: IAppState) => ({
  isRequestingItemUse,
  itemsUsableHere: setting?.itemsUsableHere ?? false,
});

export default withRouter(
  connect(mapStateToProps)(InventoryItem),
);
