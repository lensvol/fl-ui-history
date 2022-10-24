export default function redirectAfterLogin(history, { hasCharacter }) {
  // If the user already has a character, then take them to the story tab
  if (hasCharacter) {
    return history.push("/");
  }
  // If the user has no character, take them to the character-creation page
  return history.push("/create-character");
}
