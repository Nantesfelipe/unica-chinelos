import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { initMercadoPago } from '@mercadopago/sdk-react';
import './index.css';
import App from './App.jsx';

import AuthProvider from './contexts/AuthContext';
import CartProvider from './contexts/CartContext.jsx';

initMercadoPago(import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY, {
  locale: 'pt-BR',
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);