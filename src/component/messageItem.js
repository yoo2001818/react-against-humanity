import React, { Component, PropTypes } from 'react';

export default class MessageItem extends Component {
  render() {
    const { message, type, connection } = this.props;
    if (type === 'join') {
      return (
        <div className='message'>
          {connection.name} has joined the server
        </div>
      );
    }
    if (type === 'leave') {
      return (
        <div className='message'>
          {connection.name} has left the server
        </div>
      );
    }
    return (
      <div className='message'>
        {connection.name}: {message}
      </div>
    );
  }
}

MessageItem.propTypes = {
  message: PropTypes.string,
  type: PropTypes.string,
  connection: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string
  })
};
