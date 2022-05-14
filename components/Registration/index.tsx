import React, { Component } from 'react';

import Login from 'components/Registration/components/Login';
import Signup from './components/Signup';
import Tab from './components/Tab';

interface State {
  activeTab: string,
}

class Registration extends Component<never, State> {
  state: State = {
    activeTab: 'login',
  }

  static displayName = 'Registration';

  renderActiveTab = () => {
    const { activeTab } = this.state;
    if (activeTab === 'signup') {
      return <Signup />;
    }
    return <Login />;
  }

  handleTabClick = (e: { target: { name: string } }) => {
    this.setState({ activeTab: e.target.name });
  }

  /**
   * Render
   * @return {Object}
   */
  render() {
    const { activeTab } = this.state;

    return (
      <div>
        <nav className="nav nav--tabs">
          <ul role="tablist">
            <Tab
              name="login"
              label="Log in"
              activeTab={activeTab}
              onClick={this.handleTabClick}
            />
            <Tab
              name="signup"
              label="Sign up"
              activeTab={activeTab}
              onClick={this.handleTabClick}
            />
          </ul>
        </nav>
        <div className="tab-content tab-content--inverse inverse--bordered">
          <div className="tab-content__bordered-container">
            {this.renderActiveTab()}
          </div>
        </div>
      </div>
    );
  }
}

export default Registration;