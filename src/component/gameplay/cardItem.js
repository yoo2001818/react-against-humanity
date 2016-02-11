import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class CardItem extends Component {
  handleKeyDown(e) {
    if (e.keyCode === 13 || e.keyCode === 32) {
      if (this.props.onSelect) this.props.onSelect();
      e.preventDefault();
    }
  }
  render() {
    const { card, blind, selected, canSelect, selectIndicator,
      onSelect = () => {} } = this.props;
    if (card == null) return false;
    return (
      <div
        className={classNames('card-item-component', {
          question: card.type === 'Q',
          answer: card.type === 'A',
          selected, canSelect
        })}
        onClick={onSelect}
        onKeyDown={this.handleKeyDown.bind(this)}
        tabIndex={canSelect ? 0 : null}
      >
        { canSelect && selected && selectIndicator != null && (
          <div className='select-indicator'>
            { selectIndicator }
          </div>
        )}
        { !blind && card.text }
      </div>
    );
  }
}

CardItem.propTypes = {
  card: PropTypes.shape({
    type: PropTypes.oneOf(['Q', 'A']),
    text: PropTypes.string
  }),
  selected: PropTypes.bool,
  selectIndicator: PropTypes.node,
  canSelect: PropTypes.bool,
  onSelect: PropTypes.func,
  blind: PropTypes.bool
};
