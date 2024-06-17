import { Options } from "braintree-web-drop-in";

export default function getDefaultPayPalOptions(
  authorization: string
): Omit<Options, "container"> {
  return {
    authorization,
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
  };
}
