import React from "react";
import { MessageVia } from "services/SettingsService";
import EmailAuthStatus from "./EmailAuthStatus";
import FacebookAuthStatus from "./FacebookAuthStatus";
import TwitterAuthStatus from "./TwitterAuthStatus";
import GoogleAuthStatus from "./GoogleAuthStatus";

export default function AuthStatus({ method }: { method: MessageVia }) {
  switch (method) {
    case "Email":
      return (
        <>
          <h3 className="heading heading--3">{method}</h3>
          <EmailAuthStatus />;
        </>
      );
    case "Facebook":
      return (
        <>
          <h3 className="heading heading--3">{method}</h3>
          <FacebookAuthStatus />;
        </>
      );
    case "Google":
      return (
        <>
          <h3 className="heading heading--3">{method}</h3>
          <GoogleAuthStatus />;
        </>
      );
    case "Twitter":
      return <TwitterAuthStatus />;
    default:
      return null;
  }
}
