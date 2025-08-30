import './index.css';
import App from './App.jsx';
import { Provider } from 'react-redux';
import Store from './redux/store';
import React from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(
  <Provider store={Store}>
    <App />
  </Provider>
);
