import React from 'react';
import { StickyContainer, Sticky } from 'react-sticky';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import ScrollNav from 'components/ScrollNav';
import Loading from 'components/Loading';
import MediaLgUp from 'components/Responsive/MediaLgUp';
import MediaMdDown from 'components/Responsive/MediaMdDown';
import SearchField from 'components/SearchField';
import { IAppState } from 'types/app';

import ExchangeItems from './components/ExchangeItems';

type OwnProps = {
  filterString: string,
  onSearchFieldChange: (...args: any) => any,
  onStoreSelect: (event: React.ChangeEvent<HTMLSelectElement>) => void,
  quantities: { [key: number]: number },
  shopList: any[],
};

type Props = RouteComponentProps & ReturnType<typeof mapStateToProps> & OwnProps;

export function ExchangeComponent(props: Props) {
  const {
    activeStore,
    description,
    filterString,
    isFetching,
    isFetchingAvailable,
    onSearchFieldChange,
    onStoreSelect,
    quantities,
    shopList,
    title,
  } = props;

  if (isFetching) {
    return <Loading />;
  }

  return (
    <div>
      <h1 className="heading heading--1 exchange__title">{title}</h1>
      <p className="lede">{description}</p>
      <hr />
      <MediaLgUp>
        <StickyContainer style={{ height: 'auto' }} className="row">
          <div className="nav nav--stacked nav--stacked--1-of-4 nav--stacked--roman">
            <Sticky>
              {
                ({ style }) => (
                  <ScrollNav
                    style={style}
                    data={[
                      ...shopList,
                      {
                        id: 'jump-to-top',
                        icon: 'arrow-up',
                        name: 'Jump to top',
                      },
                    ]}
                    gotoItem={onStoreSelect}
                    active={activeStore}
                    inverse
                  />
                )
              }
            </Sticky>
          </div>

          <div className="stack-content stack-content--3-of-4 shop">
            <SearchField value={filterString} onChange={onSearchFieldChange} />
            {isFetchingAvailable ? <Loading /> : (
              <ExchangeItems
                quantities={quantities}
                filterString={filterString}
              />
            )}
          </div>
        </StickyContainer>
      </MediaLgUp>

      <MediaMdDown>
        <SearchField value={filterString} onChange={onSearchFieldChange} />
        <div style={{ position: 'sticky', top: 0, zIndex: 1 }}>
          <select
            className="form__control js-selector"
            value={activeStore || 'sell-my-things'}
            onChange={onStoreSelect}
          >
            {shopList.map(({ id, name }) => <option key={id} value={id || 'sell-my-things'}>{name}</option>)}
          </select>
        </div>
        {isFetchingAvailable ? <Loading /> : (
          <ExchangeItems
            quantities={quantities}
            filterString={filterString}
          />
        )}
      </MediaMdDown>
    </div>
  );
}

const mapStateToProps = ({ exchange }: IAppState) => (
  {
    activeStore: exchange.activeStore,
    description: exchange.description,
    exchangeData: exchange.data,
    isFetching: exchange.isFetching,
    isFetchingAvailable: exchange.isFetchingAvailable,
    isFetchingSellItem: exchange.isFetchingSellItem,
    title: exchange.title,
  });

export default withRouter(connect(mapStateToProps)(ExchangeComponent));
