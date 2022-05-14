import React, {
  CSSProperties,
  PureComponent,
} from 'react';
import classnames from 'classnames';
import MenuItem from 'components/ScrollNav/MenuItem';

export default class ScrollNav extends PureComponent<Props> {
  static displayName = 'ScrollNav';

  render() {
    const {
      active,
      data,
      gotoItem,
      style,
      inverse,
    } = this.props;

    return (
      <nav style={{ ...style, overflow: 'auto' }}>
        <ol className={classnames('nav__list', inverse && 'scroll-nav--inverse')}>
          {data && !!data.length && data.map(item => (
            <MenuItem
              key={item.id}
              active={item.id === active}
              data={item}
              onClick={() => gotoItem(item)}
              inverse={inverse}
            />
          ))}
        </ol>
      </nav>
    );
  }
}

type Props = {
  active?: number | string | null,
  data: {
    id?: number | string,
    name: string,
    description?: string,
  }[],
  gotoItem: (...args: any) => void,
  inverse?: boolean,
  style?: CSSProperties,
};
