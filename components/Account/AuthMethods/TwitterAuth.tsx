import TippyWrapper from "components/TippyWrapper";
import React, { useCallback, useMemo } from "react";
import classnames from "classnames";
import { connect, useDispatch } from "react-redux";
import { IAppState } from "types/app";
import { unlinkSocialAccount } from "actions/settings";

function TwitterAuth(props: Props) {
  const {
    buttonClassName,
    data: { emailAuth, facebookAuth, twitterAuth, googleAuth },
  } = props;

  const dispatch = useDispatch();

  const onClickToUnlink = useCallback(() => {
    dispatch(unlinkSocialAccount("twitter"));
  }, [dispatch]);

  const linkedComponent = useMemo(() => {
    const canUnlink = emailAuth || facebookAuth || googleAuth;
    if (canUnlink) {
      return (
        <>
          <i className="fa fa-fw fa-twitter" />{" "}
          <button
            type="button"
            className={classnames("button--link", buttonClassName)}
            onClick={onClickToUnlink}
          >
            Unlink Twitter from this account
          </button>
        </>
      );
    }
    return (
      <>
        <i className="fa fa-fw fa-twitter" />{" "}
        <TippyWrapper
          tooltipData={{
            description:
              "Your account must be linked to Facebook, Google, or to an email address" +
              " before you can unlink Twitter.",
          }}
        >
          <span style={{ cursor: "default" }}>
            Unlink Twitter from this account
          </span>
        </TippyWrapper>
      </>
    );
  }, [buttonClassName, emailAuth, facebookAuth, googleAuth, onClickToUnlink]);

  const unlinkedComponent = useMemo(() => <></>, []);

  return <>{twitterAuth ? linkedComponent : unlinkedComponent}</>;
}

type OwnProps = {
  buttonClassName?: string;
};

const mapStateToProps = ({ settings: { data } }: IAppState) => ({ data });

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(TwitterAuth);
