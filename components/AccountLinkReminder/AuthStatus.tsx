import React from "react";
import { MessageVia } from "services/SettingsService";
import EmailAuthStatus from "./EmailAuthStatus";
import FacebookAuthStatus from "./FacebookAuthStatus";
import TwitterAuthStatus from "./TwitterAuthStatus";
import GoogleAuthStatus from "./GoogleAuthStatus";

export default function AuthStatus({
  method,
  onLinkSuccess,
}: {
  method: MessageVia;
  onLinkSuccess: () => void;
}) {
  switch (method) {
    case "Email":
      return (
        <>
          <li key={method}>
            <h3 className="heading heading--3">{method}</h3>
            <EmailAuthStatus onLinkSuccess={onLinkSuccess} />
          </li>
        </>
      );
    case "Facebook":
      return (
        <>
          <li key={method}>
            <h3 className="heading heading--3">{method}</h3>
            <FacebookAuthStatus onLinkSuccess={onLinkSuccess} />
          </li>
        </>
      );
    case "Google":
      return (
        <>
          <li key={method}>
            <h3 className="heading heading--3">{method}</h3>
            <GoogleAuthStatus onLinkSuccess={onLinkSuccess} />
          </li>
        </>
      );
    case "Twitter":
      return <TwitterAuthStatus />;
    default:
      return null;
  }
}
