import {
  Dropin,
  PaymentMethodPayload,
  PaymentMethodRequestablePayload,
} from "braintree-web-drop-in";
import getDefaultPayPalOptions from "components/Payment/getDefaultPayPalOptions";
import { CURRENCY_CODE_GBP } from "constants/payment";
import Loading from "components/Loading";
import BillingField from "components/Payment/BillingField";
import BraintreeDropIn, {
  BraintreeDropInProps,
  BraintreeWebDropInOptions,
} from "components/Payment/BraintreeWebDropIn";
import CountrySelect from "components/Payment/CountrySelect";
import Packages from "components/Payment/Packages";
import CurrencySelector from "components/Payment/CurrencySelector";
import { Field, Form, Formik, FormikHelpers } from "formik";
import useIsMounted from "hooks/useIsMounted";
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import PaymentService from "services/PaymentService";
import {
  CurrencyCode,
  ExtendedThreeDSecureInfo,
  IBraintreeNexOptionsResponse,
  IBraintreePurchaseFateRequest,
  IPaymentService,
  NexQuantity,
  PaymentMethodType,
  ThreeDSecureCompleteResult,
  ThreeDSecureParameters,
} from "types/payment";

export const INITIAL_VALUES = {
  email: "",
  phoneNumber: "",
  givenName: "",
  surname: "",
  streetAddress: "",
  extendedAddress: "",
  locality: "",
  postalCode: "",
  country: "US1",
};

export const GENERIC_THREE_D_SECURE_FAILURE_MESSAGE =
  "ThreeDSecure verification failed";

export type FormValues = typeof INITIAL_VALUES;

export interface PaymentStuffProps<
  TPayload extends { nonce: string; recaptchaResponse: string | null },
> {
  onCancel: () => void;
  onThreeDSComplete: (result: ThreeDSecureCompleteResult<TPayload>) => void;
}

export function getFailureMessageFromPayload(payload: PaymentMethodPayload) {
  if (payload.type !== "CreditCard") {
    // currently, we only have logic for credit card messages
    return `${GENERIC_THREE_D_SECURE_FAILURE_MESSAGE} (${payload.type})`;
  }

  if (payload.threeDSecureInfo === undefined) {
    return GENERIC_THREE_D_SECURE_FAILURE_MESSAGE;
  }

  if (payload.threeDSecureInfo.liabilityShifted ?? false) {
    // this function should never have been called; reaching here is a coding error
    return GENERIC_THREE_D_SECURE_FAILURE_MESSAGE;
  }

  const status = (payload.threeDSecureInfo as ExtendedThreeDSecureInfo)?.status;
  if (status !== undefined) {
    return `${GENERIC_THREE_D_SECURE_FAILURE_MESSAGE} (${status})`;
  }

  return GENERIC_THREE_D_SECURE_FAILURE_MESSAGE;
}

export function formValuesToBillingAddress(
  values: FormValues
): ThreeDSecureParameters["billingAddress"] {
  const { country, ...rest } = values;
  return {
    ...rest,
    countryCodeAlpha2: country.replace("US1", "US").replace("GB1", "GB"),
  };
}

