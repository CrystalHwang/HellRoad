import { LATITUDE } from '../constants/actionTypes';

import {
  LOCATION,
} from '../constants/actionTypes';

export const createActionForLocation = (location) => {

  return {
    type: LOCATION,
    payload: location
  };
};
