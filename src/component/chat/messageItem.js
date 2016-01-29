import React, { Component, PropTypes } from 'react';
import __ from '../../lang';

import ConnectionTag from '../connectionTag';

export default class MessageItem extends Component {
  render() {
    const { message, type, connection } = this.props;
    if (type === 'join') {
      return (
        <div className='message'>
          {__('UserJoin', connection.name)}
        </div>
      );
    }
    if (type === 'leave') {
      return (
        <div className='message'>
          {__('UserLeave', connection.name)}
        </div>
      );
    }
    return (
      <div className='message'>
        <ConnectionTag connection={connection} />: {message}
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
