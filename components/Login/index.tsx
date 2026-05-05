import React, { useCallback, useEffect, useRef, useState } from "react";

import { useDispatch } from "react-redux";

import classnames from "classnames";

import onVisitLogin from "actions/login/onVisitLogin";

import FooterContent from "components/Footer/components/FooterContent";
import LoginCopy from "components/Login/components/LoginCopy";
import TitleBar from "components/Login/components/TitleBar";
import Registration from "components/Registration";

const possibleClassNames = [
  "ambassador",
  "astrologer",
  "aunt",
  "boatman",
  "deputy",
  "edward",
  "madamex1",
  "magician",
  "master",
  "mystic",
  "november",
  "plenty",
  "surveyor",
];

export default function LoginContainer() {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [heroClassName, setHeroClassName] = useState<string | undefined>(
    undefined
  );
  const [currentY, setCurrentY] = useState(1);
  const [originalY, setOriginalY] = useState<number | undefined>(undefined);
  const [didLoad, setDidLoad] = useState(false);

  const container = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const getRandomClassName = useCallback(() => {
    return possibleClassNames[
      Math.floor(Math.random() * possibleClassNames.length)
    ];
  }, []);

  useEffect(() => {
    if (didLoad) {
      return;
    }

    asyncUseEffect();

    async function asyncUseEffect() {
      const node = container.current;

      if (node) {
        setOriginalY(node.getBoundingClientRect().top);
      }

      const className = new URLSearchParams(window.location.search).get("hero");

      const heroClassName =
        className && possibleClassNames.indexOf(className) >= 0
          ? className
          : getRandomClassName();

      setHeroClassName(heroClassName);

      setDidLoad(true);

      await dispatch(onVisitLogin());
    }
  }, [didLoad, dispatch, getRandomClassName]);

  const handleScroll = useCallback(() => {
    // Try to update state on scroll so that the backdrop opacity changes
    const node = container.current;

    if (!node) {
      return;
    }

    const newCurrentY = node.getBoundingClientRect().top;

    setCurrentY(newCurrentY);
    setHasScrolled(true);
  }, []);

  const calculateOpacity = useCallback(() => {
    if (!hasScrolled) {
      return 0;
    }

    if (!originalY) {
      return 0;
    }

    return Math.min(0.75, 1 - Math.max(0, currentY) / originalY);
  }, [currentY, hasScrolled, originalY]);

  return (
    <div
      className={classnames("container-background-image", heroClassName)}
      onScroll={handleScroll}
    >
      <div>
        <div
          className="login__overlay"
          style={{
            opacity: calculateOpacity(),
          }}
        />
        <div className="login" ref={container}>
          <div>
            <TitleBar />
          </div>
          <div className="login__copy-and-form">
            <div className="login__copy">
              <LoginCopy />
            </div>
            <div>
              <Registration />
            </div>
          </div>
          <div>
            <FooterContent className="footer-content--login-page" />
          </div>
        </div>
      </div>
    </div>
  );
}

LoginContainer.displayName = "LoginContainer";
