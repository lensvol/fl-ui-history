import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import Storylet from 'components/Storylet';
import getNeedsProminentTravelButton from 'selectors/map/getNeedsProminentTravelButton';
import { IAppState } from 'types/app';
import TravelButton from 'components/TravelButton';

function StoryletStagger({ needsProminentTravelButton, storylets }: Props) {
  if (storylets === null) {
    return null;
  }

  return (
    <Fragment>
      {needsProminentTravelButton && (
        <div
          className="prominent-travel-button-container"
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <TravelButton />
        </div>
      )}
      {storylets.map(storylet => (
        <Storylet
          key={storylet.id}
          data={storylet}
        />
      ))}
    </Fragment>
  );
}

StoryletStagger.displayName = 'StoryletStagger';

const mapStateToProps = (state: IAppState) => {
  const {
    storylet,
  } = state;
  return ({
    needsProminentTravelButton: getNeedsProminentTravelButton(state),
    storylets: storylet.storylets,
  });
};

export type Props = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(StoryletStagger);