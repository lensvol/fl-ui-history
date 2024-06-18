import { Options } from "braintree-web-drop-in";
import Config from "configuration";
import { IBraintreeNexOptionsResponse } from "types/payment";

export default function getDefaultPayPalOptions(
  nexOptions: IBraintreeNexOptionsResponse
): Omit<Options, "container"> {
  return {
    authorization: nexOptions.clientRequestToken,
    locale: "en_GB",
    paypal: {
      flow: "vault",
      buttonStyle: {
        // @ts-ignore
        color: "blue",
        // @ts-ignore
        shape: "rect",
        // @ts-ignore
        size: "medium",
      },
    },
    threeDSecure: true,
    vaultManager: true,
    card: {
      vault: {
        // Unlike with subscriptions, Fate purchasers should have the option to decline vaulting of cards
        allowVaultCardOverride: true,
      },
    },
    applePay: {
      buttonStyle: "black",
      displayName: "Failbetter Games",
      paymentRequest: {
        total: {
          type: "final",
          label: "Failbetter Games",
          amount: (
            nexOptions.packages[0].currencyAmount +
            nexOptions.packages[0].valueAddedTax
          ).toFixed(2),
        },
        currencyCode: nexOptions.currencyCode,
      },
    },
    googlePay: {
      merchantId: Config.googleMerchantId,
      googlePayVersion: 2,
      transactionInfo: {
        currencyCode: nexOptions.currencyCode,
        totalPrice: (
          nexOptions.packages[0].currencyAmount +
          nexOptions.packages[0].valueAddedTax
        ).toFixed(2),
        totalPriceStatus: "FINAL",
      },
      button: {
        onClick: (_event: Event) => {
          // custom event handler when user clicks Google Pay button
          // no-op for now
        },
        buttonType: "buy", // "Buy with G Pay"
        buttonSizeMode: "fill",
        allowedPaymentMethods: [
          {
            type: "CARD",
            parameters: {
              allowedAuthMethods: [
                "CRYPTOGRAM_3DS", // ThreeDSecure
              ],
              allowedCardNetworks: ["DISCOVER", "MASTERCARD", "VISA"],
            },
          },
          {
            type: "PAYPAL",
            parameters: {
              allowedAuthMethods: [
                "CRYPTOGRAM_3DS", // ThreeDSecure
              ],
              allowedCardNetworks: ["DISCOVER", "MASTERCARD", "VISA"],
            },
          },
        ],
      },
    },
  };
}
