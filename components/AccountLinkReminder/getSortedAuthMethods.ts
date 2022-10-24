import { SUPPORTED_LINK_METHODS } from "components/AccountLinkReminder/constants";
import { AuthMethod, MessageVia } from "services/SettingsService";

export default function sortAuthMethodsByLinkedState(
  authMethods: AuthMethod[]
): MessageVia[] {
  return [...SUPPORTED_LINK_METHODS].sort((a, b): number => {
    const aMethod = authMethods?.find((_) => _.type === a);
    const bMethod = authMethods?.find((_) => _.type === b);
    return (aMethod ? 0 : 1) - (bMethod ? 0 : 1);
  });
}
