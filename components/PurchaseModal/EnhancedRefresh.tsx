import React, { Component } from "react";

import { connect } from "react-redux";

import { purchaseItem } from "actions/fate";

import classnames from "classnames";

import Image from "components/Image";
import Loading from "components/Loading";
import PurchaseResult from "components/PurchaseModal/PurchaseResult";

import { Success } from "services/BaseMonadicService";

import { IFateCard } from "types/fate";

type Props = {
  dispatch: Function; // eslint-disable-line
  onRequestClose: () => void;
  data: IFateCard & {
    buttons?: any[];
    remainingActionRefreshes?: number;
  };
};

type State = {
  isSuccess?: boolean;
  isSubmitting: boolean;
  message?: string;
  purchaseComplete: boolean;
};

export class EnhancedRefresh extends Component<Props, State> {
  state: State = {
    isSubmitting: false,
    purchaseComplete: false,
  };

  handlePurchase = async (correspondingActivePurchase: any) => {
    const {
      dispatch,
      data: { id },
    } = this.props;

    const { isSubmitting } = this.state;

    if (isSubmitting) {
      return;
    }

    this.setState({
      isSubmitting: true,
    });

    // If we were passed an object with an 'id' value, then it's an activePurchase thing
    // (otherwise it's the onClick event)
    const storeItemId = correspondingActivePurchase.id ?? id;

    const result = await dispatch(
      purchaseItem({
        storeItemId,
      })
    );

    const isSuccess = result instanceof Success;

    let message;

    if (result instanceof Success) {
      ({ message } = result.data);
    } else {
      ({ message } = result);
    }

    this.setState({
      isSuccess,
      message,
      isSubmitting: false,
      purchaseComplete: true,
    });
  };

  renderButtons = () => {
    const { data: activePurchase } = this.props;

    const { isSubmitting } = this.state;

    return activePurchase.buttons?.map(
      (button: {
        correspondingActivePurchase: {
          id: number;
        };
        description: string;
      }) => (
        <button
          key={button.correspondingActivePurchase.id}
          className={classnames(
            "button button--ef",
            isSubmitting && "button--disabled"
          )}
          onClick={() =>
            this.handlePurchase(button.correspondingActivePurchase)
          }
          type="button"
        >
          {isSubmitting ? <Loading spinner small /> : <>{button.description}</>}
        </button>
      )
    );
  };

  render = () => {
    const { onRequestClose, data: activePurchase } = this.props;

    const { purchaseComplete, isSuccess, message } = this.state;

    const { image, name } = activePurchase;

    if (purchaseComplete) {
      return (
        <PurchaseResult
          image={image}
          name={name}
          isSuccess={isSuccess}
          message={message ?? ""}
          onClick={onRequestClose}
          isActionRefresh
        />
      );
    }

    const remainingActionRefreshes =
      this.props.data.remainingActionRefreshes ?? 0;

    return (
      <>
        <div className="media dialog__media">
          <div className="media__content">
            <div className="media__left">
              <div>
                <Image
                  className="media__object"
                  icon={activePurchase.image}
                  alt={activePurchase.name}
                  width={78}
                  height={100}
                  type="icon"
                />
              </div>
            </div>
            <div className="media__body">
              <h3 className="heading heading--3">{activePurchase.name}</h3>
              <p
                dangerouslySetInnerHTML={{ __html: activePurchase.description }}
              />
              <p>
                <span className="enhanced-text">
                  {remainingActionRefreshes}
                </span>{" "}
                Enhanced refresh{remainingActionRefreshes !== 1 && "es"}{" "}
                available
              </p>
            </div>
            <hr />
          </div>
          <div className="dialog__actions">{this.renderButtons()}</div>
        </div>
      </>
    );
  };
}

export default connect()(EnhancedRefresh);
