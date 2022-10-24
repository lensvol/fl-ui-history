import {
  SET_TIMER_NEXT_AVAILABLE,
  SET_TIMER_REMAINING,
} from "actiontypes/timer";
import { ActionCreator } from "redux";

export type SetNextAvailable = {
  type: typeof SET_TIMER_NEXT_AVAILABLE;
};

export type SetRemaining = { type: typeof SET_TIMER_REMAINING };

export type TimerAction = SetNextAvailable | SetRemaining;

export const setNextAvailable: ActionCreator<SetNextAvailable> = (
  time: string
) => ({
  type: SET_TIMER_NEXT_AVAILABLE,
  nextAvailable: time,
});

export const setRemaining: ActionCreator<SetRemaining> = (time: string) => ({
  type: SET_TIMER_REMAINING,
  timeRemaining: time,
});
