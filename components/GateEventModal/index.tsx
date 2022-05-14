import buildMessagesObject from 'actions/app/processMessages/buildMessagesObject';
import { handleVersionMismatch } from 'actions/versionSync';
import React from 'react';
import ReactModal from 'react-modal';
import { connect } from 'react-redux';
import { VersionMismatch } from 'services/BaseService';

import {
  fetch as fetchOpportunityCards,
} from 'actions/cards';
import { IGateEvent } from 'types/map';
import {
  beginGateEvent,
  chooseGateEventBranch,
  fetch as fetchMap,
  goBackFromGateEvent,
} from 'actions/map';
import Loading from 'components/Loading/index';

import Available from 'components/GateEventModal/Available';
import In from 'components/GateEventModal/In';
import End from 'components/GateEventModal/End';
import {
  IBranch,
  IEndStorylet,
  IStorylet,
} from 'types/storylet';
import {
  IHasTypeString,
  IMessagesObject,
  ISettingChangeMessage,
} from 'types/app/messages';
import {
  fetchAvailable,
  goBack,
} from 'actions/storylet';
import { processMessages } from 'actions/app';
import { actionsUpdated } from 'actions/actions';
import {
  AREA_CHANGE_MESSAGE,
  SETTING_CHANGE_MESSAGE,
} from 'constants/message-types';
import processSettingChangeMessage from 'actions/app/processMessages/processSettingChangeMessage';
import StoryletService, {
  ApiSecondChance,
  IApiStoryletResponseData,
  IChooseBranchRequestData,
} from 'services/StoryletService';
import ErrorState from './ErrorState';
import SecondChance from './SecondChance';

export interface Props {
  dispatch: Function, // eslint-disable-line @typescript-eslint/ban-types
  isBeingUpdated: boolean,
  isOpen: boolean,
  gateEvent: IGateEvent | undefined,
  onRequestClose: (shouldCloseMap?: boolean) => void,
}

export interface State {
  currentStep: StoryletPhase,
  deferredSettingChangeMessage?: ISettingChangeMessage | undefined,
  didPlayerChangeArea: boolean,
  errorMessage?: string,
  isClosing: boolean,
  isGoingOnwards: boolean,
  isTryingAgain: boolean,
  messages?: IMessagesObject | undefined,
  endStorylet?: IEndStorylet | undefined,
  secondChance?: ApiSecondChance | undefined,
  storylet?: IStorylet | undefined,
}

enum StoryletPhase {
  /* eslint-disable no-shadow */
  Available,
  In,
  End,
  SecondChance,
  Loading,
  Error,
  /* eslint-enable no-shadow */
}

export class GateEventModal extends React.Component<Props, State> {
  mounted = false;

  state: State = {
    currentStep: StoryletPhase.Available,
    deferredSettingChangeMessage: undefined,
    didPlayerChangeArea: false,
    endStorylet: undefined,
    messages: undefined,
    isClosing: false,
    isGoingOnwards: false,
    isTryingAgain: false,
    storylet: undefined,
  };

  componentDidMount(): void {
    this.mounted = true;
  }

  componentDidUpdate(prevProps: Readonly<Props>, _prevState: Readonly<State>, _snapshot?: any): void {
    // If the gate event has changed, it means that something has happened, and we need to update our
    // local state
    const { gateEvent } = this.props;
    if (prevProps.gateEvent === gateEvent) {
      return;
    }
    this.fetchAvailable();
  }

  componentWillUnmount(): void {
    this.mounted = false;
  }

