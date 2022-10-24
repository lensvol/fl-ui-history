/* eslint-disable no-param-reassign, no-useless-concat */
import React from "react";
import PropTypes from "prop-types";
import { CopyToClipboard } from "react-copy-to-clipboard";

import Config from "configuration";
import getAirbrakeClient from "shared/airbrake/getClient";

function stringifyError(err, filter, space) {
  const plainObject = {};
  Object.getOwnPropertyNames(err).forEach((key) => {
    plainObject[key] = err[key];
  });
  return JSON.stringify(plainObject, filter, space);
}

class ErrorBoundary extends React.Component {
  static displayName = "ErrorBoundary";

  state = {
    copied: false,
  };

  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    const { hasError } = this.state;

    // We are already in an errorful state; don't re-render
    if (hasError) {
      return;
    }

    // Display fallback UI
    this.setState({ error, info, hasError: true });

    // Filter and send to Airbrake --- if we error here, then silently discard it
    try {
      const airbrake = getAirbrakeClient();
      airbrake.notify({
        error: stringifyError(error, null, "\t"),
        params: { info },
      });
    } catch {}
  }

  createMessage = (error, info) => {
    let message = "Version: " + Config.version + "\n\n";
    if (window.isSecureContext) {
      message += "User-Agent: " + window.navigator.userAgent + "\n\n";
    }
    message +=
      "Error stack:\n\n" +
      error.stack +
      "\n\n\n" +
      "Component stack" +
      "\n\n" +
      info.componentStack;
    return message;
  };

  render() {
    const { children } = this.props;
    const { error, copied, hasError, info } = this.state;

    if (hasError) {
      const message = this.createMessage(error, info);
      const subject = "[" + Config.version + "] " + error.message;
      const body = message.replace(/\n/g, "%0D%0A");

      // You can render any custom fallback UI
      return (
        <div className="error-boundary">
          <div className="error-boundary__content">
            <h1 className="heading heading--1">Our apologies!</h1>

            <p>
              Something terrible has happened. Perhaps a server has shattered in
              a spray of sparks, or a database flared and guttered like a dying
              star. More likely the Bazaar has hiccupped, or twitched in its
              sleep, and you are the victim of inexplicable but transient
              circumstances.
            </p>
            <p className="error-boundary__p--link">
              <a href="/">If you click here, all will likely be well.</a>
            </p>
            <p>
              If the problem persists, do let us know as much information as
              possible — username, browser and what you were trying to do — at:
            </p>
            <p className="error-boundary__p--link">
              <a
                href={`mailto:fallenlondonredesign@failbettergames.com?subject=${subject}&body=${body}`}
              >
                fallenlondonredesign@failbettergames.com
              </a>
              .
            </p>
            <p>
              You're using version <b>{Config.version}</b> of Fallen London.
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "1rem",
              }}
            >
              Here's what we know about the error:
              <CopyToClipboard
                text={message}
                onCopy={() => this.setState({ copied: true })}
              >
                <span className="button--link">
                  {copied ? "Copied!" : "Copy"}
                </span>
              </CopyToClipboard>
            </div>
            <div>
              <textarea
                defaultValue={message}
                style={{ width: "100%", height: "8rem" }}
              />
            </div>
          </div>
        </div>
      );
    }
    return children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
