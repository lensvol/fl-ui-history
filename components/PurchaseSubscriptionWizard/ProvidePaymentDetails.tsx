import React, { useCallback, useMemo, useState } from "react";
import { Dropin, PaymentMethodRequestablePayload } from "braintree-web-drop-in";
import { Formik, Form } from "formik";

import {
  formValuesToBillingAddress,
  GENERIC_THREE_D_SECURE_FAILURE_MESSAGE,
  INITIAL_VALUES,
  PaymentStuffProps,
  PersonalDeets,
} from "components/Payment/PaymentStuff";
import BraintreeDropIn from "components/Payment/BraintreeWebDropIn";
import {
  FixedPaymentMethodPayload,
  IBraintreePlanWithClientRequestToken,
  PaymentMethodType,
} from "types/payment";
import Header from "./Header";

interface Props {
  braintreePlan: IBraintreePlanWithClientRequestToken;
  onGoBack: () => void;
  onThreeDSecureComplete: PaymentStuffProps<{
    nonce: string;
    recaptchaResponse: string | null;
  }>["onThreeDSComplete"];
}

export default function ProvidePaymentDetails({
  braintreePlan,
  onGoBack,
  onThreeDSecureComplete,
}: Props) {
  const { clientRequestToken, currencyIsoCode, price } = braintreePlan;

  const formattedPrice = useMemo(
    () =>
      new Intl.NumberFormat("en-GB", {
        currency: currencyIsoCode,
        style: "currency",
      }).format(price),
    [currencyIsoCode, price]
  );

  const authorization = useMemo(() => clientRequestToken, [clientRequestToken]);

  const [currentPaymentMethod, setCurrentPaymentMethod] = useState<
    PaymentMethodType | undefined
  >(undefined);
  const [dropInInstance, setDropInInstance] = useState<Dropin | undefined>(
    undefined
  );
  const [isPaymentMethodRequestable, setIsPaymentMethodRequestable] =
    useState(false);

  const handleInstance = useCallback((instance: Dropin | undefined) => {
    setDropInInstance(instance);
  }, []);

  const handleNoPaymentMethodRequestable = useCallback(() => {
    setIsPaymentMethodRequestable(false);
    setCurrentPaymentMethod(undefined);
  }, []);

  const handlePaymentMethodRequestable = useCallback(
    (payload: PaymentMethodRequestablePayload) => {
      setIsPaymentMethodRequestable(true);
      setCurrentPaymentMethod(payload.type);
    },
    []
  );

  const handleSubmit = useCallback(
    async (values, _helpers) => {
      if (dropInInstance === undefined) {
        console.error("Trying to submit without a Braintree instance");
        return;
      }

      const payload = (await dropInInstance.requestPaymentMethod({
        threeDSecure: {
          amount: price.toFixed(2),
          billingAddress: formValuesToBillingAddress(values),
        },
      })) as FixedPaymentMethodPayload;

      if (payload.type === "CreditCard") {
        if (!payload.threeDSecureInfo?.liabilityShifted) {
          console.error(
            "Liability did not shift as a result of 3DS authentication"
          );
          onThreeDSecureComplete({
            isSuccess: false,
            message: GENERIC_THREE_D_SECURE_FAILURE_MESSAGE,
          });
          return;
        }
      }

      const { nonce } = payload;
      onThreeDSecureComplete({
        isSuccess: true,
        payload: {
          nonce,
          recaptchaResponse: null,
        },
      });
    },
    [dropInInstance, onThreeDSecureComplete, price]
  );

  return (
    <Formik initialValues={INITIAL_VALUES} onSubmit={handleSubmit}>
      {({ values }) => (
        <Form>
          <Header amountString={formattedPrice} />
          <BraintreeDropIn
            authorization={authorization}
            onInstance={handleInstance}
            onNoPaymentMethodRequestable={handleNoPaymentMethodRequestable}
            onPaymentMethodRequestable={handlePaymentMethodRequestable}
          />
          {currentPaymentMethod === "CreditCard" && (
            <PersonalDeets values={values} />
          )}
          <div
            className="buttons buttons--left buttons--no-squash buttons--space-between"
            style={{
              paddingTop: "2rem",
              paddingBottom:
                currentPaymentMethod === "CreditCard" ? ".5rem" : 0,
            }}
          >
            <button
              type="button"
              className="button button--primary"
              onClick={onGoBack}
            >
              Go back
            </button>
            <button
              className="button button--primary"
              disabled={!isPaymentMethodRequestable}
              type="submit"
            >
              Subscribe
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

/*
interface Props {
  braintreePlan: IBraintreePlanWithClientRequestToken,
  onPaymentComplete: ({ message, isSuccess }: { message: string | undefined, isSuccess: boolean }) => Promise<void>,
  onThreeDSecureSuccess: ({
    nonce,
    reCaptcha,
  }: { nonce: string, reCaptcha: string | null }) => Promise<Either<{ message: string }>>,

  onGoBack: () => void,
}

export default function ProvidePaymentDetails({
  braintreePlan,
  onPaymentComplete,
  onGoBack,
  onThreeDSecureSuccess,
}: Props) {
  const { clientRequestToken } = braintreePlan;
  const {
    currencyIsoCode,
    price,
  } = braintreePlan;

  const options: Omit<Options, 'container'> = useMemo(() => ({
    authorization: clientRequestToken,
    threeDSecure: true,
    version: 2,
    paypal: {
      flow: 'vault',
    },
  }), [clientRequestToken]);

  const handlePaymentComplete = useCallback(async (result: Either<{ message: string | undefined }>) => {
    if (result instanceof Success) {
      const { message } = result.data;
      await onPaymentComplete({ message, isSuccess: true });
    } else {
      await onPaymentComplete({ message: result.message, isSuccess: false });
    }
  }, [onPaymentComplete]);

  const formattedPrice = useMemo(
    () => new Intl.NumberFormat('en-GB', { currency: currencyIsoCode, style: 'currency' }).format(price),
    [currencyIsoCode, price],
  );

  return (
    <div>
      <Header
        amountString={formattedPrice}
      />
      <PaymentForm
        amount={braintreePlan.price.toFixed(2)}
        dropInOptions={options}
        labelText="Subscribe"
        onGoBack={onGoBack}
        onPaymentComplete={handlePaymentComplete}
        onThreeDSecureSuccess={onThreeDSecureSuccess}
      />
    </div>
  );
}

 */
