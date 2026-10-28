import React, { useCallback } from "react";

import { useDispatch } from "react-redux";

import { Link, useHistory } from "react-router-dom";

import classnames from "classnames";

import { clearAgentsNotification } from "actions/agents/fetchAgents";
import { clearNotification } from "actions/messages";

import { useAppSelector } from "features/app/store";

type Props = {
  children: React.ReactNode;
  id: string;
  name: string;
  to: string;
};

export default function Tab({ children, id, name, to }: Props) {
  const dispatch = useDispatch();
  const history = useHistory();

  const hasAgentTabAlert = useAppSelector(
    (state) => state.agents.hasNotification
  );
  const hasMessageTabAlert = useAppSelector(
    (state) => state.messages.hasMessageTabAlert
  );

  const {
    location: { pathname },
  } = history;

  const isNotifying =
    (name === "messages" && hasMessageTabAlert) ||
    (name === "agents" && hasAgentTabAlert);

  const onSelect = useCallback(() => {
    if (name === "messages") {
      dispatch(clearNotification());
    } else if (name === "agents") {
      dispatch(clearAgentsNotification());
    } else {
      // no-op
    }
  }, [dispatch, name]);

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

Tab.displayName = "Tab";
