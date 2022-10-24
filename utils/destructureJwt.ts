import jwt from "jsonwebtoken";

import { getTokenAndStorage } from "features/startup";

export default function destructureJwt() {
  const { token } = getTokenAndStorage(window);
  return {
    characterId: extractOrReturnUndefined(token, "CharacterId"),
    userId: extractOrReturnUndefined(token, "UserId"),
    exp: extractOrReturnUndefined(token, "exp"),
  };
}

function extractOrReturnUndefined(token: string | undefined, key: string) {
  if (token === undefined) {
    return undefined;
  }

  try {
    const decoded: any = jwt.decode(token);
    const value = decoded[key];
    if (Number(value)) {
      return Number(value);
    }
    return undefined;
  } catch (error) {
    return undefined;
  }
}
