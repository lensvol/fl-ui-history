import React from 'react';
import { connect } from 'react-redux';
import { IAppState } from 'types/app';

import FeedMessageControls from './FeedMessageControls';
import MessageList from './MessageList';

export function FeedMessagesComponent(props: Props) {
  const {
    messages,
    title,
    type,
  } = props;
  return (
    <div
      className="message"
      style={{ marginBottom: '10px' }}
    >
      <h1
        className="heading heading--1 messages__heading"
        style={{ display: 'flex', justifyContent: 'space-between' }}
      >
        {title}
        {type !== 'feedMessages' && (
          <FeedMessageControls />
        )}
      </h1>
      <MessageList messages={messages} />
    </div>
  );
}

type OwnProps = {
  title: string,
  type: 'feedMessages' | 'interactions',
};

const mapStateToProps = ({ messages }: IAppState, { type }: OwnProps) => ({ messages: messages[type] });

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(FeedMessagesComponent);