import { combineReducers } from 'redux';

import loadingReducer from './loadingReducer';
import locationReducer from './locationReducer';
import routesReducer from './routesReducer';
import dangerReducer from './dangerReducer';
import navigationReducer from './navigationReducer';

const rootReducer = combineReducers({
  loadingReducer,
  locationReducer,
  routesReducer,
  dangerReducer,
  navigationReducer,
});

export default rootReducer;
