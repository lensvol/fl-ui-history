import React from "react";
import Header from "components/Header";
import Help from "components/Help";
import Footer from "components/Footer";

export default function HelpContainer() {
  return (
    <div id="helpContainer">
      <Header />
      <Help />
      <Footer />
    </div>
  );
}

HelpContainer.displayName = "HelpContainer";
