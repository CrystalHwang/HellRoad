import { APIs } from '../constants';
import { NAVIGATION_DATA } from '../constants/actionTypes';

const initialState = {
  distance: '',
  duration: '',
  numOfDanger: '',
  nameOfAPI: APIs.T_MAP_DEFAULT
};
const navigationReducer = (state = initialState, action) => {
  switch (action.type) {
    case NAVIGATION_DATA:
      return { ...action.payload };

    default:
      return state;
  }
};

export default navigationReducer;
