import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class Header extends Component {
  render() {
    const { title, right,
      onSidebar = () => {}, showSidebar } = this.props;
    return (
      <div className='header-component'>
        <div className='content'>
          <div className='left'>
            <i
              className={classNames('hamburger', { open: showSidebar })}
              onClick={onSidebar}
            />
            <h1 className='title'>
              { title }
            </h1>
          </div>
          <div className='center'>

          </div>
          <div className='right'>
            { right }
          </div>
        </div>
      </div>
    );
  }
}

Header.propTypes = {
  onSidebar: PropTypes.func,
  showSidebar: PropTypes.bool,
  title: PropTypes.node,
  right: PropTypes.node
};
