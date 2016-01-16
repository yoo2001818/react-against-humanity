import React, { Component, PropTypes } from 'react';

class Pane extends Component {
  render() {
    const { title, children } = this.props;
    return (
      <div className='pane'>
        <div className='header'>{title}</div>
        <div className='content'>
          {children}
        </div>
      </div>
    );
  }
}

Pane.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node
};

export default class RoomInspector extends Component {
  render() {
    const { room } = this.props;
    return (
      <div className='room-inspector'>
        <Pane title='접속자'>
          <ul>
            {Array(room.playerCount).fill(0).map(() => (
              <li>A player</li>
            ))}
          </ul>
        </Pane>
        <Pane title='규칙'>
          None.
        </Pane>
        <Pane title='덱'>
          None.
        </Pane>
      </div>
    );
  }
}

RoomInspector.propTypes = {
  room: PropTypes.shape({
    id: React.PropTypes.number,
    name: React.PropTypes.string
  })
};
