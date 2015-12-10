import React, { Component, PropTypes } from 'react';

export default class MessageItem extends Component {
  render() {
    return (
      <div className='message'>
        {this.props.message}
      </div>
    );
  }
}

MessageItem.propTypes = {
  message: PropTypes.string
};
