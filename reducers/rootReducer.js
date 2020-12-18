import { combineReducers } from 'redux';

import loadingReducer from './loadingReducer';
import locationReducer from './locationReducer';
import routesReducer from './routesReducer';
import nearestDangerReducer from './nearestDangerReducer';
import navigationReducer from './navigationReducer';
import mapModeReducer from './mapModeReducer';
import covidDataReducer from './covidDataReducer';
import startReducer from './startReducer';
import finishReducer from './finishReducer';

const rootReducer = combineReducers({
  loadingReducer,
  locationReducer,
  routesReducer,
  nearestDangerReducer,
  navigationReducer,
  mapModeReducer,
  covidDataReducer,
  startReducer,
  finishReducer,
});

export default rootReducer;
