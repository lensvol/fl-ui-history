import {
  CLOSE_MODAL_TOOLTIP,
  OPEN_MODAL_TOOLTIP,
} from "actiontypes/modalTooltip";
import { ITooltipData } from "components/ModalTooltip/types";
import { Dispatch } from "redux";

export function openModalTooltip(tooltipData: ITooltipData) {
  return (dispatch: Dispatch) =>
    dispatch({ type: OPEN_MODAL_TOOLTIP, payload: tooltipData });
}

export function closeModalTooltip() {
  return (dispatch: Dispatch) => dispatch({ type: CLOSE_MODAL_TOOLTIP });
}
