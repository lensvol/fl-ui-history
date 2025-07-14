import React from "react";

import Image from "components/Image";
import Loading from "components/Loading";

import { useAppSelector } from "features/app/store";

export default function LoginCopy() {
  const accessCode = useAppSelector((state) => state.accessCodes.accessCode);
  const isFetching = useAppSelector((state) => state.accessCodes.isFetching);

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
    <>
      <h2 className="heading heading--2">
        Forty years ago, London was stolen by bats.
      </h2>
      <p
        style={{
          marginTop: "0.5em",
        }}
      >
        Discover a dark and hilarious Gothic underworld where Hell is close,
        immortality is cheap, and the screaming has largely stopped&hellip;
      </p>
      <p>Welcome. Delicious friend.</p>
      <hr />
      <p
        style={{
          marginBottom: 0,
        }}
      >
        &ldquo;[This] world will ease itself into your spare tabs, onto your
        phone and behind your eyelids&hellip; It can provide, for you, regular
        smatterings of whimsy, awe and delight&mdash;if only you&rsquo;ll let
        yourself fall in.&rdquo;
      </p>
      <p
        style={{
          marginBottom: "1em",
          textAlign: "right",
        }}
      >
        <em>PC Gamer</em>
      </p>
      <p
        style={{
          marginBottom: 0,
        }}
      >
        &ldquo;Fallen London [is] a free-to-play text-based browser game&hellip;
        an open-world RPG that subsists mostly on the written word to spin
        bizarre tales.&rdquo;
      </p>
      <p
        style={{
          marginBottom: "1em",
          textAlign: "right",
        }}
      >
        <em>Unwinnable</em>
      </p>
    </>
  );
}
