import React, { CSSProperties } from "react";
import { connect } from "react-redux";
import PurchaseFateModal from "components/PurchaseFateModal";
import { IAppState } from "types/app";

interface Props {
  disableTouchEvents?: boolean;
  isModalOpen: boolean;
  onRequestClose: () => void;
  style?: {
    overlay?: CSSProperties;
    content?: CSSProperties;
  };
}

export function PurchaseFateFromGateEvent({
  disableTouchEvents,
  isModalOpen,
  onRequestClose,
  style,
}: Props) {
  return (
    <PurchaseFateModal
      isOpen={isModalOpen}
      onRequestClose={onRequestClose}
      disableTouchEvents={disableTouchEvents}
      style={style}
    />
  );
}

const mapStateToProps = ({ payment: { isSuccess } }: IAppState) => ({
  isSuccess,
});

export default connect(mapStateToProps)(PurchaseFateFromGateEvent);
