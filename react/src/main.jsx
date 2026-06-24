import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app.jsx';
import './app.css';

// Mounts the React application layout directly into the HTML root anchor
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);