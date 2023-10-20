import React, { Component } from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { IAppState } from "types/app";

import ActionCountModal from "./ActionCountModal";
import FooterLink from "./FooterLink";

interface State {
  actionCountModalIsOpen: boolean;
}

class ResponsiveFooter extends Component<Props, State> {
  state = {
    actionCountModalIsOpen: false,
  };

  handleOpenModal = () => {
    this.setState({ actionCountModalIsOpen: true });
  };

  handleRequestClose = () => {
    this.setState({ actionCountModalIsOpen: false });
  };

  render = () => {
    const { actions, actionBankSize, history, subtabs } = this.props;
    const { actionCountModalIsOpen } = this.state;

    const current = history.location.pathname;

    const myselfPath = `/${subtabs.myself}`;
    const myselfHighlightAlso =
      subtabs.myself === "myself" ? "/possessions" : "/myself";

    return (
      <>
        <nav className="footer-xs">
          <ul className="footer-menu" role="tablist">
            <FooterLink
              to="/"
              title="Story"
              current={current}
              className="fl-ico-story"
              role="tab"
            />
            <FooterLink
              to={myselfPath}
              title="Myself"
              className="fl-ico-myself"
              current={current}
              highlightAlso={myselfHighlightAlso}
              role="tab"
            />
            <li
              className="footer-menu__item footer-menu__item--actions"
              role="tab"
            >
              <button
                className="button--link"
                onClick={this.handleOpenModal}
                onKeyUp={this.handleOpenModal}
                tabIndex={0}
                type="button"
              >
                <div className="footer-menu__item--actions" />
                <div>
                  <span className="action__count__item js-action-count">
                    {actions}
                  </span>{" "}
                  /{" "}
                  <span className="action__count__item">{actionBankSize}</span>
                </div>
              </button>
            </li>
            <FooterLink
              to="/bazaar"
              title="Bazaar"
              className="fl-ico-bazaar"
              current={current}
              role="tab"
            />
            <FooterLink
              to="/messages"
              title="Messages"
              className="fl-ico-message"
              current={current}
              role="tab"
            />
          </ul>
        </nav>
        <ActionCountModal
          isOpen={actionCountModalIsOpen}
          onRequestClose={this.handleRequestClose}
        />
      </>
    );
  };
}

const mapStateToProps = ({ actions, subtabs }: IAppState) => ({
  subtabs,
  actions: actions.actions,
  actionBankSize: actions.actionBankSize,
});

type Props = RouteComponentProps & ReturnType<typeof mapStateToProps>;

export default withRouter(connect(mapStateToProps)(ResponsiveFooter));
