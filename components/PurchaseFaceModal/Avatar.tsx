import React from "react";

import Image from "components/Image";

export default function Avatar({
  avatar,
  onClick,
}: {
  avatar: string;
  onClick: (avatar: string) => void;
}) {
  return (
    <Image
      alt={avatar}
      height={100}
      icon={avatar}
      onClick={() => onClick(avatar)}
      type="cameo"
      className="avatar-list__image"
    />
  );
}

/*
type State = {
  isConfirmModalOpen: boolean,
  isSubmitting: boolean,
  isSuccess: boolean,
  message: string | undefined,
  purchaseComplete: boolean,
};

export class Avatar extends Component<Props, State> {
  state = {
    isConfirmModalOpen: false,
    isSubmitting: false,
    isSuccess: false,
    message: undefined,
    purchaseComplete: false,
  };

  makeRequest = async (req: any) => {
    const { avatar, dispatch, isFree } = this.props;

    let result: Either<SetAvatarImageResponse> | undefined;

    // If changing our face is free, use setAvatarImage
    if (isFree) {
      result = dispatch(setAvatarImage(req));
    } else {
      // Otherwise, use purchaseItem
      result = await dispatch(purchaseItem(req));
    }

    if (result instanceof Success) {
      dispatch(newAvatarImage(avatar));
    }

    return result;
  };

  handleCloseModalStack = () => {
    const { onRequestClose } = this.props;
    this.handleCloseConfirmModal();
    onRequestClose?.();
  };

  handleCloseConfirmModal = () => {
    this.setState({ isConfirmModalOpen: false });
  };

  handleConfirm = async () => {
    const {
      activePurchase,
      dispatch,
      isFree,
      avatar: avatarImage,
    } = this.props;
    const { isSubmitting } = this.state;

    if (isSubmitting) {
      return;
    }

    this.setState({ isSubmitting: true });

    // The endpoint and the data we need to send vary depending on whether this face change
    // is free or costs Fate
    const data = isFree ? { avatarImage } : { avatarImage, storeItemId: activePurchase.id };
    let message: string | undefined;

    const result = await this.makeRequest(data);

    const isSuccess: boolean = result instanceof Success;

    if (result instanceof Success) {
      message = result.data.message; // eslint-disable-line prefer-destructuring
    } else {
      message = result?.message;
    }

    // If we spent our Licence to Amend Your Face, then we should re-fetch Fate,
    // but we don't need to await it
    dispatch(fetchFate());

    // Update our local state
    this.setState({
      isSuccess,
      message,
      isSubmitting: false,
      purchaseComplete: true,
    });
  };

  handleImageClick = () => {
    const { disabled } = this.props;
    if (!disabled) {
      this.setState({ isConfirmModalOpen: true });
    }
  };

  render = () => {
    const { avatar, isFree, fateCost } = this.props;
    const {
      isConfirmModalOpen,
      isSubmitting,
      isSuccess,
      purchaseComplete,
      message,
    } = this.state;
    return (
      <Fragment>
        <Image
          alt={avatar}
          height={100}
          icon={avatar}
          onClick={this.handleImageClick}
          type="cameo"
        />
        <ConfirmModal
          avatar={avatar}
          fateCost={fateCost}
          isFree={isFree}
          isOpen={isConfirmModalOpen}
          isSubmitting={isSubmitting}
          isSuccess={isSuccess}
          message={message}
          onConfirm={this.handleConfirm}
          onRequestClose={this.handleCloseConfirmModal}
          onRequestCloseModalStack={this.handleCloseModalStack}
          purchaseComplete={purchaseComplete}
        />
      </Fragment>
    );
  }
}

type Props = {
  activePurchase: any,
  avatar: string,
  disabled: boolean,
  dispatch: Function, // eslint-disable-line
  fateCost: number,
  isFree: boolean,
  onRequestClose: (_args?: any) => void,
};

 */

// export default connect()(Avatar);
