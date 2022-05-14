import React from 'react';

import EmailAuth from './EmailAuth';
import FacebookAuth from './FacebookAuth';
import TwitterAuth from './TwitterAuth';
import GoogleAuth from './GoogleAuth';

export default function AuthMethods() {
  return (
    <div>
      <h2 className="heading heading--2">Authentication methods</h2>
      <ul className="list-icons">
        <li><EmailAuth /></li>
        <li><FacebookAuth /></li>
        <li><GoogleAuth /></li>
        <li><TwitterAuth /></li>
      </ul>
    </div>
  );
}
