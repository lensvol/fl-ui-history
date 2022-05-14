import React from 'react';
import { connect } from 'react-redux';

import TravelButton from 'components/TravelButton';
import getNeedsProminentTravelButton from 'selectors/map/getNeedsProminentTravelButton';
import { IArea } from 'types/map';
import { IAppState } from 'types/app';

function WelcomeAndTravel(props: Props) {
  const {
    currentArea,
    needsProminentTravelButton,
    profileName,
  } = props;
  if (!(profileName && currentArea)) {
    return null;
  }
  return (
    <div className="storylets__welcome-and-travel">
      <div className="heading heading--2">
        It's
        {' '}
        <span dangerouslySetInnerHTML={{ __html: profileName }} />
        !
        {' '}
        {`Welcome to ${currentArea.name}, delicious friend!`}
      </div>
      {!needsProminentTravelButton && (<TravelButton />)}
    </div>
  );
}

interface OptionalProps {
  currentArea?: IArea,
  profileName?: string | undefined,
}


const mapStateToProps = (state: IAppState) => {
  const {
    map: { currentArea },
    myself: { character: { name: profileName } },
  } = state;

  return {
    currentArea,
    profileName,
    needsProminentTravelButton: getNeedsProminentTravelButton(state),
  };
};

type Props = Partial<OptionalProps> & ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(WelcomeAndTravel);