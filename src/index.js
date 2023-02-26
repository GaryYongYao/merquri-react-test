import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import { HistoryContextProvider } from 'components/HistoryList';
import 'styles/index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1f9dda',
        },
      }}
    >
      <HistoryContextProvider>
        <App />
      </HistoryContextProvider>
    </ConfigProvider>
  </React.StrictMode>
);
