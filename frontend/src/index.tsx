import React from 'react';
import ReactDOM from 'react-dom/client';
// @ts-ignore: allow side-effect CSS import without type declarations
import './styles/global.css';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);