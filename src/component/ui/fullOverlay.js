import React, { Component, PropTypes } from 'react';

import classNames from 'classnames';

// Full-sized loading page.

export default class FullOverlay extends Component {
  render() {
    const { children, filter } = this.props;
    return (
      <div className={classNames('full-overlay', { filter })}>
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
  children: PropTypes.node,
  filter: PropTypes.bool
};
