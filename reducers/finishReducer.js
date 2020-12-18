import { CHECK_FINISH } from '../constants/actionTypes';

const initialState = {
  navigate: false
};

const finishReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHECK_FINISH:
      return { ...state, ...action.payload };

    default:
      return state;
  }
};

export default finishReducer;
