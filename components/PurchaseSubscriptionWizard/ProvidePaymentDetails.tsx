import { FEATURE_REQUIRE_RECAPTCHA_FOR_PURCHASES } from "features/feature-flags";
import useIsMounted from "hooks/useIsMounted";
import React, { useCallback, useMemo, useState } from "react";
import BraintreeDropIn from "braintree-web-drop-in-react";
import { Options, Dropin } from "braintree-web-drop-in";
import ReCAPTCHA from "react-google-recaptcha";
import {
  IBraintreePlanWithClientRequestToken,
  ICreateBraintreeSubscriptionRequest,
} from "types/payment";
import Loading from "components/Loading";
import { Feature, useFeature } from "flagged";
import Header from "./Header";

interface Props {
  braintreePlan: IBraintreePlanWithClientRequestToken;
  on3dSecureSuccess: (
    purchaseRequest: ICreateBraintreeSubscriptionRequest
  ) => void;
  onGoBack: () => void;
}

const ERROR_MESSAGE_THREE_D_SECURE_AUTHENTICATION_FAILED =
  "3D Secure authentication failed." +
  " Please try a different payment method.";

export default function ProvidePaymentDetails({
  braintreePlan,
  on3dSecureSuccess,
  onGoBack,
}: Props) {
  const { clientRequestToken } = braintreePlan;

  const requireReCaptcha = useFeature(FEATURE_REQUIRE_RECAPTCHA_FOR_PURCHASES);

  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );
  const [instance, setInstance] = useState<Dropin | undefined>(undefined);
  const [reCaptchaValue, setReCaptchaValue] = useState<any | undefined>(
    undefined
  );
  const [submitting, setSubmitting] = useState(false);

  const isMounted = useIsMounted();

  const options: Omit<Options, "container"> = useMemo(
    () => ({
      authorization: clientRequestToken,
      threeDSecure: true,
      version: 2,
      paypal: {
        flow: "vault",
      },
    }),
    [clientRequestToken]
  );

  const loading = useMemo(
    () => !instance || submitting,
    [instance, submitting]
  );

  const handleReCaptchaChange = useCallback((value) => {
    setReCaptchaValue(value);
  }, []);

  const handleClick = useCallback(
    async (_evt: React.MouseEvent<HTMLButtonElement>) => {
      const { price: planAmount, id: planId } = braintreePlan;

      if (!instance) {
        console.error("no instance available to request a payment method.");
        return;
      }

      setErrorMessage(undefined);
      setSubmitting(true);

      // @ts-ignore
      const payload = (await instance.requestPaymentMethod({
        threeDSecure: {
          amount: planAmount.toString(),
        },
      })) as any; // We need to cast to any because the type definitions don't know about 3DS

      const { liabilityShifted, liabilityShiftPossible } = payload;

      // We should continue if
      // - liability was shifted (3DS succeeded)
      // - liability shift isn't possible (3DS not available on this card)
      const shouldWeProceed = liabilityShifted || !liabilityShiftPossible;

      // Liability shifted; we can go ahead and make the subscription request
      if (shouldWeProceed) {
        const { nonce } = payload;

        // Construct the request
        const purchaseRequest: ICreateBraintreeSubscriptionRequest = {
          nonce,
          planId,
          recaptchaResponse: reCaptchaValue,
        };

        // Pass back up to the wizard; change state to show that we're working
        on3dSecureSuccess(purchaseRequest);

        if (isMounted.current) {
          setSubmitting(false);
        }

        return;
      }

      // Liability was not shifted; we have a problem. Let's log the payload
      console.error("Liability not shifted (but was possible).");
      console.error(payload);

      if (isMounted.current) {
        setErrorMessage(ERROR_MESSAGE_THREE_D_SECURE_AUTHENTICATION_FAILED);
        setSubmitting(false);
      }
    },
    [braintreePlan, instance, isMounted, on3dSecureSuccess, reCaptchaValue]
  );

  return (
    <div>
      <Header
        amountString={
          braintreePlan &&
          `${braintreePlan.currencyIsoCode} ${braintreePlan.price}`
        }
      />
      <BraintreeDropIn
        onInstance={(i: Dropin) => setInstance(i)}
        options={options}
      />
      <Feature name={FEATURE_REQUIRE_RECAPTCHA_FOR_PURCHASES}>
        {(enabled: boolean) =>
          enabled && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: ".5rem",
                marginTop: ".5rem",
              }}
            >
              <ReCAPTCHA
                sitekey="6Ldu784UAAAAAI2pquK8B8q4lgT6vXY-Dpa8mu4S"
                onChange={handleReCaptchaChange}
              />
            </div>
          )
        }
      </Feature>
      {errorMessage && <p className="form__error">{errorMessage}</p>}
      <div
        style={{
          display: "flex",
          flexDirection: "row-reverse",
          justifyContent: "space-between",
          marginTop: ".5rem",
        }}
      >
        <SubmitButton
          isReCaptchaComplete={
            !requireReCaptcha || reCaptchaValue !== undefined
          }
          loading={loading}
          onClick={handleClick}
        />
        <button
          className="button button--primary"
          type="button"
          onClick={onGoBack}
          disabled={loading || submitting}
        >
          Go back
        </button>
      </div>
    </div>
  );
}

interface SubmitButtonProps {
  isReCaptchaComplete: boolean;
  loading: boolean;
  onClick: (evt: React.MouseEvent<HTMLButtonElement>) => void;
}

function SubmitButton({
  isReCaptchaComplete,
  loading,
  onClick,
}: SubmitButtonProps) {
  const label = useMemo(() => {
    if (loading) {
      return <Loading spinner small />;
    }
    return <span>Submit</span>;
  }, [loading]);

  return (
    <button
      disabled={loading || !isReCaptchaComplete}
      onClick={onClick}
      className="button button--secondary"
      type="button"
    >
      {label}
    </button>
  );
}
