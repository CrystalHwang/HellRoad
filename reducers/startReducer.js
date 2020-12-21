import { CHECK_START } from '../constants/actionTypes';

const initialState = {
  navigate: false
};

const startReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHECK_START:
      return { ...state, ...action.payload };

    default:
      return state;
  }
};

export default startReducer;
