type ExcludableMessage = {
  date: any;
  relatedId: number;
};

export default function excludeById(messages: ExcludableMessage[], id: number) {
  return messages.filter((message) => message.relatedId !== id);
}
