import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Loading from "components/Loading";
import PlanList from "./components/PlanList";

export function Plans({
  activePlans,
  completePlans,
  firstFetchHasOccurred,
  isFetching,
}) {
  if (isFetching && !firstFetchHasOccurred) {
    return <Loading />;
  }

  return (
    <div>
      <h1 className="heading heading--1">My Plans</h1>
      <p>
        Mark choices as Plans, and they'll show up here. Plans help you keep
        track of your schemes and dreams in Fallen London, and what you need to
        achieve them.
      </p>

      <h2 className="heading heading--2 plans_margin">Active Plans</h2>
      <PlanList plans={activePlans} canRefresh={false} />

      <h2 className="heading heading--2 u-space-above plans_margin">
        Completed Plans
      </h2>
      <PlanList plans={completePlans} canRefresh />
    </div>
  );
}

Plans.displayName = "Plans";

Plans.propTypes = {
  activePlans: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  completePlans: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  firstFetchHasOccurred: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
};

const mapStateToProps = ({
  plans: { activePlans, completePlans, firstFetchHasOccurred, isFetching },
}) => ({
  activePlans,
  completePlans,
  firstFetchHasOccurred,
  isFetching,
});

export default connect(mapStateToProps)(Plans);
