import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import Image from 'components/Image';
import TippyWrapper from 'components/TippyWrapper';
import {
  RouteComponentProps,
  withRouter,
} from 'react-router-dom';
import { IAppState } from 'types/app';
import { ICard } from 'types/cards';

import getBorderColour from 'utils/getBorderColour';

import makeTooltipData from '../../utils/makeTooltipData';

interface OwnProps {
  data: ICard,
  onClick: () => void,
}

const mapStateToProps = ({ cards: { isFetching } }: IAppState) => ({ isFetching });

type Props = OwnProps & ReturnType<typeof mapStateToProps> & RouteComponentProps;

function Card(props: Props) {
  const { data, isFetching, onClick } = props;

  const {
    isAutofire,
    teaser,
  } = data;

  const borderColour = getBorderColour(data);

  const teaserWithAutofireWarning = useMemo(() => {
    if (isAutofire) {
      return `${teaser}<p class="u-visually-hidden">This card will take effect as soon as you click it.</p>`;
    }
    return teaser;
  }, [isAutofire, teaser]);

  const tooltipData = makeTooltipData({
    action: onClick,
    data: { ...data, teaser: teaserWithAutofireWarning },
  });

  return (
    <TippyWrapper
      tooltipData={tooltipData}
    >
      <div
        className={classnames(
          'hand__card',
          isFetching && 'card--fetching',
        )}
      >
        <Image
          borderContainerClassName="hand__border"
          className="hand__image"
          icon={data.image}
          alt={data.name}
          onClick={onClick}
          border={borderColour}
          tooltipData={tooltipData}
          type="icon"
          interactiveProps={{
            focus: {
              outline: 'solid 2px #1d1d1d',
            },
          }}
        />
      </div>
    </TippyWrapper>
  );
}

export default withRouter(connect(mapStateToProps)(Card));