import React, { useCallback, useMemo } from "react";
import classnames from "classnames";
import { connect, DispatchProp } from "react-redux";
import { withRouter, RouteComponentProps } from "react-router-dom";

import { setTab } from "actions/subtabs";
import { IAppState } from "types/app";
import { UIRestriction } from "types/myself";

function InnerTabs({ dispatch, history, subtab, showPossessionsUI }: Props) {
  const goToMyself = useCallback(() => {
    setTab({ tab: "myself", subtab: "myself" })(dispatch);
    history.push("/myself");
  }, [dispatch, history]);

  const goToPossessions = useCallback(() => {
    setTab({ tab: "myself", subtab: "possessions" })(dispatch);
    history.push("/possessions");
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
        "inner-tab--active": subtab === "possessions",
      }),
    [subtab]
  );

  if (!showPossessionsUI) {
    return null;
  }

  return (
    <div className="inner-tabs">
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
    </div>
  );
}

const mapStateToProps = ({
  subtabs: { myself: subtab },
  myself: { uiRestrictions },
}: IAppState) => ({
  subtab,
  showPossessionsUI: !uiRestrictions?.find(
    (restriction) => restriction === UIRestriction.Possessions
  ),
});

type Props = DispatchProp &
  RouteComponentProps &
  ReturnType<typeof mapStateToProps>;

export default withRouter(connect(mapStateToProps)(InnerTabs));
