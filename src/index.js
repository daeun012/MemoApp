import React from 'react';
import { render } from 'react-dom';
import MainRouter from './routes.jsx';
import { Provider } from 'react-redux';
import configureStore from './store';

const store = configureStore();

render(
  <Provider store={store}>
    <MainRouter />
  </Provider>,
  document.getElementById('root')
);
