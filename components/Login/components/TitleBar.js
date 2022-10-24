import React from "react";

import logo from "assets/img/FL_logo_white.png";

export default function TitleBar() {
  return (
    <h1 className="registration__title-bar">
      <img
        className="img-responsive u-space-below"
        src={logo}
        alt="Fallen London - Home of the Echo Bazaar"
      />
    </h1>
  );
}
