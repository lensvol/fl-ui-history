import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { IAppState } from "types/app";

import scrollToComponent from "utils/scrollToComponent";

import {
  fetchAvailableItems,
  fetchExchange,
  selectStore,
} from "actions/exchange";

import getQuantities from "selectors/exchange/getQuantities";
import getShopList from "selectors/exchange/getShopList";

import Loading from "components/Loading";

import BazaarUnavailableMessage from "./components/BazaarUnavailableMessage";
import BazaarDialog from "./components/BazaarDialog";
import ExchangeComponent from "./ExchangeComponent";
import ExchangeContext from "./ExchangeContext";

type State = {
  activeItem: any | null;
  filterString: string;
  isModalOpen: boolean;
};

type OwnProps = {
  dispatch: Function;
};

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

class ExchangeContainer extends Component<Props, State> {
  static displayName = "ExchangeContainer";

  state: State = {
    activeItem: null,
    filterString: "",
    isModalOpen: false,
  };

  /**
   * Component Did Mount
   * @return {undefined}
   */
  componentDidMount = () => {
    const { activeStore, dispatch, isFetchingAvailable } = this.props;
    // Don't fetch while fetching
    if (isFetchingAvailable) {
      return;
    }

    // Fetch the exchange, then go get stuff for the active store
    dispatch(fetchExchange()).then(() =>
      dispatch(fetchAvailableItems(activeStore))
    );
  };

  handleJumpToTop = () => {
    // TODO: we probably shouldn't use dqs here (should rely on refs instead)
    const header = document.querySelector(".exchange__title");
    scrollToComponent(header, { offset: 0, align: "top" });
  };

  handleSearchFieldChange = (evt: { currentTarget: { value: string } }) => {
    this.setState({ filterString: evt.currentTarget.value });
  };

  /**
   * Handle store select
   */
  handleStoreSelect = (se: any) => {
    const { dispatch } = this.props;

    // We may be passed either a store object or an event,
    // because we might be coming here from either the sticky menu
    // (on large displays) or the select menu (on small ones)
    if (typeof se === "object" && se !== null) {
      if ("id" in se) {
        if (se.id === "jump-to-top") {
          return this.handleJumpToTop();
        }
        return dispatch(selectStore(se.id));
      }
      // If we can't parse the target as an integer, coerce it to 'null'
      // (a non-integer shop ID means 'Sell my things')
      return dispatch(selectStore(parseInt(se.target.value, 10) || "null"));
    }
    return undefined;
  };

  /**
   * Open Bazaar dialog
   * @param  {Object} item
   * @return {undefined}
   */
  openBazaarDialog = (item: any) => {
    this.setState({
      activeItem: item,
      isModalOpen: true,
    });
  };

  /**
   * closeDialog
   * @return {undefined}
   */
  closeBazaarDialog = () => {
    this.setState({ isModalOpen: false });
  };

  handleAfterCloseModal = () => {
    this.setState({ activeItem: null });
  };

  render() {
    const {
      // activeItem,
      isAvailable,
      isFetching,
      quantities,
      shopList,
    } = this.props;

    const { activeItem, filterString, isModalOpen } = this.state;

    if (isFetching) {
      return <Loading />;
    }

    if (!isAvailable) {
      return <BazaarUnavailableMessage />;
    }

    return (
      <ExchangeContext.Provider
        value={{
          activeItem,
          onStartTransaction: this.openBazaarDialog,
        }}
      >
        <Fragment>
          <ExchangeComponent
            filterString={filterString}
            onSearchFieldChange={this.handleSearchFieldChange}
            onStoreSelect={this.handleStoreSelect}
            quantities={quantities}
            shopList={shopList}
          />
          <BazaarDialog
            activeItem={activeItem}
            onRequestClose={this.closeBazaarDialog}
            isOpen={isModalOpen}
          />
        </Fragment>
      </ExchangeContext.Provider>
    );
  }
}

const mapStateToProps = (state: IAppState) => {
  const { exchange } = state;
  const { activeStore, isAvailable, isFetching, isFetchingAvailable } =
    exchange;
  return {
    activeStore,
    isAvailable,
    isFetching,
    isFetchingAvailable,
    quantities: getQuantities(state),
    shopList: getShopList(state),
  };
};

export default connect(mapStateToProps)(ExchangeContainer);
