import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Loading from 'components/Loading';

interface Props {
  direction: 'next' | 'prev' | undefined,
  fetchDirection: 'next' | 'prev' | undefined,
  isFetching: boolean,
  onClick: () => void,
}

export default function NavigationButton({
  direction,
  fetchDirection,
  isFetching,
  onClick,
}: Props) {
  const faClassName = direction === 'next' ? 'fa-arrow-left' : 'fa-arrow-right';
  const label = direction === 'next' ? 'Older' : 'Newer';
  return (
    <button
      disabled={isFetching}
      type="button"
      onClick={onClick}
      className={classnames(
        'button--link journal-entries__control',
        isFetching && 'journal-entries__control--disabled',
      )}
    >
      {fetchDirection === direction ? <Loading spinner small /> : <i className={classnames('fa', faClassName)} />}
      <span className="u-visually-hidden">{label}</span>
    </button>
  );
}

NavigationButton.propTypes = {
  direction: PropTypes.oneOf(['next', 'prev']).isRequired,
  fetchDirection: PropTypes.oneOf(['next', 'prev']),
  isFetching: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

NavigationButton.defaultProps = {
  fetchDirection: undefined,
};