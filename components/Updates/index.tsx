import React from "react";

import Footer from "components/Footer";
import Header from "components/Header";
import AllNews from "components/Updates/AllNews";
import UpdatesHeader from "components/Updates/UpdatesHeader";

export default function Updates() {
  return (
    <div id="updatesContainer">
      <Header />
      <div className="updates">
        <UpdatesHeader />
        <AllNews />
      </div>
      <Footer />
    </div>
  );
}

Updates.displayName = "Updates";
