import { DANGER_LOCATION } from '../constants/actionTypes';

const initialState = {
  distance: '',
  location: {
    latitude: '',
    longitude: '',
  }
};

const nearestDangerReducer = (state = initialState, action) => {
  switch (action.type) {
    case DANGER_LOCATION:
      return {
        distance: action.payload.minDistance,
        location: { ...action.payload.nearestLocation }
      };

    default:
      return state;
  }
};

export default nearestDangerReducer;
