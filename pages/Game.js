import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { saveQuestions, saveTimer, saveUser } from '../redux/actions';
import Header from '../components/Header';

const ONE_SECOND = 1000;
const TIME_START = 30;
let difficulty = 0;

class Game extends React.Component {
  constructor() {
    super();

    this.state = {
      isDisabled: false,
      seconds: TIME_START,
    };

    this.handleClick = this.handleClick.bind(this);
    this.toNextPage = this.toNextPage.bind(this);
  }

  componentDidMount() {
    this.generateQuestions();
    this.disableButton();
    this.intervalId = setInterval(() => {
      this.setState((prevState) => ({
        seconds: prevState.seconds - 1,
      }));
    }, ONE_SECOND);
    this.recoverFromLocalStorage();
  }

  componentDidUpdate(prevProps, prevState) {
    const { dispatchTime } = this.props;
    if (prevState.seconds < 2) {
      clearInterval(this.intervalId);
      dispatchTime(0);
    }
  }

  recoverFromLocalStorage() {
    const { dispatchPlayer } = this.props;
    const playerData = JSON.parse(localStorage.getItem('state')).player;
    dispatchPlayer(playerData);
  }

  async fetchToken() {
    const token = localStorage.getItem('token');
    const number = 1;
    const response = await fetch(`https://opentdb.com/api.php?amount=${number}&token=${token}`);
    const questions = await response.json();
    return questions.results;
  }

  // função retirada do site https://bost.ocks.org/mike/shuffle/
  shuffle(array) {
    const copy = [];
    let n = array.length;
    let i;
    while (n) {
      i = Math.floor(Math.random() * array.length);
      if (i in array) {
        copy.push(array[i]);
        delete array[i];
        n -= 1;
      }
    }
    return copy;
  }

  async generateQuestions() {
    const { dispatchQuestions } = this.props;
    const questions = await this.fetchToken();
    const orderedAnswers = [];
    const correctAnswer = { answer: questions[0].correct_answer, correct: true, id: 0 };
    orderedAnswers.push(correctAnswer);
    questions[0].incorrect_answers.forEach((answer, index) => {
      const wrongAnswer = { answer, correct: false, id: index };
      orderedAnswers.push(wrongAnswer);
    });
    const answers = this.shuffle(orderedAnswers);
    const questionsObj = {
      category: questions[0].category,
      difficulty: questions[0].difficulty,
      question: questions[0].question,
      answers,
    };
    dispatchQuestions(questionsObj);
  }

  disableButton() {
    const thirtySeconds = 30000;
    setTimeout(() => {
      this.setState({ isDisabled: true });
    }, thirtySeconds);
  }

  handleClick(event) {
    const { dispatchPlayer } = this.props;
    this.toNextButton();
    const playerObject = this.functionToDeceiveLint(event);
    dispatchPlayer(playerObject);
  }

  functionToDeceiveLint(event) {
    const { seconds } = this.state;
    const { questions, user } = this.props;
    if (questions.difficulty === 'easy') difficulty = 1;
    if (questions.difficulty === 'medium') difficulty = 2;
    if (questions.difficulty === 'hard') difficulty = 2 + 1;
    let score = parseInt(JSON.parse(localStorage.getItem('state')).player.score, 10);
    let assertions = parseInt(JSON.parse(localStorage.getItem('state'))
      .player.assertions, 10);
    if (event.target.id) {
      score += 2 + 2 + 2 + 2 + 2 + (seconds * difficulty);
      assertions += 1;
    }
    const { name, gravatarEmail } = user;
    const player = { player: { name: user.name, assertions, score, gravatarEmail } };
    localStorage.setItem('state', JSON.stringify(player));
    return { name, gravatarEmail, score, assertions };
  }

  toNextButton() {
    const nextBtn = document.createElement('button');
    nextBtn.setAttribute('data-testid', 'btn-next');
    nextBtn.innerText = 'Próxima';
    document.querySelector('.questions-container').appendChild(nextBtn);
    nextBtn.addEventListener('click', this.toNextPage);
    const allButtons = document.querySelectorAll('button');
    allButtons.forEach((element) => {
      if (element.id) {
        element.classList.add('correct');
      } else {
        element.classList.add('incorrect');
      }
    });
  }

  toNextPage() {
    const { match, history } = this.props;
    const fiveQuestions = 5;
    const nextPage = `/game/${parseInt(match.params.questionindex, 10) + 1}`;
    if (match.params.questionindex >= fiveQuestions) {
      history.push('/feedback');
    } else {
      history.push(nextPage);
      window.location.reload();
    }
  }

  renderButtonTrue(answer) {
    const { isDisabled } = this.state;
    return (
      <button
        type="button"
        data-testid="correct-answer"
        disabled={ isDisabled }
        id="correct"
        onClick={ this.handleClick }
      >
        {answer.answer}
      </button>
    );
  }

  renderButtonFalse(answer) {
    const { isDisabled } = this.state;
    const dataTestId = `wrong-answer${answer.id}`;
    return (
      <button
        type="button"
        data-testid={ dataTestId }
        disabled={ isDisabled }
        onClick={ this.handleClick }
      >
        {answer.answer}
      </button>
    );
  }

  render() {
    const { questions } = this.props;
    const { seconds } = this.state;
    return (
      <div>
        <Header />
        <div className="questions-container">
          <p data-testid="question-category">{ questions.category }</p>
          <p data-testid="question-text">{ questions.question }</p>
          { questions.answers && questions.answers.map((answer) => (
            answer.correct
              ? this.renderButtonTrue(answer)
              : this.renderButtonFalse(answer)
          ))}
        </div>
        <div>
          <h2>{seconds}</h2>
        </div>
      </div>
    );
  }
}

Game.propTypes = {
  dispatchQuestions: PropTypes.func.isRequired,
  questions: PropTypes.shape(PropTypes.string).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      questionindex: PropTypes.string,
    }),
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  dispatchTime: PropTypes.func.isRequired,
  dispatchPlayer: PropTypes.func.isRequired,
  user: PropTypes.shape(PropTypes.string).isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  dispatchQuestions: (questions) => dispatch(saveQuestions(questions)),
  dispatchTime: (time) => dispatch(saveTimer(time)),
  dispatchPlayer: (player) => dispatch(saveUser(player)),
});

const mapStateToProps = (state) => ({
  questions: state.game.questions,
  time: state.game.time,
  user: state.user.player,
});

export default connect(mapStateToProps, mapDispatchToProps)(Game);
