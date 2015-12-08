import '../style/fullOverlay.scss';

import React, { Component, PropTypes } from 'react';

// Full-sized loading page.

export default class FullOverlay extends Component {
  render() {
    const { children } = this.props;
    return (
      <div className='full-overlay'>
        <div className='container'>
          <div className='message'>
            <div className='children'>
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

FullOverlay.propTypes = {
  children: PropTypes.node
};
