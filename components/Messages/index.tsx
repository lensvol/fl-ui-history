import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';

import * as MessageActions from 'actions/messages';
import { setTab } from 'actions/subtabs';
import { IAppState } from 'types/app';

import MediaSmDown from '../Responsive/MediaSmDown';
import MediaMdUp from '../Responsive/MediaMdUp';
import Dialog from '../Dialog';

import FeedMessages from './components/FeedMessages';
import InnerTabs from './components/InnerTabs';

function Messages({
  dialogMessage,
  dialogOpen,
  dispatch,
  subtab,
}: Props) {
  const clearNotifications = useCallback(() => dispatch(MessageActions.clearNotification()), [dispatch]);

  const closeDialog = useCallback(() => dispatch(MessageActions.closeDialog()), [dispatch]);

  const switchTab = useCallback(newSubtab => dispatch(setTab({ subtab: newSubtab, tab: 'messages' })), [dispatch]);

  return (
    <div onClick={clearNotifications}>
      <MediaSmDown>
        <InnerTabs
          activeTab={subtab}
          onChange={switchTab}
        />
        <div className="messages">
          <FeedMessages type={subtab} />
        </div>
      </MediaSmDown>

      <MediaMdUp>
        <div className="messages">
          <FeedMessages type="interactions" />
          <FeedMessages type="feedMessages" />
        </div>
      </MediaMdUp>

      {dialogOpen && (
        <Dialog isOpen={(dialogOpen)} onRequestClose={closeDialog}>
          <div>
            <h1 className="travel__message heading heading--1">Warning!</h1>
            <p>{dialogMessage}</p>
          </div>
        </Dialog>
      )}
    </div>
  );
}

Messages.displayName = 'Messages';

const mapStateToProps = (state: IAppState) => ({
  dialogMessage: state.messages.dialogMessage,
  dialogOpen: state.messages.dialogOpen,
  subtab: state.subtabs.messages,
});

type Props = ReturnType<typeof mapStateToProps> & {
  dispatch: ThunkDispatch<any, any, any>,
}

export default withRouter(connect(mapStateToProps)(Messages));