import StoryletService, {
  IApiStoryletResponseData,
} from "services/StoryletService";

export default function beginGateEvent(
  eventId: number
): () => Promise<{ data: IApiStoryletResponseData }> {
  return async () => new StoryletService().begin(eventId);
}