export default function PaymentStuff({
  onCancel,
  onThreeDSComplete,
}: PaymentStuffProps<IBraintreePurchaseFateRequest>) {
  const isMounted = useIsMounted();

  const [currentPaymentMethod, setCurrentPaymentMethod] = useState<
    PaymentMethodType | undefined
  >(undefined);
  const [dropInInstance, setBraintreeDropInInstance] = useState<
    Dropin | undefined
  >(undefined);
  const [isFetchingCurrencyOptions, setIsFetchingCurrencyOptions] =
    useState(false);
  const [isPaymentMethodRequestable, setIsPaymentMethodRequestable] =
    useState(false);
  const [isSelectingCurrency, setIsSelectingCurrency] = useState(false);
  const [nexOptions, setNexOptions] = useState<
    IBraintreeNexOptionsResponse | undefined
  >(undefined);
  const [selectedCurrency, setSelectedCurrency] = useState<
    CurrencyCode | undefined
  >(undefined);
  const [selectedPackage, setSelectedPackage] = useState<
    NexQuantity | undefined
  >(undefined);

  const options = useMemo(() => {
    if (nexOptions?.clientRequestToken === undefined) {
      return undefined;
    }

    return getDefaultPayPalOptions(nexOptions.clientRequestToken);
  }, [nexOptions]);

  const fetchNexOptions = useCallback(
    async (code?: CurrencyCode) => {
      const paymentService: IPaymentService = new PaymentService();
      const currencyCode = code ?? CURRENCY_CODE_GBP;
      setIsFetchingCurrencyOptions(true);
      setSelectedCurrency(currencyCode);

      const { data } = await paymentService.selectCurrency(
        code ?? CURRENCY_CODE_GBP
      );

      if (isMounted.current) {
        setIsFetchingCurrencyOptions(false);
        setNexOptions(data);
        setSelectedPackage(
          data.packages.length > 0 ? data.packages[0] : undefined
        );
      }
    },
    [isMounted]
  );

  const handleCancel = useCallback(() => {
    onCancel();
  }, [onCancel]);

  const handleInstance = useCallback((instance: Dropin | undefined) => {
    setBraintreeDropInInstance(instance);
  }, []);

  const handleInstanceTeardown = useCallback(() => {
    setBraintreeDropInInstance(undefined);
  }, []);

  const handleNoPaymentRequestable = useCallback(() => {
    setCurrentPaymentMethod(undefined);
    setIsPaymentMethodRequestable(false);
  }, []);

  const handlePaymentMethodRequestable = useCallback(
    (payload: PaymentMethodRequestablePayload) => {
      setCurrentPaymentMethod(payload.type);
      setIsPaymentMethodRequestable(true);
    },
    []
  );

  const handleSelectCurrency = useCallback(
    async (evt: ChangeEvent<HTMLSelectElement>) => {
      const {
        target: { value },
      } = evt;
      setIsSelectingCurrency(true);
      await fetchNexOptions(value as CurrencyCode);
      if (isMounted.current) {
        setIsSelectingCurrency(false);
      }
    },
    [fetchNexOptions, isMounted]
  );

  const handleSelectPackage = useCallback((quantity: NexQuantity) => {
    setSelectedPackage(quantity);
  }, []);

  const handleFormSubmit = useCallback(
    async (values: FormValues, helpers: FormikHelpers<FormValues>) => {
      if (dropInInstance === undefined) {
        console.error("Trying to submit without a Braintree instance");
        return;
      }

      if (selectedPackage === undefined) {
        console.error("Trying to submit without a selected package");
        return;
      }

      const { setSubmitting } = helpers;

      const { currencyAmount, valueAddedTax } = selectedPackage;

      const amount = (currencyAmount + valueAddedTax).toFixed(2);

      setSubmitting(true);

      // console.info('INITIATING PAYMENT METHOD REQUEST');

      const requestPaymentMethodPayload: {
        threeDSecure: ThreeDSecureParameters;
      } = {
        threeDSecure: {
          email: values.email,
          amount,
          billingAddress: formValuesToBillingAddress(values),
        },
      };

      const payload = await dropInInstance.requestPaymentMethod(
        requestPaymentMethodPayload
      );

      // Check whether we failed 3DS authentication on a card payment method request before we proceed
      if (payload.type === "CreditCard") {
        // OK, liability didn't shift, which means that we can't process this payment. Just yeet the user
        // to the failed state
        if (!payload.threeDSecureInfo?.liabilityShifted) {
          console.error(
            "Liability did not shift as a result of 3DS authentication."
          );
          onThreeDSComplete({
            isSuccess: false,
            message: getFailureMessageFromPayload(payload),
          });
          return;
        }
      }

      // OK, we can proceed now.

      const { nonce } = payload;

      onThreeDSComplete({
        isSuccess: true,
        payload: {
          nonce,
          nexAmount: selectedPackage.quantity,
          recaptchaResponse: null,
          currencyCode: selectedPackage.currency.code,
        },
      });

      if (isMounted.current) {
        setSubmitting(false);
      }
    },
    [dropInInstance, isMounted, onThreeDSComplete, selectedPackage]
  );

  useEffect(() => {
    // noinspection JSIgnoredPromiseFromCall
    fetchNexOptions();
  }, [fetchNexOptions]);

  return (
    <Formik initialValues={INITIAL_VALUES} onSubmit={handleFormSubmit}>
      {({ values, isSubmitting, isValid }) => (
        <Form>
          <div>
            <div>
              {/* select currency */}
              <CurrencySelectionOrLoading
                isFetching={isFetchingCurrencyOptions}
                onSelect={handleSelectCurrency}
                value={selectedCurrency}
              />
              <div>
                <PackagesOrLoading
                  isFetchingCurrencies={
                    isFetchingCurrencyOptions || dropInInstance === undefined
                  }
                  isFetching={
                    isSelectingCurrency || dropInInstance === undefined
                  }
                  packages={nexOptions?.packages ?? []}
                  onSelect={handleSelectPackage}
                  selectedPackage={selectedPackage}
                />
              </div>
              <DropInOrLoading
                isFetchingCurrencies={isFetchingCurrencyOptions}
                isSelectingCurrency={isSelectingCurrency}
                onNoPaymentMethodRequestable={handleNoPaymentRequestable}
                onPaymentMethodRequestable={handlePaymentMethodRequestable}
                onInstance={handleInstance}
                onTeardown={handleInstanceTeardown}
                options={options}
              />
              {currentPaymentMethod === "CreditCard" ? (
                <PersonalDetails values={values} />
              ) : null}
            </div>
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
                className="button button--primary button--no-margin"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="button button--primary button--no-margin"
                disabled={
                  isSubmitting || !isPaymentMethodRequestable || !isValid
                }
              >
                Next
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export interface PersonalDeetsProps {
  values: FormValues;
}

export function PersonalDetails({ values }: PersonalDeetsProps) {
  return (
    <div>
      <h2 className="heading heading--2">Card details</h2>
      <p>
        This information is used by our payment provider for security
        verification and is not stored by Failbetter Games.
      </p>
      <div
        style={{
          marginTop: "1rem",
        }}
      >
        <BillingField name="email" value={values.email} label="Email" />
        <BillingField
          name="givenName"
          label="First name"
          value={values.givenName}
          maxlength={50}
        />
        <BillingField
          name="surname"
          label="Last name"
          value={values.surname}
          maxlength={50}
        />
        <BillingField
          name="streetAddress"
          label="Address Line 1"
          value={values.streetAddress}
          maxlength={50}
        />
        <BillingField
          name="extendedAddress"
          label="Address Line 2"
          value={values.extendedAddress}
          maxlength={50}
        />
        <BillingField
          name="locality"
          label="City/Town"
          value={values.locality}
          maxlength={50}
        />
        <BillingField
          name="postalCode"
          label="Postal code"
          value={values.postalCode}
          maxlength={10}
        />

        <label htmlFor="country">Country</label>
        <Field
          autofill="country"
          name="country"
          value={values.country}
          component={CountrySelect}
        />
      </div>
    </div>
  );
}

interface CurrencySelectionOrLoadingProps {
  isFetching: boolean;
  onSelect: (evt: ChangeEvent<HTMLSelectElement>) => Promise<void>;
  value: CurrencyCode | undefined;
}

function CurrencySelectionOrLoading({
  isFetching,
  onSelect,
  value,
}: CurrencySelectionOrLoadingProps) {
  if (value === undefined) {
    return <Loading spinner />;
  }
  if (isFetching) {
    return <Loading spinner />;
  }

  return (
    <>
      {/* select currency */}
      <label htmlFor="currency" style={{ fontWeight: "bold" }}>
        Currency
      </label>
      <CurrencySelector value={value} onChange={onSelect} />
    </>
  );
}

interface DropInOrLoadingProps extends Omit<BraintreeDropInProps, "options"> {
  isFetchingCurrencies: boolean;
  isSelectingCurrency: boolean;
  options: BraintreeWebDropInOptions | undefined;
}

function DropInOrLoading({
  isFetchingCurrencies,
  isSelectingCurrency,
  onInstance,
  onPaymentMethodRequestable,
  onNoPaymentMethodRequestable,
  onTeardown,
  options,
}: DropInOrLoadingProps) {
  if (isFetchingCurrencies || isSelectingCurrency) {
    return null;
  }
  if (options === undefined) {
    return null;
  }

  return (
    <BraintreeDropIn
      onInstance={onInstance}
      onNoPaymentMethodRequestable={onNoPaymentMethodRequestable}
      onPaymentMethodRequestable={onPaymentMethodRequestable}
      onTeardown={onTeardown}
      options={options}
    />
  );
}

interface PackagesOrLoadingProps {
  isFetching: boolean;
  isFetchingCurrencies: boolean;
  onSelect: (selectedPackage: NexQuantity) => void;
  packages: NexQuantity[];
  selectedPackage: NexQuantity | undefined;
}

function PackagesOrLoading({
  isFetching,
  isFetchingCurrencies,
  onSelect,
  packages,
  selectedPackage,
}: PackagesOrLoadingProps) {
  if (isFetchingCurrencies) {
    return null;
  }
  if (isFetching) {
    return <Loading spinner />;
  }

  return (
    <Packages
      isBreakdownVisible={false}
      isFetching={false}
      packages={packages}
      onSelect={onSelect}
      selectedPackage={selectedPackage}
    />
  );
}
