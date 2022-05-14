// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react';

export default class ErrorThrower extends Component {
  static displayName = 'ErrorThrower';

  async componentDidMount() {
    // throw new Error('An error has occurred in ErrorThrower!');
    // window.GM_getValue();
    // const foo = new XMLHttpRequest();
    // foo.open('GET', 'https://fallenlondon.com.invalid', false); // foo.send();
    this.setStateRepeatedly();
  }

  setStateRepeatedly = () => {
    this.setState({ foo: 'bar'}, () => {
      this.setStateRepeatedly();
    });
  };


  render() {
    // throw new Error('An error has occurred in ErrorThrower.render()!');
    return <div>ErrorThrower</div>;
  }
}