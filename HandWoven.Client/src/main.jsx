import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App';
import { AuthProvider } from './context/AuthProvider';

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './context/CartProvider';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <App />
          <ToastContainer />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
)
