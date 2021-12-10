import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class Questions extends Component {
  constructor() {
    super();

    this.state = {
      isDisabled: false,
    };
  }

  componentDidMount() {
    this.disableButton();
  }

  disableButton() {
    const thirtySeconds = 30000;
    setTimeout(() => {
      this.setState({ isDisabled: true });
    }, thirtySeconds);
  }

  handleClick() {
    const allButtons = document.querySelectorAll('button');
    allButtons.forEach((element) => {
      if (element.id) {
        element.classList.add('correct');
      } else {
        element.classList.add('incorrect');
      }
    });
    const nextBtn = document.createElement('button');
    nextBtn.setAttribute('data-testid', 'btn-next');
    nextBtn.innerText = 'Próxima';
    document.querySelector('.questions-container').appendChild(nextBtn);
    nextBtn.addEventListener('click', () => window.location.reload());
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
    return (
      <div className="questions-container">
        <p data-testid="question-category">{ questions.category }</p>
        <p data-testid="question-text">{ questions.question }</p>
        { questions.answers && questions.answers.map((answer) => (
          answer.correct
            ? this.renderButtonTrue(answer)
            : this.renderButtonFalse(answer)
        ))}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  questions: state.game.questions,
  time: state.game.time,
});

Questions.propTypes = {
  questions: PropTypes.shape(PropTypes.string).isRequired,
};

export default connect(mapStateToProps)(Questions);
