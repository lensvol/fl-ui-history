import React, { Component } from "react";
import classnames from "classnames";
import { connect } from "react-redux";

import { purchaseItem } from "actions/fate";
import Image from "components/Image";
import Loading from "components/Loading";
import { Success } from "services/BaseMonadicService";
import { IFateCard } from "types/fate";

import PurchaseResult from "./PurchaseResult";

type Props = {
  dispatch: Function; // eslint-disable-line
  onRequestClose: () => void;
  data: IFateCard & { buttons?: any[] };
};

type State = {
  isSuccess?: boolean;
  isSubmitting: boolean;
  message?: string;
  purchaseComplete: boolean;
};

export class PurchaseDefault extends Component<Props, State> {
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
    this.setState({ isSubmitting: true });
    // If we were passed an object with an 'id' value, then it's an activePurchase thing
    // (otherwise it's the onClick event)
    const storeItemId = correspondingActivePurchase.id ?? id;

    const result = await dispatch(purchaseItem({ storeItemId }));
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
    if (!activePurchase.buttons) {
      return (
        <button
          className={classnames(
            "button button--secondary",
            isSubmitting && "button--disabled"
          )}
          onClick={this.handlePurchase}
          type="button"
        >
          {isSubmitting ? <Loading spinner small /> : <span>Purchase</span>}
        </button>
      );
    }

    return activePurchase.buttons.map(
      (button: {
        correspondingActivePurchase: { id: number };
        description: string;
      }) => (
        <button
          key={button.correspondingActivePurchase.id}
          className="button button--primary"
          onClick={() =>
            this.handlePurchase(button.correspondingActivePurchase)
          }
          type="button"
        >
          {button.description}
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
        />
      );
    }

    const price = Array.isArray(activePurchase.price)
      ? activePurchase.price.toString().replace(/,/g, " or ")
      : activePurchase.price;

    return (
      <div>
        <h3 className="heading heading--2" style={{ color: "#000" }}>
          Confirm Purchase
        </h3>
        <hr />
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
              <p>{`You need ${price} Fate for this.`}</p>
            </div>
            <hr />
          </div>
          <div className="dialog__actions">{this.renderButtons()}</div>
        </div>
      </div>
    );
  };
}

export default connect()(PurchaseDefault);
