import React from "react";

import classnames from "classnames";

type Props = {
  activeTab: string;
  alt?: string;
  className?: string;
  label: string;
  name: string;
  onClick: (e: any) => void;
};

export default function RegistrationTab({
  activeTab,
  alt,
  className,
  label,
  name,
  onClick,
}: Props) {
  const active = name === activeTab;

  return (
    <li className={classnames("nav__item", active && "active", className)}>
      <div className={classnames("nav__button--tabs", active && "active")}>
        <button
          className={classnames("button--link nav__button", active && "active")}
          name={name}
          onClick={onClick}
          role="tab"
          tabIndex={-1}
          title={alt}
          type="button"
        >
          {label}
        </button>
      </div>
    </li>
  );
}

RegistrationTab.displayName = "RegistrationTab";
