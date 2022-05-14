import { buildTooltipData } from 'components/SidebarQualities/utils';
import React, { Component } from 'react';

import { normalize } from 'utils/stringFunctions';
import Modal from 'components/Modal';
import Image from 'components/Image';
import { IQuality } from 'types/qualities';

interface State {
  filterString: string,
}

export default class QualityPicker extends Component<Props, State> {
  mounted = false;

  state = {
    filterString: '',
  };

  componentDidMount = () => {
    this.mounted = true;
  };

  componentWillUnmount = () => {
    this.mounted = false;
  };

  handleClick = (item: IQuality) => {
    const { onChoose, onRequestClose } = this.props;
    onChoose(item);
    onRequestClose();
  };

  handleFilterStringChange = (evt: any) => {
    this.setState({ filterString: evt.target.value });
  };

  render = () => {
    const {
      activateButtonLabel,
      header,
      isOpen,
      qualities,
      onRequestClose,
    } = this.props;
    const { filterString } = this.state;

    return (
      <Modal
        isOpen={isOpen}
        className="modal-dialog--quality-picker"
        onRequestClose={onRequestClose}
      >
        <div className="quality-picker">
          <h1 className="heading heading--3">
            {header}
          </h1>
          <input
            className="form__control"
            placeholder="Search"
            type="text"
            value={filterString}
            onChange={this.handleFilterStringChange}
          />
          <div className="quality-picker__items">
            {qualities
              .filter(q => normalize(q.name).indexOf(normalize(filterString)) >= 0)
              .map(item => (
                <div className="icon icon--inventory quality-picker__item" key={item.id}>
                  <Image
                    icon={item.image}
                    alt={item.nameAndLevel || item.name}
                    type="small-icon"
                    width={50}
                    height={50}
                    onClick={() => this.handleClick(item)}
                    style={{ cursor: 'pointer', imageRendering: 'auto' }}
                    tooltipData={{
                      ...buildTooltipData(item),
                      smallButtons: [{
                        label: activateButtonLabel,
                        action: () => this.handleClick(item),
                      }],
                    }}
                  />
                </div>
              ))}
          </div>
        </div>
      </Modal>
    );
  }
}

interface Props {
  activateButtonLabel: string,
  header: string,
  isOpen: boolean,
  qualities: IQuality[],
  onChoose: (quality: IQuality) => void,
  onRequestClose: () => void,
}
