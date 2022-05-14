import React, {
  useCallback,
  useMemo,
  useState,
} from 'react';

import Modal from 'components/Modal';
import RequestPasswordResetForm from './RequestPasswordResetForm';
import RequestPasswordResetSuccess from './RequestPasswordResetSuccess';

enum Step {
  Ready,
  Success,
}

export default function RequestPasswordResetModal({ isOpen, onRequestClose }: Props) {
  const [currentStep, setCurrentStep] = useState(Step.Ready);

  const handleSubmitSuccess = useCallback(() => {
    setCurrentStep(Step.Success);
  }, []);

  const onAfterClose = useCallback(() => setCurrentStep(Step.Ready), []);

  const content = useMemo(() => {
    switch (currentStep) {
      case Step.Success:
        return <RequestPasswordResetSuccess />;
      default:
        return (<RequestPasswordResetForm onSuccess={handleSubmitSuccess} />);
    }
  }, [
    currentStep,
    handleSubmitSuccess,
  ]);

  return (
    <Modal
      isOpen={isOpen}
      onAfterClose={onAfterClose}
      onRequestClose={onRequestClose}
    >
      {content}
    </Modal>
  );
}

type OwnProps = {
  isOpen: boolean,
  onRequestClose: () => void,
};

type Props = OwnProps;
