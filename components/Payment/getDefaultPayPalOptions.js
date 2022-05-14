export default function getDefaultPayPalOptions(authorization) {
  const paypal = {
    flow: 'vault',
    buttonStyle: {
      color: 'blue',
      shape: 'rect',
      size: 'medium',
    },
  };

  return {
    authorization,
    paypal,
    threeDSecure: true,
    vaultManager: true,
    card: {
      vault: {
        allowVaultCardOverride: true,
      },
    },
  };
}