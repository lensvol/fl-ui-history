import React from "react";

import { Link } from "react-router-dom";

import classnames from "classnames";

import Config from "configuration";

interface Props {
  className?: string;
}

export default function FooterContent({ className }: Props) {
  return (
    <div className={classnames("footer-content", className)}>
      <div>
        <p>
          &copy; <a href="https://www.failbettergames.com/">Failbetter Games</a>{" "}
          2010&ndash;2026{" "}
          <span
            style={{
              fontWeight: "bold",
              marginLeft: "1em",
            }}
          >
            Version {Config.version}
          </span>
        </p>
      </div>
      <div>
        <ul className="list--horizontal">
          <li className="list-item--separated">
            <Link to="/help">Help</Link>
          </li>
          <li className="list-item--separated">
            <Link to="/privacy">Privacy</Link>
          </li>
          <li className="list-item--separated">
            <Link to="/terms">Terms</Link>
          </li>
          <li className="list-item--separated">
            <a href="https://www.failbettergames.com/news">Blog</a>
          </li>
        </ul>
      </div>
    </div>
  );
}

FooterContent.displayName = "FooterContent";
