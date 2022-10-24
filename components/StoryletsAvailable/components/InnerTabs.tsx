import React from "react";

import { StoryletActiveTab as ActiveTab } from "types/subtabs";
import Tab from "./InnerTab";

export default function InnerTabs(props: Props) {
  const { activeTab, onChange } = props;
  return (
    <div className="inner-tabs">
      <Tab
        isActive={activeTab === "always"}
        onClick={() => onChange("always")}
        bordered
      >
        <i className="fl-ico fl-ico-2x fl-ico-story inner-tab__icon" />
        <span className="inner-tab__label">Always</span>
      </Tab>
      <Tab
        isActive={activeTab === "sometimes"}
        onClick={() => onChange("sometimes")}
      >
        <i className="fl-ico fl-ico-2x fl-ico-deck inner-tab__icon" />
        <span className="inner-tab__label">Sometimes</span>
      </Tab>
    </div>
  );
}

export interface Props {
  activeTab: ActiveTab;
  onChange: (arg: "always" | "sometimes") => void;
}
