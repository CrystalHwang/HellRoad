import {
  CHANGE_MAP_MODE
} from '../constants/actionTypes';

import { MAP_MODE } from '../constants';

const mapModeReducer = (state = MAP_MODE.HOME, action) => {
  switch (action.type) {
    case CHANGE_MAP_MODE:
      return action.payload;

    default:
      return state;
  }
};

export default mapModeReducer;
