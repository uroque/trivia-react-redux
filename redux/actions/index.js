export const SAVE_USER = 'SAVE_USER';
export const SAVE_QUESTIONS = 'SAVE_QUESTIONS';
export const SAVE_TIMER = 'SAVE_TIMER';

export const saveUser = (user) => ({
  type: SAVE_USER,
  user,
});

export const saveQuestions = (questions) => ({
  type: SAVE_QUESTIONS,
  questions,
});

export const saveTimer = (time) => ({
  type: SAVE_TIMER,
  time,
});
