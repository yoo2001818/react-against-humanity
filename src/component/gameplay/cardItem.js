import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class CardItem extends Component {
  render() {
    const { card } = this.props;
    if (card == null) return false;
    return (
      <div className={classNames('card-item-component', {
        question: card.type === 'Q',
        answer: card.type === 'A'
      })}>
        { card.text }
      </div>
    );
  }
}

CardItem.propTypes = {
  card: PropTypes.shape({
    type: PropTypes.oneOf(['Q', 'A']),
    text: PropTypes.string
  })
};
