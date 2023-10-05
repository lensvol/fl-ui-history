import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import classnames from "classnames";

type Props = {
  /**
   * The contents to be shown or hidden by the {@link Disclosure} control.
   */
  children: ReactNode;

  /**
   * Gets the text that appears on the {@link Disclosure} control itself.
   * The user clicks on this text to open and close it.
   * Useful for customising the text over the lifetime of the control.
   * @param isOpen true, if the control is currently open; false, if the control is currently closed.
   * @returns The text to use for the control.
   */
  getDisclosureText: (isOpen: boolean) => string;

  /**
   * Indicates whether the {@link Disclosure} control starts out opened or closed.
   * If omitted, it defaults to closed.
   */
  isInitiallyOpen?: boolean;

  /**
   * An event which gets called just before the {@link Disclosure} transitions between the open and closed states.
   * Useful for customising the behaviour of the transition between states.
   * @param isClosing true, if the control is open and about to close; false, if the control is closed and about to open.
   */
  onBeforeToggle?: (isClosing: boolean) => void;

  /**
   * An event which gets called once, when the {@link Disclosure} first loads.
   * Useful for customising the initial setup of the control.
   * @param isInitiallyOpen true, if {@link Props.isInitiallyOpen} is true; false, if it is either false or undefined.
   */
  onInitialLoad?: (isInitiallyOpen: boolean) => void;
};

/**
 * A control which the allows the user to selectively show or hide its contents.
 * @param properties The properties passed to this control.
 * @returns A disclosure control surrounding the elements inside it.
 */
export default function Disclosure({
  children,
  getDisclosureText,
  isInitiallyOpen,
  onBeforeToggle,
  onInitialLoad,
}: Props) {
  // tracks open/close state
  const [isDisclosureOpen, setIsDisclosureOpen] = useState(
    isInitiallyOpen ?? false
  );

  // reference to the <div> directly containing children; used for animating the control
  const disclosureDivRef = useRef<HTMLDivElement>(null);

  // adapted from https://css-tricks.com/using-css-transitions-auto-dimensions/
  const doCloseDisclosure = useCallback(async () => {
    if (!disclosureDivRef.current) {
      return;
    }

    // get the height of the element's inner content, regardless of its actual size
    var sectionHeight = disclosureDivRef.current.scrollHeight;

    // temporarily disable all css transitions
    var elementTransition = disclosureDivRef.current.style.transition;
    disclosureDivRef.current.style.transition = "";

    // on the next frame (as soon as the previous style change has taken effect),
    // explicitly set the element's height to its current pixel height, so we
    // aren't transitioning out of 'auto'
    requestAnimationFrame(function () {
      if (!disclosureDivRef.current) {
        return;
      }

      disclosureDivRef.current.style.height = sectionHeight + "px";
      disclosureDivRef.current.style.transition = elementTransition;

      // on the next frame (as soon as the previous style change has taken effect),
      // have the element transition to height: 0
      requestAnimationFrame(function () {
        if (!disclosureDivRef.current) {
          return;
        }

        disclosureDivRef.current.style.height = 0 + "px";
      });
    });
  }, [disclosureDivRef]);

  const doOpenDisclosure = useCallback(async () => {
    if (!disclosureDivRef.current) {
      return;
    }

    // get the height of the element's inner content, regardless of its actual size
    var sectionHeight = disclosureDivRef.current.scrollHeight;

    // have the element transition to the height of its inner content
    disclosureDivRef.current.style.height = sectionHeight + "px";
  }, [disclosureDivRef]);

  const onToggleDisclosure = useCallback(async () => {
    onBeforeToggle?.(isDisclosureOpen);

    if (isDisclosureOpen) {
      doCloseDisclosure();
    } else {
      doOpenDisclosure();
    }

    setIsDisclosureOpen(!isDisclosureOpen);
  }, [
    doCloseDisclosure,
    doOpenDisclosure,
    isDisclosureOpen,
    onBeforeToggle,
    setIsDisclosureOpen,
  ]);

  const onTransitionEnd = useCallback(async () => {
    if (disclosureDivRef.current && isDisclosureOpen) {
      disclosureDivRef.current.style.height = "auto";
    }
  }, [disclosureDivRef, isDisclosureOpen]);

  const [disclosureDidLoad, setDisclosureDidLoad] = useState(false);
  const disclosureText = getDisclosureText(isDisclosureOpen);

  useEffect(() => {
    if (disclosureDidLoad) {
      // only let this effect run once
      return;
    }

    if (disclosureDivRef.current && isInitiallyOpen) {
      disclosureDivRef.current.style.height = "auto";
    }

    // user-defined event to run when the control loads
    onInitialLoad?.(isInitiallyOpen ?? false);

    setDisclosureDidLoad(true);
  }, [
    disclosureDidLoad,
    disclosureDivRef,
    isInitiallyOpen,
    onInitialLoad,
    setDisclosureDidLoad,
  ]);

  return (
    <div
      className={classnames(
        "disclosure-wrapper",
        isDisclosureOpen && "disclosure-wrapper--open"
      )}
    >
      <div className="disclosure-container">
        <button
          className="disclosure-control"
          onClick={onToggleDisclosure}
          type="button"
        >
          {disclosureText}{" "}
          <span
            className={classnames(
              "fa",
              isDisclosureOpen ? "fa-chevron-up" : "fa-chevron-down"
            )}
          ></span>
        </button>
      </div>
      <div
        className="disclosure-children"
        ref={disclosureDivRef}
        onTransitionEnd={onTransitionEnd}
      >
        {children}
      </div>
    </div>
  );
}

Disclosure.displayName = "Disclosure";
