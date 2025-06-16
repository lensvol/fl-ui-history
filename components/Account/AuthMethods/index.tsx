import React from "react";

import EmailAuth from "components/Account/AuthMethods/EmailAuth";
import FacebookAuth from "components/Account/AuthMethods/FacebookAuth";
import GoogleAuth from "components/Account/AuthMethods/GoogleAuth";

export default function AuthMethods() {
  return (
    <div>
      <h2 className="heading heading--2">Authentication methods</h2>
      <ul className="list-icons">
        <li>
          <EmailAuth showVerificationLink />
        </li>
        <li>
          <FacebookAuth />
        </li>
        <li>
          <GoogleAuth />
        </li>
      </ul>
    </div>
  );
}
