import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

class Feedback extends Component {
  constructor() {
    super();

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const { history } = this.props;
    history.push('/');
  }

  render() {
    const user = JSON.parse(localStorage.getItem('state'));
    const { player } = user;
    return (
      <>
        <img alt="foto de avatar" data-testid="header-profile-picture" />
        <p data-testid="header-player-name">{player.name}</p>
        <p data-testid="header-score">{player.score}</p>
        <p data-testid="feedback-text">
          {
            (player.assertions < 2 + 1) ? 'Podia ser melhor...' : 'Mandou bem!'
          }
        </p>
        <p data-testid="feedback-total-score">{player.score}</p>
        <p data-testid="feedback-total-question">{player.assertions}</p>
        <button
          type="button"
          data-testid="btn-play-again"
          onClick={ this.handleClick }
        >
          Jogar novamente
        </button>
      </>
    );
  }
}

Feedback.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user.player,
});

export default connect(mapStateToProps)(Feedback);
