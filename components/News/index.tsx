import React, { useCallback, useMemo } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import Image from "components/Image";
import Loading from "components/Loading";
import Buttonlet from "components/Buttonlet";

import { dismissNewsItem } from "actions/news";

import moment from "moment";
import { IAppState } from "types/app";

function News(props: Props) {
  const { active, dispatch, newsItem } = props;

  const dismiss = useCallback(() => {
    if (!newsItem) {
      return;
    }
    dispatch(dismissNewsItem(newsItem.id));
  }, [dispatch, newsItem]);

  const date = useMemo(() => {
    if (!newsItem) {
      return "";
    }
    return moment(newsItem.atDateTime).format("DD MMMM YYYY");
  }, [newsItem]);

  if (!active) {
    return null;
  }

  if (!newsItem) {
    return <Loading spinner />;
  }

  return (
    <div className="news">
      <div className="news-body">
        <Buttonlet
          classNames={{
            containerClassName: "news__close-button",
          }}
          type="close"
          onClick={dismiss}
        />
        <div
          style={{
            display: "flex",
            marginBottom: "8px",
            marginRight: "28px",
          }}
        >
          <Image
            icon={newsItem.image}
            type="small-icon"
            height={40}
            width={40}
          />
          <div>
            <div className="heading heading--2"> {newsItem.heading} </div>
            <div className="news-topline">
              <div className="heading heading--4">{date}</div>
            </div>
          </div>
        </div>
        <p
          dangerouslySetInnerHTML={{ __html: newsItem.html }}
          style={{ marginBottom: 0 }}
        />
      </div>
    </div>
  );
}

const mapStateToProps = (state: IAppState) => ({
  newsItem: state.news.newsItem,
  active: state.news.active,
});

type Props = ReturnType<typeof mapStateToProps> & {
  dispatch: Function; // eslint-disable-line
};

export default withRouter(connect(mapStateToProps)(News));
