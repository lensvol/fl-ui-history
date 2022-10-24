import React, { Fragment } from "react";
import { connect } from "react-redux";

import Image from "components/Image";
import Loading from "components/Loading";
import { IAppState } from "types/app";

function LoginCopy({ accessCode, isFetching }: Props) {
  if (isFetching) {
    return <Loading />;
  }

  if (accessCode?.name) {
    return (
      <div className="media">
        <div className="media__left">
          <span className="card card--sm">
            <Image
              className="media__object"
              icon={accessCode?.image}
              alt={accessCode.name}
              width={60}
              height={78}
              type="icon"
            />
          </span>
        </div>
        <div className="media__body">
          <h2 className="heading heading--2">Enter Friend!</h2>
          <p dangerouslySetInnerHTML={{ __html: accessCode.initialMessage }} />
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      <h2 className="heading heading--2">
        Forty years ago, London was stolen by bats.
      </h2>
      <p style={{ marginTop: ".5em" }}>
        Discover a dark and hilarious Gothic underworld where Hell is close,
        immortality is cheap, and the screaming has largely stopped…
      </p>
      <p>Welcome. Delicious friend.</p>
      <hr />
      <p style={{ marginBottom: 0 }}>
        “Fallen London [is] a free-to-play text-based browser game… an
        open-world RPG that subsists mostly on the written word to spin bizarre
        tales.”
      </p>
      <p style={{ textAlign: "right", marginBottom: "1em" }}>
        <em>Unwinnable</em>
      </p>
      <p style={{ marginBottom: 0 }}>
        “Far and away the best browser game of today. Why? Flavour and story.”
      </p>
      <p style={{ textAlign: "right", marginBottom: "1em" }}>
        <em>The New Yorker</em>
      </p>
    </Fragment>
  );
}

/*
LoginCopy.propTypes = {
  accessCode: PropTypes.shape({
    image: PropTypes.string,
    initialMessage: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  isFetching: PropTypes.bool.isRequired,
};

 */

const mapStateToProps = ({
  accessCodes: { accessCode, isFetching },
}: IAppState) => ({
  accessCode,
  isFetching,
});

type Props = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(LoginCopy);
