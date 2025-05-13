import React from "react";

import { GoogleLogin } from "@react-oauth/google";

interface GoogleLoginButtonProps {
  className?: string;
  handleSuccess: (googleAccessToken: any) => Promise<void>;
  isSignUp?: boolean;
}

export default function GoogleLoginButton(props: GoogleLoginButtonProps) {
  const { className, handleSuccess, isSignUp } = props;

  return (
    <GoogleLogin
      containerProps={{
        className: className,
      }}
      onSuccess={handleSuccess}
      text={isSignUp ? "signup_with" : "signin_with"}
      use_fedcm_for_prompt
      width="204"
      ux_mode="popup"
    />
  );
}
