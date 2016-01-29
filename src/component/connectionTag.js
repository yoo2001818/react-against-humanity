import React, { Component, PropTypes } from 'react';

export default class ConnectionTag extends Component {
  render() {
    const { connection } = this.props;
    return (
      <span className='connection-tag'>
        {connection.name}
      </span>
    );
  }
}

ConnectionTag.propTypes = {
  connection: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string
  })
};
