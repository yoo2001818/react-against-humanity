import React, { Component, PropTypes } from 'react';

export default class SidebarEntry extends Component {
  render() {
    const { name, hideHeader, children } = this.props;
    return (
      <section className='sidebar-entry'>
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
  children: PropTypes.node
};
