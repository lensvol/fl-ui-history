import React, { CSSProperties } from "react";
import { connect } from "react-redux";
import PurchaseModal from "components/PurchaseModal";
import { IAppState } from "types/app";

export function ActionRefreshModal({
  actionRefillFateCard,
  className,
  disableTouchEvents,
  isOpen,
  onRequestClose,
  overlayClassName,
  style,
}: Props) {
  if (!actionRefillFateCard) {
    return null;
  }

  return (
    <PurchaseModal
      className={className}
      data={actionRefillFateCard}
      disableTouchEvents={disableTouchEvents}
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      overlayClassName={overlayClassName}
      style={style}
    />
  );
}

interface OwnProps {
  className?: string;
  disableTouchEvents?: boolean;
  isOpen: boolean;
  onRequestClose: () => void;
  overlayClassName?: string;
  style?: { overlay?: CSSProperties; content?: CSSProperties };
}

const mapStateToProps = ({
  fate: {
    data: { actionRefillFateCard },
  },
}: IAppState) => ({ actionRefillFateCard });

export type Props = OwnProps & ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(ActionRefreshModal);
