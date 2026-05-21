import React from "react";

import { Route, Router, Switch } from "react-router-dom";

import ReactGA from "react-ga4";

import Config from "configuration";

import AccessCode, {
  AccessCodeChallengeDialog,
  AccessCodeResultDialog,
} from "components/AccessCode";

import ErrorBoundary from "components/ErrorBoundary";
import VersionMismatchModal from "components/VersionMismatchModal";

// These components ensure a user can only access certain areas when logged in.
import RequireCharacter from "components/RequireCharacter";
import RequireNoCharacter from "components/RequireNoCharacter";
import RequireUnauthenticated from "components/RequireUnauthenticated";

import Timer from "components/Timer";

// Containers (These are essentially used like 'pages')
import AccountPage from "components/AccountPage";
import AgentsTab from "components/Agents/AgentsTab";
import AiStatementPage from "components/AiStatement";
import CreateCharacter from "components/CreateCharacter";
import CreditsPage from "components/Credits";
import ExchangeTab from "components/ExchangeTab";
import FacebookDataPage from "components/FacebookData";
import FateTab from "components/FateTab";
import HelpPage from "components/HelpPage";
import LoginContainer from "components/Login";
import MessagesTab from "components/MessagesTab";
import MyProfileTab from "components/MyProfileTab";
import PossessionsTab from "components/PossessionsTab";
import PrivacyPage from "components/PrivacyPage";
import ProfilePage from "components/ProfilePage";
import StoryTabContent from "components/StoryTabContent";
import TermsPage from "components/TermsPage";
import Updates from "components/Updates";

import ErrorThrower from "components/ErrorThrower";
import MyselfTab from "components/MyselfTab";
import PlansTab from "components/PlansTab";

import ModalTooltip from "components/ModalTooltip";
import MapAdminOverlay from "components/Map/AdminOverlay";

import AccountLinkReminder from "components/AccountLinkReminder";

import EmailVerificationContainer from "components/Account/AuthMethods/EmailVerificationContainer";
import UnsubscribeContainer from "components/Messages/UnsubscribeContainer";

// 404 Route
import NotFound from "components/NotFound";

// Our shared history object
import history from "shared/history";

import { UIRestriction } from "types/myself";

export default function App() {
  console.log("current version: ", Config.version); // eslint-disable-line no-console
  ReactGA.initialize("G-7ZBF3LYSFQ");

  return (
    <ErrorBoundary>
      <MapAdminOverlay />
      <VersionMismatchModal />
      <Timer />
      <Router basename={Config.basePath || null} history={history}>
        <div className="router-example">
          <div className="ie11banner">
            Fallen London no longer supports Internet Explorer (support ended on
            11 January 2020). Please upgrade your browser!
          </div>
          <Route
            render={({ location }) => (
              <Switch location={location}>
                {/* Unrestricted routes */}
                {/* <Route path='*' component={maintenance} /> */}
                <Route path="/a/:accessCodeName" exact component={AccessCode} />
                <Route
                  path="/profile/:profileName/:fromEchoId?"
                  exact
                  component={ProfilePage}
                />
                <Route path="/help" exact component={HelpPage} />
                <Route path="/privacy" exact component={PrivacyPage} />
                <Route path="/terms" exact component={TermsPage} />
                <Route path="/account" exact component={AccountPage} />
                <Route path="/credits" exact component={CreditsPage} />
                <Route path="/ai-statement" exact component={AiStatementPage} />
                <Route path="/500" exact component={ErrorThrower} />
                <Route
                  path="/email/:token"
                  exact
                  component={EmailVerificationContainer}
                />
                <Route
                  path="/unsubscribe/:userId/:token/:purpose?"
                  exact
                  component={UnsubscribeContainer}
                />
                <Route
                  path="/fbdata/:token?"
                  exact
                  component={FacebookDataPage}
                />

                {/* Routes that only logged-out users can visit */}
                <RequireUnauthenticated
                  path="/login"
                  exact
                  component={LoginContainer}
                />

                {/* Routes that only logged-in users with no character can visit */}
                <RequireNoCharacter
                  path="/create-character"
                  exact
                  component={CreateCharacter}
                />

                {/* Routes that only logged-in users with a character can visit */}
                <RequireCharacter
                  path="/fate"
                  exact
                  component={FateTab}
                  uiRestriction={UIRestriction.Fate}
                />
                <RequireCharacter
                  path="/bazaar"
                  exact
                  component={ExchangeTab}
                  uiRestriction={UIRestriction.EchoBazaar}
                />
                <RequireCharacter
                  path="/possessions"
                  exact
                  component={PossessionsTab}
                  uiRestriction={UIRestriction.Possessions}
                />
                <RequireCharacter path="/myself" exact component={MyselfTab} />
                <RequireCharacter
                  path="/messages"
                  exact
                  component={MessagesTab}
                  uiRestriction={UIRestriction.Messages}
                />
                <RequireCharacter path="/plans" exact component={PlansTab} />
                <RequireCharacter path="/me" exact component={MyProfileTab} />
                <RequireCharacter
                  path="/profile"
                  exact
                  component={ProfilePage}
                />
                <RequireCharacter path="/" exact component={StoryTabContent} />
                <RequireCharacter
                  path="/agents"
                  exact
                  component={AgentsTab}
                  uiRestriction={UIRestriction.Agents}
                />
                <RequireCharacter path="/updates" exact component={Updates} />

                {/* Also unrestricted but, it's the catch-all, so it lives at the end */}
                <Route path="*" component={NotFound} />
              </Switch>
            )}
          />
          <AccessCodeChallengeDialog />
          <AccessCodeResultDialog />
        </div>
      </Router>
      <ModalTooltip />
      <AccountLinkReminder />
    </ErrorBoundary>
  );
}

App.displayName = "App";
