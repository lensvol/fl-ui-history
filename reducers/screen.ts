import {
  ENTER_FULL_SCREEN,
  EXIT_FULL_SCREEN,
} from 'actiontypes/screen';
import { IScreenState } from 'types/screen';

const INITIAL_STATE: IScreenState = {
  full: false,
};

export default function reducer(state = INITIAL_STATE, action: { type: any }) {
  switch (action.type) {
    case ENTER_FULL_SCREEN:
      return { ...state, full: true };
    case EXIT_FULL_SCREEN:
      return { ...state, full: false };
    default:
      return state;
  }
}
