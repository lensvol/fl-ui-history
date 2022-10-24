import StoryletService from "services/StoryletService";

export default function goBackFromGateEvent() {
  return async () => new StoryletService().goBack();
}
