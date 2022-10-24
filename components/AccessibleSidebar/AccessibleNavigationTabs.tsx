import React from "react";
import { Link, withRouter } from "react-router-dom";

import { NAV_ITEMS } from "components/GeneralContainer/constants";

export function AccessibleNavigationTabs() {
  return (
    <nav>
      <ul>
        {NAV_ITEMS.map(({ label, value }) => (
          <li key={value}>
            <Link to={value}>{label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

AccessibleNavigationTabs.displayName = "AccessibleNavigationTabs";

export default withRouter(AccessibleNavigationTabs);
