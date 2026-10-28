import React from "react";

import InnerTab from "components/StoryletsAvailable/components/InnerTab";

import { StoryletActiveTab as ActiveTab } from "types/subtabs";

interface Props {
  activeTab: ActiveTab;
  onChange: (arg: "always" | "sometimes") => void;
}

export default function StoryletInnerTabs({ activeTab, onChange }: Props) {
  return (
    <div className="inner-tabs">
      <InnerTab
        bordered
        isActive={activeTab === "always"}
        onClick={() => onChange("always")}
      >
        <i className="fl-ico fl-ico-2x fl-ico-story inner-tab__icon" />
        <span className="inner-tab__label">Always</span>
      </InnerTab>

      <InnerTab
        bordered={false}
        isActive={activeTab === "sometimes"}
        onClick={() => onChange("sometimes")}
      >
        <i className="fl-ico fl-ico-2x fl-ico-deck inner-tab__icon" />
        <span className="inner-tab__label">Sometimes</span>
      </InnerTab>
    </div>
  );
}

StoryletInnerTabs.displayName = "StoryletInnerTabs";
