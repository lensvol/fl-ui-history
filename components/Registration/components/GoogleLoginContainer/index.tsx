import { googleLogin } from "actions/user";
import Modal from "components/Modal";

import Config from "configuration";
import React, { useCallback, useState } from "react";
import GoogleLogin from "react-google-login";
import { connect, useDispatch } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";

import redirectAfterLogin from "../redirectAfterLogin";
import GoogleLoginButton from "./GoogleLoginButton";

const ERROR_IDPIFRAME_INITIALIZATION_FAILED = "idpiframe_initialization_failed";

interface GoogleError {
  error: string;
  details: string;
}

function isInitializationError(err: GoogleError) {
  return err.error === ERROR_IDPIFRAME_INITIALIZATION_FAILED;
}

export function GoogleLoginContainer({ history, label }: Props) {
  const { googleId } = Config;

  const dispatch = useDispatch();

  const [errors, setErrors] = useState<GoogleError[]>([]);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  const [areThirdPartyCookiesAvailable, setAreThirdPartyCookiesAvailable] =
    useState(true);
  const [didScriptLoadingFail, setDidScriptLoadingFail] = useState(false);

  const handleScriptLoadFailure = useCallback(() => {
    console.warn("Google API failed to load; disabling the component");
    setDidScriptLoadingFail(true);
  }, []);

  const handleSuccess = useCallback(
    async (response) => {
      // NOTE: this is a Google-provided access token, not our JWT
      const { access_token: googleAccessToken } = response.getAuthResponse();
      const data: any = await dispatch(googleLogin(googleAccessToken));
      // Send the user where they need to go next
      redirectAfterLogin(history, data);
    },
    [dispatch, history]
  );

  const handleFailure = useCallback((err: GoogleError) => {
    setErrors((prevState) => [...prevState, err]);

    // Open the modal if this is not an initialization error
    // (otherwise we'd spam everyone with initialization errors, whether or not they
    // might want to log in w/ Google).
    if (isInitializationError(err)) {
      setAreThirdPartyCookiesAvailable(false);
    } else {
      setIsErrorModalOpen(true);
    }
  }, []);

  return (
    <>
      <GoogleLogin
        clientId={googleId}
        className="button button--google"
        autoLoad={false}
        disabled={didScriptLoadingFail || !areThirdPartyCookiesAvailable}
        buttonText={label}
        onFailure={handleFailure}
        onScriptLoadFailure={handleScriptLoadFailure}
        onSuccess={handleSuccess}
        render={(renderProps) => (
          <GoogleLoginButton
            {...renderProps}
            didScriptLoadingFail={didScriptLoadingFail}
            label={label}
          />
        )}
      />
      <GoogleLoginErrorModal
        isOpen={isErrorModalOpen}
        onRequestClose={() => setIsErrorModalOpen(false)}
        errors={errors}
      />
    </>
  );
}

function GoogleLoginErrorModal(props: {
  isOpen: boolean;
  onRequestClose: () => void;
  errors: GoogleError[];
}) {
  const { errors, isOpen, onRequestClose } = props;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="inverse modal-dialogue--large"
    >
      <div>
        <h1 className="heading heading--1">Login failed</h1>
        <p>
          Something went wrong while logging in with Google. Please get in touch
          with us at{" "}
          <a
            className="link--inverse"
            href="mailto:support@failbettergames.com"
          >
            support@failbettergames.com
          </a>{" "}
          and let us know about the following errors, which are what Google can
          tell us about what went wrong:
        </p>
        <ul
          style={{
            listStyle: "none",
            color: "black",
            backgroundColor: "white",
            padding: ".5rem",
          }}
        >
          {errors
            .map((e, i) => ({ ...e, index: i }))
            .map(({ error, details, index }) => (
              <li key={index}>
                <p>
                  <span style={{ fontFamily: "monospace" }}>{error}</span>:{" "}
                  {details ? (
                    <span>{details}</span>
                  ) : (
                    <span style={{ fontStyle: "italic" }}>
                      [no further details]
                    </span>
                  )}
                </p>
              </li>
            ))}
        </ul>
      </div>
    </Modal>
  );
}

type OwnProps = { label: string };
type Props = OwnProps & RouteComponentProps;

export default withRouter(connect()(GoogleLoginContainer));
