import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import values from 'lodash.values';

class ConnectionList extends Component {
  render() {
    return (
      <div className='user-list'>
        {
          this.props.connections.map(connection => (
            <div key={connection.id}>
              {connection.name}
            </div>
          ))
        }
      </div>
    );
  }
}

ConnectionList.propTypes = {
  connections: PropTypes.arrayOf(PropTypes.shape({
    id: React.PropTypes.number,
    name: React.PropTypes.string
  })).isRequired
};

export default connect(
  state => ({
    connections: values(state.connection.list)
  })
)(ConnectionList);
