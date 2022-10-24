/* eslint-disable no-console */
import { Dropin } from "braintree-web-drop-in";
import BraintreeDropIn from "braintree-web-drop-in-react";
import SubmitButton from "components/Payment/components/BraintreeView/SubmitButton";
import getDefaultPayPalOptions from "components/Payment/getDefaultPayPalOptions";
import { FEATURE_REQUIRE_RECAPTCHA_FOR_PURCHASES } from "features/feature-flags";
import useIsMounted from "hooks/useIsMounted";
import React, { useCallback, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Either, Failure, Success } from "services/BaseMonadicService";
import { VersionMismatch } from "services/BaseService";
import PaymentService from "services/PaymentService";
import {
  IBraintreeNexOptionsResponse,
  IPaymentService,
  NexQuantity,
  PaymentResult,
} from "types/payment";
import Loading from "components/Loading";
import { Feature, useFeature } from "flagged";

interface Props {
  onGoBack: () => void;
  onPaymentComplete: (result: Either<PaymentResult>) => void;
  onSubmitFinished?: (result: Either<PaymentResult>) => void;
  onSubmitStarted?: () => void;
  options: IBraintreeNexOptionsResponse;
  selectedPackage: NexQuantity;
}

const ERROR_MESSAGE_THREE_D_SECURE_AUTHENTICATION_FAILED =
  "3D Secure authentication failed." +
  " Please try a different payment method.";

export default function ProvidePaymentDetails({
  onGoBack,
  onPaymentComplete,
  onSubmitFinished,
  onSubmitStarted,
  options,
  selectedPackage,
}: Props) {
  const { clientRequestToken } = options;

  const total = selectedPackage.currencyAmount + selectedPackage.valueAddedTax;

  const isMounted = useIsMounted();

  const requireReCaptcha = useFeature(FEATURE_REQUIRE_RECAPTCHA_FOR_PURCHASES);

  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );
  const [instance, setInstance] = useState<Dropin | undefined>(undefined);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isSubmittingToAPI, setIsSubmittingToAPI] = useState(false);
  const [reCaptcha, setReCaptcha] = useState<string | null>(null);

  const handleReCaptchaChange = useCallback((value: string | null) => {
    setReCaptcha(value);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!instance) {
      return;
    }

    if (requireReCaptcha && !reCaptcha) {
      return;
    }

    setIsPurchasing(true);

    try {
      const payload = (await instance.requestPaymentMethod({
        threeDSecure: {
          amount: total.toFixed(2),
        },
      })) as any;

      console.info("payload from BT:");
      console.info(payload);

      const { liabilityShifted, liabilityShiftPossible } = payload;

      // We should continue if
      // - liability was shifted (3DS succeeded)
      // - liability shift isn't possible (3DS not available on this card)
      const shouldWeProceed = liabilityShifted || !liabilityShiftPossible;

      if (shouldWeProceed) {
        const { nonce } = payload;

        const request = {
          nonce,
          currencyCode: options.currencyCode,
          nexAmount: selectedPackage.quantity,
          recaptchaResponse: reCaptcha,
        };

        // Tell parent we've started submitting
        onSubmitStarted?.();

        setIsSubmittingToAPI(true);

        const paymentService: IPaymentService = new PaymentService();

        // Attempt the purchase
        const { data } = await paymentService.purchaseWithBraintree(request);

        // Monadize the raw result
        const either = data.isSuccess
          ? new Success(data)
          : new Failure(data.message ?? "Unknown failure");

        // Call the onSubmitFinished prop func that our parent passed us
        onSubmitFinished?.(either);

        // Call our parent prop function, which should move us on from here
        onPaymentComplete(either);

        return;
      }

      console.error("Liability not shifted.");
      setErrorMessage(ERROR_MESSAGE_THREE_D_SECURE_AUTHENTICATION_FAILED);
    } catch (e) {
      if (e instanceof VersionMismatch) {
        return;
      }
    } finally {
      if (isMounted.current) {
        setIsPurchasing(false);
        setIsSubmittingToAPI(false);
      }
    }
  }, [
    instance,
    isMounted,
    onPaymentComplete,
    onSubmitFinished,
    onSubmitStarted,
    options.currencyCode,
    requireReCaptcha,
    reCaptcha,
    selectedPackage.quantity,
    total,
  ]);

  if (isSubmittingToAPI) {
    return (
      <div
        style={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h2 className="heading heading--2">Completing transaction</h2>
        <Loading spinner />
      </div>
    );
  }

  return (
    <>
      <h2 className="heading heading--2">Payment details</h2>

      <p>
        Purchasing {selectedPackage.quantity} Fate for{" "}
        {selectedPackage.currency.sign}
        {total.toFixed(2)}
      </p>

      <BraintreeDropIn
        options={getDefaultPayPalOptions(clientRequestToken)}
        onInstance={setInstance}
      />
      <Feature name={FEATURE_REQUIRE_RECAPTCHA_FOR_PURCHASES}>
        {(enabled: boolean) =>
          enabled && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: ".5rem",
                width: "100%",
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
        className="buttons buttons--no-squash"
        style={{
          marginTop: ".5rem",
        }}
      >
        <SubmitButton
          isPurchasing={isPurchasing}
          isWaitingForInstance={!instance}
          isWaitingForReCaptcha={requireReCaptcha && !reCaptcha}
          onClick={handleSubmit}
          selectedPackage={selectedPackage}
        />
        <button
          type="button"
          className="button button--primary"
          onClick={onGoBack}
          disabled={isPurchasing}
        >
          Go back
        </button>
      </div>
    </>
  );
}
