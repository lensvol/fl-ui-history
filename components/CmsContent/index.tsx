import React, {
  useEffect,
  useState,
} from 'react';
import { connect } from 'react-redux';
import { fetchPage } from 'actions/pages';
import Loading from 'components/Loading';
import { ThunkDispatch } from 'redux-thunk';
import { Success } from 'services/BaseMonadicService';
import { PageName } from 'services/PageService';

interface Props {
  dispatch: ThunkDispatch<any, any, any>,
  pageName: PageName,
}

export function CmsContent({ dispatch, pageName }: Props) {
  const [contentHtml, setContentHtml] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const minimumLoadingTime = 1000;

  // const dispatch = useDispatch();

  useEffect(() => {
    asyncUseEffect();

    let timeout: ReturnType<typeof setTimeout>;

    async function asyncUseEffect() {
      const startTime = new Date();
      setIsLoading(true);
      const response = await dispatch(fetchPage(pageName));
      const duration = new Date().valueOf() - startTime.valueOf();
      timeout = setTimeout(() => {
        setIsLoading(false);
        if (response instanceof Success) {
          setContentHtml(response.data.text);
        }
      }, Math.max(0, minimumLoadingTime - duration));
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [dispatch, pageName]);

  if (!contentHtml) {
    return (
      <div style={{ margin: '1rem auto' }}>
        <Loading spinner />
      </div>
    );
  }

  if (isLoading) {
    return <Loading spinner />;
  }

  return (
    <div
      className="cms-page"
      dangerouslySetInnerHTML={{ __html: contentHtml }}
    />
  );
}

export default connect()(CmsContent);