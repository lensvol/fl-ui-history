import dropin, {
  ChangeActiveViewPayload,
  Dropin,
  PaymentMethodRequestablePayload,
  PaymentOptionSelectedPayload,
} from "braintree-web-drop-in";
import getDefaultPayPalOptions from "components/Payment/getDefaultPayPalOptions";
import React, { useEffect, useRef } from "react";

export interface BraintreeDropInProps {
  authorization: string;
  onChangeActiveView?: (payload: ChangeActiveViewPayload) => void;
  onInstance?: (instance: Dropin | undefined) => void;
  on3dsCustomerCanceled?: () => void;
  onNoPaymentMethodRequestable?: () => void;
  onPaymentMethodRequestable?: (
    payload: PaymentMethodRequestablePayload
  ) => void;
  onPaymentOptionSelected?: (payload: PaymentOptionSelectedPayload) => void;
  onTeardown?: () => void;
  // options: Omit<Options, 'container'> & Partial<{ container: Options['container'] }>,
}

export default function BraintreeDropIn({
  authorization,
  onChangeActiveView,
  on3dsCustomerCanceled,
  onInstance,
  onNoPaymentMethodRequestable,
  onPaymentMethodRequestable,
  onPaymentOptionSelected,
  onTeardown,
}: BraintreeDropInProps) {
  const divRef = useRef<HTMLDivElement | null>(null);
  const instanceRef = useRef<Dropin | undefined>(undefined);

  useEffect(() => {
    const element = divRef.current;

    if (instanceRef.current) {
      const instance = instanceRef.current;
      // console.info('tearing down to reinitialize');
      instance.teardown().then(() => {
        if (element !== null) {
          // console.info('reinitializing after teardown')
          initializeBraintree(element);
        }
      });
    } else if (element != null) {
      // console.info('init without existing instance');
      initializeBraintree(element);
    }

    return () => {
      if (instanceRef.current) {
        onTeardown?.();
        // console.info('tearing down instance');
        instanceRef.current.teardown();
      }
    };

    function initializeBraintree(container: HTMLDivElement) {
      const defaultOptions = getDefaultPayPalOptions(authorization);
      dropin.create(
        {
          ...defaultOptions,
          preselectVaultedPaymentMethod: false,
          container,
        },
        (error, i) => {
          if (error) {
            console.error(error);
          } else {
            instanceRef.current = i;

            // Register callbacks
            i?.on(
              "paymentMethodRequestable",
              (payload) => onPaymentMethodRequestable?.(payload)
            );
            i?.on(
              "noPaymentMethodRequestable",
              () => onNoPaymentMethodRequestable?.()
            );
            i?.on(
              "paymentOptionSelected",
              (payload) => onPaymentOptionSelected?.(payload)
            );
            i?.on(
              "changeActiveView",
              (payload) => onChangeActiveView?.(payload)
            );
            i?.on("3ds:customer-canceled", () => on3dsCustomerCanceled?.());

            // Clear the selected method, so the user _has_ to select one
            // i?.clearSelectedPaymentMethod();

            // Update our parent
            onInstance?.(i);
          }
        }
      );
    }
  }, [
    // divRef,
    // instanceRef,
    // isInitializingRef,
    authorization,
    on3dsCustomerCanceled,
    onChangeActiveView,
    onInstance,
    onNoPaymentMethodRequestable,
    onPaymentMethodRequestable,
    onPaymentOptionSelected,
    onTeardown,
  ]);

  return <div ref={divRef} />;
}
