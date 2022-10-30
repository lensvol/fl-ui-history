import { useAppDispatch, useAppSelector } from "features/app/store";
import React, { useCallback, useMemo } from "react";
import { withRouter } from "react-router-dom";

import Image from "components/Image";
import Loading from "components/Loading";
import Buttonlet from "components/Buttonlet";

import { dismissNewsItem } from "actions/news";

import moment from "moment";

function News() {
  const newsItem = useAppSelector((state) => state.news.newsItem);
  const active = useAppSelector((state) => state.news.active);
  const isFetching = useAppSelector((state) => state.news.isFetching);
  const dispatch = useAppDispatch();

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

  if (isFetching) {
    return <Loading spinner />;
  }

  if (!newsItem) {
    return null;
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

export default withRouter(News);
