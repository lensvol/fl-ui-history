import React from "react";
import Modal from "react-modal";
import classnames from "classnames";
import Buttonlet from "components/Buttonlet";
import MediaLgUp from "../Responsive/MediaLgUp";
import MediaMdDown from "../Responsive/MediaMdDown";

class Dialog extends React.Component {
  static displayName = "Dialog";

  /**
   * Render
   * @return {[type]} [description]
   */
  render() {
    const { className, large } = this.props;

    const baseclass = classnames(
      "modal-dialog media--root",
      large && "modal-dialog--large",
      className
    );

    return (
      <Modal
        {...this.props}
        className={{
          base: baseclass,
          afterOpen: "modal-dialog--after-open",
          beforeClose: "modal-dialog--before-close",
        }}
        overlayClassName={{
          base: "modal-dialog__overlay",
          afterOpen: "modal-dialog__overlay--after-open",
          beforeClose: "modal-dialog__overlay--before-close",
        }}
        shouldCloseOnOverlayClick
        closeTimeoutMS={300}
      >
        <MediaLgUp>
          <div className="modal-dialog__close-button--media-large">
            <Buttonlet
              type="delete"
              onClick={this.props.onRequestClose}
              style={{ margin: "-22px" }}
            />
          </div>
        </MediaLgUp>
        {this.props.children}
        <MediaMdDown>
          <Buttonlet
            type="delete"
            onClick={this.props.onRequestClose}
            style={{ position: "absolute", right: ".5rem", top: ".5rem" }}
          />
        </MediaMdDown>
      </Modal>
    );
  }
}

Dialog.defaultProps = {
  large: false,
};

export default Dialog;
