import React from "react";

import { connect, useDispatch } from "react-redux";

import { Link, RouteComponentProps, withRouter } from "react-router-dom";

import classnames from "classnames";

import { clearAgentsNotification } from "actions/agents/fetchAgents";
import * as MessageActions from "actions/messages";

import { IAppState } from "types/app";

const mapStateToProps = ({ agents, messages }: IAppState) => ({
  agentsChanged: agents.hasNotification,
  messagesChanged: messages.isChanged,
});

type OwnProps = {
  children: React.ReactNode;
  id: string;
  name: string;
  to: string;
};

type Props = OwnProps &
  ReturnType<typeof mapStateToProps> &
  RouteComponentProps;

export function Tab({
  agentsChanged,
  children,
  history,
  id,
  messagesChanged,
  name,
  to,
}: Props) {
  const dispatch = useDispatch();

  const {
    location: { pathname },
  } = history;

  const isNotifying =
    (name === "messages" && messagesChanged) ||
    (name === "agents" && agentsChanged);

  const clearMessages = () => {
    dispatch(MessageActions.clearNotification());
  };

  const clearAgentsNotifying = () => {
    dispatch(clearAgentsNotification());
  };

  const noOp = () => {};

  const onSelect =
    name === "messages"
      ? clearMessages
      : name === "agents"
        ? clearAgentsNotifying
        : noOp;

  const activeLabel = pathname === "/" ? "/" : pathname.replace("/", "");

  const tabClass = classnames({
    nav__item: true,
    active: activeLabel === id,
    notifying: isNotifying && activeLabel !== id,
  });

  return (
    <li
      className={tabClass}
      data-name={name}
      onClick={onSelect}
      onKeyUp={onSelect}
      role="tab"
    >
      <Link className="cursor-pointer" to={to}>
        {children}
      </Link>
    </li>
  );
}

export default withRouter(connect(mapStateToProps)(Tab));
