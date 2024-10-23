import React, { Component } from "react";

import classnames from "classnames";

import Registration from "components/Registration";
import FooterContent from "components/Footer/components/FooterContent";
import LoginCopy from "components/Login/components/LoginCopy";
import TitleBar from "components/Login/components/TitleBar";

import scrollToComponent from "utils/scrollToComponent";

export default class LoginContainer extends Component {
  constructor(props) {
    super(props);

    this.container = React.createRef();
    this.titleBar = React.createRef();
  }

  possibleClassNames = [
    "ambassador",
    // 'astrologer',
    "aunt",
    "boatman",
    "edward",
    // 'magician',
    // 'master',
    // 'november',
    // 'plenty',
    // 'surveyor',
  ];

  state = {
    hasScrolled: false,
    heroClassName: undefined,
    currentY: 1,
  };

  componentDidMount = () => {
    // On mount, work out where the container's original y-position is
    const node = this.container.current;

    this.originalY = node.getBoundingClientRect().top;

    let className;

    try {
      className = new URLSearchParams(window.location.search).get("hero");
    } finally {
      if (this.possibleClassNames.indexOf(className) >= 0) {
        this.setState({ heroClassName: className });

        return;
      }

      this.setState({ heroClassName: this.getRandomClassName() });
    }
  };

  handleScroll = () => {
    // Try to update state on scroll so that the backdrop opacity changes
    const node = this.container.current;

    if (!node) {
      return;
    }

    const currentY = node.getBoundingClientRect().top;

    this.setState({ currentY, hasScrolled: true });
  };

  handleTitleBarClick = () => {
    // Try to scroll down until the title bar is at the top of the page
    if (!this.titleBar.current) {
      return;
    }

    scrollToComponent(this.titleBar.current, {
      align: "top",
      offset: 0,
    });
  };

  calculateOpacity = () => {
    const { currentY, hasScrolled } = this.state;

    if (!hasScrolled) {
      return 0;
    }

    if (currentY === undefined || currentY === null) {
      return 0;
    }

    if (!this.originalY) {
      return 0;
    }

    return Math.min(0.75, 1 - Math.max(0, currentY) / this.originalY);
  };

  getRandomClassName = () => {
    return this.possibleClassNames[
      Math.floor(Math.random() * this.possibleClassNames.length)
    ];
  };

  /**
   * Render
   * @return {[type]} [description]
   */
  render = () => (
    <div
      className={classnames(
        "container-background-image",
        this.state.heroClassName
      )}
      onScroll={this.handleScroll}
    >
      <div>
        <div
          className="login__overlay"
          style={{
            opacity: this.calculateOpacity(),
          }}
        />
        <div className="login" ref={this.container}>
          <div ref={this.titleBar}>
            <TitleBar onClick={this.handleTitleBarClick} />
          </div>
          <div className="login__copy-and-form">
            <div className="login__copy">
              <LoginCopy />
            </div>
            <div>
              <Registration {...this.props} />
            </div>
          </div>
          <div>
            <FooterContent className="footer-content--login-page" />
          </div>
        </div>
      </div>
    </div>
  );
}

LoginContainer.displayName = "LoginContainer";
