import * as MessageActions from "actions/messages";
import classnames from "classnames";
import MessageNotificationConstants from "constants/messageNotificationConstants";
import React, { useCallback, useMemo } from "react";
import { connect, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { IAppState } from "types/app";

function FooterLink({
  className,
  current,
  highlightAlso,
  messagesChanged,
  role,
  title,
  to,
}: Props) {
  const dispatch = useDispatch();

  const classes = classnames("fl-ico fl-ico-2x", className);

  const onClick = useCallback(() => {
    if (to === MessageNotificationConstants.messagesPathName) {
      dispatch(MessageActions.clearNotification());
    }
  }, [dispatch, to]);

  const liClass = useMemo(
    () =>
      classnames(
        "footer-menu__item",
        (current === to || current === highlightAlso) && "active",
        to === MessageNotificationConstants.messagesPathName &&
          messagesChanged &&
          "notifying"
      ),
    [current, highlightAlso, messagesChanged, to]
  );

  return (
    <li className={liClass} data-name={title.toLowerCase()} role={role}>
      <Link onClick={onClick} to={to} title={title}>
        <i className={classes} />
        <span className="u-visually-hidden">{title}</span>
      </Link>
    </li>
  );
}

const mapStateToProps = ({ messages: { isChanged } }: IAppState) => ({
  messagesChanged: isChanged,
});

interface OwnProps {
  className?: string;
  current: string;
  highlightAlso?: string;
  role: string;
  title: string;
  to: string;
}

type Props = ReturnType<typeof mapStateToProps> & OwnProps;

export default connect(mapStateToProps)(FooterLink);
