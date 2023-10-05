import { useAppSelector } from "features/app/store";
import React, { useCallback, useState } from "react";
import { useHistory } from "react-router-dom";
import { UIRestriction } from "types/myself";

import ActionCountModal from "./ActionCountModal";
import FooterLink from "./FooterLink";

export default function ResponsiveFooter() {
  const history = useHistory();
  const actionBankSize = useAppSelector((s) => s.actions.actionBankSize);
  const actions = useAppSelector((s) => s.actions.actions);
  const showPossessionsUI = useAppSelector(
    (s) =>
      !s.myself.uiRestrictions?.find((r) => r === UIRestriction.Possessions)
  );
  const subtabs = useAppSelector((s) => s.subtabs);

  const [actionCountModalIsOpen, setActionCountModalIsOpen] = useState(false);

  const handleOpenModal = useCallback(() => {
    setActionCountModalIsOpen(true);
  }, []);

  const handleRequestClose = useCallback(() => {
    setActionCountModalIsOpen(false);
  }, []);

  const current = history.location.pathname;

  const myselfSubTab = showPossessionsUI ? subtabs.myself : "myself";
  const myselfPath = `/${myselfSubTab}`;
  const myselfHighlightAlso =
    myselfSubTab === "myself" ? "/possessions" : "/myself";

  return (
    <>
      <nav className="footer-xs">
        <ul className="footer-menu" role="tablist">
          <FooterLink
            to="/"
            title="Story"
            current={current}
            className="fl-ico-story"
            role="tab"
          />
          <FooterLink
            to={myselfPath}
            title="Myself"
            className="fl-ico-myself"
            current={current}
            highlightAlso={myselfHighlightAlso}
            role="tab"
          />
          <li
            className="footer-menu__item footer-menu__item--actions"
            role="tab"
          >
            <button
              className="button--link"
              onClick={handleOpenModal}
              onKeyUp={handleOpenModal}
              tabIndex={0}
              type="button"
            >
              <div className="footer-menu__item--actions" />
              <div>
                <span className="action__count__item js-action-count">
                  {actions}
                </span>{" "}
                / <span className="action__count__item">{actionBankSize}</span>
              </div>
            </button>
          </li>
          <FooterLink
            to="/bazaar"
            title="Bazaar"
            className="fl-ico-bazaar"
            current={current}
            role="tab"
            uiRestriction={UIRestriction.EchoBazaar}
          />
          <FooterLink
            to="/messages"
            title="Messages"
            className="fl-ico-message"
            current={current}
            role="tab"
            uiRestriction={UIRestriction.Messages}
          />
        </ul>
      </nav>
      <ActionCountModal
        isOpen={actionCountModalIsOpen}
        onRequestClose={handleRequestClose}
      />
    </>
  );
}

ResponsiveFooter.displayName = "ResponsiveFooter";
