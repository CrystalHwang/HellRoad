import { DANGER_LOCATION } from '../constants/actionTypes';

const dangerReducer = (state = [], action) => {
  switch (action.type) {
    case DANGER_LOCATION:
      return [...action.payload];

    default:
      return state;
  }
};

export default dangerReducer;
