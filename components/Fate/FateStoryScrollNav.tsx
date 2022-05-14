import React, { Component } from 'react';
import ScrollNav from 'components/ScrollNav';
import { IFateCard } from 'types/fate';
import {
  DUMMY_YEAR_FOR_UNDATED_STORIES,
} from './utils';

type Props = {
  active: string | number | undefined,
  cards: IFateCard[],
  onClickItem: (year: number) => void,
  style: any,
};

export default class FateStoryScrollNav extends Component<Props> {
  getScrollNavItems = () => {
    const {
      cards,
    } = this.props;
    const uniqueYears = Array.from(new Set(cards.map(card => new Date(card.releaseDate).getFullYear())));
    return uniqueYears
      .map(year => ({
        id: year,
        name: year === DUMMY_YEAR_FOR_UNDATED_STORIES ? 'Undated' : year.toString(),
        description: year === DUMMY_YEAR_FOR_UNDATED_STORIES ? 'Undated stories' : `Stories released in ${year}`,
      }));
  };

  render = () => {
    const {
      active,
      onClickItem,
      style,
    } = this.props;
    const scrollNavItems = this.getScrollNavItems();

    return (
      <ScrollNav
        active={active}
        data={scrollNavItems}
        style={style}
        gotoItem={({ id }: { id: string }) => onClickItem(parseInt(id, 10))}
        inverse
      />
    );
  };
}
