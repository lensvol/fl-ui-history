import React from "react";

const logo = "/img/15th/FL_logo_white.png";

export default function TitleBar() {
  return (
    <h1 className="registration__title-bar">
      <img
        className="img-responsive u-space-below"
        src={process.env.PUBLIC_URL + logo}
        alt="Fallen London - Home of the Echo Bazaar"
      />
    </h1>
  );
}
