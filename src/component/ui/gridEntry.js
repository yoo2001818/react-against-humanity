import React, { Component, PropTypes } from 'react';

export default class GridEntry extends Component {
  render() {
    const { title, children } = this.props;
    return (
      <div className='grid-entry-component'>
        <h1 className='title'>
          {title}
        </h1>
        <div className='content'>
          {children}
        </div>
      </div>
    );
  }
}

GridEntry.propTypes = {
  title: PropTypes.node,
  children: PropTypes.node
};
