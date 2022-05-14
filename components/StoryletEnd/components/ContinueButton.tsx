import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Loading from 'components/Loading';

interface Props {
  disabled: boolean,
  isWorking: boolean,
  label: string,
  onClick: () => {},
}

export default function TryAgainButton({
  disabled,
  isWorking,
  label,
  onClick,
}: Props) {
  return (
    <button
      className={classnames(
        'button button--primary',
        disabled && 'button--disabled',
      )}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {isWorking ? <Loading spinner small /> : label}
    </button>
  );
}

TryAgainButton.propTypes = {
  disabled: PropTypes.bool.isRequired,
  isWorking: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};