import {
  CHANGE_MAP_MODE
} from '../constants/actionTypes';

import { MAP_MODE } from '../constants';

const mapModeReducer = (state = MAP_MODE.HOME, action) => {
  switch (action.type) {
    case CHANGE_MAP_MODE:
      console.log("맵모드가 바뀝니당.", action.payload);
      return action.payload;

    default:
      return state;
  }
};

export default mapModeReducer;
