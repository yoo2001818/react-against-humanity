import '../style/button.scss';

import React, { Component, PropTypes } from 'react';

export default class Button extends Component {
  handleClick(event) {
    if (this.props.onClick) this.props.onClick(event);
  }
  render() {
    const { children } = this.props;
    return (
      <button
        className='button-component'
        onClick={this.handleClick.bind(this)}
      >
        {children}
      </button>
    );
  }
}

Button.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func
};
