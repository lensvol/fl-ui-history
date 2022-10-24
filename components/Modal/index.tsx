import Buttonlet from "components/Buttonlet";
import React from "react";
import ReactModal, { Props as ReactModalProps } from "react-modal";
import classnames from "classnames";

interface Props extends ReactModalProps {
  children?: React.ReactNode;
  disableTouchEvents?: boolean;
  hasExplicitCloseButton?: boolean;
  large?: boolean;
}

export default function Modal(props: Props) {
  const {
    className,
    children,
    disableTouchEvents,
    hasExplicitCloseButton,
    isOpen,
    large,
    onAfterClose,
    onAfterOpen,
    onRequestClose,
    overlayClassName,
    shouldCloseOnOverlayClick,
    style,
  } = props;

  const baseclass = classnames(
    "modal-dialog media--root",
    large && "modal-dialog--large",
    className
  );

  return (
    <ReactModal
      isOpen={isOpen}
      onAfterOpen={onAfterOpen}
      onAfterClose={onAfterClose}
      onRequestClose={onRequestClose}
      shouldCloseOnOverlayClick={shouldCloseOnOverlayClick ?? true}
      shouldCloseOnEsc={shouldCloseOnOverlayClick ?? true}
      closeTimeoutMS={150}
      className={{
        base: baseclass,
        afterOpen: "modal-dialog--after-open",
        beforeClose: "modal-dialog--before-close",
      }}
      overlayClassName={{
        base: classnames("modal-dialog__overlay", overlayClassName),
        afterOpen: "modal-dialog__overlay--after-open",
        beforeClose: "modal-dialog__overlay--before-close",
      }}
      style={{
        overlay: {
          ...style?.overlay,
          touchAction: disableTouchEvents ? "none" : undefined,
        },
        content: {
          ...style?.overlay,
          touchAction: disableTouchEvents ? "pan-x pan-y" : undefined,
        },
      }}
    >
      {hasExplicitCloseButton && (
        <div className="modal-dialog__close-button--media-large">
          <Buttonlet
            type="delete"
            onClick={onRequestClose}
            style={{ margin: "-22px" }}
          />
        </div>
      )}
      {children}
    </ReactModal>
  );
}

Modal.displayName = "Modal";
