import { SAVE_USER } from '../actions';

const INITIAL_STATE = {
  player: { score: 0, assertions: 0, name: '', gravatarEmail: '' },
};

const user = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case SAVE_USER:
    return ({
      ...state,
      player: action.user,
    });
  default:
    return state;
  }
};

export default user;
