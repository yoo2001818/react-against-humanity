import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import RoomForm from '../container/form/roomForm';
import RoomList from '../container/roomList';
import AppContainer from '../container/appContainer';
import __ from '../lang';

export class RoomCreateItem extends Component {
  render() {
    const { selected, onSelect } = this.props;
    return (
      <div onClick={onSelect}
        className={classNames('room-item create-room', { selected })}
      >
        <div className='header'>
          {__('RoomCreateTitle')}
        </div>
        <div className='info'>
          <RoomForm />
        </div>
      </div>
    );
  }
}

RoomCreateItem.propTypes = {
  selected: PropTypes.bool,
  onSelect: PropTypes.func
};

class Lobby extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null
    };
  }
  handleSelect(id) {
    this.setState({
      selected: id
    });
  }
  render() {
    const { selected } = this.state;
    const { level } = this.props;
    return (
      <AppContainer
        title={__('RoomListTitle')}
      >
        <div className='lobby-view'>
          <div className='list-column'>
            { level !== 'anonymous' && (
              <RoomCreateItem
                onSelect={this.handleSelect.bind(this, -1)}
                selected={selected === -1}
              />
            )}
            <RoomList
              onSelect={this.handleSelect.bind(this)}
              selected={selected}
            />
          </div>
          <div className='details-column'>
            {/* We display nothing in this column, as the room entry will
              * expand to this column.
              */}
          </div>
        </div>
      </AppContainer>
    );
  }
}

Lobby.propTypes = {
  level: PropTypes.string
};

export default connect(state => {
  const connection = state.connection.list[state.connection.self];
  return { level: connection && connection.level };
})(Lobby);
