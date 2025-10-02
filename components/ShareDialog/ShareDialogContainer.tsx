import React, { useCallback, useState } from "react";

import Modal from "components/Modal";
import {
  LOADING,
  READY,
  SHARE_COMPLETE,
} from "components/ShareDialog/constants";
import ShareDialogContent from "components/ShareDialog/ShareDialogContent";

interface Props {
  borderColour?: string;
  data: {
    description: string;
    name: string;
    image: string;
  };
  isOpen: boolean;
  isSharing: boolean;
  onRequestClose: Function;
  onSubmit: Function;
  shareErrorResponse?: string;
  shareMessageResponse?: string;
}

export default function ShareDialogContainer({
  borderColour,
  data,
  isOpen,
  isSharing,
  onRequestClose,
  onSubmit,
  shareErrorResponse,
  shareMessageResponse,
}: Props) {
  const [currentStep, setCurrentStep] = useState(LOADING);
  const [title, setTitle] = useState<string | undefined>(undefined);

  const handleAfterOpen = useCallback(() => {
    setCurrentStep(READY);
    setTitle(data && data.name ? data.name : "");
  }, [data]);

  const handleChange = useCallback(() => {
    // no-op
  }, []);

  const handleRequestClose = useCallback(() => {
    setCurrentStep(LOADING);
    setTitle(undefined);

    onRequestClose();
  }, [onRequestClose]);

  const handleSubmit = useCallback(
    async ({ title }: any) => {
      await onSubmit(title);

      setCurrentStep(SHARE_COMPLETE);
    },
    [onSubmit]
  );

  return (
    <Modal
      isOpen={isOpen}
      onAfterOpen={handleAfterOpen}
      onRequestClose={handleRequestClose}
      overlayClassName="modal--share-dialog__overlay"
    >
      <ShareDialogContent
        borderColour={borderColour}
        data={data}
        isSharing={isSharing}
        onChange={handleChange}
        onSubmit={handleSubmit}
        shareErrorResponse={shareErrorResponse}
        shareMessageResponse={shareMessageResponse}
        step={currentStep}
        title={title}
      />
    </Modal>
  );
}

ShareDialogContainer.displayName = "ShareDialogContainer";
