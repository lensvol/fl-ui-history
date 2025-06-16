import React from "react";

import EmailAuthStatus from "components/AccountLinkReminder/EmailAuthStatus";
import FacebookAuthStatus from "components/AccountLinkReminder/FacebookAuthStatus";
import GoogleAuthStatus from "components/AccountLinkReminder/GoogleAuthStatus";

import { MessageVia } from "services/SettingsService";

export default function AuthStatus({ method }: { method: MessageVia }) {
  switch (method) {
    case "Email":
      return (
        <li key={method}>
          <h3 className="heading heading--3">{method}</h3>
          <EmailAuthStatus />
        </li>
      );

    case "Facebook":
      return (
        <li key={method}>
          <h3 className="heading heading--3">{method}</h3>
          <FacebookAuthStatus />
        </li>
      );

    case "Google":
      return (
        <li key={method}>
          <h3 className="heading heading--3">{method}</h3>
          <GoogleAuthStatus />
        </li>
      );

    default:
      return null;
  }
}

AuthStatus.displayName = "AuthStatus";
