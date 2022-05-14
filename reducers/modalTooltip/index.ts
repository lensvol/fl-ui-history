import {
  CLOSE_MODAL_TOOLTIP,
  OPEN_MODAL_TOOLTIP,
} from 'actiontypes/modalTooltip';
import { IModalTooltipState } from 'types/modalTooltip';
import { ITooltipData } from 'components/ModalTooltip/types';

const INITIAL_STATE: IModalTooltipState = {
  modalIsOpen: false,
  tooltipData: {},
};

export default function reducer(state = INITIAL_STATE, action: { type: string, payload?: ITooltipData }) {
  const { type, payload } = action;
  switch (type) {
    case CLOSE_MODAL_TOOLTIP:
      // TODO: should we flush tooltipData state like this?
      return { modalIsOpen: false };
    case OPEN_MODAL_TOOLTIP:
      return { modalIsOpen: true, tooltipData: payload };
    default:
      return state;
  }
}