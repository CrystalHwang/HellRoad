import './shim';
import React from 'react';
import { Provider } from 'react-redux';
import { AppState } from 'react-native';
import * as TaskManager from 'expo-task-manager';

import AppContainer from './containers/AppContainer';
import { BACKGROUND_LOCATION_TASK } from './constants';
import store from './store.js';

const App = () => {
  return (
    <Provider store={store}>
      <AppContainer />
    </Provider>
  );
};

TaskManager.defineTask(BACKGROUND_LOCATION_TASK, ({ data, error }) => {
  if (error) {
    return alert(error.message);
  }

  const { latitude, longitude } = data.locations[0].coords;
  console.log("Appstate", AppState.currentState);
  console.log("LOCATION?!! ", latitude, longitude);
});

export default App;
