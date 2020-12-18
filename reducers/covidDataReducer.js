import { COVID_STAUS_DATA } from '../constants/actionTypes';

const covidDataReducer = (state = [], action) => {
  switch (action.type) {
    case COVID_STAUS_DATA:
      return [...action.payload];

    default:
      return state;
  }
};

export default covidDataReducer;
