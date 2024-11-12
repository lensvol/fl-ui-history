import { BraintreeWebDropInOptions } from "components/Payment/BraintreeWebDropIn";

import Config from "configuration";

export type SubscriptionBraintreeOptions = {
  authorization: string;
  currencyIsoCode: string;
  price: number;
};

export default function getSubscriptionBraintreeOptions({
  authorization,
  currencyIsoCode,
  price,
}: SubscriptionBraintreeOptions): BraintreeWebDropInOptions {
  return {
    authorization,
    locale: "en_GB",
    threeDSecure: true,
    dataCollector: true,
    paypal: {
      flow: "vault",
    },
    applePay: {
      buttonStyle: "black",
      displayName: "Failbetter Games",
      paymentRequest: {
        total: {
          type: "final",
          label: "Failbetter Games",
          amount: price.toFixed(2),
          paymentTiming: "recurring",
        },
        currencyCode: currencyIsoCode,
      },
    },
    googlePay: {
      merchantId: Config.googleMerchantId,
      googlePayVersion: 2,
      transactionInfo: {
        currencyCode: currencyIsoCode,
        totalPrice: price.toFixed(2),
        totalPriceStatus: "FINAL",
      },
      button: {
        onClick: (_event: Event) => {
          // custom event handler when user clicks Google Pay button
          // no-op for now
        },
        buttonType: "subscribe", // "Subscribe with G Pay"
        buttonSizeMode: "fill",
        allowedPaymentMethods: [
          {
            type: "CARD", // Cannot use Google Pay + PayPal for subscriptions
            parameters: {
              allowedAuthMethods: [
                "CRYPTOGRAM_3DS", // ThreeDSecure
              ],
              allowedCardNetworks: ["DISCOVER", "MASTERCARD", "VISA"],
              allowPrepaidCards: false, // avoid for subscriptions
            },
          },
        ],
      },
    },
  };
}
