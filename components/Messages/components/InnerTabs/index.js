import React from "react";
import PropTypes from "prop-types";

import Tab from "./Tab";

export default function InnerTabs({ activeTab, onChange }) {
  return (
    <div className="inner-tabs">
      <Tab
        bordered
        active={activeTab === "interactions"}
        onClick={() => onChange("interactions")}
      >
        <i className="fl-ico fl-ico-2x fl-ico-message inner-tab__icon" />
        <span className="inner-tab__label">Messages</span>
      </Tab>

      <Tab
        active={activeTab === "feedMessages"}
        onClick={() => onChange("feedMessages")}
        style={{ alignItems: "flex-end" }}
      >
        <i
          className="fa fa-2x fa-clock-o inner-tab__icon"
          style={{ backgroundColor: "transparent", height: "32px" }}
        />
        <span className="inner-tab__label">Recently</span>
      </Tab>
    </div>
  );
}

InnerTabs.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
