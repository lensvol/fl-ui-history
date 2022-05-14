import jwt from 'jsonwebtoken';

import { getTokenAndStorage } from 'features/startup';

export default function unpackJwt(window) {
  const { token } = getTokenAndStorage(window);
  try {
    const {
      CharacterId: characterId,
      UserId: userId,
    } = jwt.decode(token);
    const retValue = {};

    // Check that character and user IDs are number-like
    if (Number(characterId)) {
      retValue.characterId = characterId;
    }
    if (Number(userId)) {
      retValue.userId = userId;
    }
    return retValue;
  } catch (error) {
    // This could be a number of things, including expiry, malformedness, etc.
    return {};
  }
}