import React from "react";

import MessageTab from "components/Messages/components/MessageInnerTabs/MessageTab";

type Props = {
  activeTab: string;
  onChange: (_: string) => void;
};

export default function MessageInnerTabs({ activeTab, onChange }: Props) {
  return (
    <div className="inner-tabs">
      <MessageTab
        active={activeTab === "interactions"}
        bordered
        onClick={() => onChange("interactions")}
      >
        <i className="fl-ico fl-ico-2x fl-ico-message inner-tab__icon" />
        <span className="inner-tab__label">Messages</span>
      </MessageTab>

      <MessageTab
        active={activeTab === "feedMessages"}
        bordered={false}
        onClick={() => onChange("feedMessages")}
        style={{
          alignItems: "flex-end",
        }}
      >
        <i
          className="fa fa-2x fa-clock-o inner-tab__icon"
          style={{
            backgroundColor: "transparent",
            height: "32px",
          }}
        />

        <span className="inner-tab__label">Recently</span>
      </MessageTab>
    </div>
  );
}

MessageInnerTabs.displayName = "MessageInnerTabs";
