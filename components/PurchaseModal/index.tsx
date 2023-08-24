import React, { CSSProperties, useMemo } from "react";

import Modal from "components/Modal";
import PurchaseFace from "components/PurchaseFaceModal/PurchaseFace";
import PurchaseDefault from "./PurchaseDefault";
import PurchaseName from "./PurchaseName";

export default function PurchaseModalContainer(props: Props) {
  const {
    className,
    data,
    disableTouchEvents,
    isOpen,
    onRequestClose,
    overlayClassName,
    style,
  } = props;

  const contents = useMemo(() => {
    switch (data?.action) {
      case "AskNameChange":
        return <PurchaseName {...props} />;

      case "FaceChange":
        return <PurchaseFace {...props} />;

      default:
        return <PurchaseDefault {...props} />;
    }
  }, [data, props]);

  return (
    <Modal
      className={className}
      disableTouchEvents={disableTouchEvents}
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      overlayClassName={overlayClassName}
      style={style}
    >
      {contents}
    </Modal>
  );
}

interface Props {
  className?: string;
  data: any | undefined;
  disableTouchEvents?: boolean;
  isFree?: boolean;
  isOpen: boolean;
  onRequestClose: (...args: any) => any;
  overlayClassName?: string;
  style?: {
    overlay?: CSSProperties;
    content?: CSSProperties;
  };
}
