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
  title: PropTypes.node,
  children: PropTypes.node
};

export default class RoomInspector extends Component {
  render() {
    const { room, showCount } = this.props;
    return (
      <div className='room-inspector'>
        <Pane title={(
          <div className='float'>
            <div className='name'>접속자</div>
            {showCount && (
              <div className='count'>
                <span className='current'>
                  {room.playerCount || 1}
                </span>
                <span className='max'>
                  {room.maxPlayerCount || 1}
                </span>
              </div>
            )}
          </div>
        )}>
          <ul>
            {Array(room.playerCount).fill(0).map((_, key) => (
              <li key={key}>A player</li>
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
  }),
  showCount: PropTypes.bool
};
