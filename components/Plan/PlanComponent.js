import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Buttonlet from 'components/Buttonlet';
import Image from 'components/Image';

import EditButtonlet from './EditButtonlet';
import RefreshButtonlet from './RefreshButtonlet';
import FormOrNotes from './FormOrNotes';

export default function Plan(props) {
  const {
    canRefresh,
    data,
    editing,
    onDelete,
    onRefresh,
    onToggleEditMode,
    qualityRequirements,
  } = props;
  return (
    <div
      className={classnames(
        'branch plans_separator',
      )}
    >
      <div className="media__left">
        <div className="card card--sm">
          <Image
            className="media__object"
            icon={data.branch.image}
            alt={data.branch.name}
            width={60}
            height={78}
          />
        </div>
      </div>
      <div className="media__body enforced_break">
        <div className="plan__buttons">
          <EditButtonlet editing={editing} onClick={onToggleEditMode} />
          <Buttonlet type="delete" title="Delete this plan" onClick={onDelete} />
          {canRefresh && <RefreshButtonlet onClick={onRefresh} />}
        </div>

        <h2
          className="media__heading heading heading--2"
          dangerouslySetInnerHTML={{ __html: data.branch.name }}
        />
        <h4 className="heading heading--4">{data.areaName}</h4>
        <div>
          <FormOrNotes {...props} />
        </div>
        <div className="buttons">
          {!editing && qualityRequirements}
        </div>
      </div>
    </div>
  );
}

Plan.propTypes = {
  canRefresh: PropTypes.bool.isRequired,
  data: PropTypes.shape({}).isRequired,
  editing: PropTypes.bool.isRequired,
  onDelete: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onToggleEditMode: PropTypes.func.isRequired,
  qualityRequirements: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

