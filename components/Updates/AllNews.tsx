import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";

import moment from "moment";

import { fetchAllNews } from "actions/news/fetchAllNews";

import Image from "components/Image";
import Loading from "components/Loading";
import NewsNav from "components/Updates/NewsNav";

import { useAppSelector } from "features/app/store";

import { NewsResponse } from "services/NewsService";

export default function AllNews() {
  const dispatch = useDispatch();
  const allNewsItems = useAppSelector((state) => state.news.allNewsItems);

  const [isLoading, setIsLoading] = useState(false);
  const [didLoad, setDidLoad] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (didLoad) {
      // only run once
      return;
    }

    asyncUseEffect();

    async function asyncUseEffect() {
      setIsLoading(true);

      await dispatch(fetchAllNews());

      setIsLoading(false);
      setDidLoad(true);
    }
  }, [didLoad, dispatch]);

  const newsItem = useMemo(() => {
    if (allNewsItems.length === 0) {
      return {
        heading: "No News Today",
        html: "Check out <a href='https://www.failbettergames.com/news' target='_blank'>our blog</a> for recent news.",
        image: "newspaper",
      } as NewsResponse;
    }

    return allNewsItems[index];
  }, [allNewsItems, index]);

  const date = useMemo(() => {
    const theDate =
      allNewsItems.length === 0 ? Date.now() : newsItem.atDateTime;

    return moment(theDate).format("DD MMMM YYYY");
  }, [allNewsItems, newsItem]);

  const onShowNewer = useCallback(() => {
    if (index < 1) {
      return;
    }

    setIndex(index - 1);
  }, [index]);

  const onShowOlder = useCallback(() => {
    if (index + 1 >= allNewsItems.length) {
      return;
    }

    setIndex(index + 1);
  }, [allNewsItems, index]);

  if (isLoading || !didLoad) {
    return <Loading spinner />;
  }

  return (
    <div className="all-news-container">
      <div className="all-news-image">
        <Image
          border="Unspecialised"
          borderContainerClassName="small-card__border"
          className="media__object small-card__image"
          icon={newsItem.image}
          type="icon"
        />
        <NewsNav
          isFirst={index < 1}
          isLast={index >= allNewsItems.length - 1}
          onShowNewer={onShowNewer}
          onShowOlder={onShowOlder}
        />
      </div>
      <div className="all-news-body">
        <div>
          <div className="heading heading--2">{newsItem.heading}</div>
          <div className="heading heading--4">{date}</div>
        </div>
        <div dangerouslySetInnerHTML={{ __html: newsItem.html }} />
      </div>
    </div>
  );
}

AllNews.displayName = "AllNews";
