import React, { Component } from "react";
import { connect } from "react-redux";
import ReactModal from "react-modal";

import { closeModalTooltip } from "actions/modalTooltip";
import ModalTooltipComponent from "./ModalTooltipComponent";
import { IAppState } from "types/app";
import { ITooltipData } from "components/ModalTooltip/types";

export interface Props {
  dispatch?: Function;
  modalIsOpen: boolean;
  onRequestClose?: (e?: any) => void;
  tooltipData: ITooltipData;
  disableTouchEvents?: boolean;
}

export class ModalTooltip extends Component<Props> {
  static displayName = "ModalTooltip";

  handleRequestClose = () => {
    const { dispatch, onRequestClose } = this.props;
    // If we are connected to the store, then dispatch an action
    if (dispatch) {
      dispatch(closeModalTooltip());
    }

    // If we have an onRequestClose callback prop, then fire it
    if (onRequestClose) {
      onRequestClose();
    }
  };

  render = () => {
    const { disableTouchEvents, modalIsOpen, tooltipData } = this.props;

    return (
      <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={this.handleRequestClose}
        shouldCloseOnOverlayClick
        className="modal--tooltip-like__content"
        overlayClassName="modal--tooltip-like__overlay"
        style={{
          overlay: {
            touchAction: disableTouchEvents ? "none" : undefined,
          },
        }}
      >
        <ModalTooltipComponent
          {...tooltipData}
          onRequestClose={this.handleRequestClose}
          disableTouchEvents={disableTouchEvents}
        />
      </ReactModal>
    );
  };
}

const mapStateToProps = ({
  modalTooltip: { modalIsOpen, tooltipData },
}: IAppState) => ({
  modalIsOpen,
  tooltipData,
});

export default connect(mapStateToProps)(ModalTooltip);
