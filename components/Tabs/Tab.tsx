import React from "react";

import { connect, useDispatch } from "react-redux";

import { Link, RouteComponentProps, withRouter } from "react-router-dom";

import classnames from "classnames";

import * as MessageActions from "actions/messages";

import { IAppState } from "types/app";

const mapStateToProps = ({ messages }: IAppState) => ({
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
  id,
  children,
  history,
  messagesChanged,
  name,
  to,
}: Props) {
  const dispatch = useDispatch();

  const {
    location: { pathname },
  } = history;

  const isNotifying = name === "messages" && messagesChanged;

  const clearMessages = () => {
    dispatch(MessageActions.clearNotification());
  };

  const noOp = () => {};

  const onSelect = name === "messages" ? clearMessages : noOp;

  const activeLabel = pathname === "/" ? "/" : pathname.replace("/", "");

  const tabClass = classnames({
    nav__item: true,
    active: activeLabel === id,
    notifying: isNotifying,
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
