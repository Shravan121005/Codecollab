import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Importing your main App component

// This finds the <div id="root"> from your index.html file.
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

// This tells React to render your <App /> component inside that div.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