  fetchAvailable = async () => {
    const { dispatch } = this.props;
    this.setState({ currentStep: StoryletPhase.Loading });
    try {
      // We're using a StoryletService directly (rather than dispatch(fetchAvailable()) because
      // we don't want to update global state. We'll clean up after ourselves if the player backs
      // out of the gate event.
      const { data }: { data: IApiStoryletResponseData } = await new StoryletService().fetchAvailable();
      const { phase, storylet } = data;

      // We only know how to handle the In phase of a gate event
      if (phase === 'In') {
        this.setState({ storylet, currentStep: StoryletPhase.In });
      }
    } catch (e) {
      if (e instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(e));
        return;
      }
      throw e;
    }
  };

  handleBegin = async () => {
    const { dispatch, gateEvent } = this.props;
    if (!gateEvent) {
      return;
    }
    this.setState({ currentStep: StoryletPhase.Loading });
    const { data: { isSuccess, message, storylet } } = await dispatch(beginGateEvent(gateEvent.id));
    if (isSuccess) {
      this.setState({ storylet }, () => {
        this.setState({ currentStep: StoryletPhase.In });
      });
      return;
    }
    this.setState({ currentStep: StoryletPhase.Error, errorMessage: message });
  };

  handleChooseBranch = async (branchData: IBranch & IChooseBranchRequestData) => {
    const { dispatch } = this.props;
    this.setState({ currentStep: StoryletPhase.Loading });
    const {
      actions,
      endStorylet,
      phase,
      secondChance,
      messages: unflattenedMessages,
    }: IApiStoryletResponseData = await dispatch(chooseGateEventBranch(branchData));

    // Update actions
    dispatch(actionsUpdated({ actions }));

    // const messages = flattenMessages(unflattenedMessages ?? []);
    const messages = buildMessagesObject(unflattenedMessages ?? []);

    // Don't process setting change messages yet, but get it and defer it
    dispatch(processMessages(messages, [SETTING_CHANGE_MESSAGE]));

    const deferredSettingChangeMessage = [
      ...(messages?.defaultMessages ?? []),
      ...(messages?.standardMessages ?? []),
    ].find(
      ({ type }: IHasTypeString) => type === SETTING_CHANGE_MESSAGE,
    );

    const didPlayerChangeArea = !!(messages?.defaultMessages.find(
      (message: any) => message.type === AREA_CHANGE_MESSAGE,
    ));

    // If we changed area, try fetching opportunity cards now
    if (didPlayerChangeArea) {
      dispatch(fetchOpportunityCards());
    }

    switch (phase) {
      case 'In':
        this.handleGoOnwardsFromEnd();
        return;

      case 'End':
        this.setState(({ storylet: _storylet, ...state }) => ({
          ...state,
          didPlayerChangeArea,
          endStorylet,
          messages,
          currentStep: StoryletPhase.End,
          deferredSettingChangeMessage: (deferredSettingChangeMessage
            ? deferredSettingChangeMessage as ISettingChangeMessage
            : undefined),
        }));
        return;

      case 'SecondChance':
        this.setState(() => ({
          messages,
          secondChance,
          currentStep: StoryletPhase.SecondChance,
        }));
        return; // eslint-disable-line no-useless-return

      default:
        return; // eslint-disable-line no-useless-return
    }
  };

  handleGoBackFromIn = () => {
    // Going back from the In phase means closing the modal
    this.handleRequestClose(false);
  };

  handleGoBackFromSecondChance = async () => {
    const { dispatch } = this.props;
    // We need to go back, then begin the gate event again
    this.setState({ currentStep: StoryletPhase.Loading });
    await dispatch(goBack()); // This takes to the Available phase
    this.handleBegin(); // And now we can behave as though we've just started the gate event
  };

  handleGoBackFromEnd = async () => {
    this.setState({ currentStep: StoryletPhase.Loading });
    await this.handleBegin();
  };

  handleGoOnwardsFromEnd = async () => {
    const { didPlayerChangeArea } = this.state;
    this.setState({ isGoingOnwards: true });
    this.handleRequestClose(didPlayerChangeArea);
    if (this.mounted) {
      // Cherry-pick stale deferred message out of state
      this.setState(({
        deferredSettingChangeMessage: _deferredSettingChangeMessage,
        ...state
      }) => ({ ...state, isGoingOnwards: false }));
    }
  };

  handleOpen = () => {
    this.handleBegin();
  };

  cleanUpBeforeClosing = async () => {
    const { dispatch } = this.props;
    const {
      currentStep,
      deferredSettingChangeMessage,
    } = this.state;

    if (currentStep === StoryletPhase.In || currentStep === StoryletPhase.SecondChance) {
      dispatch(goBackFromGateEvent());
      return;
    }

    if (currentStep === StoryletPhase.End) {
      if (deferredSettingChangeMessage) {
        dispatch(processSettingChangeMessage(deferredSettingChangeMessage));
      }
      await Promise.all([
        dispatch(fetchMap()),
        dispatch(fetchAvailable({ setIsFetching: true })),
      ]);
    }
  };

  handleRequestClose = async (shouldCloseMap?: boolean) => {
    const { onRequestClose } = this.props;
    const { currentStep, isClosing } = this.state;

    if (isClosing) {
      return;
    }

    // Nope. Wait for us to finish, please.
    if (currentStep === StoryletPhase.Loading) {
      return;
    }

    this.setState({ isClosing });

    await this.cleanUpBeforeClosing();

    this.setState(({
      storylet: _storylet,
      endStorylet: _endStorylet,
      deferredSettingChangeMessage: _deferredSettingChangeMessage,
      ...state
    }) => ({
      ...state,
      currentStep: StoryletPhase.Available,
      isClosing: false,
    }));

    onRequestClose(shouldCloseMap);
  };

  renderContent = () => {
    const { gateEvent, isBeingUpdated } = this.props;
    const {
      currentStep,
      endStorylet,
      errorMessage,
      isGoingOnwards,
      isTryingAgain,
      messages,
      secondChance,
      storylet,
    } = this.state;

    if (isBeingUpdated) {
      return <Loading spinner />;
    }

    switch (currentStep) {
      case StoryletPhase.Available: {
        if (!gateEvent) {
          return null;
        }
        return (
          <Available
            gateEvent={gateEvent}
            onClick={this.handleBegin}
          />
        );
      }
      case StoryletPhase.In: {
        if (!storylet) {
          return null;
        }
        return (
          <In
            storylet={storylet}
            onGoBack={this.handleGoBackFromIn}
            onChooseBranch={this.handleChooseBranch}
          />
        );
      }

      case StoryletPhase.SecondChance:
        return (
          <SecondChance
            messages={messages}
            onChooseBranch={this.handleChooseBranch}
            onGoBack={this.handleGoBackFromSecondChance}
            secondChance={secondChance}
            storylet={storylet}
          />
        );

      case StoryletPhase.End: {
        if (!(endStorylet && messages)) {
          return null;
        }
        return (
          <End
            endStorylet={endStorylet}
            isGoingOnwards={isGoingOnwards}
            isTryingAgain={isTryingAgain}
            messages={messages}
            onGoOnwards={this.handleGoOnwardsFromEnd}
            onTryAgain={this.handleGoBackFromEnd}
          />
        );
      }

      case StoryletPhase.Error: {
        if (!errorMessage) {
          return null;
        }
        return <ErrorState message={errorMessage} />;
      }

      case StoryletPhase.Loading:
      default:
        return <Loading spinner />;
    }
  };

  render() {
    const { gateEvent, isOpen } = this.props;

    if (!gateEvent) {
      return null;
    }

    return (
      <ReactModal
        overlayClassName="modal--tooltip-like__overlay modal--gate-storylet__overlay"
        className="modal--gate-storylet__content"
        isOpen={isOpen}
        onRequestClose={_ => this.handleRequestClose()}
        style={{
          overlay: {
            touchAction: 'none',
          },
          content: {
            backgroundImage: 'https://images.fallenlondon.com/static/bg-paper-dark.png',
            touchAction: 'pan-x pan-y',
          },
        }}
        onAfterOpen={this.handleOpen}
      >
        {this.renderContent()}
      </ReactModal>
    );
  }
}

export default connect()(GateEventModal);
