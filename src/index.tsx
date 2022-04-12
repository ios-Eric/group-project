import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

ReactDOM.render(
    <Suspense fallback={<div>fallback...</div>}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Suspense>
  ,
  document.getElementById('root')
);
