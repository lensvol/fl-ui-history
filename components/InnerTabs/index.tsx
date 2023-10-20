import React, { useCallback, useMemo } from "react";
import classnames from "classnames";
import { connect, DispatchProp } from "react-redux";
import { withRouter, RouteComponentProps } from "react-router-dom";

import { setTab } from "actions/subtabs";
import { IAppState } from "types/app";

function InnerTabs({ dispatch, history, subtab }: Props) {
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

const mapStateToProps = ({ subtabs: { myself: subtab } }: IAppState) => ({
  subtab,
});

type Props = DispatchProp &
  RouteComponentProps &
  ReturnType<typeof mapStateToProps>;

export default withRouter(connect(mapStateToProps)(InnerTabs));

/*
class InnerTabs extends React.Component {
  goToMyself = () => {
    const { dispatch, history } = this.props;
    dispatch(setTab({ tab: 'myself', subtab: 'myself' }));
    history.push('/myself');
  }

  goToPossessions = () => {
    const { dispatch, history } = this.props;
    dispatch(setTab({ tab: 'myself', subtab: 'possessions' }));
    history.push('/possessions');
  }

  render() {
    const { subtab } = this.props;

    const myselfClass = classnames({
      'inner-tab': true,
      'inner-tab--with-border': true,
      'inner-tab--active': subtab === 'myself',
    });

    const possessionsClass = classnames({
      'inner-tab': true,
      'inner-tab--active': subtab === 'possessions',
    });

    return (
      <div className="inner-tabs">
        <div
          className={myselfClass}
          onClick={this.goToMyself}
          onKeyUp={this.goToMyself}
          role="tab"
          tabIndex={-1}
        >
          <i className="fl-ico fl-ico-2x fl-ico-myself inner-tab__icon" />
          <div className="inner-tab__label">
            Myself
          </div>
        </div>
        <div
          className={possessionsClass}
          onClick={this.goToPossessions}
          onKeyUp={this.goToPossessions}
          role="tab"
          tabIndex={-1}
        >
          <i className="fl-ico fl-ico-2x fl-ico-inventory inner-tab__icon" />
          <div className="inner-tab__label">
            Possessions
          </div>
        </div>
      </div>
    );
  }
}


InnerTabs.displayName = 'InnerTabs';

InnerTabs.propTypes = {
  dispatch: PropTypes.func.isRequired,
  subtab: PropTypes.oneOf(['myself', 'possessions']).isRequired,
};

const mapStateToProps = ({ subtabs: { myself: subtab } }) => ({ subtab });

export default withRouter(connect(mapStateToProps)(InnerTabs));
 */
