import {
  LOCATION
} from '../constants/actionTypes';

const initialState = {
  latitude: 37.50607,
  longitude: 127.05921
};

const locationReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOCATION:
      return {
        ...state,
        ...action.payload
      };

    default:
      return state;
  }
};

export default locationReducer;
