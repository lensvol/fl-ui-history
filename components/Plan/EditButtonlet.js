import React from 'react';
import PropTypes from 'prop-types';

import Buttonlet from 'components/Buttonlet';

export default function EditButtonlet(props) {
  const {
    editing,
    onClick,
  } = props;
  return (
    <Buttonlet
      focused={editing}
      type="edit"
      title="Edit this plan"
      onClick={onClick}
    />
  );
}

EditButtonlet.propTypes = {
  editing: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};