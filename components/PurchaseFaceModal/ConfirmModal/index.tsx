import React, {
  useCallback,
  useMemo,
  useState,
} from 'react';
import { connect } from 'react-redux';

import Modal from 'components/Modal';

import PurchaseResult from 'components/PurchaseModal/PurchaseResult';
import { setAvatarImage } from 'actions/myself';
import getCanChangeFaceForFree from 'selectors/myself/getCanChangeFaceForFree';
import { SetAvatarImageResponse } from 'services/MyselfService';
import { IAppState } from 'types/app';

import getFaceChangeFateCost from 'selectors/fate/getFaceChangeFateCost';
import {
  Either,
  Success,
} from 'services/BaseMonadicService';
import { purchaseItem, fetch as fetchFate } from 'actions/fate';
import getFaceChangeFateCard from 'selectors/fate/getFaceChangeFateCard';
import { newAvatarImage } from 'actions/myself/setAvatarImage';
import ConfirmModalReady from './ConfirmModalReady';

export enum AvatarConfirmModalStep {
  Ready,
  Complete,
  CompleteFree,
}

export function ConfirmModal(props: Props) {
  const {
    avatar,
    changeFaceFateCard,
    dispatch,
    fateCost,
    isFree,
    isOpen,
    onConfirm,
    onRequestClose,
    onRequestCloseModalStack,
  } = props;

  const [currentStep, setCurrentStep] = useState<AvatarConfirmModalStep>(AvatarConfirmModalStep.Ready);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | undefined>(undefined);

  const resetState = useCallback(() => {
    setCurrentStep(AvatarConfirmModalStep.Ready);
    setIsSuccess(false);
    setIsSubmitting(false);
    setMessage(undefined);
  }, []);

  const handleConfirmPurchase = useCallback(async () => {
    if (!avatar) {
      console.error('Trying to purchase an undefined avatar');
      return;
    }

    setIsSubmitting(true);

    let result: Either<SetAvatarImageResponse> | undefined;
    if (isFree) {
      result = await dispatch(setAvatarImage({ avatarImage: avatar }));
    } else {
      if (!changeFaceFateCard) {
        console.error('Trying to purchase an avatar, but can\'t find the Fate card');
        return;
      }
      result = await dispatch(purchaseItem({ avatarImage: avatar, storeItemId: changeFaceFateCard.id }));
    }

    let responseMessage: string | undefined;
    if (result instanceof Success) {
      dispatch(newAvatarImage(avatar));
      responseMessage = result.data.message;
    } else {
      responseMessage = result?.message;
    }

    // Fetch up-to-date Fate info so that we can change cameo again without refreshing the page
    dispatch(fetchFate());

    setIsSubmitting(false);
    setIsSuccess(true);
    setMessage(responseMessage);
    setCurrentStep(isFree ? AvatarConfirmModalStep.CompleteFree : AvatarConfirmModalStep.Complete);
    onConfirm();
  }, [
    avatar,
    changeFaceFateCard,
    dispatch,
    isFree,
    onConfirm,
  ]);

  const content = useMemo(() => {
    switch (currentStep) {
      case AvatarConfirmModalStep.CompleteFree:
        if (!avatar) {
          return null;
        }

        return (
          <PurchaseResult
            image={avatar}
            isSuccess={isSuccess}
            message={message ?? (isSuccess ? 'Success' : 'Failure')}
            name={avatar}
            onClick={onRequestCloseModalStack}
            type="cameo"
            isFree
          />
        );

      case AvatarConfirmModalStep.Complete:
        if (!avatar) {
          return null;
        }

        return (
          <PurchaseResult
            image={avatar}
            isSuccess={isSuccess}
            message={message ?? (isSuccess ? 'Success' : 'Failure')}
            name={avatar}
            onClick={onRequestCloseModalStack}
            type="cameo"
          />
        );
      default:
        return (
          <ConfirmModalReady
            avatar={avatar}
            changeFaceFateCard={changeFaceFateCard}
            fateCost={fateCost}
            isFree={isFree}
            isOpen={isOpen}
            isSubmitting={isSubmitting}
            onConfirm={handleConfirmPurchase}
            onRequestClose={onRequestClose}
            onRequestCloseModalStack={onRequestCloseModalStack}
          />
        );
    }
  }, [
    avatar,
    changeFaceFateCard,
    currentStep,
    fateCost,
    handleConfirmPurchase,
    isFree,
    isOpen,
    isSubmitting,
    isSuccess,
    message,
    onRequestClose,
    onRequestCloseModalStack,
  ]);

  return (
    <Modal
      isOpen={isOpen}
      onAfterClose={resetState}
      onRequestClose={onRequestClose}
    >
      {content}
    </Modal>
  );
}

