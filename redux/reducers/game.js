import { SAVE_QUESTIONS, SAVE_TIMER } from '../actions';

const INITIAL_STATE = {
  questions: {},
  time: 30,
};

const questions = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case SAVE_QUESTIONS:
    return ({
      ...state,
      questions: action.questions,
    });
  case SAVE_TIMER:
    return ({
      ...state,
      time: action.time,
    });
  default:
    return state;
  }
};

export default questions;
