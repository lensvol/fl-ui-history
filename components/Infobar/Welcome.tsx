import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import TravelButton from 'components/TravelButton';
import ItsYou from 'components/Infobar/ItsYou';
import getNeedsProminentTravelButton from 'selectors/map/getNeedsProminentTravelButton';
import { IAppState } from 'types/app';

type OwnProps = {
  name: string,
  currentAreaName: string,
};

export function Welcome({
  currentAreaName,
  name,
  needsProminentTravelButton,
}: Props) {
  return (
    <Fragment>
      <p className="heading heading--3">
        <ItsYou name={name} />
        <br />
        Welcome to
      </p>
      <p className="heading heading--2 welcome__current-area">
        {currentAreaName}
        ,
      </p>
      <p className="heading heading--3">
        delicious friend!
      </p>
      {!needsProminentTravelButton && (
        <TravelButton
          className="travel-button--infobar"
        />
      )}
    </Fragment>
  );
}

Welcome.displayName = 'Welcome';

const mapStateToProps = (state: IAppState) => ({
  needsProminentTravelButton: getNeedsProminentTravelButton(state),
});

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(Welcome);
