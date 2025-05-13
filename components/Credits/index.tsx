import React, { Fragment, useCallback } from "react";
import { useHistory } from "react-router-dom";

import { CmsContent } from "components/CmsContent";
import Footer from "components/Footer";
import Header from "components/Header";

import { useAppDispatch } from "features/app/store";

export default function Credits() {
  const dispatch = useAppDispatch();
  const history = useHistory();

  const onGoBack = useCallback(() => {
    history.goBack();
  }, [history]);

  return (
    <Fragment>
      <Header />
      <div className="credits">
        <h1 className="heading heading--1 credits__navigation">
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
          Credits
        </h1>
        <CmsContent dispatch={dispatch} pageName="credits" />
      </div>
      <Footer />
    </Fragment>
  );
}

Credits.displayName = "Credits";
