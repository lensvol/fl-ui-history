import React from "react";
import classnames from "classnames";
import { connect, useDispatch } from "react-redux";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";

import * as MessageActions from "actions/messages";
import MessageNotificationConstants from "constants/messageNotificationConstants";
import { IAppState } from "types/app";

const mapStateToProps = ({ messages: { isChanged } }: IAppState) => ({
  messagesChanged: isChanged,
});

type OwnProps = {
  children: React.ReactNode;
  id: string;
  name: string;
  onSelect: () => void;
  to: string;
};

type Props = OwnProps &
  ReturnType<typeof mapStateToProps> &
  RouteComponentProps;

export function Tab({
  id,
  children,
  history,
  location,
  messagesChanged,
  name,
  to,
  onSelect: parentOnSelect,
}: Props) {
  const dispatch = useDispatch();

  const {
    location: { pathname },
  } = history;

  const onSelect =
    location.pathname === MessageNotificationConstants.messagesPathName
      ? () => {
          dispatch(MessageActions.clearNotification());
        }
      : parentOnSelect;

  const activeLabel = pathname === "/" ? "/" : pathname.replace("/", "");

  const tabClass = classnames({
    nav__item: true,
    active: activeLabel === id,
    notifying:
      to === MessageNotificationConstants.messagesLinkTo && messagesChanged,
  });

  return (
    <li
      className={tabClass}
      data-name={name}
      onClick={onSelect}
      onKeyUp={onSelect}
      role="tab"
    >
      <Link className={classnames(onSelect && "cursor-pointer")} to={to}>
        {children}
      </Link>
    </li>
  );
}

export default withRouter(connect(mapStateToProps)(Tab));
