import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { saveUser } from '../redux/actions';

const API_URL_TRIVIA = 'https://opentdb.com/api_token.php?command=request';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
    };
    this.onChange = this.onChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.settingsButton = this.settingsButton.bind(this);
  }

  onChange({ target: { name, value } }) {
    this.setState({ [name]: value });
  }

  settingsButton() {
    const { history } = this.props;
    history.push('/settingspage');
  }

  async handleClick() {
    const { sendUser, history } = this.props;
    const { name, email } = this.state;
    const userObject = { name, email, score: 0, assertions: 0, gravatarEmail: '' };
    sendUser(userObject);
    const response = await fetch(API_URL_TRIVIA);
    const responseJson = await response.json();
    const { token } = responseJson;
    const playerObject = { player: { name, gravatarEmail: '', score: 0, assertions: 0 } };
    localStorage.setItem('state', JSON.stringify(playerObject));
    localStorage.setItem('token', token);
    history.push('/game/1');
  }

  render() {
    const { name, email } = this.state;
    const isDisabled = !(name.length > 1 && email.length > 1);
    return (
      <>
        <form>
          <label htmlFor="name">
            <input
              data-testid="input-player-name"
              type="text"
              name="name"
              id="name"
              value={ name }
              onChange={ this.onChange }
              placeholder="Digite seu nome"
            />
          </label>

          <label htmlFor="email">
            <input
              data-testid="input-gravatar-email"
              type="email"
              name="email"
              id="email"
              value={ email }
              onChange={ this.onChange }
              placeholder="Digite seu email"
            />
          </label>
          <button
            data-testid="btn-play"
            type="button"
            disabled={ isDisabled }
            onClick={ this.handleClick }
          >
            Jogar
          </button>
        </form>
        <button
          data-testid="btn-settings"
          type="button"
          onClick={ this.settingsButton }
        >
          Configurações
        </button>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  sendUser: (user) => dispatch(saveUser(user)),
});

Login.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  sendUser: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(Login);
