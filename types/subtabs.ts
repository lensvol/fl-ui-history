export type MessagesActiveTab = "feedMessages" | "interactions";
export type MyselfActiveTab = "myself" | "possessions" | "agents";
export type StoryletActiveTab = "always" | "sometimes";

export const ALWAYS = "always";
export const SOMETIMES = "sometimes";

export interface ISubtabsState {
  messages: MessagesActiveTab;
  myself: MyselfActiveTab;
  storylet: StoryletActiveTab;
}
