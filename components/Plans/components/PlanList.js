import React from 'react';
import PropTypes from 'prop-types';

import Plan from 'components/Plan';

export default function PlanList({ canRefresh, plans }) {
  return plans.map(plan => (
    <Plan
      key={plan.branch.id}
      data={plan}
      canRefresh={canRefresh}
    />
  ));
}

PlanList.propTypes = {
  canRefresh: PropTypes.bool.isRequired,
  plans: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};