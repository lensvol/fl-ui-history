import google from "assets/img/google.png";
import TippyWrapper from "components/TippyWrapper";
import Tooltip from "components/Tooltip";
import React, { useMemo } from "react";

interface GoogleLoginButtonProps {
  didScriptLoadingFail: boolean;
  disabled?: boolean | undefined;
  onClick: () => void;
  label: string;
}

export default function GoogleLoginButton(props: GoogleLoginButtonProps) {
  const { didScriptLoadingFail, disabled, onClick, label } = props;

  const button = useMemo(
    () => (
      <button
        className="button button--google"
        disabled={disabled}
        onClick={onClick}
        type="button"
      >
        <span>
          <img src={google} alt="Google" /> {label}
        </span>
      </button>
    ),
    [disabled, label, onClick]
  );

  if (didScriptLoadingFail) {
    return (
      <TippyWrapper content={<ScriptLoadingFailedTooltip />}>
        <div>{button}</div>
      </TippyWrapper>
    );
  }

  return button;
}

function ScriptLoadingFailedTooltip() {
  const message =
    "Google authentication is disabled because the Google Login API script failed to load." +
    " Check that your adblocker isn't preventing this and try refreshing the page.";
  return (
    <Tooltip
      data={{
        secondaryDescription: message,
      }}
    />
  );
}
