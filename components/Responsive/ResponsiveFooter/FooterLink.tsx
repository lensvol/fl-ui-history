import React, { useCallback, useMemo } from "react";

import { useDispatch } from "react-redux";

import { Link } from "react-router-dom";

import classnames from "classnames";

import { clearNotification } from "actions/messages";

import MessageNotificationConstants from "constants/messageNotificationConstants";

import { useAppSelector } from "features/app/store";

import { UIRestriction } from "types/myself";

interface Props {
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
}: Props) {
  const dispatch = useDispatch();

  const hasMessageTabAlert = useAppSelector(
    (state) => state.messages.hasMessageTabAlert
  );
  const uiRestrictions = useAppSelector((state) => state.myself.uiRestrictions);

  const classes = classnames("fl-ico fl-ico-2x", className);

  const onClick = useCallback(() => {
    if (to === MessageNotificationConstants.messagesPathName) {
      dispatch(clearNotification());
    }
  }, [dispatch, to]);

  const liClass = useMemo(
    () =>
      classnames(
        "footer-menu__item",
        (current === to || current === highlightAlso) && "active",
        to === MessageNotificationConstants.messagesPathName &&
          hasMessageTabAlert &&
          "notifying"
      ),
    [current, hasMessageTabAlert, highlightAlso, to]
  );

  const shouldShowUI =
    !uiRestriction ||
    uiRestrictions === undefined ||
    !uiRestrictions.find((restriction) => restriction === uiRestriction);

  return (
    <li className={liClass} data-name={title.toLowerCase()} role={role}>
      {shouldShowUI && (
        <Link onClick={onClick} title={title} to={to}>
          <i className={classes} />

          <span className="u-visually-hidden">{title}</span>
        </Link>
      )}
    </li>
  );
}

FooterLink.displayName = "FooterLink";
