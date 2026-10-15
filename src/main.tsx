import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { registerAndroidServiceWorker } from './utils/androidBridge';
import '../styles.css';
import './index.css';

registerAndroidServiceWorker();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
