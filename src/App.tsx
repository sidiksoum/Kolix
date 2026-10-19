import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext';
import { OrdersProvider } from './context/OrdersContext';
import { StockProvider } from './context/StockContext';
import { WalletProvider } from './context/WalletContext';
import { StoreProvider } from './context/StoreContext';
import { AppRoutes } from './routes/AppRoutes';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <OrdersProvider>
          <StockProvider>
            <WalletProvider>
              <StoreProvider>
                <AppRoutes />
                <Toaster
                  position="top-right"
                  richColors
                  closeButton
                  toastOptions={{
                    style: {
                      borderRadius: '16px',
                      fontFamily: 'inherit',
                      fontWeight: 600
                    }
                  }}
                />
              </StoreProvider>
            </WalletProvider>
          </StockProvider>
        </OrdersProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
