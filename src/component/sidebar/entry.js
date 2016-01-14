import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class SidebarEntry extends Component {
  render() {
    const { name, hideHeader, noPadding, children } = this.props;
    return (
      <section
        className={classNames('sidebar-entry', {'no-padding': noPadding})}
      >
        { hideHeader || (
          <div className='header'>
            <h1>{name}</h1>
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
  name: PropTypes.string,
  hideHeader: PropTypes.bool,
  noPadding: PropTypes.bool,
  children: PropTypes.node
};
