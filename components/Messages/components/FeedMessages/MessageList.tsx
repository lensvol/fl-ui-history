import React, { useCallback } from "react";
import { IAppState } from "types/app";
import Loading from "components/Loading";
import Message from "../Message";
import { connect } from "react-redux";
import Dialog from "components/Dialog";
import * as MessageActions from "actions/messages";
import { ThunkDispatch } from "redux-thunk";

export function MessageList({
  messages,
  dispatch,
  dialogOpen,
  dialogHeader,
  dialogMessage,
}: Props) {
  const closeDialog = useCallback(
    () => dispatch(MessageActions.closeDialog()),
    [dispatch]
  );

  if (!messages) {
    return <Loading />;
  }
  if (messages.length) {
    return (
      <div>
        {messages.map((message) => (
          <Message key={message.relatedId} data={message} />
        ))}

        {dialogOpen && (
          <Dialog isOpen={dialogOpen} onRequestClose={closeDialog}>
            <div>
              <h2 className="travel__message heading heading--1">
                {dialogHeader}
              </h2>
              <p>{dialogMessage}</p>
            </div>
          </Dialog>
        )}
      </div>
    );
  }
  return <p>No messages</p>;
}

type OwnProps = {
  messages: any[];
  dispatch: ThunkDispatch<any, any, any>;
};

const mapStateToProps = (state: IAppState) => ({
  dialogOpen: state.messages.dialogOpen,
  dialogHeader: state.messages.dialogHeader,
  dialogMessage: state.messages.dialogMessage,
});

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(MessageList);
