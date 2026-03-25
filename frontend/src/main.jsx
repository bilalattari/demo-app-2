import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import 'antd/dist/reset.css';

import { AdminProvider } from './context/AdminContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import App from './App.jsx';
import { COLORS } from './theme/colors.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: COLORS.brandBlue,
        },
      }}
    >
      <AdminProvider>
        <AuthProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AuthProvider>
      </AdminProvider>
    </ConfigProvider>
  </React.StrictMode>
);

