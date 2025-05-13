import React, { useCallback, useMemo } from "react";

import { connect, DispatchProp } from "react-redux";

import { withRouter, RouteComponentProps } from "react-router-dom";

import classnames from "classnames";

import { clearAgentsNotification } from "actions/agents/fetchAgents";
import { setTab } from "actions/subtabs";

import { IAppState } from "types/app";
import { UIRestriction } from "types/myself";

function InnerTabs({
  agentsChanged,
  dispatch,
  history,
  showAgentsUI,
  showPossessionsUI,
  subtab,
}: Props) {
  const goToMyself = useCallback(() => {
    setTab({
      tab: "myself",
      subtab: "myself",
    })(dispatch);

    history.push("/myself");
  }, [dispatch, history]);

  const goToPossessions = useCallback(() => {
    setTab({
      tab: "myself",
      subtab: "possessions",
    })(dispatch);

    history.push("/possessions");
  }, [dispatch, history]);

  const goToAgents = useCallback(() => {
    dispatch(clearAgentsNotification());

    setTab({
      tab: "myself",
      subtab: "agents",
    })(dispatch);

    history.push("/agents");
  }, [dispatch, history]);

  const myselfClass = useMemo(
    () =>
      classnames({
        "inner-tab": true,
        "inner-tab--with-border": true,
        "inner-tab--active": subtab === "myself",
      }),
    [subtab]
  );

  const possessionsClass = useMemo(
    () =>
      classnames({
        "inner-tab": true,
        "inner-tab--with-border": showAgentsUI,
        "inner-tab--active": subtab === "possessions",
      }),
    [showAgentsUI, subtab]
  );

  const agentsClass = useMemo(
    () =>
      classnames({
        "inner-tab": true,
        "inner-tab--active": subtab === "agents",
        notifying: agentsChanged && subtab !== "agents",
      }),
    [agentsChanged, subtab]
  );

  if (!showPossessionsUI) {
    return null;
  }

  return (
    <div className={showAgentsUI ? "inner-tabs-3" : "inner-tabs-2"}>
      <button
        className={myselfClass}
        onClick={goToMyself}
        role="tab"
        type="button"
      >
        <i className="fl-ico fl-ico-2x fl-ico-myself inner-tab__icon" />
        <div className="inner-tab__label">Myself</div>
      </button>

      <button
        className={possessionsClass}
        onClick={goToPossessions}
        role="tab"
        type="button"
      >
        <i className="fl-ico fl-ico-2x fl-ico-inventory inner-tab__icon" />
        <div className="inner-tab__label">Possessions</div>
      </button>

      {showAgentsUI && (
        <button
          className={agentsClass}
          onClick={goToAgents}
          role="tab"
          type="button"
        >
          <i className="fl-ico fl-ico-2x fl-ico-agents inner-tab__icon" />
          <div className="inner-tab__label">Agents</div>
        </button>
      )}
    </div>
  );
}

const mapStateToProps = ({
  agents,
  myself: { uiRestrictions },
  subtabs: { myself: subtab },
}: IAppState) => ({
  agentsChanged: agents.hasNotification,
  showAgentsUI: !uiRestrictions?.find(
    (restriction) => restriction === UIRestriction.Agents
  ),
  showPossessionsUI: !uiRestrictions?.find(
    (restriction) => restriction === UIRestriction.Possessions
  ),
  subtab,
});

type Props = DispatchProp &
  RouteComponentProps &
  ReturnType<typeof mapStateToProps>;

export default withRouter(connect(mapStateToProps)(InnerTabs));
