import React, { Fragment } from "react";
import PropTypes from "prop-types";

import Loading from "components/Loading";
import StoryletRoot from "components/StoryletRoot";

export default function UniqueActPendingComponent({
  branch,
  isGoingBack,
  onGoBack,
}) {
  return (
    <div className="unique-act-pending">
      <StoryletRoot data={branch} />
      <div className="branch">
        <h2 className="heading heading--2">
          You have already issued an outstanding invitation for this action!
        </h2>
        <p>
          It must be accepted or cancelled before you can send another
          invitation of this kind.
        </p>
      </div>
      <div className="buttons buttons--left buttons--storylet-exit-options">
        <button
          className="button button--primary"
          onClick={onGoBack}
          type="button"
        >
          {isGoingBack ? <Loading spinner small /> : <GoBack />}
        </button>
      </div>
    </div>
  );
}

UniqueActPendingComponent.propTypes = {
  branch: PropTypes.shape({}).isRequired,
  isGoingBack: PropTypes.func.isRequired,
  onGoBack: PropTypes.func.isRequired,
};

export function GoBack() {
  return (
    <Fragment>
      <i className="fa fa-arrow-left" /> Back
    </Fragment>
  );
}
