import * as MessageActions from "actions/messages";
import classnames from "classnames";
import MessageNotificationConstants from "constants/messageNotificationConstants";
import { useAppSelector } from "features/app/store";
import React, { useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { UIRestriction } from "types/myself";

interface OwnProps {
  className?: string;
  current: string;
  highlightAlso?: string;
  role: string;
  title: string;
  to: string;
  uiRestriction?: UIRestriction;
}

export default function FooterLink({
  className,
  current,
  highlightAlso,
  role,
  title,
  to,
  uiRestriction,
}: OwnProps) {
  const dispatch = useDispatch();
  const messagesChanged = useAppSelector((s) => s.messages.isChanged);
  const uiRestrictions = useAppSelector((s) => s.myself.uiRestrictions);

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

  const shouldShowUI =
    !uiRestriction ||
    !uiRestrictions?.find((restriction) => restriction === uiRestriction);

  return (
    <li className={liClass} data-name={title.toLowerCase()} role={role}>
      {shouldShowUI && (
        <Link onClick={onClick} to={to} title={title}>
          <i className={classes} />
          <span className="u-visually-hidden">{title}</span>
        </Link>
      )}
    </li>
  );
}
