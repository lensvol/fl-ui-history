import { Options } from "braintree-web-drop-in";

export default function getDefaultPayPalOptions(
  authorization: string
): Omit<Options, "container"> {
  return {
    authorization,
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
        allowVaultCardOverride: true,
      },
    },
  };
}
