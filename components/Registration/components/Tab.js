import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export default function Tab({
  activeTab,
  label,
  name,
  onClick,
}) {
  const active = name === activeTab;
  return (
    <li className={classnames('nav__item', active && 'active')}>
      <button
        className={classnames(
          'button--link nav__button nav__button--tabs',
          active && 'active',
        )}
        role="tab"
        name={name}
        onClick={onClick}
        tabIndex={-1}
        type="button"
      >
        {label}
      </button>
    </li>
  );
}

Tab.propTypes = {
  activeTab: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};