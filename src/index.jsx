import React from 'react';
import ReactDOM from 'react-dom/client';
import { TimeProvider } from './context/TimeContext';
import App from './App';

// Render application
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <TimeProvider>
      <App />
    </TimeProvider>
  </React.StrictMode>
);
