import './shim';
import React from 'react';
import { Provider } from 'react-redux';
import { AppState } from 'react-native';

import AppContainer from './containers/AppContainer';
import store from './store.js';

const App = () => {
  return (
    <Provider store={store}>
      <AppContainer />
    </Provider>
  );
};

export default App;
