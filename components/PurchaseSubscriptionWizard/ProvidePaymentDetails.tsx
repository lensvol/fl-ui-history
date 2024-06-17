import React, { useCallback, useMemo, useState } from "react";
import { Dropin, PaymentMethodRequestablePayload } from "braintree-web-drop-in";
import { Formik, Form } from "formik";

import {
  formValuesToBillingAddress,
  GENERIC_THREE_D_SECURE_FAILURE_MESSAGE,
  INITIAL_VALUES,
  PaymentStuffProps,
  PersonalDetails,
} from "components/Payment/PaymentStuff";
import BraintreeDropIn, {
  BraintreeWebDropInOptions,
} from "components/Payment/BraintreeWebDropIn";
import {
  IBraintreePlanWithClientRequestToken,
  PaymentMethodType,
} from "types/payment";
import Header from "./Header";

import { PremiumSubscriptionType } from "types/subscription";

interface Props {
  braintreePlan: IBraintreePlanWithClientRequestToken;
  hasSubscription: boolean;
  onGoBack: () => void;
  onThreeDSecureComplete: PaymentStuffProps<{
    nonce: string;
    recaptchaResponse: string | null;
  }>["onThreeDSComplete"];
  renewDate?: string;
  subscriptionType?: PremiumSubscriptionType;
}

export default function ProvidePaymentDetails({
  braintreePlan,
  hasSubscription,
  onGoBack,
  onThreeDSecureComplete,
  renewDate,
  subscriptionType,
}: Props) {
  const { clientRequestToken, currencyIsoCode, price, addOns } = braintreePlan;

  const addOnPrice = addOns?.[0]?.amount ?? 0;

  const formattedPrice = useMemo(
    () =>
      new Intl.NumberFormat("en-GB", {
        currency: currencyIsoCode,
        style: "currency",
      }).format(price + addOnPrice),
    [addOnPrice, currencyIsoCode, price]
  );

  const formattedUpgradePrice = useMemo(
    () =>
      new Intl.NumberFormat("en-GB", {
        currency: currencyIsoCode,
        style: "currency",
      }).format(addOnPrice),
    [addOnPrice, currencyIsoCode]
  );

  const authorization = useMemo(() => clientRequestToken, [clientRequestToken]);

  const options: BraintreeWebDropInOptions = useMemo(
    () => ({
      authorization,
      locale: "en_GB",
      threeDSecure: true,
      version: 2,
      paypal: {
        flow: "vault",
      },
    }),
    [authorization]
  );

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

      const payload = await dropInInstance.requestPaymentMethod({
        threeDSecure: {
          amount: (price + addOnPrice).toFixed(2),
          billingAddress: formValuesToBillingAddress(values),
        },
      });

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
    [addOnPrice, dropInInstance, onThreeDSecureComplete, price]
  );

  return (
    <Formik initialValues={INITIAL_VALUES} onSubmit={handleSubmit}>
      {({ values }) => (
        <Form>
          <Header
            amountString={formattedPrice}
            hasSubscription={hasSubscription}
            isEnhanced={addOnPrice !== 0}
            renewDate={renewDate}
            subscriptionType={subscriptionType}
            upgradeAmountString={formattedUpgradePrice}
          />
          <BraintreeDropIn
            onInstance={handleInstance}
            onNoPaymentMethodRequestable={handleNoPaymentMethodRequestable}
            onPaymentMethodRequestable={handlePaymentMethodRequestable}
            options={options}
          />
          {currentPaymentMethod === "CreditCard" && (
            <PersonalDetails values={values} />
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
