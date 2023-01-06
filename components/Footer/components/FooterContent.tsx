import React from "react";
import classnames from "classnames";
import Config from "configuration";
import { Link, withRouter, RouteComponentProps } from "react-router-dom";

interface Props extends RouteComponentProps {
  className?: string;
}

export function FooterContent({ className }: Props) {
  // noinspection HtmlUnknownTarget
  return (
    <div className={classnames("footer-content", className)}>
      <div className="">
        <p>
          © <a href="http://www.failbettergames.com/">Failbetter Games</a>{" "}
          2010–2023{" "}
          <span style={{ fontWeight: "bold", marginLeft: "1em" }}>
            Version {Config.version}
          </span>
        </p>
      </div>
      <div className="">
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
            <a href="http://www.twitter.com/failbettergames">FBG on Twitter</a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default withRouter(FooterContent);
