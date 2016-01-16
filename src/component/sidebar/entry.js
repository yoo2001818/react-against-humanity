import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class SidebarEntry extends Component {
  render() {
    const { title, hideHeader, noPadding, children, className } = this.props;
    return (
      <section
        className={classNames('sidebar-entry', className, {
          'no-padding': noPadding
        })}
      >
        { hideHeader || (
          <div className='header'>
            <h1>{title}</h1>
          </div>
        )}
        <div className='content'>
          {children}
        </div>
      </section>
    );
  }
}

SidebarEntry.propTypes = {
  title: PropTypes.string,
  className: PropTypes.string,
  hideHeader: PropTypes.bool,
  noPadding: PropTypes.bool,
  children: PropTypes.node
};
