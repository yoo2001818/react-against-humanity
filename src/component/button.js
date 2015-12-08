import '../style/button.scss';

import React, { Component, PropTypes } from 'react';

export default class Button extends Component {
  render() {
    const { children } = this.props;
    return (
      <button className='button-component'>
        {children}
      </button>
    );
  }
}

Button.propTypes = {
  children: PropTypes.node
};
