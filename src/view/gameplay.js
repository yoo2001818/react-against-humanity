import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import AppContainer from '../container/appContainer';
import CardItem from '../component/gameplay/cardItem';

import * as GameplayActions from '../action/gameplay';

import __ from '../lang';

class Gameplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: []
    };
  }
  handleSubmit() {
    this.props.dispatch(GameplayActions.submit(this.state.cards));
  }
  handleSelect(id) {
    const { room, connection } = this.props;
    const { gameplay } = room;
    const isCzar = connection.id === gameplay.czar;
    const canSelect = isCzar && gameplay.phase === 'select';
    if (!canSelect) return;
    this.props.dispatch(GameplayActions.select(id));
  }
  handleDeck(id) {
    let cards = this.state.cards;
    if (cards.indexOf(id) !== -1) cards = [];
    const { room } = this.props;
    const { gameplay } = room;
    const { questionCard } = gameplay;
    if (questionCard && questionCard.answerCount <= cards.length) {
      cards = [];
    }
    this.setState({
      cards: cards.concat([id])
    });
  }
  render() {
    const { room, connection } = this.props;
    const { gameplay } = room;
    const currentUser = gameplay.users[connection.id];
    const { cards: selectedCards } = this.state;
    const isCzar = connection.id === gameplay.czar;
    const canSelect = isCzar && gameplay.phase === 'select';
    const canSubmit = !isCzar && gameplay.phase === 'submit';
    return (
      <AppContainer title={room.name}>
        <div className='gameplay-view two-column-view'>
          <div className='list-column'>
            <div className='question'>
              <CardItem card={gameplay.questionCard} />
            </div>
            <div className='answers'>
              {gameplay.answerCards && gameplay.answerCards.map(
                (answer, deckId) =>
              (
                <div className='answer-deck' key={deckId}>
                  {answer.cards.map((card, id) => (
                    <CardItem card={card} key={id}
                      blind={gameplay.phase === 'submit'}
                      onSelect={this.handleSelect.bind(this, deckId)}
                      canSelect={canSelect}
                      selected={deckId === gameplay.selectedAnswer}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className='details-column'>
            <div className='card-list'>
              {currentUser.cards.map((card, id) => (
                <CardItem card={card} key={id}
                  selected={canSubmit && selectedCards.indexOf(id) !== -1}
                  selectIndicator={selectedCards.indexOf(id) + 1}
                  onSelect={this.handleDeck.bind(this, id)}
                  canSelect={canSubmit}
                />
              ))}
              {canSubmit && (
                <div className='card-actions'>
                  <button className='submit'
                    onClick={this.handleSubmit.bind(this)}
                  >
                    {__('SubmitBtn')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </AppContainer>
    );
  }
}

Gameplay.propTypes = {
  room: PropTypes.object,
  connection: PropTypes.object,
  dispatch: PropTypes.func
};

export default connect(() => ({}))(Gameplay);
