import { LOCATION, } from '../constants/actionTypes';

export const updateLocation = (location) => {
  /* location은 Obj -> {'latitude' : latitude, 'longitude': longitude} */
  return {
    type: LOCATION,
    payload: location
  };
};
