import React, {
  Fragment,
  useCallback,
  useState,
} from 'react';
import { connect } from 'react-redux';

import CategorySelector from 'components/CategorySelector';
import MediaLgUp from 'components/Responsive/MediaLgUp';
import MediaMdDown from 'components/Responsive/MediaMdDown';
import ScrollNav from 'components/ScrollNav/index';
import SearchField from 'components/SearchField';
import { Sticky, StickyContainer } from 'react-sticky';

import getVisibleCategories from 'selectors/possessions/getVisibleCategories';
import scrollToComponent from 'utils/scrollToComponent';

import InventoryGroup from './InventoryGroup';
import { ICategory } from 'types/possessions';
import { IAppState } from 'types/app';

export function Inventory({
  categories,
  dispatch,
  filterString,
  onFilter,
  scrolling,
}: Props) {
  const [activeItem, setActiveItem] = useState<number | undefined>();

  const onEnterWaypoint = useCallback((id: number) => {
    if (scrolling) {
      return;
    }
    setActiveItem(id);
  }, [scrolling]);

  const onScrollToCategory = useCallback(({ id, name }: { id: number, name: string }) => {
    const el = document.querySelector(`[data-group-name="${name}"]`);
    if (el) {
      setActiveItem(id);
      scrollToComponent(
        el,
        { offset: 0, align: 'top' },
        dispatch,
      );
    }
  }, [dispatch]);

  const renderInventoryGroups = useCallback(() => {
    return categories.map(({ name, qualities }: ICategory, i: number) => (
      <InventoryGroup
        id={i}
        key={name}
        filterString={filterString}
        name={name}
        onEnter={onEnterWaypoint}
        qualities={qualities}
      />
    ));
  }, [
    categories,
    filterString,
    onEnterWaypoint,
  ]);

  return (
    <Fragment>
      <MediaLgUp>
        <StickyContainer style={{ height: 'auto' }} className="row">
          <div className="nav nav--stacked nav--stacked--1-of-4 nav--stacked--roman possessions__menu">
            <Sticky>
              {({ style }) => (
                <ScrollNav
                  active={activeItem}
                  data={categories}
                  style={style}
                  gotoItem={onScrollToCategory}
                  inverse
                />
              )}
            </Sticky>
          </div>
          <div className="stack-content stack-content--3-of-4">
            <SearchField onChange={onFilter} value={filterString} />
            {renderInventoryGroups()}
          </div>
        </StickyContainer>
      </MediaLgUp>

      <MediaMdDown>
        <SearchField onChange={onFilter} value={filterString} />
        <div style={{ position: 'sticky', top: 0, zIndex: 1 }}>
          <CategorySelector
            data={categories.map((c: ICategory, i: number) => ({ ...c, id: i }))}
            gotoItem={onScrollToCategory}
          />
        </div>
        {renderInventoryGroups()}
      </MediaMdDown>
    </Fragment>
  );
}

type OwnProps = {
  categories: ICategory[],
  filterString: string,
  onFilter: (_: any) => void,
};

const mapStateToProps = (state: IAppState, props: OwnProps) => ({
  categories: getVisibleCategories(state, props),
  scrolling: state.scrollToComponent.scrolling,
});

type Props = OwnProps & ReturnType<typeof mapStateToProps> & {
  dispatch: Function,
}

export default connect(mapStateToProps)(Inventory);
