import { DEFAULT_LOCATION } from '../constants';
import {
  CURRENT_LOCATION,
  ORIGIN,
  DESTINATION
} from '../constants/actionTypes';

const defaultLocationLatLng = {
  latitude: DEFAULT_LOCATION.latitude,
  longitude: DEFAULT_LOCATION.longitude
};

const initialState = {
  current: defaultLocationLatLng,
  origin: defaultLocationLatLng,
  destination: defaultLocationLatLng
};

const locationReducer = (state = initialState, action) => {
  switch (action.type) {
    case CURRENT_LOCATION:
      return {
        ...state,
        current: { ...action.payload }
      };

    case ORIGIN:
      return {
        ...state,
        origin: { ...action.payload }
      };

    case DESTINATION:
      return {
        ...state,
        destination: { ...action.payload }
      };

    default:
      return state;
  }
};

export default locationReducer;
