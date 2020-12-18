import {
  LOADING_COVID_STATUS,
  LOADING_CURRENT_LOCATION,
  LOADING_ROUTES,
} from '../constants/actionTypes';

const initialState = {
  covidStatus: true,
  currentLocation: false,
  routes: false
};

const loadingReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOADING_COVID_STATUS:
      return {
        ...state,
        covidStatus: action.payload
      };

    case LOADING_CURRENT_LOCATION:
      return {
        ...state,
        currentLocation: action.payload
      };

    case LOADING_ROUTES:
      return {
        ...state,
        routes: action.payload
      };
    default:
      return state;
  }
};

export default loadingReducer;