type OwnProps = {
  avatar: string | undefined,
  isOpen: boolean,
  onConfirm: () => void,
  onRequestClose: (_args?: any) => void,
  onRequestCloseModalStack: (_args?: any) => void,
};

const mapStateToProps = (state: IAppState) => ({
  changeFaceFateCard: getFaceChangeFateCard(state),
  fateCost: getFaceChangeFateCost(state),
  isFree: getCanChangeFaceForFree(state),
});

export type Props = OwnProps & ReturnType<typeof mapStateToProps> & {
  dispatch: Function, // eslint-disable-line
};

export default connect(mapStateToProps)(ConfirmModal);

/*
export default class ConfirmModal extends Component<Props, State> {
  state = {
    isFree: false,
  };

  componentDidMount = () => {
    // The reason we want isFree to be allowed to go stale is that the criterion on
    // which it's initially based — ownership of a Licence to Amend Your Face —
    // changes over the course of the modal's lifetime (a successful face change removes
    // it). We don't want the result content to suggest to the user that they spent
    // Fate, so we'll let this go stale.
    const { isFree } = this.props;
    this.setState({ isFree });
  };

  renderButtonLabel = () => {
    const {
      fateCost,
      isSubmitting,
    } = this.props;

    const { isFree } = this.state;

    if (isSubmitting) {
      return <Loading spinner small />;
    }

    if (isFree) {
      return 'Select';
    }

    return `${fateCost} Fate`;
  };

  renderContent = () => {
    const {
      avatar,
      fateCost,
      isSuccess,
      message,
      onConfirm,
      onRequestCloseModalStack,
      purchaseComplete,
    } = this.props;

    const { isFree } = this.state;

    if (purchaseComplete) {
      return (
        <PurchaseResult
          image={avatar}
          name={avatar}
          isFree={isFree}
          isSuccess={isSuccess}
          message={message ?? 'Success'}
          onClick={onRequestCloseModalStack}
          type="cameo"
        />
      );
    }

    return (
      <div>
        <h3 className="heading heading--2" style={{ color: '#000' }}>Change your face?</h3>
        <hr />
        <div className="media dialog__media">
          <div className="media__content">
            <div className="media__left">
              <div>
                <Image className="media__object" icon={avatar} alt={avatar} width={78} height={100} type="cameo" />
              </div>
            </div>
            <div className="media__body">
              <p>Are you sure?</p>
              <CostRubric isFree={isFree} fateCost={fateCost} />
            </div>
            <hr />
          </div>
          <div className="dialog__actions">
            <button
              className={classnames(
                'button',
                isFree ? 'button--primary' : 'button--secondary',
              )}
              onClick={onConfirm}
              type="button"
            >
              {this.renderButtonLabel()}
            </button>
          </div>
        </div>
      </div>
    );
  };

  render = () => {
    const { isOpen, onRequestClose } = this.props;

    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
      >
        {this.renderContent()}
      </Modal>
    );
  }
}
 */

/*
type Props = {
  avatar: string,
  fateCost: number,
  isFree: boolean,
  isOpen: boolean,
  isSubmitting: boolean,
  isSuccess: boolean,
  message?: string,
  onConfirm: (...args: any) => void,
  onRequestClose: () => void,
  onRequestCloseModalStack: () => void,
  purchaseComplete: boolean,
};

export function CostRubric({ fateCost, isFree }: Pick<Props, 'fateCost' | 'isFree'>) {
  if (isFree) {
    return <p className="descriptive">Changing your face is free, just this once.</p>;
  }
  return (
    <p className="descriptive">
      {`This will immediately deduct ${fateCost} Fate.`}
    </p>
  );
}
 */
