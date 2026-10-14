import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import App from './components/app/app';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './services/store';
import { installApiFallback } from './mock/install';
import { DemoBadge } from './mock/demo-badge';

installApiFallback(process.env.BURGER_API_URL);

// на GitHub Pages приложение открывается из подпапки
const basename = (process.env.PUBLIC_PATH || '/').replace(/\/$/, '');

const container = document.getElementById('root') as HTMLElement;
const root = ReactDOMClient.createRoot(container!);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter basename={basename}>
        <App />
        <DemoBadge />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
