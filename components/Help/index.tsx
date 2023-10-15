import { fetchPage } from "actions/pages";
import Buttonlet from "components/Buttonlet";
import MediaLgUp from "components/Responsive/MediaLgUp";
import ScrollNav from "components/ScrollNav";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Sticky, StickyContainer } from "react-sticky";
import { ThunkDispatch } from "redux-thunk";

import { Success } from "services/BaseMonadicService";
import scrollToComponent from "utils/scrollToComponent";
import Loading from "components/Loading";

function Help(
  props: RouteComponentProps & { dispatch: ThunkDispatch<any, any, any> }
) {
  const { dispatch } = props;

  const contentRef = useRef<HTMLDivElement | null>(null);

  const [retaggedContent, setRetaggedContent] = useState<string | null>(null);
  const [navItems, setNavItems] = useState<any[]>([]);

  // Pad a loading delay so that we stay in a loading state for a user-perceptible amount of time
  const MINIMUM_LOAD_DURATION = 1000;

  useEffect(() => {
    asyncUseEffect();

    let timeout: ReturnType<typeof setTimeout>;

    return () => {
      clearTimeout(timeout);
    };

    async function asyncUseEffect() {
      const startTime = new Date();
      const response = await dispatch(fetchPage("help"));
      if (response instanceof Success) {
        const duration = new Date().valueOf() - startTime.valueOf();

        timeout = setTimeout(
          () => {
            const {
              data: { text },
            } = response;
            const el = document.createElement("div");
            el.innerHTML = text;

            // Parse the HTML for headers and create sticky nav items
            el.querySelectorAll("h1").forEach((node, i) => {
              node.setAttribute("data-section-name", node.innerHTML.trim());
              setNavItems((prevState) => [
                ...prevState,
                { id: i, name: node.innerText },
              ]);
            });

            setRetaggedContent(el.innerHTML);
          },
          Math.max(MINIMUM_LOAD_DURATION - duration, 0)
        );
      }
    }
  }, [dispatch]);

  const activeItem = 0;
  const gotoItem = useCallback((navItem) => {
    const sectionHeader = contentRef.current?.querySelector(
      `[data-section-name="${navItem.name.trim()}"]`
    );
    if (sectionHeader) {
      scrollToComponent(sectionHeader, { offset: 0, align: "top" });
    }
  }, []);

  return (
    <div>
      <div className="help">
        <div style={{ marginBottom: "2rem" }}>
          <StaticContent {...props} />
        </div>
        <StickyContainer style={{ height: "auto" }} className="row">
          <MediaLgUp>
            <div className="nav nav--stacked nav--stacked--1-of-4 nav--stacked--roman">
              <Sticky>
                {({ style }) => (
                  <ScrollNav
                    style={style}
                    data={navItems}
                    gotoItem={gotoItem}
                    active={activeItem}
                  />
                )}
              </Sticky>
            </div>
          </MediaLgUp>
          {retaggedContent === null ? (
            <Loading spinner />
          ) : (
            <div
              className="stack-content stack-content--3-of-4 cms-page"
              dangerouslySetInnerHTML={{ __html: retaggedContent }}
              ref={contentRef}
            />
          )}
        </StickyContainer>
      </div>
    </div>
  );
}

function StaticContent({ history }: RouteComponentProps) {
  return (
    <>
      <h1 className="heading heading--1" style={{ marginTop: 5 }}>
        <button
          className="button--link"
          onClick={() => {
            history.goBack();
          }}
          style={{
            marginRight: "1rem",
          }}
          type="button"
        >
          <i className="fa fa-arrow-left back-button" />
        </button>
        Help
      </h1>
      <h2 className="heading heading--2">Welcome to Fallen London!</h2>
      <div>
        <p>
          You may be disoriented by the shock of your arrival. We’re here to
          help.{" "}
          <a
            href="https://community.failbettergames.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Our forums
          </a>{" "}
          and{" "}
          <a
            href="https://discordapp.com/invite/59aNpKf"
            target="_blank"
            rel="noopener noreferrer"
          >
            Official Discord
          </a>{" "}
          are also a good place to seek assistance. And if you think you've
          found a bug, please let us know by emailing{" "}
          <a href="mailto:support@failbettergames.com">
            support@failbettergames.com
          </a>
          .
        </p>
        <Buttonlet
          type="book"
          title="Blog"
          onClick={() =>
            window.open("http://www.failbettergames.com/news/", "_blank")
          }
        />
        <Buttonlet
          type="twitter"
          title="Twitter"
          onClick={() =>
            window.open("https://www.twitter.com/echobazaar", "_blank")
          }
        />
        <Buttonlet
          type="facebook"
          title="Facebook"
          onClick={() =>
            window.open("http://www.facebook.com/fallenlondon", "_blank")
          }
        />
        <Buttonlet
          type="quote-left"
          title="Forums"
          onClick={() =>
            window.open("http://community.failbettergames.com", "_blank")
          }
        />
      </div>
    </>
  );
}

export default withRouter(connect()(Help));
