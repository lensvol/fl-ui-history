import React, { Component } from 'react';

import Modal from 'components/Modal';
import ShareDialogContent from './ShareDialogContent';
import { LOADING, READY, SHARE_COMPLETE } from './constants';


interface Props {
  borderColour?: string,
  data: {
    description: string,
    name: string,
    image: string,
  },
  isOpen: boolean,
  isSharing: boolean,
  onRequestClose: Function,
  onSubmit: Function,
  shareMessageResponse?: string,
}

interface State {
  currentStep: string,
  title?: string,
}

const INITIAL_STATE: State = {
  currentStep: LOADING,
  title: undefined,
};

export class ShareDialogContainer extends Component<Props, State> {
  static displayName = 'ShareDialogContainer';

  mounted = false;

  state = { ...INITIAL_STATE };

  componentDidMount = () => {
    this.mounted = true;
  };

  componentWillUnmount = () => {
    this.mounted = false;
  };

  handleAfterOpen = () => {
    const { data } = this.props;
    this.setState({
      currentStep: READY,
      title: (data && data.name) ? data.name : '',
    });
  };

  handleChange = () => {
  };

  handleRequestClose = () => {
    const { onRequestClose } = this.props;
    this.setState({ ...INITIAL_STATE });
    onRequestClose();
  };

  handleSubmit = async ({ title }: any) => {
    const { onSubmit } = this.props;
    await onSubmit(title);
    this.setStateIfMounted({ currentStep: SHARE_COMPLETE });
  };

  setStateIfMounted = (state: Partial<State>) => {
    if (this.mounted) {
      this.setState({ ...this.state, ...state });
    }
  };

  render = () => {
    const {
      borderColour,
      data,
      isOpen,
      isSharing,
      shareMessageResponse,
    } = this.props;
    const { currentStep, title } = this.state;

    return (
      <Modal
        isOpen={isOpen}
        onAfterOpen={this.handleAfterOpen}
        onRequestClose={this.handleRequestClose}
        overlayClassName="modal--share-dialog__overlay"
      >
        <ShareDialogContent
          borderColour={borderColour}
          data={data}
          isSharing={isSharing}
          onChange={this.handleChange}
          onSubmit={this.handleSubmit}
          shareMessageResponse={shareMessageResponse}
          step={currentStep}
          title={title}
        />
      </Modal>
    );
  }
}

ShareDialogContainer.displayName = 'ShareDialogContainer';

export default ShareDialogContainer;