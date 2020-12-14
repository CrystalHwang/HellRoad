import './shim';
import React from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { AppState } from 'react-native';
import * as TaskManager from 'expo-task-manager';

import AppContainer from './containers/AppContainer';
import store from './store.js';

import { BACKGROUND_LOCATION_TASK } from './constants';

const App = () => {
  return (
    <Provider store={store}>
      <AppContainer />
    </Provider>
  );
};

export default App;
