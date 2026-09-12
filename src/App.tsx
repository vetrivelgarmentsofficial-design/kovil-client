import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LanguageProvider } from './context/LanguageContext';
import { FunctionProvider } from './context/FunctionContext';
import { AppLayout } from './layouts/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { AddEntry } from './pages/AddEntry';
import { TransactionList } from './pages/TransactionList';
import { Reconciliation } from './pages/Reconciliation';
import { PrintView } from './pages/PrintView';
import { FunctionManagement } from './pages/FunctionManagement';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <FunctionProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<AppLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="add" element={<AddEntry />} />
                <Route path="entries" element={<TransactionList />} />
                <Route path="reconciliation" element={<Reconciliation />} />
                <Route path="print" element={<PrintView />} />
                <Route path="functions" element={<FunctionManagement />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </FunctionProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
