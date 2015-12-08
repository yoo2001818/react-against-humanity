import '../style/textInput.scss';

import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class TextInput extends Component {
  render() {
    return (
      <input
        type='text'
        {...this.props}
        className={classNames('text-input-component', this.props.className)}
      />
    );
  }
}

TextInput.propTypes = {
  className: PropTypes.string
};
