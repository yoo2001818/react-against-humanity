import '../style/sidePane.scss';

import React, { Component, PropTypes } from 'react';

export default class SidePane extends Component {
  render() {
    const { children } = this.props;
    return (
      <div className='side-pane-right'>
        {children}
      </div>
    );
  }
}

SidePane.propTypes = {
  children: PropTypes.node
};
