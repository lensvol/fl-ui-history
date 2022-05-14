import TippyWrapper from 'components/TippyWrapper';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Loading from 'components/Loading';
import Image from 'components/Image';
import QualityValue from 'components/QualityValue';
import { IAppState } from 'types/app';

const mapStateToProps = ({ myself: { isFetching, qualities } }: IAppState) => {
  if (isFetching) {
    return { isFetching, pennies: 0 };
  }

  const pennyQuality = qualities.find(({ name }) => name === 'Penny');

  if (!pennyQuality) {
    return { isFetching: isFetching as boolean, pennies: 0 };
  }

  return { isFetching: isFetching as boolean, pennies: pennyQuality.level };
};

type Props = ReturnType<typeof mapStateToProps>;

function PlayerEchoes(props: Props) {
  return (
    <li className="item">
      <TippyWrapper
        tooltipData={{ description: 'Open the Bazaar tab' }}
      >
        <Link
          to="/bazaar"
          className="icon--currency sidebar__echoes-button sidebar__button--has-focus-outline"
        >
          <Image
            alt=""
            className="media__object"
            icon="echoes"
            type="currencies"
            width={60}
            height={78}
          />
          <span className="u-visually-hidden">Open the Bazaar tab</span>
        </Link>
      </TippyWrapper>
      <div className="item__desc">
        <span className="js-item-name item__name">Echoes</span>
        <Value {...props} />
      </div>
    </li>
  );
}

PlayerEchoes.displayName = 'PlayerEchoes';

function Value({ isFetching, pennies }: Props) {
  if (isFetching) {
    return (
      <div>
        {' '}
        <Loading
          spinner
          small
        />
      </div>
    );
  }
  return (
    <div className="item__value">
      <QualityValue
        value={pennies}
        isCurrency
        invert
      />
    </div>
  );
}

export default connect(mapStateToProps)(PlayerEchoes);