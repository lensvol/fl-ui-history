import { PremiumSubscriptionType } from "types/subscription";

// determines whether a subscription has been recently cancelled, but the player is still in the final billing cycle
export function isRecentlyCancelledSubscription(
  hasSubscription: boolean,
  subscriptionType?: PremiumSubscriptionType
): boolean {
  return (
    !hasSubscription &&
    (subscriptionType === "ExceptionalFriendship" ||
      subscriptionType === "EnhancedExceptionalFriendship")
  );
}

// determines whether a subscription was recently transitioned from Enhanced to non-Enhanced
export function isDowngradedSubscription(
  hasSubscription: boolean,
  subscriptionType?: PremiumSubscriptionType
): boolean {
  return hasSubscription && subscriptionType === "None";
}

// provides a human-readble name for the given subscription type
export function subscriptionName(
  subscriptionType?: PremiumSubscriptionType
): string {
  switch (subscriptionType) {
    case "EnhancedExceptionalFriendship":
      return "Enhanced Exceptional Friendship";

    case "ExceptionalFriendship":
      return "Exceptional Friendship";

    default:
      return "";
  }
}
