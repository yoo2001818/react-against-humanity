import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { routeActions } from 'redux-simple-router';
import * as roomActions from '../action/room';

import RoomList from '../container/roomList';
// import __ from '../lang';

export default class Lobby extends Component {
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
  dispatchTest() {
    this.props.dispatch(roomActions.create({
      name: '괴상한 방'
    })).then(action => {
      // Navigate to the room.
      let roomId = action.meta.target.room;
      this.props.dispatch(routeActions.push(`/room/${roomId}`));
    });
  }
  render() {
    const { selected } = this.state;
    return (
      <div className='lobby-view'>
        <div className='list-column'>
          <RoomList
            onSelect={this.handleSelect.bind(this)}
            selected={selected}
          />
          <button onClick={this.dispatchTest.bind(this)}>방 만들기</button>
        </div>
        <div className='details-column'>
          {/* We display nothing in this column, as the room entry will
            * expand to this column.
            */}
        </div>
      </div>
    );
  }
}

Lobby.propTypes = {
  dispatch: PropTypes.func.isRequired
};

export default connect(() => ({}))(Lobby);
