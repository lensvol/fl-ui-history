export default function excludeById(messages: { date: any, relatedId: number }[], id: number) {
  return messages.filter(message => message.relatedId !== id);
}