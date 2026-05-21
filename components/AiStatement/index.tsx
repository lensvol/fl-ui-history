import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";

import { CmsContent } from "components/CmsContent";
import Footer from "components/Footer";
import Header from "components/Header";

import { useAppDispatch } from "features/app/store";

export default function AiStatementPage() {
  const dispatch = useAppDispatch();
  const history = useHistory();

  const onGoBack = useCallback(() => {
    history.goBack();
  }, [history]);

  return (
    <>
      <Header />
      <div className="ai-statement">
        <h1 className="heading heading--1 ai-statement__navigation">
          <button
            className="button--link"
            onClick={onGoBack}
            style={{
              marginRight: "1rem",
            }}
            type="button"
          >
            <i className="fa fa-arrow-left back-button" />
          </button>
          AI Statement
        </h1>
        <CmsContent dispatch={dispatch} pageName="ai-statement" />
      </div>
      <Footer />
    </>
  );
}

AiStatementPage.displayName = "AiStatementPage";
