import React from 'react';
import { Feature } from 'flagged';
import { FEATURE_IS_IT_ADVENT } from 'features/feature-flags';

export default function AdventLinkItem() {
  return (
    <Feature name={FEATURE_IS_IT_ADVENT}>
      <li className="sidemenu__nav-item">
        <a
          className="sidemenu__nav-link"
          href="https://advent.fallenlondon.com/"
          style={{ display: 'flex' }}
        >
          <img
            alt="Mr Sacks"
            src="https://images.fallenlondon.com/icons/mistersackssmall.png"
            height="16"
            width="16"
            style={{
              marginRight: '5px',
            }}
          />
          It's Advent!
        </a>
      </li>
    </Feature>
  );
}