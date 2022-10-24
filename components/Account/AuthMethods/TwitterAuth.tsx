import LinkTwitterAccount from "components/Account/AuthMethods/LinkTwitterAccount";
import TippyWrapper from "components/TippyWrapper";
import React, { useCallback, useMemo } from "react";
import classnames from "classnames";
import { connect, useDispatch } from "react-redux";
import { IAppState } from "types/app";
import { unlinkSocialAccount } from "actions/settings";

function TwitterAuth(props: Props) {
  const {
    buttonClassName,
    data: { emailAuth, facebookAuth, twitterAuth },
  } = props;

  const dispatch = useDispatch();

  const onClickToUnlink = useCallback(() => {
    dispatch(unlinkSocialAccount("twitter"));
  }, [dispatch]);

  const onFailure = useCallback((reason: string | Error) => {
    console.error("Failed to link Twitter account; original reason follows:");
    console.error(reason);
  }, []);

  const linkedComponent = useMemo(() => {
    const canUnlink = emailAuth || facebookAuth;
    if (canUnlink) {
      return (
        <button
          type="button"
          className={classnames("button--link", buttonClassName)}
          onClick={onClickToUnlink}
        >
          Unlink Twitter from this account
        </button>
      );
    }
    return (
      <TippyWrapper
        tooltipData={{
          description:
            "Your account must be either linked to Facebook or to an email address" +
            " before you can unlink Twitter.",
        }}
      >
        <span style={{ cursor: "default" }}>
          Unlink Twitter from this account
        </span>
      </TippyWrapper>
    );
  }, [buttonClassName, emailAuth, facebookAuth, onClickToUnlink]);

  const unlinkedComponent = useMemo(
    () => (
      <LinkTwitterAccount
        buttonClassName={buttonClassName}
        onFailure={onFailure}
      />
    ),
    [buttonClassName, onFailure]
  );

  return (
    <>
      <i className="fa fa-fw fa-twitter" />{" "}
      {twitterAuth ? linkedComponent : unlinkedComponent}
    </>
  );
}

type OwnProps = {
  buttonClassName?: string;
};

const mapStateToProps = ({ settings: { data } }: IAppState) => ({ data });

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(TwitterAuth);
