import React, { useCallback, useState } from "react";

import Login from "components/Registration/components/Login";
import Promotion from "components/Registration/components/Promotion";
import RegistrationTab from "components/Registration/components/RegistrationTab";
import Signup from "components/Registration/components/Signup";

import { useAppSelector } from "features/app/store";

const LoginTab = "login";
const SignUpTab = "signup";
const PromotionalTab = "promo";

type RegistrationTab =
  typeof LoginTab | typeof SignUpTab | typeof PromotionalTab;

export default function Registration() {
  const accessCode = useAppSelector((state) => state.accessCodes.accessCode);

  const [activeTab, setActiveTab] = useState<RegistrationTab>(LoginTab);

  const handleTabClick = useCallback((e: { target: { name: string } }) => {
    setActiveTab(e.target.name as RegistrationTab);
  }, []);

  return (
    <div className="login__form">
      <nav className="nav nav--tabs">
        <ul role="tablist" className="login__tabs">
          <RegistrationTab
            activeTab={activeTab}
            label="Log in"
            name={LoginTab}
            onClick={handleTabClick}
          />

          <RegistrationTab
            activeTab={activeTab}
            label="Sign up"
            name={SignUpTab}
            onClick={handleTabClick}
          />

          <li className="nav__item" />

          {accessCode && (
            <RegistrationTab
              activeTab={activeTab}
              alt="Redeem code"
              className="login-promo-tab"
              label="&nbsp;"
              name={PromotionalTab}
              onClick={handleTabClick}
            />
          )}
        </ul>
      </nav>

      <div className="tab-content tab-content--inverse inverse--bordered">
        <div className="tab-content__bordered-container">
          {activeTab === LoginTab && <Login />}

          {activeTab === SignUpTab && <Signup />}

          {activeTab === PromotionalTab && <Promotion />}
        </div>
      </div>
    </div>
  );
}

Registration.displayName = "Registration";
