import { combineReducers } from 'redux';

import loadingReducer from './loadingReducer';
import locationReducer from './locationReducer';
import routesReducer from './routesReducer';

const rootReducer = combineReducers({
  loadingReducer,
  locationReducer,
  routesReducer
});

export default rootReducer;
