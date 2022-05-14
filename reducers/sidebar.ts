import {
  SIDEBAR_CLOSE,
  SIDEBAR_OPEN,
} from 'actiontypes/sidebar';
import { ISidebarState } from 'types/sidebar';

const INITIAL_STATE: ISidebarState = {
  isOpen: false,
};

export default function reducer(state = INITIAL_STATE, action: { type: string }) {
  switch (action.type) {
    case SIDEBAR_OPEN:
      return { isOpen: true };
    case SIDEBAR_CLOSE:
      return { isOpen: false };
    default:
      return state;
  }
}
