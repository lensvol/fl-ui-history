/* eslint-disable no-console */
import React, { useCallback, useMemo, useState } from "react";
import { connect } from "react-redux";
import { Props as ReactModalProps } from "react-modal";
import Modal from "components/Modal";
import { ThunkDispatch } from "redux-thunk";
import { IAppState } from "types/app";
import { ExceptionalFriendWizardStep } from "types/fate";
import Blurb from "components/ExceptionalFriendModal/Blurb";
import { fetch as fetchMap } from "actions/map";
import { fetchAvailable } from "actions/storylet";
import PurchaseSubscriptionWizard from "components/PurchaseSubscriptionWizard";

export interface Props extends ReactModalProps {
  disableTouchEvents?: boolean;
  dispatch: ThunkDispatch<any, any, any>;
  onRequestClose: (_?: any) => void;
}

export function ExceptionalFriendModal(props: Props) {
  const { disableTouchEvents, dispatch, isOpen, onRequestClose } = props;

  const [wizardStep, setWizardStep] = useState(
    ExceptionalFriendWizardStep.Blurb
  );

  const handleRequestClose = useCallback(() => {
    onRequestClose(false);
  }, [onRequestClose]);

  const onNextFromSubscriptionSuccess = useCallback(() => {
    dispatch(fetchMap());
    dispatch(fetchAvailable());
    onRequestClose(true);
  }, [dispatch, onRequestClose]);

  const handleAfterClose = useCallback(() => {
    // Clean up internal state
    setWizardStep(ExceptionalFriendWizardStep.Blurb);
  }, []);

  const onNext = useCallback(
    (_message?: string) => {
      switch (wizardStep) {
        case ExceptionalFriendWizardStep.Blurb:
          setWizardStep(ExceptionalFriendWizardStep.Payment);
          return;
        case ExceptionalFriendWizardStep.Payment:
          onNextFromSubscriptionSuccess();
          return; // eslint-disable-line no-useless-return
        case ExceptionalFriendWizardStep.Success:
        case ExceptionalFriendWizardStep.Error:
        default:
          return; // eslint-disable-line no-useless-return
      }
    },
    [onNextFromSubscriptionSuccess, wizardStep]
  );

  const handleWizardClose = useCallback(
    (didUserCompleteSubscription: boolean | undefined) => {
      if (didUserCompleteSubscription) {
        onNext();
        return;
      }
      onRequestClose();
    },
    [onNext, onRequestClose]
  );

  const content = useMemo(() => {
    switch (wizardStep) {
      case ExceptionalFriendWizardStep.Payment:
        return (
          <PurchaseSubscriptionWizard onClickToClose={handleWizardClose} />
        );

      case ExceptionalFriendWizardStep.Blurb:
      default:
        return <Blurb onNext={onNext} />;
    }
  }, [handleWizardClose, onNext, wizardStep]);

  return (
    <Modal
      isOpen={isOpen}
      onAfterClose={handleAfterClose}
      onRequestClose={handleRequestClose}
      overlayClassName="modal--map-exceptional-friend-modal__overlay"
      className="modal--map-exceptional-friend-modal__content"
      disableTouchEvents={disableTouchEvents}
    >
      {content}
    </Modal>
  );
}

ExceptionalFriendModal.displayName = "ExceptionalFriendModal";

const mapStateToProps = ({ fate }: IAppState) => ({ data: fate.data });

export default connect(mapStateToProps)(ExceptionalFriendModal);
